import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
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
  private form: FormGroup;
  private unusedKeys: string[];
  constructor(public model: ScreenerModel) { }


  
  ngOnInit() {

    const controls = Object.keys(this.question).reduce( (accum, key) => {
      accum[key] = new FormControl(this.question[key], Validators.required);
      return accum;
    }, {})
    this.form = new FormGroup(controls);

    this.model.unusedKeys$.asObservable()
      .subscribe( (keys: any) => this.unusedKeys = [...keys])

    this.form.valueChanges.switchMap( update => this.model.keys$.map(keys => [update, keys]))
    .subscribe( ([update, keys]) => {

      if (update.key !== this.question.key) {
        this.model.handleKeyChange(update.key, this.question.key);
      }
      console.log('update')
      console.log(update);
      console.log(this.question);
      console.log('---------------')
      this.question = (<any>Object).assign({}, update);
      //this.updateErrors(update, keys)
      //this.model.updateKeys(update, this.question.id); 
    })
  }
    

  private updateErrors(update, keys) {

    const updateKey = keys.find(k => k.name = update.key);

    if (update.controlType === 'CheckBox' && updateKey.type !== 'boolean'){
      this.form.setErrors({
        checkbox: 'a CheckBox requires a boolean key type'
      })
    } else if (update.controlType !== 'CheckBox' && updateKey.type === 'boolean') {
      this.form.setErrors({
        checkbox: 'a boolean key requires a CheckBox type'
      })
    }


  }  
}


