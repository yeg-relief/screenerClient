import { Question } from '../../shared/models';

export interface MasterScreener {
  version: number;
  created: string;
  questions: Question[];
}

// information about master screeners... like how many versions exist etc.
export interface MasterScreenerMetaData {
  versions: number[];
}
