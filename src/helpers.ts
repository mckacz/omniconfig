export type DeepPartial<Type> = Type extends object ? { [P in keyof Type]?: DeepPartial<Type[P]> } : Type

export type RecordWithSuffix<BaseType, Type, Suffix extends string> = {
  [P in (keyof BaseType & string) as `${P}${Suffix}`]: Type
}

export type MembersOfType<BaseType, MemberType> = {
  [P in keyof BaseType]: BaseType[P] extends MemberType ? BaseType[P] : never
}
