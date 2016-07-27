import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { GenYcbQuestion } from '../question';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MasterScreenerEditActions } from '../../actions/master-screener-edit';



@Component({
  selector: 'master-screener-question',
  template: `
            <div 
              style="cursor:move"
              draggable="true"
              [ngClass]="{
                selected: isSelected,
                over: isOver
              }"
              (dragstart)="dragStartHandler()"
              (dragend)="dragEndHandler()"
              (dragenter)="handleDragEnter($event)"
              (dragleave)="handleDragLeave()"
              (dragover)="allowDrop($event)"
              (drop)="handleDragDrop()">
              <gen-ycb-question [question]="question" [controls]="false"></gen-ycb-question>
            </div>`,
  directives: [GenYcbQuestion],
  styles: [`
    .selected{
      opacity: 0.4
    } 
    .over {
      border: 2px dashed #000;
    }
  `]
})
class MasterScreenerQuestion implements OnInit{
  @Input() question:any;
  isSelected = false;
  isOver = false;
  
  @Output() dragStartEmmitter = new EventEmitter<any>();
  @Output() dragEndEmmitter = new EventEmitter<any>();
  @Output() dropEmmitter  = new EventEmitter<any>();
  
  constructor(){}
  ngOnInit(){
  }
  
  dragStartHandler(){
    this.isSelected = true;
    this.dragStartEmmitter.emit(this.question);
  }
  dragEndHandler(){
    this.isSelected = false;
    this.dragEndEmmitter.emit(this.question);
  }
  handleDragEnter($event) {
    $event.preventDefault();
    this.isOver = true;
  }

  handleDragLeave() {
    this.isOver = false;
  }
  
  handleDragDrop(){
    this.isOver = false;
    this.dropEmmitter.emit(this.question);
  }
  
  allowDrop($event) {
    $event.preventDefault();
    this.isOver = true;
  }
  
}




@Component({
  template: `
  <div style="width:80vw;margin-top:5vh;height:200vh;">
    <md-card>
      <md-card-title>Master Screener Edit Mode</md-card-title>
      <md-card-subtitle>delete, edit or reorder</md-card-subtitle>
      <md-card-content>
        <div class="flex flex-column flex-center" >
          <div *ngFor="let question of (questions$ | async)" 
            style="margin-left:15%;margin-right:15%;width:70%;">
            <md-card style="background-color:lightblue">
              <md-card-content>
                <master-screener-question
                  (dragEndEmmitter)="handleDragEnd($event)"
                  (dragStartEmmitter)="handleDragStart($event)"
                  (dropEmmitter)="handleDrop($event)"
                  [question]="question">
                </master-screener-question>
              </md-card-content>
              <md-card-actions>
                <button md-button>EDIT</button>
                <button md-button (click)="deleteQuestion(question)">DELETE</button>
              </md-card-actions>
            </md-card>
            <br><br>
          </div>
        </div>
      </md-card-content>
    </md-card>
  </div>
  `,
  directives: [MD_CARD_DIRECTIVES,MD_BUTTON_DIRECTIVES, MasterScreenerQuestion]
})
export class MasterScreenerEdit implements OnInit{
  private questions$: Observable<any>;
  private currentDrag: any = undefined;
  
  constructor(private store: Store<AppState>){}
  
  ngOnInit(){
    this.questions$ = this.store.select('masterScreenerEdit')   
                      .map( (msEdit:any) => msEdit.data.questions); 
  }
  
  deleteQuestion(question:any){
    this.store.dispatch({type: MasterScreenerEditActions.DELETE_QUESTION, payload:question})
  }
  
  handleDragEnd(question){
    if(question.key !== this.currentDrag.key){
      console.log(`dragEnd called on ${question.key}, but currentDrag.key = ${this.currentDrag.key}`)
    }
    this.currentDrag = undefined;
  }
  
  handleDragStart(question){
    if(this.currentDrag !== undefined){
      console.log(`dragStart called on ${question.key}, but currentDrag does not equal undefined deets below`);
      for(const key in this.currentDrag){
        console.log(`currentDrag.${key}: ${this.currentDrag[key]}`)
      }
    }
    this.currentDrag = question;
  }
  
  handleDrop(question){
    this.store.dispatch({
      type: MasterScreenerEditActions.SWAP_QUESTIONS,
      payload: {
        questionA: this.currentDrag,
        questionB: question
      }
    })
  }
}