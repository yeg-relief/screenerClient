import { IOptions } from '../Question/index';
export interface MasterScreener{
  // an Array holding Arrays of IOptions "data for questiongroups"
  content: Array<Array<IOptions<string|boolean>>> 
}