import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ScreenerController } from '../../services/screener-controller';
import { Id, Question } from '../../services';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-overview-controls',
  templateUrl: './overview-controls.component.html',
  styleUrls: ['./overview-controls.component.css']
})
export class OverviewControlsComponent implements OnInit, OnDestroy {
  @Input() question_IDs: Observable<string[]>;
  @Input() selectedQuestion_ID: BehaviorSubject<string>;
  @Output() questionSelected = new EventEmitter<Question>();
  @Output() swapQuestions = new EventEmitter<{ [key: string]: string }>();
  private questions: Observable<Question[]>;
  private styles = {};
  
  private subscriptions: Subscription[];

  constructor(public controller: ScreenerController) { }

  ngOnInit() {
    this.questions = this.question_IDs
                      .map(ids => ids.reduce( (accum, id) => [this.controller.findQuestionById(id), ...accum], []) )
                      .do(questions => {
                        let questionAlreadySelected = false;
                        for(const key in this.styles){
                          if(this.styles[key] !== undefined && this.styles[key].selected !== undefined){
                            questionAlreadySelected = this.styles[key].selected
                          }

                          if (questionAlreadySelected) break;
                        }


                        if(Array.isArray(questions) && questions.length > 0 && !questionAlreadySelected){
                          this.questionSelected.emit(questions[0].id)
                        } 
                      })
                      .multicast( new BehaviorSubject( [] ) ).refCount();

    const selectedQuestion = this.selectedQuestion_ID
      .subscribe( id => {
        for(const styleID in this.styles) {
          this.styles[styleID].selected = false;
        }

        if (this.styles[id] !== undefined && this.styles[id].selected !== undefined) {
          this.styles[id].selected = true;
        } else {
          const style = {}
          style[id] = { 
            selected: true,
            dragStart: false,
            dragOver: false,
            error: false
          }
          this.styles = (<any>Object).assign({}, this.styles, style)
        }

      })

    const updateStyles = this.questions.subscribe(questions => {
      if (Array.isArray(questions) && questions.length > 0) {
        this.styles = questions.filter(question => question.id !== undefined)
          .reduce( (styles, question) => {
            if (this.styles[question.id] === undefined) {
              const style = {};
              style[question.id] = { 
                selected: false,
                dragStart: false,
                dragOver: false,
                error: true
              }
              return (<any>Object).assign(styles, style);
            } else {
              styles[question.id] = (<any>Object).assign({}, this.styles[question.id]);
              return styles;
            }
            
          }, {})
      }
    })

    const errors = Observable.combineLatest(
        this.controller.state$.map(state => state.errors),
        this.questions
    )
      .subscribe( ([errors , questions ]) => {

        // add style for question not in styles
        for (const q of questions ) {
          if (this.styles[q.id] === undefined) {
            const style = {}
            style[q.id] = { 
              selected: false,
              dragStart: false,
              dragOver: false,
              error: true
            }
            this.styles = (<any>Object).assign({}, this.styles, style)
          }
        }

        for(const id in this.styles) {

          // set errors
          if (!errors.has(id) ) {
            this.styles[id].error = false;
          } else if (errors.get(id).length === 0){
            this.styles[id].error = false;
          } else if (errors.get(id).length > 0) {
            this.styles[id].error = true;
          }

          // delete styles for deleted questions
          if (!errors.has(id) && questions.find(q => q.id === id) === undefined) {
            delete this.styles[id];
          }

        }

      })

    this.subscriptions = [ errors, updateStyles, selectedQuestion ];
  }

  ngOnDestroy(){
    for(const sub of this.subscriptions) {
      if (!sub.closed) {
        sub.unsubscribe();
      }
    }
  }

  addQuestion() {
    this.controller.command$.next({
      fn: this.controller.commands.addConstantQuestion,
      args: []
    });
  }

  selectQuestion(question) {


    if (question !== undefined && question.id !== undefined) this.questionSelected.emit(question.id); 
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
    let stringArray = targetKey.split(/(\s+)/);
    if (stringArray[0] === '[+]'){
      stringArray = $event.target.parentNode.innerText.split(/(\s+)/);
      targetKey = stringArray[0];
    } else {
      targetKey = stringArray[0];
    }

    const draggingID = Object.keys(this.styles).filter(key => this.styles[key].dragStart === true)[0];
    if (draggingID === undefined) {
      console.error(`[OverviewControlsComponent].drop: Strange behaviour with conditional drag and drop index swap: ${draggingID}`);
      return false;
    }

    for (const key in this.styles) {
      this.styles[key].dragStart = false;
      this.styles[key].dragOver = false;
    }

    if (!this.controller.hasKey(targetKey) && targetKey.substr(0, 7) !== 'invalid'){
      return false;
    }

    this.swapQuestions.emit({ sourceID: draggingID, targetKeyName: targetKey });
    return false;
  }

  dragEnd() {
    for (const key in this.styles) {
      this.styles[key].dragOver = false;
      this.styles[key].dragStart = false;
    }
  }

}
