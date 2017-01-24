import { Component, OnInit, Input } from '@angular/core';
import { UserQuestionComponent } from '../user-question.component';
import { FormGroup, FormBuilder } from '@angular/forms'
import { ScreenerModel } from '../../../screener-model';

@Component({
  selector: 'app-input-question',
  templateUrl: './input-question.component.html',
  styleUrls: ['./input-question.component.css']
})
export class InputQuestionComponent  {
  constructor(public model: ScreenerModel) { }
}
