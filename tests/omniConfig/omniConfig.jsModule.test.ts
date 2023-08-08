import { ModuleLoader } from '~/loaders/module/moduleLoader'
import { OptionalLoader } from '~/loaders/optionalLoader'
import { OmniConfig } from '~/omniConfig'

jest.mock('~/loaders/optionalLoader')
jest.mock('~/loaders/module/moduleLoader')

describe('OmniConfig - JS files', () => {
  const originalCWD = process.cwd()
  process.chdir('/tmp')

  jest.mocked(OptionalLoader).mockImplementation(loader => ({ optional: true, ...loader }) as never)
  jest.mocked(ModuleLoader).mockImplementation((file) => ({ type: 'module', file }) as never)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    process.chdir(originalCWD)
  })

  test('consider single JS file only', () => {
    const om = new OmniConfig()

    expect(om).not.toHaveProperty('loaders')

    om.useJsFiles('app.js')

    expect(om).toHaveProperty('loaders', [
      { optional: true, type: 'module', file: 'app.js' },
    ])
  })

  test('consider JS file with NODE_ENV and local variants', () => {
    const om = new OmniConfig()

    expect(om).not.toHaveProperty('loaders')

    om.useJsFiles('app[.node_env][.local].js')

    expect(om).toHaveProperty('loaders', [
      { optional: true, type: 'module', file: 'app.js' },
      { optional: true, type: 'module', file: 'app.local.js' },
      { optional: true, type: 'module', file: 'app.test.js' },
      { optional: true, type: 'module', file: 'app.test.local.js' },
    ])
  })

  test('consider JS file with NODE_ENV and dist variants', () => {
    const om = new OmniConfig()

    expect(om).not.toHaveProperty('loaders')

    om.useJsFiles('app[.node_env].js[.dist]')

    expect(om).toHaveProperty('loaders', [
      { optional: true, type: 'module', file: 'app.js.dist' },
      { optional: true, type: 'module', file: 'app.js' },
      { optional: true, type: 'module', file: 'app.test.js.dist' },
      { optional: true, type: 'module', file: 'app.test.js' },
    ])
  })
})
