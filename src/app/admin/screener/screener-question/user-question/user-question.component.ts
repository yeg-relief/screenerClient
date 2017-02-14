import { 
  Component, OnInit, Input, ViewEncapsulation, 
  Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ScreenerModel } from '../../screener-model';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-user-question',
  templateUrl: './user-question.component.html',
  styleUrls: ['./user-question.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UserQuestionComponent implements OnInit, OnDestroy {
  @Input() question: any;
  @Output() makeExpandable = new EventEmitter<boolean>();
  private form: any;
  private unusedKeys: string[];
  private internalErrors: string;

  private errorFilter = false;
  private keyFilter = false;
  private filterQuestion = false;

  private optionValue;
  private subscriptions: Subscription[];


  constructor(public model: ScreenerModel) { }


  
  ngOnInit() {
    this.form = this.model.getControls(this.question.id);

    const updateUnusedKeys = this.model.unusedKeys$.asObservable()
      .subscribe( (keys: any) => this.unusedKeys = [...keys])

    const localUpdates = this.form.valueChanges.switchMap( update => this.model.keys$.map(keys => [update, keys]))
    .debounceTime(100)
    .subscribe( ([update, keys]) => {
      const f = <FormGroup>this.form;
      f.parent.setErrors( {} )

      if(update.key === '' || update.key === undefined){
        this.form.setErrors({error: 'no key selected'});
      } else if (update.key !== this.question.key) {
        this.model.handleKeyChange(update.key, this.question.key);
      } else if (this.question.controlType === 'NumberSelect' && update.controlType !== 'NumberSelect') {
        this.form.removeControl('options')
      } else if (this.question.controlType === 'CheckBox' && update.controlType !== 'CheckBox' && update.conditionalQuestions.length > 0) {
        // add some user confirmation dialog here
        //this.model.clearCondtionals(this.question);
        this.question.conditionalQuestions = [];
      } else if (this.question.expandable && !update.expandable  && update.conditionalQuestions.length > 0) {
        //this.model.clearCondtionals(this.question);
        this.question.conditionalQuestions = [];
      }
        
      this.question = (<any>Object).assign( {}, update );
      
    })

    const errorFilter = this.model.filter$
      .subscribe( (filter) => {
        const errorIndex = this.form.parent.errors
        if (errorIndex !== null && filter) {
          if (this.question.index === errorIndex.error) {
            this.errorFilter = false;
          } else {
            this.errorFilter = true;
          }
        } else if ( !filter ) {
          this.errorFilter = false;
        }
        this.filterQuestion = this.errorFilter;
      })

    const keyFilter = this.model.keyFilter$
      .subscribe( keyName => {
        const regexp = new RegExp(keyName);
        if (!this.errorFilter){
          this.filterQuestion = regexp.test(this.question.key) ? false : true;
        }
      })

    const expandChange = this.form.get('expandable').valueChanges
      .do(value => this.makeExpandable.emit(value)  )
      .subscribe();

    this.subscriptions = [updateUnusedKeys, localUpdates, errorFilter, keyFilter, expandChange];
  }

  ngOnDestroy() {
    for(const sub of this.subscriptions) {
      if (!sub.closed) {
        sub.unsubscribe();
      }
    }
  }


  // these next functions handle NumberOption type question  
  handleInput($event) {
    const scan = Number.parseInt($event.target.value, 10);
    if (!Number.isNaN(scan)) {
      this.optionValue = scan;
    }
  }

  handleOptionAdd() {
    if ( this.optionValue === '') {
      return;
    }

    if (Array.isArray(this.question.options)) {
      this.question.options.push(this.optionValue);
    } else {
      this.question.options = new Array<any>();

      const options = new FormControl( this.question.options || [] );
      this.form.addControl('options', options)
      
      this.question.options.push(this.optionValue);
    }
    this.optionValue = '';
  }

  removeOption(index) {
    if (Array.isArray(this.question.options)) {
      this.question.options.splice(index, 1);
    }
  }
}


