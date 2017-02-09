import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';

@Component({
  selector: 'app-ycb-question',
  templateUrl: './ycb-question.component.html',
  styleUrls: ['./ycb-question.component.css']
})
export class YcbQuestionComponent implements OnInit, OnDestroy {
  @Input() question;
  @Input() form: FormGroup;
  @Output() onExpand = new EventEmitter<any>();
  @Output() onHide = new EventEmitter<any>();
  private subscriptions: Subscription[] = [];

  constructor() { }

  ngOnInit() {
    if (this.question.expandable && Array.isArray(this.question.conditionalQuestions) && this.question.conditionalQuestions.length > 0) {
      const change = this.form.get(this.question.key).valueChanges
        .filter(value => typeof value === 'boolean')
        .multicast( new ReplaySubject<boolean>(1) ).refCount()


      const expand = change.filter(value => value === true)
        .do( _ => this.onExpand.emit( this.question.conditionalQuestions) )

      const hide = change.filter(val => val === false)
        .do( _ => this.onHide.emit( this.question.conditionalQuestions) )

      const merged = Observable.merge(expand, hide).subscribe();
      this.subscriptions = [ merged ]
    }
    
  }

  ngOnDestroy(){
    for(const sub of this.subscriptions) {
      if (!sub.closed){
        sub.unsubscribe();
      }
    }
  }

}
