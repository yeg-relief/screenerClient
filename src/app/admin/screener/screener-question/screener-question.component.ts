import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ScreenerController } from '../services/screener-controller';
import { Id, Question } from '../services';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/do';

@Component({
  selector: 'app-screener-question',
  templateUrl: './screener-question.component.html',
  styleUrls: ['./screener-question.component.css']
})
export class ScreenerQuestionComponent implements OnInit {
  @Input() question: ReplaySubject<Id>;
  @Output() onDelete = new EventEmitter<Id>();
  @Output() onAddConditional = new EventEmitter<Id>();

  private questionUpdate: Observable<Id>;
  private conditionalQuestions: Observable<Id[]>;
  private selectedQuestion = new ReplaySubject<Id>(1);
  private form = new ReplaySubject<any>(1);

  private expandable = false;

  private sub: Subscription;
  constructor(public controller: ScreenerController) { }

  ngOnInit() {
    this.question.take(1).subscribe(id => {
      const f = this.controller.findGroup(id) !== null ? this.controller.findGroup(id) : undefined;
      if (f) this.form.next(f.value)
      if (f.value.expandable){
        this.expandable = true;
      } else {
        this.expandable = false;
      }
    })

    this.questionUpdate = Observable.combineLatest(
      this.question.asObservable(),
      this.controller.state$
    )
      .map( ([question, _]) => question)
      .do( questionID => {
        const f = this.controller.findGroup(questionID) !== null ? this.controller.findGroup(questionID) : undefined;
        if (f !== undefined) this.form.next(f.value);

        if (f !== undefined && f.value.expandable){
          this.expandable = true;
        } else if(f !== undefined && !f.value.expandable) {
          this.expandable = false;
        } else if(f === undefined) {
          console.warn('[ScreenerQuestion].ngOnInit.questionUodate "f" is undefined')
          console.warn(f === undefined)
          // do something??
        }
      })
      .multicast(new ReplaySubject<Id>(1)).refCount()

    

    this.conditionalQuestions = this.questionUpdate
      .map( id => {
        console.log('[ScreenerQuestion].ngOnInit.contionalQuestions called');
        const q = this.controller.findQuestionById(id);
        console.log(q);

        if( q !== undefined && Array.isArray(q.conditionalQuestions) )  {
          if(q.conditionalQuestions[0] !== undefined) this.selectedQuestion.next(q.conditionalQuestions[0]);
          return q.conditionalQuestions;
        }
        return [];
      })
      .startWith([]);
    
    this.sub = this.questionUpdate.subscribe();
  }

  ngOnDestroy(){ if (this.sub !== undefined && !this.sub.closed) this.sub.unsubscribe() }

  handleSelect(questionID: Id) { this.selectedQuestion.next( questionID ) }

  deleteQuestion() { this.questionUpdate.take(1).subscribe(id => this.onDelete.emit(id)) }


  addConditionalQuestion() { this.questionUpdate.take(1).subscribe(id => this.onAddConditional.emit( id ) ) }

  makeExpandable($event) {
    this.questionUpdate.take(1).subscribe(id => {
      const question = this.controller.findQuestionById(id);
      if (!$event && question !== undefined) {
        // launch some type of confirmation dialog here.
        this.controller.command$.next( {
          fn: this.controller.commands.clearConditionals,
          args: [ id ]
        })
      } else if($event && question !== undefined) {
        this.controller.command$.next( {
          fn: this.controller.commands.makeExpandable,
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

    this.conditionalQuestions.take(1)
        .map( ids => ids[0] )
        .subscribe( (update: string) => update !== undefined ? this.selectedQuestion.next( update ) : this.selectedQuestion.next(''))
  }


  swapConditionalQuestions($event) {
    this.controller.command$.next( {
      fn: this.controller.commands.swapQuestions,
      args: [ $event.sourceID, $event.targetKeyName ]
    });
  }
}
