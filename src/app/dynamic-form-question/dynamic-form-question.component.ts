import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ControlGroup } from '@angular/common';
import { QuestionBase } from '../Question/base/question-base';
import { Subscription } from 'rxjs/Subscription';

export interface INewValue {
  key: string,
  data: string
}

@Component({
  selector: 'df-question',
  templateUrl: 'app/dynamic-form-question/dynamic-form-question.component.html'
})
export class DynamicFormQuestionComponent implements OnInit, OnDestroy {
  private _subscription: Subscription;
  @Input() question: QuestionBase<any>;
  @Input() form: ControlGroup;
  @Output() onChanged = new EventEmitter<INewValue>();
  
  get isValid() { return this.form.controls[this.question.key].valid; }
  ngOnInit() {
    this._subscription = this.form.controls[this.question.key].valueChanges
    .subscribe(data => {
      this.dispatchChange({key: this.question.key, data: data});
    });
  }
  ngOnDestroy(){
    this._subscription.unsubscribe();
  }
  
  dispatchChange(newValue: INewValue){
    this.onChanged.emit(newValue);
  }
}