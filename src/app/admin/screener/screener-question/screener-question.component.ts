import { Component, Input, OnInit } from '@angular/core';
import { ScreenerModel } from '../screener-model';

@Component({
  selector: 'app-screener-question',
  templateUrl: './screener-question.component.html',
  styleUrls: ['./screener-question.component.css']
})
export class ScreenerQuestionComponent implements OnInit {
  @Input() question;
  private conditionalQuestions = [];
  private showConditionals = true;
  constructor(public model: ScreenerModel) { }

  ngOnInit() {
    if (this.question.expandable && Array.isArray(this.question.conditionalQuestions)  
        && this.question.conditionalQuestions.length > 0)
    {
      this.conditionalQuestions = this.model.findConditionals(this.question);
      console.log(this.conditionalQuestions);
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
    if (!this.question.expandable && this.question.conditionalQuestions.length > 0) {
      this.model.clearCondtionals(this.question);
    }
  }

  deleteConditionalQuestion(question) {
    console.log('deleteConditionalQuestion called')
    const index = this.conditionalQuestions.findIndex(q => q.id === question.id);
    this.conditionalQuestions.splice(index, 1);
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
