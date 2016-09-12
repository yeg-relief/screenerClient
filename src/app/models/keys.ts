export interface Key{
  id: string
  type: string
  questionKeys: string[] //foreign keys for question reducer
}