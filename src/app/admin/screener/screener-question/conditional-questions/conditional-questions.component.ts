import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-conditional-questions',
  templateUrl: './conditional-questions.component.html',
  styleUrls: ['./conditional-questions.component.css']
})
export class ConditionalQuestionsComponent implements OnInit, OnDestroy {
  @Input() questions: any[];
  @Input() selectedQuestion: any[];
  @Output() addQuestion = new EventEmitter<any>();
  @Output() removeConditional = new EventEmitter<any>();
  @Output() swapConditionals = new EventEmitter<any>();
  //@Input() form: FormGroup;
  //private questionControl: FormGroup;
  private styles = {};
  private timeout;
  constructor() { }

  ngOnInit() {
    for(const question of this.questions) {
      this.styles[question.id] = {
        selected: false,
        dragStart: false,
        dragOver: false
      }
    }

    if (this.questions.length > 0) {
      this.selectedQuestion = [ this.questions[0] ];
      this.styles[ this.questions[0].id ].selected = true;
    }
  }

  ngOnDestroy(){
    if (this.timeout){
      clearTimeout(this.timeout);
    }
  }

  handleAddQuestion() {
    this.addQuestion.emit();
    this.timeout = setTimeout(() => {
      if (this.questions.length > 0) this.selectQuestion(this.questions[this.questions.length - 1])
    }, 60)
    
  }

  selectQuestion(question) {
    this.selectedQuestion = [question];
    const selected = Object.keys(this.styles).filter(key => this.styles[key].selected = true)
    for(const key of selected) {
      this.styles[key].selected = false;
    }
    if (this.styles[question.id]){
      this.styles[question.id].selected = true;
    } else {
      this.styles[question.id] = {
        selected: true,
        dragStart: false,
        dragOver: false
      }
    }
  }

  deleteConditionalQuestion(selectedQuestion) {
    if (!selectedQuestion){
      console.error('invalid deleteConditionalQuestion')
      return;
    }
    this.questions = this.questions.filter(question => question.id !== selectedQuestion.id);
    this.removeConditional.emit(selectedQuestion);

    const selected = Object.keys(this.styles).filter(key => this.styles[key].selected = true)
    for(const key of selected) {
      this.styles[key].selected = false;
    }

    if (this.questions.length > 0){
      const q = this.questions[0] 
      this.selectedQuestion = [ q ];
      if (this.styles[q.id]) {
        this.styles[q.id].selected = true;
      } else {
        this.styles[q.id] = {
          selected: true,
          dragStart: false,
          dragOver: false
        }
      }
    } else {
      this.selectedQuestion = [];
    }

  }

  updateOverview(question, $event) {
    const qq = question[0];
    let updateQuestion;
    if (qq) {
      updateQuestion = this.questions.find(q => q.id === qq.id);
    }
    if (updateQuestion) {
      updateQuestion.key = $event;
    }
  }

  dragStart(question, $event) {
    if (this.styles[question.id]) {
      this.styles[question.id] = (<any>Object).assign({}, this.styles[question.id], { dragStart: true})
    } else {
      this.styles[question.id] = (<any>Object).assign({}, {
        selected: false,
        dragStart: true,
        dragOver: false
      })
    }
    
    // hack to make elements draggable in firefox
    // http://mereskin.github.io/dnd/
    $event.dataTransfer.setData('text', 'foo');
  }

  dragEnter(question, $event) {
    if($event.preventDefault) {
      $event.preventDefault();
    }
    if (this.styles[question.id]) {
      this.styles[question.id] = (<any>Object).assign({}, this.styles[question.id], { dragOver: true})
    } else {
      this.styles[question.id] = (<any>Object).assign({}, {
        selected: false,
        dragStart: false,
        dragOver: true
      })
    }
  }

  dragOver(question, $event){
    if ($event.preventDefault) {
      $event.preventDefault();
    }
    if (this.styles[question.id]) {
      this.styles[question.id] = (<any>Object).assign({}, this.styles[question.id], { dragOver: true})
    } else {
      this.styles[question.id] = (<any>Object).assign({}, {
        selected: false,
        dragStart: false,
        dragOver: true
      })
    }
    return false;
  }

  dragLeave(question) {
    if (this.styles[question.id]) {
      this.styles[question.id] = (<any>Object).assign({}, this.styles[question.id], { dragOver: false})
    } else {
      this.styles[question.id] = (<any>Object).assign({}, {
        selected: false,
        dragStart: false,
        dragOver: false
      })
    }
  }

  drop(question, $event) {
    if($event.preventDefault){
      $event.preventDefault();
    }

    if($event.stopPropagation) {
      $event.stopPropagation();
    }

    for(const key in this.styles){
      this.styles[key].dragStart = false;
      this.styles[key].dragOver = false;
    }

    const targetKey = $event.target.innerText;
    const draggingKey = Object.keys(this.styles).filter(key => this.styles[key].dragStart === true)
    if (draggingKey.length !== 1) {
      console.error(`Strange behaviour with conditional drag and drop index swap: dragging.length = ${draggingKey.length}`);
      return false;
    }

    

    const q = this.questions.find(qq => qq.id === draggingKey[0]);
    if (q) {
      this.swapConditionals.emit({
        sourceQuestion: q,
        targetKeyName: targetKey
      })
    }
    
    
    return false;
  }

  dragEnd() {
    for(const key in this.styles) {
      this.styles[key].dragOver = false;
      this.styles[key].dragStart = false;
    }
  }
}
