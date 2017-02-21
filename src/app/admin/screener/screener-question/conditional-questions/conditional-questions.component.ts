import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ScreenerModel } from '../../screener-model';
import { Subscription } from 'rxjs/Subscription';

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
  private subscription: Subscription;
  //@Input() form: FormGroup;
  //private questionControl: FormGroup;
  private styles = {};
  private timeout;
  constructor(public model: ScreenerModel) { }

  ngOnInit() {
    for(const question of this.questions) {
      this.styles[question.id] = {
        selected: false,
        dragStart: false,
        dragOver: false,
        error: false
      }
    }

    if (this.questions.length > 0) {
      this.selectedQuestion = [ this.questions[0] ];
      this.styles[ this.questions[0].id ].selected = true;
    }

    this.subscription = this.model.errors$.subscribe( (errors: string[]) => {
      if (errors.length > 0) {
        const errorQuestions = this.questions.filter(q => errors.find(id => q.id === id));

        // mark errors
        for(const errorQuestion of errorQuestions) {
          if(this.styles[errorQuestion.id]) {
            this.styles[errorQuestion.id].error = true;
          } else {
            this.styles[errorQuestion.id] = {
              selected: false,
              dragStart: false,
              dragOver: false,
              error: true
            }
          }
        }
        // unmark questions no longer in error
        for(const key in this.styles) {
          if (errorQuestions.find(q => q.id === key) === undefined && this.styles[key].error === true) {
            this.styles[key].error = false;
          }
        }

      } else {
        // no errors at all => unmark all
        for(const key in this.styles) {
          this.styles[key].error = false;
        }
      }
    })
  }

  ngOnDestroy(){
    if (this.timeout){
      clearTimeout(this.timeout);
    }

    if (!this.subscription.closed) {
      this.subscription.unsubscribe();
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
        dragOver: false,
        error: false
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
        dragOver: true,
        error: false
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
        dragOver: true,
        error: false
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
        dragOver: false,
        error: false
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

    const targetKey = $event.target.innerText;
    const draggingKey = Object.keys(this.styles).filter(key => this.styles[key].dragStart === true)
    console.log('here 1');
    if (draggingKey.length !== 1) {
      console.error(`Strange behaviour with conditional drag and drop index swap: dragging.length = ${draggingKey.length}`);
      return false;
    }

    

    const q = this.questions.find(qq => qq.id === draggingKey[0]);
    console.log(q);
    console.log(targetKey);
    console.log(draggingKey);
    if (q) {
      this.swapConditionals.emit({
        sourceQuestion: q,
        targetKeyName: targetKey
      })
    }
    
    for(const key in this.styles){
      this.styles[key].dragStart = false;
      this.styles[key].dragOver = false;
    }
    console.log('here 2');
    
    return false;
  }

  dragEnd() {
    for(const key in this.styles) {
      this.styles[key].dragOver = false;
      this.styles[key].dragStart = false;
    }
  }
}
