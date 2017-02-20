import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-conditional-questions',
  templateUrl: './conditional-questions.component.html',
  styleUrls: ['./conditional-questions.component.css']
})
export class ConditionalQuestionsComponent implements OnInit {
  @Input() questions: any[];
  @Output() removeConditional = new EventEmitter<any>();
  @Output() swapConditionals = new EventEmitter<any>();
  //@Input() form: FormGroup;
  //private questionControl: FormGroup;
  private selectedQuestion: any[] = [];
  private styles = {};
  constructor() { }

  ngOnInit() {
    for(const question of this.questions) {
      this.styles[question.id] = {
        selected: false,
        dragStart: false,
        dragOver: false
      }
    }
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
    this.questions = this.questions.filter(question => question.id !== selectedQuestion.id);
    this.removeConditional.emit(selectedQuestion[0]);
    this.selectedQuestion = [];
    const selected = Object.keys(this.styles).filter(key => this.styles[key].selected = true)
    for(const key of selected) {
      this.styles[key].selected = false;
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
    
    const targetKey = $event.target.innerText;
    const draggingKey = Object.keys(this.styles).filter(key => this.styles[key].dragStart === true)
    if (draggingKey.length !== 1) {
      console.error(`Strange behaviour with conditional drag and drop index swap: dragging.length = ${draggingKey.length}`);
    }

    const q = this.questions.find(qq => qq.id === draggingKey[0]);
    if (q) {
      this.swapConditionals.emit({
        sourceQuestion: q,
        targetKeyName: targetKey
      })
    }
    
    if($event.preventDefault){
      $event.preventDefault();
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
