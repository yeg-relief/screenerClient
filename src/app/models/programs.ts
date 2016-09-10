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

interface Condition{
  condition: StringCondition | NumberCondition | BooleanCondition;
  type: string;
}

export interface Program{
  conditions: Condition[];
  title: string;
  details: string;
  link: string;
}