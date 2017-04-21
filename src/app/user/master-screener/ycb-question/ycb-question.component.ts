import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { QuestionControlService } from '../questions/question-control.service';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/multicast'
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations'

@Component({
  selector: 'app-ycb-question',
  templateUrl: './ycb-question.component.html',
  styleUrls: ['./ycb-question.component.css'],
  animations: [
    trigger('expand', [
      state('expanded', style({transform: 'translateY(0)', opacity: 1})),
      state('collapsed', style({opacity: 0})),
      transition('void => *', [
        style({transform: 'translateY(-30%)'}),
        animate('300ms ease-out')
      ]),
      transition('expanded => collapsed', [
        style({opacity: 0}),
        animate('200ms ease-out')
      ]),
    ]),
  ]
})
export class YcbQuestionComponent implements OnInit, OnDestroy {
  @Input() question;
  @Input() form: FormGroup;
  @Input() conditionalQuestions;
  @Output() onExpand = new EventEmitter<any>();
  @Output() onHide = new EventEmitter<any>();
  subscriptions: Subscription[] = [];
  showQuestions = false;
  expand;

  constructor(private qcs: QuestionControlService) { }

  ngOnInit() {
    if (this.isExpandableQuestion()) {
      this.onExpand.emit( this.question.conditionalQuestions )
      
      const change = this.form.get(this.question.key).valueChanges
        .filter(value => typeof value === 'boolean')
        .multicast( new ReplaySubject<boolean>(1) ).refCount()


      const expand = change.filter(value => value === true)
        .do( _ => this.onExpand.emit( this.question.conditionalQuestions) )
        .do( _ => this.expand !== 'expanded' ? this.expand = 'expanded' : null );

      const hide = change.filter(val => val === false)
        .do( _ => this.expand !== 'collapsed' ? this.expand = 'collapsed' : null )
      
  
      const merged = Observable.merge(expand, hide)
        .subscribe(hide => hide === true ? this.showQuestions = hide : null);

      
      this.subscriptions = [ merged ];
      
    }
 
  }

  ngOnDestroy(){
    for(const sub of this.subscriptions) {
      if (!sub.closed){
        sub.unsubscribe();
      }
    }
  }

  animationDone($event) {
    if ($event.toState === 'collapsed') {
      this.showQuestions = false;
    }
  }

  isExpandableQuestion() {
    return this.question.expandable && 
           Array.isArray(this.question.conditionalQuestions) && 
           this.question.conditionalQuestions.length > 0;
  }
}
