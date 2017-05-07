import {AnimationEntryMetadata } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

export const Animations: {[key: string]: AnimationEntryMetadata} = {
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
  ]),
  routeAnimation: trigger('routeAnimation', [
    state('*',
      style({
        opacity: 1,
        transform: 'translateX(0)'
      })
    ),
    transition(':enter', [
      style({
        opacity: 0,
        transform: 'translateX(-100%)'
      }),
      animate('0.3s ease-in')
    ]),
    transition(':leave', [
      animate('0.5s ease-out', style({
        opacity: 0,
        transform: 'translateY(100%)'
      }))
    ])
  ]),
  conditionalQuestions: trigger('expandFromConstants', [
    state('*',
      style({
        opacity: 1,
        transform: 'translateX(0)'
      })
    ),
    transition(':enter', [
      style({
        opacity: 0,
        transform: 'translateX(-15vw)'
      }),
      animate('0.3s ease-in')
    ]),
    transition(':leave', [
      animate('0.3s ease-out', style({
        opacity: 0,
        transform: 'translateX(-15vw)'
      }))
    ])
  ]),
  questionEdit: trigger('questionEdit', [
    state('true', 
      style({
        transform: 'translateX(0)'
      })
    ),
    state('false', style({
        transform: 'translateX(0)'
      })
    ),
    transition('true => false', [
      animate('0.3s ease-out', style({
        transform: 'translateX(-15vw)'
      }))
    ]),
  ])
}