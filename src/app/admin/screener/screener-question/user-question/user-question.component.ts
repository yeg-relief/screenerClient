import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ScreenerModel } from '../../screener-model';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
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
export class UserQuestionComponent  {
  @Input() question: any;
  @Output() saveControl = new EventEmitter<FormGroup>();
  private form: any;
  private unusedKeys: string[];
  private internalErrors: string;

  private optionValue;

  constructor(public model: ScreenerModel) { }


  
  ngOnInit() {
    this.form = this.model.getControls(this.question.id);

    this.model.unusedKeys$.asObservable()
      .subscribe( (keys: any) => this.unusedKeys = [...keys])

    this.form.valueChanges.switchMap( update => this.model.keys$.map(keys => [update, keys]))
    .debounceTime(100)
    .subscribe( ([update, keys]) => {

      if (update.key !== this.question.key) {
        this.model.handleKeyChange(update.key, this.question.key);
        this.checkKeyError(update, this.question);
      }

      if (update.controlType !== this.question.controlType) {
        this.checkControlError(update, this.question);
      }
      if (!this.form.hasErrors) {
        // bind our view to the changes in the form
        this.question = (<any>Object).assign({}, update);
      }
      
    })

  }

  checkKeyError(update, question){
    this.model.keys$.take(1).subscribe( (keys: any) => {

      const [updateKey] = keys.filter(key => key.name === update.key)
      const [quetionKey] = keys.filter(key => key.name === question.key)


      switch (updateKey.type) {
        case 'boolean': {
          if(update.controlType !== 'CheckBox'){
            this.form.setErrors({error: 'boolean key is not CheckBox aaa'})
            break;
          }
        }

        case 'integer': {
          if(update.controlType !== 'NumberSelect' || update.controlType !== 'NumberInput'){
            this.form.setErrors({error: 'number key is CheckBox aaa'})
            break
          }
        }

        default: {
          console.log('no error type a')
        }
      }
      
    });
  }

  checkControlError(update, question) {
    this.model.keys$.take(1).subscribe( (keys: any) => {

      const [updateKey] = keys.filter(key => key.name === update.key)

      switch (update.controlType) {
        case 'CheckBox': {
          if(updateKey.type !== 'boolean'){
            this.form.setErrors({error: 'CheckBox is integer bbb'})
            break;
          }
        }

        case 'NumberSelect' || 'NumberInput': {
          if(updateKey.type !== 'integer'){
            this.form.setErrors({error: 'boolean key is NumberSelect or NumberInput bbb'})
            break
          }
        }

        default: {
          console.log('no error type a')
        }
      }
      
    });
  }

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


