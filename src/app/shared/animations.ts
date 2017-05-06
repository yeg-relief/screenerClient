import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

export const Animations = {
  flyinHalf: trigger('flyinHalf', [
    state('in', style({ transform: 'translateX(0)' })),
    transition('void => *', [
      style({ transform: 'translateX(-50%)' }),
      animate('400ms ease-out')
    ]),
  ]),
}