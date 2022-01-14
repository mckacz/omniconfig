export interface EnvKeyMapper {
  keyToPath(key: string): string | undefined
  pathToKey(path: string): string
}
