import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Media } from '../models';

@Injectable()
export class MediaActions{
  static SET_SIZE = '[Media] SET_SIZE';
  setSize(size: string){
    return {
      type: MediaActions.SET_SIZE,
      payload: size
    }
  }
}