import { MongoHelper, QueryBuilder } from '@/infra/db/mongodb/helpers'
import { type SavePollResultRepository, type LoadPollResultRepository } from '@/data/protocols'

import { ObjectId } from 'mongodb'
import round from 'mongo-round'
import { type PollResultModel } from '@/domain/models'

export class PollResultMongoRepository implements SavePollResultRepository, LoadPollResultRepository {
  async save (data: SavePollResultRepository.Params): Promise<void> {
    const pollResultCollection = MongoHelper.getCollection('pollResults')
    await (await pollResultCollection).findOneAndUpdate({
      pollId: new ObjectId(data.pollId),
      accountId: new ObjectId(data.accountId)
    }, {
      $set: {
        answer: data.answer,
        date: data.date
      }
    }, {
      upsert: true
    })
  }

  async loadByPollId (pollId: string, accountId: string): Promise<LoadPollResultRepository.Result> {
    const pollResultCollection = MongoHelper.getCollection('pollResults')
    const query = new QueryBuilder()
      .match({
        pollId: new ObjectId(pollId)
      })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT'
        },
        total: {
          $sum: 1
        }
      })
      .unwind({
        path: '$data'
      })
      .lookup({
        from: 'polls',
        foreignField: '_id',
        localField: 'data.pollId',
        as: 'poll'
      })
      .unwind({
        path: '$poll'
      })
      .group({
        _id: {
          pollId: '$poll._id',
          question: '$poll.question',
          date: '$poll.date',
          total: '$total',
          answer: '$data.answer',
          answers: '$poll.answers'
        },
        count: {
          $sum: 1
        },
        currentAccountAnswer: {
          $push: {
            $cond: [{ $eq: ['$data.accountId', new ObjectId(accountId)] }, '$data.answer', '$invalid']
          }
        }
      })
      .project({
        _id: 0,
        pollId: '$_id.pollId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $map: {
            input: '$_id.answers',
            as: 'item',
            in: {
              $mergeObjects: ['$$item', {
                count: {
                  $cond: {
                    if: {
                      $eq: ['$$item.answer', '$_id.answer']
                    },
                    then: '$count',
                    else: 0
                  }
                },
                percent: {
                  $cond: {
                    if: {
                      $eq: ['$$item.answer', '$_id.answer']
                    },
                    then: {
                      $multiply: [{
                        $divide: ['$count', '$_id.total']
                      }, 100]
                    },
                    else: 0
                  }
                },
                isCurrentAccountAnswerCount: {
                  $cond: [{
                    $eq: ['$$item.answer', {
                      $arrayElemAt: ['$currentAccountAnswer', 0]
                    }]
                  }, 1, 0]
                }
              }]
            }
          }
        }
      })
      .group({
        _id: {
          pollId: '$pollId',
          question: '$question',
          date: '$date'
        },
        answers: {
          $push: '$answers'
        }
      })
      .project({
        _id: 0,
        pollId: '$_id.pollId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $reduce: {
            input: '$answers',
            initialValue: [],
            in: {
              $concatArrays: ['$$value', '$$this']
            }
          }
        }
      })
      .unwind({
        path: '$answers'
      })
      .group({
        _id: {
          pollId: '$pollId',
          question: '$question',
          date: '$date',
          answer: '$answers.answer',
          image: '$answers.image'
        },
        count: {
          $sum: '$answers.count'
        },
        percent: {
          $sum: '$answers.percent'
        },
        isCurrentAccountAnswerCount: {
          $sum: '$answers.isCurrentAccountAnswerCount'
        }
      })
      .project({
        _id: 0,
        pollId: '$_id.pollId',
        question: '$_id.question',
        date: '$_id.date',
        answer: {
          answer: '$_id.answer',
          image: '$_id.image',
          count: round('$count'),
          percent: round('$percent'),
          isCurrentAccountAnswer: {
            $eq: ['$isCurrentAccountAnswerCount', 1]
          }
        }
      })
      .sort({
        'answer.count': -1
      })
      .group({
        _id: {
          pollId: '$pollId',
          question: '$question',
          date: '$date'
        },
        answers: {
          $push: '$answer'
        }
      })
      .project({
        _id: 0,
        pollId: {
          $toString: '$_id.pollId'
        },
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers'
      })
      .build()
    const pollResult = await (await pollResultCollection).aggregate<PollResultModel>(query).toArray()
    return pollResult.length ? pollResult[0] : null
  }
}
