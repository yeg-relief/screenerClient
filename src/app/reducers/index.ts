import { compose } from '@ngrx/core/compose';
import { combineReducers } from '@ngrx/store';
import { storeLogger } from 'ngrx-store-logger';

import * as fromMsEditor from './master-screener-edit';
import * as fromMedia from './media';
import * as fromMasterScreener from './master-screener'; 
import * as fromKeys from './keys';
import * as fromPrograms from './programs';
import * as fromAddProgram from './add-program';

export interface AppState {
  media: fromMedia.MediaState;
  masterScreener: fromMasterScreener.MasterScreenerState;
  masterScreenerEdit: fromMsEditor.MasterScreenerEditState;
  keys: fromKeys.KeyState;
  programs: fromPrograms.ProgramState;
  addProgram: fromAddProgram.AddProgramState;
}

export default compose(storeLogger(), combineReducers)({
  media: fromMedia.mediaReducer,
  masterScreener: fromMasterScreener.masterScreenerReducer,
  masterScreenerEdit: fromMsEditor.MasterScreenerEditReducer,
  keys: fromKeys.keyReducer,
  programs: fromPrograms.ProgramReducer,
  addProgram: fromAddProgram.addProgramReducer
});
