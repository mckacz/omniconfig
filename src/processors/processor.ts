export interface Processor<T, U> {
  process(data: T): U
}
