import _ from 'lodash'
import type { Reference } from '../interfaces/reference'
import type { DataContainer } from '../interfaces/dataContainer'

/**
 * Data container that merged data from other containers.
 */
export class MergedDataContainer<T> implements DataContainer<T> {
  readonly value: T

  constructor(
    private readonly containers: DataContainer<T>[],
  ) {
    this.value = _.merge({}, ...containers.map(c => c.value)) as T
  }

  getDefinition(path: string[]): Reference | undefined {
    for (let i = this.containers.length - 1; i >= 0; i--) {
      const container = this.containers[i]

      if (_.get(container.value, path) !== undefined) {
        return container.getDefinition(path)
      }
    }
  }
}
