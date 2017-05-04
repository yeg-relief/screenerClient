import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

// WIP want to store all animations in this file (DRY)

export const anim = {
  exapand: trigger('expand', [
    state('expanded', style({ transform: 'translateX(0)', opacity: '1' })),
    state('collapsed', style({ transform: 'translateX(100%)', opacity: '0' })),
    transition('void => *', [
      style({ transform: 'translateX(-100%)', opacity: '0' }),
      animate('300ms ease-out')
    ]),
    transition('expanded => collapsed', [
      style({ transform: 'translateX(0)', opacity: '1' }),
      animate('300ms ease-out')
    ]),
  ])
}