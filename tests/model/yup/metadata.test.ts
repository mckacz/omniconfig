import * as yup from 'yup'
import { buildMetadata } from '~/model/yup/metadata'

describe('Yup metadata building helpers', () => {
  test('empty schema', () => {
    expect(
      buildMetadata(yup.object())
    ).toEqual([])
  })

  test('simple object', () => {
    expect(
      buildMetadata(
        yup.object({
          host:     yup.string().default('localhost'),
          port:     yup.number().min(1).max(65535).default(5432),
          username: yup.string().required(),
          password: yup.string().required(),
        })
      )
    ).toEqual([
      {
        path:         ['host'],
        type:         'string',
        required:     false,
        defaultValue: 'localhost',
      },
      {
        path:         ['port'],
        type:         'number',
        required:     false,
        defaultValue: 5432,
      },
      {
        path:     ['username'],
        type:     'string',
        required: true,
      },
      {
        path:     ['password'],
        type:     'string',
        required: true,
      }
    ])
  })

  test('nested object', () => {
    expect(
      buildMetadata(
        yup.object({
          debug: yup.boolean(),
          db:    yup.object({
            host:     yup.string().default('localhost'),
            port:     yup.number().min(1).max(65535).default(5432),
            username: yup.string().required(),
            password: yup.string().required(),
          })
        })
      )
    ).toEqual([
      {
        path:     ['debug'],
        type:     'boolean',
        required: false,
      },
      {
        path:         ['db', 'host'],
        type:         'string',
        required:     false,
        defaultValue: 'localhost',
      },
      {
        path:         ['db', 'port'],
        type:         'number',
        required:     false,
        defaultValue: 5432,
      },
      {
        path:     ['db', 'username'],
        type:     'string',
        required: true,
      },
      {
        path:     ['db', 'password'],
        type:     'string',
        required: true,
      }
    ])
  })

  test('object with metadata', () => {
    expect(
      buildMetadata(
        yup.object({
          host:     yup.string().default('localhost').meta({description: 'Database host'}),
          port:     yup.number().min(1).max(65535).default(5432).meta({description: 'Database port'}),
          username: yup.string().required().meta({description: 'Database username'}),
          password: yup.string().required().meta({description: 'Database password'}),
        })
      )
    ).toEqual([
      {
        path:         ['host'],
        type:         'string',
        required:     false,
        description:  'Database host',
        defaultValue: 'localhost',
      },
      {
        path:         ['port'],
        type:         'number',
        required:     false,
        description:  'Database port',
        defaultValue: 5432,
      },
      {
        path:        ['username'],
        type:        'string',
        required:    true,
        description: 'Database username',
      },
      {
        path:        ['password'],
        type:        'string',
        required:    true,
        description: 'Database password',
      }
    ])
  })
})
