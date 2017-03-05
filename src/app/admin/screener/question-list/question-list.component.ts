import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Question, ID, QuestionType, QUESTION_TYPE_CONDITIONAL, QUESTION_TYPE_CONSTANT } from '../../models';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromEvent';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';


@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css'],
})
export class QuestionListComponent implements OnInit, OnDestroy {
  @Input() questions: ID[];
  @Input() form: FormGroup;
  @Input() type: QuestionType; // are these conditional or constant questions in the list?
  @Input() host_id: ID | undefined; // undefined if these are constant questions
  @Output() questionSelect = new EventEmitter<ID>();
  @Output() questionUnselect = new EventEmitter<ID>();
  @Output() addQuestion = new EventEmitter<{[key: string]: QuestionType | ID }>();

  private classes: { [key: string]: {[key: string]: boolean} } = { };
  private constant_type: QuestionType = QUESTION_TYPE_CONSTANT;
  private conditional_type: QuestionType = QUESTION_TYPE_CONDITIONAL;

  private destroySubs$ = new Subject();

  constructor(private store: Store<fromRoot.State>) {}

  handleAddQuestion() {
    if (this.type === QUESTION_TYPE_CONSTANT ) {
      this.addQuestion.emit({type: QUESTION_TYPE_CONSTANT});
      return;
    } else if (this.type === QUESTION_TYPE_CONDITIONAL ) {
      this.addQuestion.emit({type: QUESTION_TYPE_CONDITIONAL, host_id: this.host_id})
    } else {
      console.warn('[QuestionList]: unkown type @Input()');
    }
  } 

  handleSelect(questionID: ID) {
    
    const deselectAll = () => {
      for (const key in this.classes) {
        if (this.classes[key]['selected'] === true) this.classes[key]['selected'] = false;
      }
    }


    const selected_id = Object.keys(this.classes).find(id => this.classes[id]['selected'] === true);
    if (selected_id !== undefined && selected_id === questionID) {
      this.questionUnselect.emit(selected_id);
      deselectAll();
      return;
    } 

    deselectAll();

    if (this.classes[questionID] === undefined) this.classes[questionID] = { };

    this.classes[questionID]['selected'] = true;

    
    Promise.resolve(this.questionUnselect.emit(selected_id))
           .then(_ => this.questionSelect.emit(questionID));
  }
  
  ngOnInit(){
    
    const upArrow = Observable.fromEvent(document.body, 'keydown')
      .filter(e => (<any>e).key === 'ArrowUp')
      .takeUntil(this.destroySubs$)
      .combineLatest(this.store.let(fromRoot.getSelectedConstantID), this.store.let(fromRoot.getSelectedConditionalID))
      .subscribe( ([_, selectedConstantID, selectedConditionalID]) => {
        const container = document.getElementById(this.type + '-question-list'); 
        if(selectedConstantID !== undefined && this.type === this.constant_type) {
          this.showSelection(selectedConstantID, container)
        } else if (selectedConstantID === undefined && this.type === this.constant_type){
          this.deselectAll();
        } else if (selectedConditionalID !== undefined && this.type === this.conditional_type) {
          this.showSelection(selectedConditionalID, container)
        } else if (selectedConditionalID === undefined && this.type == this.conditional_type) {
          this.deselectAll();
        }        
      })
  }

  showSelection(selectedID, container) {
    const element = document.getElementById(selectedID);
    scrollIntoView(element, container);
    const index = this.questions.findIndex(id => id === selectedID)
    const targetID = index >= 0 ? this.questions[index] : undefined;
    this.selectTarget(targetID);
  }

  deselectAll() {
    for (const key in this.classes) {
      if (this.classes[key]['selected'] === true) this.classes[key]['selected'] = false;
    }
  }

  selectTarget(targetID){
    this.deselectAll();

    if (targetID === undefined) return;

    if(this.classes[targetID] === undefined) this.classes[targetID] = { };

    this.classes[targetID]['selected'] = true;
  }

  ngOnDestroy() { this.destroySubs$.next() }
}


function scrollIntoView(element, container){
  if (element && container){
    element.scrollIntoView({block: 'start', behavior: 'smooth'});
    // scroll a bit more
    container.scroll(0, 50)
  }
}