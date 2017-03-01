import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ScreenerController } from '../services/screener-controller';
import { Id, Question } from '../services';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

@Component({
  selector: 'app-screener-overview',
  templateUrl: './screener-overview.component.html',
  styleUrls: ['./screener-overview.component.css'],
})
export class ScreenerOverviewComponent implements OnInit {
  questions: Observable<string[]>;
  selectedQuestion = new ReplaySubject<any>(1);

  constructor(public controller: ScreenerController) { }

  ngOnInit() {
    this.controller.populateModel();
    this.questions = this.controller.state$.asObservable().map(state => state.questions);
  }

  ngOnDestroy() {}

  handleKeyFilter(keyName: string) {
    const q = this.controller.findQuestionByKey(keyName);
    if (q === undefined) {
      this.selectedQuestion.next('');
    } else {
      this.selectedQuestion.next(q.id);
    }
  }

  handleSelect(id) {
    const newSelection = this.questions.take(1)
      .map(ids => ids.filter(i => i === id) )
      .map(id => id[0])
      .subscribe( (update: string) => { 
        if(update !== undefined) this.selectedQuestion.next( update ) 
      })
    
  }

  handleSwap($event) {
    this.controller.command$.next({
        fn: this.controller.commands.swapQuestions, 
        args: [$event.sourceID, $event.targetKeyName] 
    });
  }

  handleDelete(questionID: Id) {
    this.controller.command$.next({
        fn: this.controller.commands.deleteQuestion, 
        args:  [ questionID ] 
    });

    this.questions.take(1)
        .filter( ids => ids.length > 0 )
        .mergeMap( ids => Observable.of(ids[0]) )
        .subscribe( (update: string) => { if(update !== undefined) this.selectedQuestion.next( update ) } )
  }

  handleAddConditional(questionID: Id) {
    console.log(`[ScreenerOverview].handleAddConditional questionID: ${questionID}`)

    this.controller.command$.next({
      fn: this.controller.commands.addConditionalQuestion,
      args: [ questionID ]
    })
  }

}
