import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ScreenerModel } from '../screener-model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-screener-question',
  templateUrl: './screener-question.component.html',
  styleUrls: ['./screener-question.component.css']
})
export class ScreenerQuestionComponent implements OnInit {
  @Input() question;
  @Output() keyChange = new EventEmitter<any>();
  private conditionalQuestions = [];
  private showConditionals = true;
  //private form: FormGroup;
  constructor(public model: ScreenerModel) { }

  ngOnInit() {
    //this.form = this.model.getModelControls();
    if (this.question.expandable && Array.isArray(this.question.conditionalQuestions)  
        && this.question.conditionalQuestions.length > 0)
    {
      this.conditionalQuestions = this.model.findConditionals(this.question);
    }

  }

  deleteQuestion() {
    this.model.delete(this.question);
  }

  toggleConditionals() {
    this.showConditionals = !this.showConditionals;
  }

  addConditionalQuestion() {
    this.model.addConditionalQuestion(this.question);
    this.conditionalQuestions = this.model.findConditionals(this.question);
  }

  makeExpandable($event) {
    this.question.expandable = $event;
    if (!this.question.expandable && Array.isArray(this.question.conditionalQuestions) ){
      this.model.clearCondtionals(this.question);
    }
  }

  deleteConditionalQuestion(question) {
    this.conditionalQuestions = this.conditionalQuestions.filter(q => q.id !== question.id);
    this.model.deleteConditional(this.question, question);
  }

  swapConditionalQuestions($event) {
    this.model.swapConditionals($event.sourceQuestion, $event.targetKeyName);
    this.conditionalQuestions = this.model.findConditionals(this.question).sort( (a, b) => a.index - b.index)
  }
}
