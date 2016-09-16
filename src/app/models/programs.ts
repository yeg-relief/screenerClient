import { Key } from './keys';

interface BooleanCondition{
  keyID: string;
  value: boolean;
}

interface NumberCondition{
  keyID: string;
  qualifier: string;
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