import { UserFacingProgram } from '../../shared/models';
import { Key } from './key';

export interface ProgramCondition {
  guid: string;
  key: Key;
  value: boolean | string | number;
  type: 'boolean' | 'string' | 'number';
  qualifier?: string | 'lessThan' | 'equal' | 'greaterThan';
}

export interface ApplicationFacingProgram {
  guid: string;
  application: ProgramCondition[];
  user: UserFacingProgram;
}
