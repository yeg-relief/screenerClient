import { ActionReducer, Action } from '@ngrx/store';

export const SMALL = 'SMALL';
export const MEDIUM = 'MEDIUM';
export const LARGE = 'LARGE';

export const mediaReducer: ActionReducer<string> = (state: string = SMALL, action: Action) => {
  switch (action.type) {
    case SMALL:
      return SMALL;

    case MEDIUM:
      return MEDIUM;

    case LARGE:
      return LARGE;

    default:
      return SMALL;
  }
}