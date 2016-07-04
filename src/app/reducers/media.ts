import { ActionReducer, Action } from '@ngrx/store';
import { Media, MEDIA_SMALL, MEDIA_MEDIUM, MEDIA_LARGE } from '../models';
import { MediaActions } from '../actions'; 

export interface MediaState {
  width: string;
};

const initialState: MediaState = {
  width: MEDIA_SMALL
}

export function mediaReducer(state = initialState, action: Action): MediaState {
  switch(action.type){
    case MediaActions.SET_SIZE: {
      /*
      console.log('*******************************')
      for(const key in action){
        console.log(key)
      }
      console.log(`action type: ${action.type}`)
      for(const key in action.payload){
        console.log(key);
      }
      console.log(action.payload.width);
      console.log('*******************************')
      */
      return {width: action.payload.width};
    }
    
    default: {
      return state;
    }
  }
}