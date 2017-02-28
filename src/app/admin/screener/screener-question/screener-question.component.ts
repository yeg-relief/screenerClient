import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ScreenerController, Id, Question } from '../services';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/startWith';

@Component({
  selector: 'app-screener-question',
  templateUrl: './screener-question.component.html',
  styleUrls: ['./screener-question.component.css']
})
export class ScreenerQuestionComponent implements OnInit {
  @Input() question: BehaviorSubject<Id>;
  @Output() onDelete = new EventEmitter<Id>();
  @Output() onAddConditional = new EventEmitter<Id>();

  private questionUpdate: Observable<Id>;
  private conditionalQuestions = new Observable<Id[]>();
  private selectedQuestion = new BehaviorSubject<Id>('');
  
  constructor(public controller: ScreenerController) { }

  ngOnInit() {
    this.questionUpdate = this.question.asObservable().multicast(new BehaviorSubject<Id>('')).refCount()

    this.conditionalQuestions = this.questionUpdate
      .map( id => {
        const q = this.controller.findQuestionById(id);
        if( q !== undefined && Array.isArray(q.conditionalQuestions) )  {
          if(q.conditionalQuestions[0] !== undefined) this.selectedQuestion.next(q.conditionalQuestions[0]);
          return q.conditionalQuestions;
        }
        return [];
      })
      .startWith([]);
  }

  handleSelect(questionID: Id) { this.selectedQuestion.next( questionID ) }

  deleteQuestion() { this.questionUpdate.take(1).subscribe(id => this.onDelete.emit(id)) }


  addConditionalQuestion() { this.questionUpdate.take(1).subscribe(id => this.onAddConditional.emit( id ) ) }

  makeExpandable($event) {
    this.questionUpdate.take(1).subscribe(id => {
      const question = this.controller.findQuestionById(id);
      if (!$event && question.expandable) {
        // launch some type of confirmation dialog here.
        this.controller.command$.next( {
          fn: this.controller.commands.clearConditionals,
          args: [ id ]
        })
      }
    })
  }

  deleteConditionalQuestion(questionID: Id) {
    this.controller.command$.next( {
      fn: this.controller.commands.deleteQuestion,
      args: [ questionID ]
    })
  }


  swapConditionalQuestions($event) {
    this.controller.command$.next( {
      fn: this.controller.commands.swapQuestions,
      args: [ $event.sourceID, $event.targetKeyName ]
    });
  }
}
