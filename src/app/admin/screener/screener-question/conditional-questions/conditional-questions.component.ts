import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ScreenerController } from '../../services/screener-controller';
import { Id, Question } from '../../services';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/observable/combineLatest';

@Component({
  selector: 'app-conditional-questions',
  templateUrl: './conditional-questions.component.html',
  styleUrls: ['./conditional-questions.component.css']
})
export class ConditionalQuestionsComponent implements OnInit, OnDestroy {
  @Input() questionIDs: Observable<Id[]>;
  @Input() selectedQuestion: BehaviorSubject<Id>;
  @Output() handleSelect = new EventEmitter<Id>();

  @Output() addQuestion = new EventEmitter<any>();
  @Output() removeConditional = new EventEmitter<Id>();
  @Output() swapConditionals = new EventEmitter<any>();
  private subscriptions: Subscription[] = [];
  //@Input() form: FormGroup;
  //private questionControl: FormGroup;
  private styles = {};
  private questions: Observable<Question[]>;
  private timeout;
  constructor(public controller: ScreenerController) { }

  ngOnInit() {

    const buildStyle = (id, isSelected) => {
      const style = {};
      style[id] = {
        selected: isSelected,
        dragStart: false,
        dragOver: false,
        error: false
      };
      this.styles = (<any>Object.assign({}, this.styles, style))
    }

    const selectedSub = this.selectedQuestion.subscribe( id => {
      for(const styleID in this.styles) {
        if (this.styles[styleID].selected !== undefined) {
          this.styles[styleID].selected = false;
        } else {
          buildStyle(styleID, false);
        }
      }

      if (this.styles[id] === undefined || this.styles[id].selected === undefined) {
        buildStyle(id, true);
      } 
      else if (this.styles[id].selected !== undefined) {
        this.styles[id].selected = true;
      }
    })

    this.questions = this.questionIDs
      .map(ids => ids.reduce( (accum, id) => [this.controller.findQuestionById(id), ...accum], []) )
      .multicast( new BehaviorSubject( [] ) ).refCount();

    const errors = Observable.combineLatest(
        this.controller.state$.map(state => state.errors),
        this.questions
    )
      .subscribe( ([errors , questions ]) => {

        // add style for question not in styles
        for (const q of questions ) {
          if (this.styles[q.id] === undefined) buildStyle(q.id, false);
        }

        for(const id in this.styles) {

          // set errors
          if (!errors.has(id) ) {
            this.styles[id] = (<any>Object).assign({}, this.styles[id], { error: false })
          } else {
            this.styles[id] = (<any>Object).assign({}, this.styles[id], { error: true })
          }

          // delete styles for deleted questions
          if (!errors.has(id) && questions.find(q => q.id === id) === undefined) {
            delete this.styles[id];
          }

        }

      })

    this.subscriptions = [ selectedSub, errors ]
  }



  ngOnDestroy(){
    if (this.timeout){
      clearTimeout(this.timeout);
    }

    for(const sub of this.subscriptions){
      if (!sub.closed) {
        sub.unsubscribe();
      }
    }
  }

  handleAddQuestion() {  
    this.addQuestion.emit();
    const update = () => this.questionIDs.take(1).subscribe(ids => {
       if (ids.length > 0) {
         this.selectQuestion( this.controller.findQuestionById(ids[ids.length - 1]) );
       } 
    }) 
    setTimeout(update, 60);
  }

  selectQuestion(question: Question) {  this.handleSelect.emit(question.id) }

  deleteConditionalQuestion() {
    this.selectedQuestion.take(1).subscribe( (questionID: Id) => {
      this.removeConditional.emit(questionID);
    })
    

    const selected = Object.keys(this.styles).filter(key => this.styles[key].selected = true)
    for(const key of selected) {
      this.styles[key].selected = false;
    }
    const update = () => this.questionIDs.take(1).subscribe(ids => {
       if (ids.length > 0) {
         this.selectQuestion( this.controller.findQuestionById(ids[ids.length - 1]) );
       } 
    }) 
    setTimeout(update, 60);
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
    this.swapConditionals.emit({ sourceID: draggingID, targetKeyName: targetKey });
 
    return false;
  }

  dragEnd() {
    for(const key in this.styles) {
      this.styles[key].dragOver = false;
      this.styles[key].dragStart = false;
    }
  }
}
