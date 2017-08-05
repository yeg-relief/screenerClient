import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadein', [
      state('*', style({opacity: 1 })),
      transition('void => *', [
        style({opacity: 0 }),
        animate('900ms ease-out')
      ]),
    ])
  ]
})
export class HomeComponent {}
