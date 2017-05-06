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
  fadeinAndOut: trigger('fadeinAndOut', [
    state('in', style({opacity: '1'})),
    state('out', style({opacity: '0'})),
    transition('void => *', [
      style({opacity: '0'}),
      animate('300ms ease-out')
    ]),
    transition('out => in', [
      style({opacity: '0'}),
      animate('300ms ease-out')
    ]),
    transition('in => out', [
      style({opacity: '1'}),
      animate('300ms ease-out')
    ])
  ])
}