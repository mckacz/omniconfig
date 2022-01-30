import chalk, { ChalkInstance } from 'chalk'

/**
 * Create a chalk instance mocks that decorates strings with `<call.chain.paths>some text</call.chain.paths>`
 * instead of applying the real style just to make snapshots in tests more readable.
 */
export const createChalkMock = (callChain: string[] = []) => new Proxy<ChalkInstance>(chalk, {
  get(target: unknown, p: string | symbol): unknown {
    return createChalkMock([...callChain, String(p)])
  },

  apply(target: unknown, thisArg: unknown, argArray: [string]): string {
    const tag = callChain.join('.')

    return `<${tag}>${argArray[0]}</${tag}>`
  }
})
