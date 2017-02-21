import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ScreenerModel } from '../../screener-model';
import 'rxjs/add/operator/take';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-overview-controls',
  templateUrl: './overview-controls.component.html',
  styleUrls: ['./overview-controls.component.css']
})
export class OverviewControlsComponent implements OnInit, OnDestroy {
  @Input() questions: any[];
  @Input() selectedQuestion: ReplaySubject<any>;
  @Output() questionSelected = new EventEmitter<any>();
  @Output() swapQuestions = new EventEmitter<any>();
  private styles = {};
  private subscriptions: Subscription[];

  constructor(public model: ScreenerModel) { }

  ngOnInit() {
    if (this.questions && this.questions.length > 0) {
      this.styles = this.questions.reduce((styles, question) => {
        const style = {};
        style[question.id] = {
          selected: false
        };

        return (<any>Object).assign(styles, style);
      }, {});
    }

    const error = this.model.errors$.subscribe( (errors: string[]) => {
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

    const questionSelect = this.selectedQuestion.subscribe(question => this.selectQuestion(question));

    this.subscriptions = [ error, questionSelect ];
  }

  ngOnDestroy(){
    for(const sub of this.subscriptions) {
      if (!sub.closed) {
        sub.unsubscribe();
      }
    }
  }

  addQuestion() {
    this.model.addQuestion();
    this.model.questions$.map( (questions: any[]) => questions[questions.length - 1])
      .take(1)
      .subscribe(question => {
        if (question) {
          for (const key in this.styles) {
            this.styles[key].selected = false;
          }
          if (this.styles[question.id]) {
            this.styles[question.id].selected = true;
          } else {
            this.styles[question.id] = {};
            this.styles[question.id].selected = true;
          }
          this.questionSelected.emit(question);
        }
      });
  }

  selectQuestion(question) {

    if (question === this.selectQuestion) {
      return;
    }

    this.selectedQuestion = question;

    for (const key in this.styles) {
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
      this.styles[question.id] = (<any>Object).assign({}, this.styles[question.id], { dragStart: true })
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
    if ($event.preventDefault) {
      $event.preventDefault();
    }
    if (this.styles[question.id]) {
      this.styles[question.id] = (<any>Object).assign({}, this.styles[question.id], { dragOver: true })
    } else {
      this.styles[question.id] = (<any>Object).assign({}, {
        selected: false,
        dragStart: false,
        dragOver: true
      })
    }
  }

  dragOver(question, $event) {
    if ($event.preventDefault) {
      $event.preventDefault();
    }
    if (this.styles[question.id]) {
      this.styles[question.id] = (<any>Object).assign({}, this.styles[question.id], { dragOver: true })
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
      this.styles[question.id] = (<any>Object).assign({}, this.styles[question.id], { dragOver: false })
    } else {
      this.styles[question.id] = (<any>Object).assign({}, {
        selected: false,
        dragStart: false,
        dragOver: false
      })
    }
  }

  drop(question, $event) {
    if ($event.preventDefault) {
      $event.preventDefault();
    }

    if ($event.stopPropagation) {
      $event.stopPropagation();
    }

    

    let targetKey = $event.target.innerText;
    var stringArray = targetKey.split(/(\s+)/);
    if (stringArray[0] === '[+]'){
      stringArray = $event.target.parentNode.innerText.split(/(\s+)/);
      targetKey = stringArray[0];
    } else {
      targetKey = stringArray[0];
    }
    const draggingKey = Object.keys(this.styles).filter(key => this.styles[key].dragStart === true)
    if (draggingKey.length !== 1) {
      console.error(`Strange behaviour with conditional drag and drop index swap: dragging.length = ${draggingKey.length}`);
      return false;
    }

    for (const key in this.styles) {
      this.styles[key].dragStart = false;
      this.styles[key].dragOver = false;
    }

    if (!this.model.hasKey(targetKey)){
      return false;
    }

    const q = this.questions.find(qq => qq.id === draggingKey[0]);
    if (q) {
      this.swapQuestions.emit({
        sourceQuestion: q,
        targetKeyName: targetKey
      })
    }

    


    return false;
  }

  dragEnd() {
    for (const key in this.styles) {
      this.styles[key].dragOver = false;
      this.styles[key].dragStart = false;
    }
  }

}
