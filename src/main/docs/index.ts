export default {
  openapi: '3.1.0',
  info: {
    title: 'Clean Node API - Polls System',
    description: `A RESTful API for managing polls and user accounts built with Clean Architecture principles.

**Features:**
- User authentication with JWT
- Role-based access control (admin/user)
- Create and manage polls
- Vote on polls and view results

**Useful links:**
- [GitHub Repository](https://github.com/felipe-barreto-dev/clean-node-api)
- [Security Guidelines](https://github.com/felipe-barreto-dev/clean-node-api/blob/master/SECURITY.md)`,
    contact: {
      email: 'fbarreto.dev@gmail.com'
    },
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC'
    },
    version: '2.5.0'
  },
  servers: [
    {
      url: 'http://localhost:5050',
      description: 'Development server'
    },
    {
      url: 'https://clean-node-api-1ad8.onrender.com',
      description: 'Production server'
    }
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'User account management and authentication'
    },
    {
      name: 'Polls',
      description: 'Poll creation and management (admin only)'
    },
    {
      name: 'Poll Results',
      description: 'Poll voting and results (admin only)'
    }
  ],
  paths: {
    '/signup': {
      post: {
        tags: ['Authentication'],
        summary: 'Create a new user account',
        description: 'Register a new user and receive an access token',
        operationId: 'signup',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password', 'passwordConfirmation', 'role'],
                properties: {
                  name: {
                    type: 'string',
                    example: 'John Doe',
                    description: 'Full name of the user'
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'john@example.com',
                    description: 'Valid email address'
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    example: 'password123',
                    description: 'User password'
                  },
                  passwordConfirmation: {
                    type: 'string',
                    format: 'password',
                    example: 'password123',
                    description: 'Must match password field'
                  },
                  role: {
                    type: 'string',
                    enum: ['admin', 'user'],
                    example: 'admin',
                    description: 'User role for access control'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Account created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    accessToken: {
                      type: 'string',
                      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                      description: 'JWT token for authentication'
                    },
                    name: {
                      type: 'string',
                      example: 'John Doe'
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Invalid input data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          403: {
            description: 'Email already in use',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Authenticate user',
        description: 'Login with email and password to receive an access token',
        operationId: 'login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'john@example.com'
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    example: 'password123'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Authentication successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    accessToken: {
                      type: 'string',
                      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                    },
                    name: {
                      type: 'string',
                      example: 'John Doe'
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Invalid input data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          401: {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/polls': {
      post: {
        tags: ['Polls'],
        summary: 'Create a new poll',
        description: 'Create a new poll with question and options. Requires admin role.',
        operationId: 'addPoll',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['question', 'options'],
                properties: {
                  question: {
                    type: 'string',
                    example: 'What is your favorite programming language?',
                    description: 'The poll question'
                  },
                  options: {
                    type: 'array',
                    minItems: 2,
                    items: {
                      type: 'object',
                      required: ['option'],
                      properties: {
                        image: {
                          type: 'string',
                          example: 'javascript.png',
                          description: 'Optional image URL or filename'
                        },
                        option: {
                          type: 'string',
                          example: 'JavaScript',
                          description: 'Option text'
                        }
                      }
                    },
                    example: [
                      { image: 'javascript.png', option: 'JavaScript' },
                      { image: 'python.png', option: 'Python' },
                      { image: 'java.png', option: 'Java' }
                    ]
                  }
                }
              }
            }
          }
        },
        responses: {
          204: {
            description: 'Poll created successfully'
          },
          400: {
            description: 'Invalid input data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          403: {
            description: 'Access denied - admin role required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      },
      get: {
        tags: ['Polls'],
        summary: 'List all polls',
        description: 'Retrieve all polls. Requires admin role.',
        operationId: 'loadPolls',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'List of polls retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Poll' }
                }
              }
            }
          },
          204: {
            description: 'No polls found'
          },
          403: {
            description: 'Access denied - admin role required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/polls/{pollId}/results': {
      put: {
        tags: ['Poll Results'],
        summary: 'Vote on a poll',
        description: 'Submit a vote for a poll option. Requires admin role.',
        operationId: 'savePollResult',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'pollId',
            in: 'path',
            required: true,
            description: 'Poll ID',
            schema: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['option'],
                properties: {
                  option: {
                    type: 'string',
                    example: 'JavaScript',
                    description: 'The option to vote for'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Vote registered successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PollResult' }
              }
            }
          },
          403: {
            description: 'Access denied - admin role required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          404: {
            description: 'Poll not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      },
      get: {
        tags: ['Poll Results'],
        summary: 'Get poll results',
        description: 'Retrieve results for a specific poll. Requires admin role.',
        operationId: 'loadPollResult',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'pollId',
            in: 'path',
            required: true,
            description: 'Poll ID',
            schema: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            }
          }
        ],
        responses: {
          200: {
            description: 'Poll results retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PollResult' }
              }
            }
          },
          403: {
            description: 'Access denied - admin role required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          404: {
            description: 'Poll not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token in the format: Bearer {token}'
      }
    },
    schemas: {
      Poll: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '507f1f77bcf86cd799439011',
            description: 'MongoDB ObjectId'
          },
          question: {
            type: 'string',
            example: 'What is your favorite programming language?'
          },
          options: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                image: {
                  type: 'string',
                  example: 'javascript.png'
                },
                option: {
                  type: 'string',
                  example: 'JavaScript'
                }
              }
            }
          },
          date: {
            type: 'string',
            format: 'date-time',
            example: '2025-10-11T00:00:00.000Z'
          }
        }
      },
      PollResult: {
        type: 'object',
        properties: {
          pollId: {
            type: 'string',
            example: '507f1f77bcf86cd799439011'
          },
          question: {
            type: 'string',
            example: 'What is your favorite programming language?'
          },
          options: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                image: {
                  type: 'string',
                  example: 'javascript.png'
                },
                option: {
                  type: 'string',
                  example: 'JavaScript'
                },
                count: {
                  type: 'integer',
                  example: 42,
                  description: 'Number of votes for this option'
                },
                percent: {
                  type: 'number',
                  format: 'float',
                  example: 67.74,
                  description: 'Percentage of total votes'
                },
                isCurrentAccountOption: {
                  type: 'boolean',
                  example: true,
                  description: 'Whether the authenticated user voted for this option'
                }
              }
            }
          },
          date: {
            type: 'string',
            format: 'date-time',
            example: '2025-10-11T00:00:00.000Z'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Invalid parameter: email'
          }
        }
      }
    }
  }
}
