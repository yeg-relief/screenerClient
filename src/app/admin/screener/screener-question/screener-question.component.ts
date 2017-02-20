import { Component, Input, OnInit } from '@angular/core';
import { ScreenerModel } from '../screener-model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-screener-question',
  templateUrl: './screener-question.component.html',
  styleUrls: ['./screener-question.component.css']
})
export class ScreenerQuestionComponent implements OnInit {
  @Input() question;
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

  increaseIndex() {
    this.model.increaseIndex(this.question);
  }

  decreaseIndex() {
    this.model.decreaseIndex(this.question);
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
    console.log('deleteConditionalQuestion called')
    console.log(question)
    console.log(this.conditionalQuestions)
    this.conditionalQuestions = this.conditionalQuestions.filter(q => q.id !== question.id);
    console.log(this.conditionalQuestions)
    this.model.deleteConditional(this.question, question);
  }


  decreaseConditionalIndex(condQuestion) {
    if (condQuestion.index === 0 || this.conditionalQuestions.length === 1) {
      return;
    }

    this.conditionalQuestions = this.conditionalQuestions.map( (q, index) => {
      if (index > condQuestion.index) {
        return q;
      } 

      if (index === condQuestion.index) {
        const swap = this.conditionalQuestions[index - 1];
        if (swap === undefined) {
          return q;
        }
        swap.index = index;
        return swap;
      }

      if (index === condQuestion.index - 1) {
        const swap = (<any>Object).assign({}, condQuestion);
        swap.index = index;
        return swap;
      }

      if (index < condQuestion.index - 1) {
        q.index = index + 1;
        return q;
      }

    });

    this.model.setConditionalIndices(this.conditionalQuestions);

  }

  increaseConditionalIndex(condQuestion) {
    if (condQuestion.index === this.conditionalQuestions.length - 1) {
      return;
    }

    this.conditionalQuestions = this.conditionalQuestions.map( (q, index) => {
      if (index < condQuestion.index) {
        return q;
      } 

      if (index === condQuestion.index) {
        const swap = this.conditionalQuestions[index + 1];
        if (swap === undefined) {
          return q;
        }
        swap.index = index;
        return swap;
      }

      if (index === condQuestion.index + 1) {
        const swap = (<any>Object).assign({}, condQuestion);
        swap.index = index;
        return swap;
      }

      if (index > condQuestion.index + 1) {
        q.index = index - 1;
        return q;
      }

    });

    this.model.setConditionalIndices(this.conditionalQuestions);
  }
}
