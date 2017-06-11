import { ApplicationFacingProgram } from '../../../models/program';
import { FilterMessage, PageMetaData, pageMetaDataFactory, PAGE_SIZE  } from './index';
import { Observable } from 'rxjs/Observable';


export class ProgramState {
  filter: FilterMessage;
  programs: ApplicationFacingProgram[];
  meta: PageMetaData;
  updateMeta;

  constructor(
    programs: ApplicationFacingProgram[],
    filter: FilterMessage,
    meta: PageMetaData) {
    this.programs = [...programs];
    this.filter = (<any>Object).assign({}, filter);
    this.meta = (<any>Object).assign({}, meta)
  }
}


export function updateState(input$: Observable<FilterMessage | ApplicationFacingProgram[] | PageMetaData | ApplicationFacingProgram>)
  : Observable<ProgramState> {
  
  const INITIAL_STATE =
  new ProgramState(
    [],
    new FilterMessage({ type: '', value: 'none' }),
    pageMetaDataFactory([])
  );
  
  return input$.scan((state: ProgramState, update: FilterMessage | ApplicationFacingProgram[] | PageMetaData | ApplicationFacingProgram) => {
    if (update instanceof FilterMessage) {
      state.filter = update;
      return state;
    } else if (Array.isArray(update)) {
      state.programs = [...update].sort(programComparator);
      return state;
    } else if (update instanceof PageMetaData) {
      console.log('page-meta-update');
      state.meta = update
      return state;
    } else if (typeof update === 'object' && update.guid !== undefined) {
      console.log('program update');
      console.log(update)
      const index = state.programs.findIndex(p => p.guid === update.guid)

      if (index >= 0) {
        state.programs.splice(index, 1, update)
      }
      return state;
    }

    return INITIAL_STATE;
  }, INITIAL_STATE)
}


function programComparator(a: ApplicationFacingProgram, b: ApplicationFacingProgram): number {
  const titleA = a.user.title.toUpperCase();
  const titleB = b.user.title.toUpperCase();

  if (titleA < titleB) return -1;

  if (titleB < titleA) return 1;

  return 0;
}