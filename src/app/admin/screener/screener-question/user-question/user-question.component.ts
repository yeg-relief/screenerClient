import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-question',
  templateUrl: './user-question.component.html',
  styleUrls: ['./user-question.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserQuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() userForm: FormGroup;
  @Input() adminForm: FormGroup ;
  
  text = ''
  //@Input() meta;
  constructor() { }

  ngOnInit() {
    this.text = this.adminForm.value;
    this.adminForm.valueChanges 
      .do(update => this.question = (<any>Object).assign({}, update))
      .subscribe(next => console.log('^^^^  ^^^^^'));
  }
  }



export type Question = ( NumberInput | Checkbox | NumberRadio | ExpandableQuestion );
export type ConditionalQuestion = ( NumberInput | NumberRadio );

export type NumberOption = {
  value: number;
  display: string;
}

export type NumberInput = {
  label: string;
  key: string;
  controlType: 'input';
  value: number;
}

export type Checkbox = {
  label: string;
  key: string;
  controlType: 'checkbox';
}

export type NumberRadio = {
  label: string;
  key: string;
  controlType: 'radio';
  options: NumberOption[];
}

export type ExpandableQuestion = {
  expandable: boolean;
  label: string;
  key: string;
  controlType: 'checkbox';
  conditonalQuestions: ConditionalQuestion[];
}