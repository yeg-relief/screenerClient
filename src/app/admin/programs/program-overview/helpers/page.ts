import { Observable } from 'rxjs/Observable';
import { ProgramState } from './program-state';
import { PageMetaData, pageMetaDataFactory } from './page-meta-data';
import { ApplicationFacingProgram } from '../../../models';

export const PAGE_SIZE = 10;
export class Page<T> {
  pageContent: T[];

  constructor(
    inputContent: T[],
    metaData: PageMetaData,
  ) {
    if (inputContent === undefined || !Array.isArray(inputContent)) 
      this.pageContent = [];
    else {
      let start: number;
      let end: number;
      start = metaData.currentPage * metaData.pageSize;
      end = start + metaData.pageSize;
      this.pageContent = inputContent.slice(start, end);
    }
  }
}


export function applyPagination(input$: Observable<ProgramState>)
  : Observable<any> {
    let previousPrograms;

  return input$.map(state => {
    const areProgramsSame = samePrograms(previousPrograms, state.programs);
      if (!areProgramsSame) {
        state.meta = pageMetaDataFactory(state.programs, PAGE_SIZE, 0);
        state.updateMeta = true;
      } else 
        state.updateMeta = false;
      
        

      previousPrograms = state.programs;

      return state;
    })
    .map(state => {
      if (state.updateMeta)
        return [new Page<ApplicationFacingProgram>(state.programs, state.meta), state.meta];

      return [new Page<ApplicationFacingProgram>(state.programs, state.meta), undefined];
    })
}


function samePrograms(previous, update): boolean {
  if (previous === undefined)
    return false;

  if (previous.length !== update.length)
    return false;
  
  const allSame = previous.map(previousProgram => update.find(p => p.guid === previousProgram.guid))

  return allSame.length === previous.length;

}