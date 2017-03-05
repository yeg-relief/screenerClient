import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Question, ID, QuestionType, QUESTION_TYPE_CONDITIONAL, QUESTION_TYPE_CONSTANT } from '../../models';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subscription } from 'rxjs/Subscription';
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

  private upArrow: Subscription;
  private downArrow: Subscription;
  private rightArrow: Subscription;
  private leftArrow: Subscription;
  private selectedQuestionID: Subscription;
  private destroySubs$ = new Subject();
  

  constructor(private store: Store<fromRoot.State>, private ref: ElementRef) {}

  handleAddQuestion() {
    if (this.type === QUESTION_TYPE_CONSTANT ) {
      Promise.resolve(this.addQuestion.emit({type: QUESTION_TYPE_CONSTANT}))
        .then( _ => setTimeout( () => this.selectTarget(this.questions[this.questions.length - 1]), 60))
        .then( _ => {
          const id = this.questions[this.questions.length -1];
          this.showSelection(id);
        })
      return;
    } else if (this.type === QUESTION_TYPE_CONDITIONAL ) {
      Promise.resolve(this.addQuestion.emit({type: QUESTION_TYPE_CONDITIONAL, host_id: this.host_id}))
        .then( _ => setTimeout( () => this.selectTarget(this.questions[this.questions.length -1]), 60))
        .then( _ => {
          const id = this.questions[this.questions.length -1];
          this.showSelection(id);
        })
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
      console.log("QUESTION UNSELECT")
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
    this.selectedQuestionID = Observable.merge(
      this.store.let(fromRoot.getSelectedConstantID),
      this.store.let(fromRoot.getSelectedConditionalID)
    )
    .filter( id => this.questions.find(qid => qid === id) !== undefined)
    .takeUntil(this.destroySubs$)
    .subscribe( id => { this.selectTarget(id); console.log(this.classes) });
  }

  ngAfterViewInit(){
    const keydown = Observable.fromEvent(document, 'keydown')
      .takeUntil(this.destroySubs$)
      .do(e => (<any>e).preventDefault())
      .debounceTime(60)
      .multicast( new ReplaySubject(1)).refCount();


    this.upArrow = keydown
      .combineLatest(this.store.let(fromRoot.getSelectedConstantID), this.store.let(fromRoot.getSelectedConditionalID))
      .filter( ([e, _, __]) => (<any>e).key === 'ArrowUp')
      .subscribe( ([_, selectedConstantID, selectedConditionalID]) => {

        if(selectedConstantID !== undefined && this.type === this.constant_type) {
          this.showSelection(selectedConstantID)
        } else if (selectedConstantID === undefined && this.type === this.constant_type){
          this.deselectAll();
        } else if (selectedConditionalID !== undefined && this.type === this.conditional_type) {
          this.showSelection(selectedConditionalID,)
        } else if (selectedConditionalID === undefined && this.type == this.conditional_type) {
          this.deselectAll();
        }        
      })

    this.downArrow = keydown
      .combineLatest(this.store.let(fromRoot.getSelectedConstantID), this.store.let(fromRoot.getSelectedConditionalID))
      .filter( ([e, _, __]) => (<any>e).key === 'ArrowDown')
      .subscribe( ([_, selectedConstantID, selectedConditionalID]) => {

        if(selectedConstantID !== undefined && this.type === this.constant_type) {
          this.showSelection(selectedConstantID)
        } else if (selectedConstantID === undefined && this.type === this.constant_type){
          this.deselectAll();
        } else if (selectedConditionalID !== undefined && this.type === this.conditional_type) {
          this.showSelection(selectedConditionalID,)
        } else if (selectedConditionalID === undefined && this.type == this.conditional_type) {
          this.deselectAll();
        }        
      });

    this.rightArrow = keydown
      .combineLatest(this.store.let(fromRoot.getSelectedConditionalID), this.store.let(fromRoot.getSelectedConstantID))
      .filter( ([e, __, _]) => (<any>e).key === 'ArrowRight')
      .subscribe( ([_, selectedConditionalID, selectedConstantID]) => {

          if (selectedConditionalID !== undefined && this.type === this.conditional_type) {
            this.showSelection(selectedConditionalID);
          } else if (selectedConstantID !== undefined && this.type === this.constant_type){
            this.showSelection(selectedConstantID);
          }   
        },
        error => console.log(error)
      );

    this.leftArrow = keydown
      .combineLatest(this.store.let(fromRoot.getSelectedConditionalID))
      .filter( ([e,  __]) => (<any>e).key === 'ArrowLeft')
      .filter( ([_, selectedConditionalID]) => selectedConditionalID === undefined )
      .subscribe( ([_, selectedConditionalID]) => {
        
        if (selectedConditionalID === undefined && this.type === this.conditional_type) {
          const selected_id = Object.keys(this.classes).find(id => this.classes[id]['selected'] === true);
          if (selected_id !== undefined) this.questionUnselect.emit(selected_id);
          this.deselectAll();
        }    
      });
  }

  showSelection(selectedID) {
    const element = document.getElementById(selectedID);
    scrollIntoView(element);
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

  ngOnDestroy() { 
    console.log('NG ON DESTROY CALLED');
    for(const key in this.classes) delete this.classes[key];
    this.destroySubs$.next(); 
  }
}


function scrollIntoView(element){if (element) element.scrollIntoView({block: "start", behavior: "smooth"});}