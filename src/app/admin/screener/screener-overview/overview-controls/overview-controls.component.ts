import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'app-overview-controls',
  templateUrl: './overview-controls.component.html',
  styleUrls: ['./overview-controls.component.css']
})
export class OverviewControlsComponent implements OnInit {
  @Input() questions: any[];
  @Input() selectedQuestion: ReplaySubject<any>;
  @Output() questionSelected = new EventEmitter<any>();
  @Output() swapQuestions = new EventEmitter<any>();
  private styles = {};

  constructor() { }

  ngOnInit() {
    if (this.questions && this.questions.length > 0) {
      this.styles = this.questions.reduce( (styles, question) => {
        const style = {};
        style[question.id] = {
          selected: false
        };
        
        return (<any>Object).assign(styles, style);
      }, {});
    }

    this.selectedQuestion.subscribe(question => this.selectQuestion(question));
  }

  selectQuestion(question) {
    if (question === this.selectQuestion) {
      return;
    }

    this.selectedQuestion = question;
    for(const key in this.styles) {
      this.styles[key].selected = false;
    }
    if (this.styles[question.id]) {
      this.styles[question.id].selected = true;
    } else {
      this.styles[question.id] = {};
      this.styles[question.id].selected = true;
    }
    
    this.questionSelected.emit(this.selectedQuestion);
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
      this.swapQuestions.emit({
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
