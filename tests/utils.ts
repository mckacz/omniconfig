/**
 * Catches error thrown by the function and returns it.
 * @param fn Function that throws error.
 */
export function catchError(fn: () => unknown): Error | undefined {
  try {
    fn()
  } catch (ex) {
    return ex as Error
  }
}

/**
 * Catches promise rejection and returns rejected value.
 * @param p Promise
 */
export async function catchRejection(p: Promise<unknown>): Promise<Error | undefined> {
  try {
    await p
  } catch (ex) {
    return ex as Error
  }
}
