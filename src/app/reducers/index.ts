import { compose } from '@ngrx/core/compose';
import { combineReducers } from '@ngrx/store';
import { storeLogger } from 'ngrx-store-logger';
import { Observable } from 'rxjs/Observable';
import '@ngrx/core/add/operator/select';

import * as fromMedia from './media';
import * as fromMasterScreener from './master-screener'; 

export interface AppState {
  media: fromMedia.MediaState;
  masterScreener: fromMasterScreener.MasterScreenerState;
}

export default compose(storeLogger(), combineReducers)({
  media: fromMedia.mediaReducer,
  masterScreener: fromMasterScreener.masterScreenerReducer
});

export function getMediaState() {
  return (state$: Observable<AppState>) => state$
    .select(s => s.media);
}

export function getMasterScreenerState() {
  return (state$: Observable<AppState>) => state$ 
    .select(s => s.masterScreener);
}