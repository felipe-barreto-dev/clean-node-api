export default {
  openapi: '3.1.0',
  info: {
    title: 'Swagger PollsAPI - OpenAPI 3.1',
    description: 'This is the Poll API Documentation based on the OpenAPI 3.1 specification. \n\nSome useful links:\n- [The Poll API repository](https://github.com/felipe-barreto-dev/clean-node-api)\n',
    termsOfService: 'http://swagger.io/terms/',
    contact: {
      email: 'fbarreto.dev@gmail.com'
    },
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
    },
    version: '1.0.0'
  },
  servers: [
    {
      url: 'https://clean-node-api-1ad8.onrender.com'
    }
  ],
  tags: [
    {
      name: 'polls',
      description: 'Everything about polls'
    },
    {
      name: 'polls-result',
      description: 'Access to polls results'
    },
    {
      name: 'account',
      description: 'Operations about account'
    }
  ],
  paths: {
    '/polls': {
      post: {
        tags: [
          'polls'
        ],
        summary: 'Add a new poll',
        description: 'Add a new poll',
        operationId: 'addPoll',
        requestBody: {
          description: 'Create a new poll',
          content: {
            'application/json': {
              schema: {
                required: [
                  'question',
                  'answers'
                ],
                type: 'object',
                properties: {
                  question: {
                    type: 'string',
                    example: 'What is better?'
                  },
                  answers: {
                    type: 'array',
                    xml: {
                      wrapped: true
                    },
                    items: {
                      type: 'object',
                      properties: {
                        image: {
                          type: 'string',
                          example: 'js.png'
                        },
                        answer: {
                          type: 'string',
                          example: 'Javascript'
                        }
                      },
                      xml: {
                        name: 'answers'
                      }
                    }
                  }
                },
                xml: {
                  name: 'poll'
                }
              }
            }
          },
          required: true
        },
        responses: {
          204: {
            description: 'Successful operation'
          },
          400: {
            description: 'Invalid input'
          },
          500: {
            description: 'Server error'
          }
        }
      },
      get: {
        tags: [
          'polls'
        ],
        summary: 'Find all polls',
        description: 'Returns all polls',
        responses: {
          200: {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  required: [
                    'name',
                    'photoUrls'
                  ],
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        example: 'mongo_uid'
                      },
                      date: {
                        type: 'string',
                        format: 'date-time'
                      },
                      question: {
                        type: 'string',
                        example: 'What is better?'
                      },
                      answers: {
                        type: 'array',
                        xml: {
                          wrapped: true
                        },
                        items: {
                          type: 'object',
                          properties: {
                            image: {
                              type: 'string',
                              example: 'js.png'
                            },
                            answer: {
                              type: 'string',
                              example: 'Javascript'
                            }
                          },
                          xml: {
                            name: 'answers'
                          }
                        }
                      }
                    }
                  },
                  xml: {
                    name: 'poll'
                  }
                }
              }
            }
          },
          500: {
            description: 'Server error'
          }
        }
      }
    },
    '/poll/{pollId}/results': {
      put: {
        tags: [
          'polls-result'
        ],
        summary: 'Place an order for a poll',
        description: 'Place a new order in the store',
        operationId: 'placeOrder',
        parameters: [
          {
            name: 'pollId',
            in: 'path',
            description: 'ID of order that needs to be fetched',
            required: true,
            schema: {
              type: 'integer',
              format: 'int64'
            }
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer',
                    format: 'int64',
                    example: 10
                  },
                  pollId: {
                    type: 'integer',
                    format: 'int64',
                    example: 198772
                  },
                  quantity: {
                    type: 'integer',
                    format: 'int32',
                    example: 7
                  },
                  shipDate: {
                    type: 'string',
                    format: 'date-time'
                  },
                  status: {
                    type: 'string',
                    description: 'Order Status',
                    example: 'approved',
                    enum: [
                      'placed',
                      'approved',
                      'delivered'
                    ]
                  },
                  complete: {
                    type: 'boolean'
                  }
                },
                xml: {
                  name: 'order'
                }
              }
            },
            'application/xml': {
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer',
                    format: 'int64',
                    example: 10
                  },
                  pollId: {
                    type: 'integer',
                    format: 'int64',
                    example: 198772
                  },
                  quantity: {
                    type: 'integer',
                    format: 'int32',
                    example: 7
                  },
                  shipDate: {
                    type: 'string',
                    format: 'date-time'
                  },
                  status: {
                    type: 'string',
                    description: 'Order Status',
                    example: 'approved',
                    enum: [
                      'placed',
                      'approved',
                      'delivered'
                    ]
                  },
                  complete: {
                    type: 'boolean'
                  }
                },
                xml: {
                  name: 'order'
                }
              }
            },
            'application/x-www-form-urlencoded': {
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer',
                    format: 'int64',
                    example: 10
                  },
                  pollId: {
                    type: 'integer',
                    format: 'int64',
                    example: 198772
                  },
                  quantity: {
                    type: 'integer',
                    format: 'int32',
                    example: 7
                  },
                  shipDate: {
                    type: 'string',
                    format: 'date-time'
                  },
                  status: {
                    type: 'string',
                    description: 'Order Status',
                    example: 'approved',
                    enum: [
                      'placed',
                      'approved',
                      'delivered'
                    ]
                  },
                  complete: {
                    type: 'boolean'
                  }
                },
                xml: {
                  name: 'order'
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'integer',
                      format: 'int64',
                      example: 10
                    },
                    pollId: {
                      type: 'integer',
                      format: 'int64',
                      example: 198772
                    },
                    quantity: {
                      type: 'integer',
                      format: 'int32',
                      example: 7
                    },
                    shipDate: {
                      type: 'string',
                      format: 'date-time'
                    },
                    status: {
                      type: 'string',
                      description: 'Order Status',
                      example: 'approved',
                      enum: [
                        'placed',
                        'approved',
                        'delivered'
                      ]
                    },
                    complete: {
                      type: 'boolean'
                    }
                  },
                  xml: {
                    name: 'order'
                  }
                }
              }
            }
          },
          405: {
            description: 'Invalid input'
          }
        }
      },
      get: {
        tags: [
          'polls-result'
        ],
        summary: 'Find purchase order by ID',
        description: 'For valid response try integer IDs with value <= 5 or > 10. Other values will generate exceptions.',
        operationId: 'getOrderById',
        parameters: [
          {
            name: 'pollId',
            in: 'path',
            description: 'ID of order that needs to be fetched',
            required: true,
            schema: {
              type: 'integer',
              format: 'int64'
            }
          }
        ],
        responses: {
          200: {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'integer',
                      format: 'int64',
                      example: 10
                    },
                    pollId: {
                      type: 'integer',
                      format: 'int64',
                      example: 198772
                    },
                    quantity: {
                      type: 'integer',
                      format: 'int32',
                      example: 7
                    },
                    shipDate: {
                      type: 'string',
                      format: 'date-time'
                    },
                    status: {
                      type: 'string',
                      description: 'Order Status',
                      example: 'approved',
                      enum: [
                        'placed',
                        'approved',
                        'delivered'
                      ]
                    },
                    complete: {
                      type: 'boolean'
                    }
                  },
                  xml: {
                    name: 'order'
                  }
                }
              },
              'application/xml': {
                schema: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'integer',
                      format: 'int64',
                      example: 10
                    },
                    pollId: {
                      type: 'integer',
                      format: 'int64',
                      example: 198772
                    },
                    quantity: {
                      type: 'integer',
                      format: 'int32',
                      example: 7
                    },
                    shipDate: {
                      type: 'string',
                      format: 'date-time'
                    },
                    status: {
                      type: 'string',
                      description: 'Order Status',
                      example: 'approved',
                      enum: [
                        'placed',
                        'approved',
                        'delivered'
                      ]
                    },
                    complete: {
                      type: 'boolean'
                    }
                  },
                  xml: {
                    name: 'order'
                  }
                }
              }
            }
          },
          400: {
            description: 'Invalid ID supplied'
          },
          404: {
            description: 'Order not found'
          }
        }
      }
    },
    '/signup': {
      post: {
        tags: [
          'account'
        ],
        summary: 'Create account',
        description: 'This can only be done by the logged in account.',
        operationId: 'createAccount',
        requestBody: {
          description: 'Created account object',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer',
                    format: 'int64',
                    example: 10
                  },
                  accountname: {
                    type: 'string',
                    example: 'theAccount'
                  },
                  firstName: {
                    type: 'string',
                    example: 'John'
                  },
                  lastName: {
                    type: 'string',
                    example: 'James'
                  },
                  email: {
                    type: 'string',
                    example: 'john@email.com'
                  },
                  password: {
                    type: 'string',
                    example: '12345'
                  },
                  phone: {
                    type: 'string',
                    example: '12345'
                  },
                  accountStatus: {
                    type: 'integer',
                    description: 'Account Status',
                    format: 'int32',
                    example: 1
                  }
                },
                xml: {
                  name: 'account'
                }
              }
            },
            'application/xml': {
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer',
                    format: 'int64',
                    example: 10
                  },
                  accountname: {
                    type: 'string',
                    example: 'theAccount'
                  },
                  firstName: {
                    type: 'string',
                    example: 'John'
                  },
                  lastName: {
                    type: 'string',
                    example: 'James'
                  },
                  email: {
                    type: 'string',
                    example: 'john@email.com'
                  },
                  password: {
                    type: 'string',
                    example: '12345'
                  },
                  phone: {
                    type: 'string',
                    example: '12345'
                  },
                  accountStatus: {
                    type: 'integer',
                    description: 'Account Status',
                    format: 'int32',
                    example: 1
                  }
                },
                xml: {
                  name: 'account'
                }
              }
            },
            'application/x-www-form-urlencoded': {
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer',
                    format: 'int64',
                    example: 10
                  },
                  accountname: {
                    type: 'string',
                    example: 'theAccount'
                  },
                  firstName: {
                    type: 'string',
                    example: 'John'
                  },
                  lastName: {
                    type: 'string',
                    example: 'James'
                  },
                  email: {
                    type: 'string',
                    example: 'john@email.com'
                  },
                  password: {
                    type: 'string',
                    example: '12345'
                  },
                  phone: {
                    type: 'string',
                    example: '12345'
                  },
                  accountStatus: {
                    type: 'integer',
                    description: 'Account Status',
                    format: 'int32',
                    example: 1
                  }
                },
                xml: {
                  name: 'account'
                }
              }
            }
          }
        },
        responses: {
          default: {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'integer',
                      format: 'int64',
                      example: 10
                    },
                    accountname: {
                      type: 'string',
                      example: 'theAccount'
                    },
                    firstName: {
                      type: 'string',
                      example: 'John'
                    },
                    lastName: {
                      type: 'string',
                      example: 'James'
                    },
                    email: {
                      type: 'string',
                      example: 'john@email.com'
                    },
                    password: {
                      type: 'string',
                      example: '12345'
                    },
                    phone: {
                      type: 'string',
                      example: '12345'
                    },
                    accountStatus: {
                      type: 'integer',
                      description: 'Account Status',
                      format: 'int32',
                      example: 1
                    }
                  },
                  xml: {
                    name: 'account'
                  }
                }
              },
              'application/xml': {
                schema: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'integer',
                      format: 'int64',
                      example: 10
                    },
                    accountname: {
                      type: 'string',
                      example: 'theAccount'
                    },
                    firstName: {
                      type: 'string',
                      example: 'John'
                    },
                    lastName: {
                      type: 'string',
                      example: 'James'
                    },
                    email: {
                      type: 'string',
                      example: 'john@email.com'
                    },
                    password: {
                      type: 'string',
                      example: '12345'
                    },
                    phone: {
                      type: 'string',
                      example: '12345'
                    },
                    accountStatus: {
                      type: 'integer',
                      description: 'Account Status',
                      format: 'int32',
                      example: 1
                    }
                  },
                  xml: {
                    name: 'account'
                  }
                }
              }
            }
          }
        }
      }
    },
    '/login': {
      post: {
        tags: [
          'account'
        ],
        summary: 'Logs account into the system',
        description: '',
        operationId: 'loginAccount',
        parameters: [
          {
            name: 'accountname',
            in: 'query',
            description: 'The account name for login',
            required: false,
            schema: {
              type: 'string'
            }
          },
          {
            name: 'password',
            in: 'query',
            description: 'The password for login in clear text',
            required: false,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'successful operation',
            headers: {
              'X-Rate-Limit': {
                description: 'calls per hour allowed by the account',
                schema: {
                  type: 'integer',
                  format: 'int32'
                }
              },
              'X-Expires-After': {
                description: 'date in UTC when token expires',
                schema: {
                  type: 'string',
                  format: 'date-time'
                }
              }
            },
            content: {
              'application/xml': {
                schema: {
                  type: 'string'
                }
              },
              'application/json': {
                schema: {
                  type: 'string'
                }
              }
            }
          },
          400: {
            description: 'Invalid accountname/password supplied'
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Order: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
            example: 10
          },
          pollId: {
            type: 'integer',
            format: 'int64',
            example: 198772
          },
          quantity: {
            type: 'integer',
            format: 'int32',
            example: 7
          },
          shipDate: {
            type: 'string',
            format: 'date-time'
          },
          status: {
            type: 'string',
            description: 'Order Status',
            example: 'approved',
            enum: [
              'placed',
              'approved',
              'delivered'
            ]
          },
          complete: {
            type: 'boolean'
          }
        },
        xml: {
          name: 'order'
        }
      },
      Account: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'mongo_uid'
          },
          name: {
            type: 'string',
            example: 'name'
          },
          email: {
            type: 'string',
            example: 'john@email.com'
          },
          password: {
            type: 'string',
            example: '12345'
          }
        },
        xml: {
          name: 'account'
        }
      },
      Poll: {
        required: [
          'name',
          'photoUrls'
        ],
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
            example: 10
          },
          name: {
            type: 'string',
            example: 'doggie'
          },
          category: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                format: 'int64',
                example: 1
              },
              name: {
                type: 'string',
                example: 'Dogs'
              }
            },
            xml: {
              name: 'category'
            }
          },
          photoUrls: {
            type: 'array',
            xml: {
              wrapped: true
            },
            items: {
              type: 'string',
              xml: {
                name: 'photoUrl'
              }
            }
          },
          tags: {
            type: 'array',
            xml: {
              wrapped: true
            },
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  format: 'int64'
                },
                name: {
                  type: 'string'
                }
              },
              xml: {
                name: 'tag'
              }
            }
          },
          status: {
            type: 'string',
            description: 'poll status in the store',
            enum: [
              'available',
              'pending',
              'sold'
            ]
          }
        },
        xml: {
          name: 'poll'
        }
      },
      ApiResponse: {
        type: 'object',
        properties: {
          code: {
            type: 'integer',
            format: 'int32'
          },
          type: {
            type: 'string'
          },
          message: {
            type: 'string'
          }
        },
        xml: {
          name: '##default'
        }
      }
    },
    requestBodies: {
      Poll: {
        description: 'Poll object that needs to be added',
        content: {
          'application/json': {
            schema: {
              required: [
                'question',
                'answers'
              ],
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  format: 'int64',
                  example: 10
                },
                name: {
                  type: 'string',
                  example: 'doggie'
                },
                category: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'integer',
                      format: 'int64',
                      example: 1
                    },
                    name: {
                      type: 'string',
                      example: 'Dogs'
                    }
                  },
                  xml: {
                    name: 'category'
                  }
                },
                photoUrls: {
                  type: 'array',
                  xml: {
                    wrapped: true
                  },
                  items: {
                    type: 'string',
                    xml: {
                      name: 'photoUrl'
                    }
                  }
                },
                tags: {
                  type: 'array',
                  xml: {
                    wrapped: true
                  },
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'integer',
                        format: 'int64'
                      },
                      name: {
                        type: 'string'
                      }
                    },
                    xml: {
                      name: 'tag'
                    }
                  }
                },
                status: {
                  type: 'string',
                  description: 'poll status in the store',
                  enum: [
                    'available',
                    'pending',
                    'sold'
                  ]
                }
              },
              xml: {
                name: 'poll'
              }
            }
          }
        }
      }
    }
  }
}
