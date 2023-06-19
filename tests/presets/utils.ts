import { Resolver } from '~/interfaces/resolver'
import { SyncResolver } from '~/resolver/syncResolver'
import { AsyncResolver } from '~/resolver/asyncResolver'

export function testPresetFactories<
  AF extends ((...args: any[]) => Resolver),
  SF extends ((...args: any[]) => Resolver)
  >(testName: string, asyncFunction: AF, syncFunction: SF, cb: (func: ((...args: Parameters<SF> | Parameters<AF>) => Resolver), ResolverClass: jest.Mock) => void) {
  test.each([
    [syncFunction.name, syncFunction, SyncResolver as jest.Mock],
    [asyncFunction.name, asyncFunction, AsyncResolver as jest.Mock],
  ])(`%s: ${testName}`, (_, func, resolverMock) => {
    cb(func, resolverMock)
  })
}
