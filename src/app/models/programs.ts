import { Key } from './keys';

interface BooleanCondition{
  keyID: string;
  value: boolean;
}

interface NumberQualifier{
  greaterThan: boolean;
  equal: boolean;
  lessThan: boolean;
}

interface NumberCondition{
  keyID: string;
  qualifier: NumberQualifier;
  value: number;
}

interface StringCondition{
  keyID: string;
  value: string;
}

export interface ProgramDetails{
  title: string;
  description: string;
  link: string;
}

export interface GeneralCondition{
  concreteCondition: StringCondition | NumberCondition | BooleanCondition;
  type: string;
}

export interface Program{
  conditions: GeneralCondition[];
  details: ProgramDetails;
}