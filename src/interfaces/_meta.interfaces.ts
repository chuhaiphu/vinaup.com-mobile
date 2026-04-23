export interface BaseMeta {
  canEdit: boolean;
}

export type ResponseWithMeta<T, M extends BaseMeta> = T & {
  meta: M;
}