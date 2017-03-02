export type ID = string;

export interface Question{
  conditionalQuestions?: ID[],
  controlType: '' | 'invalid' | 'NumberSelect' | 'NumberInput' | 'CheckBox',
  expandable: boolean,
  id: ID,
  index: number,
  key: string,
  label: string,
  options: number[]
};