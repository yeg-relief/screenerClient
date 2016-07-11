import { Component, Input } from '@angular/core';

import { Question } from '../models/index';

import { MD_RADIO_DIRECTIVES } from '@angular2-material/radio';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';

@Component({
  selector: 'con-ycb-question',
  template: `
    <ul>
      <li> thing </li>
      <li> thing </li>
    </ul>
  `,
  styles: [``],
  directives: [MD_RADIO_DIRECTIVES]
})
class ConcreteYcbQuestion{
  
}

@Component({
  selector: 'ycb-question',
  templateUrl:'app/components/question.component.html',
  styles: [``], 
  directives: [MD_CARD_DIRECTIVES, ConcreteYcbQuestion]
})
export class YcbQuestion{
  @Input() question: Question;
}