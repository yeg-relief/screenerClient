import { Component, Input } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { Question } from '../models/index';

@Component({
  selector: 'ycb-question',
  templateUrl:'app/components/question.component.html',
  styles: [''], 
  directives: [MD_CARD_DIRECTIVES]
})
export class YcbQuestion{
  @Input() question: Question;
}