import { compose } from '@ngrx/core/compose';
import { combineReducers } from '@ngrx/store';
import { storeLogger } from 'ngrx-store-logger';
import { Observable } from 'rxjs/Observable';
import '@ngrx/core/add/operator/select';

import  * as fromMedia from './media';


export interface AppState {
  media: fromMedia.MediaState;
}

export default compose(storeLogger(), combineReducers)({
  media: fromMedia.mediaReducer
});

export function getMediaState() {
  return (state$: Observable<AppState>) => state$
    .select(s => s.media);
}
