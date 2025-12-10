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
        option: data.option,
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
          option: '$data.option',
          options: '$poll.options'
        },
        count: {
          $sum: 1
        },
        currentAccountOption: {
          $push: {
            $cond: [{ $eq: ['$data.accountId', new ObjectId(accountId)] }, '$data.option', '$invalid']
          }
        }
      })
      .project({
        _id: 0,
        pollId: '$_id.pollId',
        question: '$_id.question',
        date: '$_id.date',
        options: {
          $map: {
            input: '$_id.options',
            as: 'item',
            in: {
              $mergeObjects: ['$$item', {
                count: {
                  $cond: {
                    if: {
                      $eq: ['$$item.option', '$_id.option']
                    },
                    then: '$count',
                    else: 0
                  }
                },
                percent: {
                  $cond: {
                    if: {
                      $eq: ['$$item.option', '$_id.option']
                    },
                    then: {
                      $multiply: [{
                        $divide: ['$count', '$_id.total']
                      }, 100]
                    },
                    else: 0
                  }
                },
                isCurrentAccountOptionCount: {
                  $cond: [{
                    $eq: ['$$item.option', {
                      $arrayElemAt: ['$currentAccountOption', 0]
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
        options: {
          $push: '$options'
        }
      })
      .project({
        _id: 0,
        pollId: '$_id.pollId',
        question: '$_id.question',
        date: '$_id.date',
        options: {
          $reduce: {
            input: '$options',
            initialValue: [],
            in: {
              $concatArrays: ['$$value', '$$this']
            }
          }
        }
      })
      .unwind({
        path: '$options'
      })
      .group({
        _id: {
          pollId: '$pollId',
          question: '$question',
          date: '$date',
          option: '$options.option',
          image: '$options.image'
        },
        count: {
          $sum: '$options.count'
        },
        percent: {
          $sum: '$options.percent'
        },
        isCurrentAccountOptionCount: {
          $sum: '$options.isCurrentAccountOptionCount'
        }
      })
      .project({
        _id: 0,
        pollId: '$_id.pollId',
        question: '$_id.question',
        date: '$_id.date',
        option: {
          option: '$_id.option',
          image: '$_id.image',
          count: round('$count'),
          percent: round('$percent'),
          isCurrentAccountOption: {
            $eq: ['$isCurrentAccountOptionCount', 1]
          }
        }
      })
      .sort({
        'option.count': -1
      })
      .group({
        _id: {
          pollId: '$pollId',
          question: '$question',
          date: '$date'
        },
        options: {
          $push: '$option'
        }
      })
      .project({
        _id: 0,
        pollId: {
          $toString: '$_id.pollId'
        },
        question: '$_id.question',
        date: '$_id.date',
        options: '$options'
      })
      .build()
    const pollResult = await (await pollResultCollection).aggregate<PollResultModel>(query).toArray()
    return pollResult.length ? pollResult[0] : null
  }
}
