import { UserFacingProgram } from '../../shared/models';
import { Key } from './key';

export interface ProgramCondition {
  guid: string;
  key: Key;
  value: boolean | string | number;
  type: 'boolean' | 'text' | 'number';
  qualifier?: string | 'lessThan' | 'lessThanOrEqual' | 'equal' | 'greaterThanOrEqual' | 'greaterThan';
}

export interface ApplicationFacingProgram {
  guid: string;
  application: ProgramCondition[];
  user: UserFacingProgram;
}
