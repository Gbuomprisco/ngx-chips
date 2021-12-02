
export type TagModel = string | TagModelClass;

export class TagModelClass {
  [key: string]: any;
}
