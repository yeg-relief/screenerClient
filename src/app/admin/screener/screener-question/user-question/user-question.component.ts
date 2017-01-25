import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
  private adminForm: FormGroup;
  private form: FormGroup;
  private option = '';
  private unusedKeys$;
  errorFilter = false;
  keyFilter = true;
  @Input() meta;
  constructor(public model: ScreenerModel) { }


  // these are not unsubscribed...
  ngOnInit() {

    this.model.publicform$
      .map(form => {
          const controls = form.controls;
          const values = form.value;
          console.log('+++++++++++++++++++++++++')
          console.log(form);
          console.log(form.value)
          // our group is obfuscated by a random number to avoid key collisions
          let key = Object.keys(controls).filter(hashedKey => controls[hashedKey].value.key === this.question.key)
          if (key.length === 0 ) {
            key = Object.keys(controls).filter(hashedKey => controls[hashedKey].value.key === '')
          }

          return [form, key]
        })
        .subscribe( ([form, key]) => {
          console.log(form)
          console.log('---------------------')
          // we bind our inputs etc to this FormGroup
          this.adminForm = (<any>form).get(key);
        })
    /*
    const getForm = this.model.state$
        .map(state => {
          const form: FormGroup = state.form;
          const values = form.value;
          // our group is obfuscated by a random number to avoid key collisions
          const  key = Object.keys(values).filter(questionKey => values[questionKey].key === this.question.key)
          console.log(key)
          return [form, key]
        })
        .take(1)
        .subscribe( ([form, key]) => {
          console.log(form)
          console.log(key)
          // we bind our inputs etc to this FormGroup
          this.adminForm = (<any>form).get(key);
        })
      */

    //keyUpdates and updates can be refactored by extracting commonalities
    const updates = 
      this.model.state$
      .switchMap(state => this.adminForm.valueChanges.map(update => [state, update]))
      .filter( ([state, update]) => update.key === this.question.key)
      .subscribe( ([state, update]) => {
 
        this.question = Object.assign({}, update);
        const newKey = state.keys.find(k => k.name === this.question.key);

        if (newKey === undefined){
          this.adminForm.setErrors({
            key: 'key is undefined'
          })
        } else if (this.question.controlType === 'CheckBox' && newKey.type !== 'boolean') {
          this.adminForm.setErrors({
            controlType: `controlType: ${this.question.controlType} can not have a key of type: ${newKey.type}`
          });
        }else if (this.question.controlType !== 'CheckBox' && newKey.type === 'boolean') {
          this.adminForm.setErrors({
            controlType: `controlType: ${this.question.controlType} can not have a key of type: ${newKey.type}`
          });
        }else if (this.question.label.length < 5) {
          this.adminForm.setErrors({
            keylength: 'invalid key length'
          })
        }
      })

    // if it is a key change then we need to alter the unusedKey pool
    const keyUpdates = this.model.state$
      .switchMap(state => this.adminForm.valueChanges.map(update => [state, update]))
      .filter( ([state, update]) => update.key !== this.question.key)
      .subscribe( ([state, update]) => {
        this.model.updateUnusedKeys(this.question.key, update.key);
        this.question = update; 

        const newKey = state.keys.find(k => k.name === this.question.key);

        if (newKey === undefined){
          this.adminForm.setErrors({
            key: 'key is undefined'
          })
        }else if (this.question.controlType === 'CheckBox' && newKey.type !== 'boolean') {
          this.adminForm.setErrors({
            controlType: ` ${this.question.controlType} can not have a key of type: ${newKey.type}`
          });
        }else if (this.question.controlType !== 'CheckBox' && newKey.type === 'boolean') {
          this.adminForm.setErrors({
            controlType: `${this.question.controlType} can not have a key of type: ${newKey.type}`
          });
        } else if (this.question.label.length < 5) {
          this.adminForm.setErrors({
            keylength: `invalid key length: ${this.question.label.length}`
          })
      
        }
      })

    // updates about key pool => which keys are available
    this.unusedKeys$ = this.model.unusedKeys$.asObservable();
    // this is for admin controls
    this.model.filterErrors$.subscribe(errorFilter => this.errorFilter = errorFilter)
    this.model.filterKey$
      .debounceTime(200)
      .subscribe(keyFilter => this.keyFilter = new RegExp(keyFilter).test(this.question.key));
  }




  /* used for adding options */
  handleInput($e) {
    this.option = $e.target.value;
  }

  handleOptionAdd(){
    const q = (<any>this.question);
    if (q.options === undefined) {
      return;
    }
    const num = Number.parseInt(this.option, 10);
    if (!Number.isNaN(num)) {
      q.options.push(num)
    }
    this.option = '';
  }

  removeOption(index) {
    this.question.options.splice(index, 1)
  }

  /* done using options */
}



export type Question = ( NumberInput | Checkbox | NumberRadio | ExpandableQuestion );
export type ConditionalQuestion = ( NumberInput | NumberRadio );

export type NumberOption = {
  value: number;
  display: string;
}

export type NumberInput = {
  label: string;
  key: string;
  controlType: 'input';
  value: number;
}

export type Checkbox = {
  label: string;
  key: string;
  controlType: 'checkbox';
}

export type NumberRadio = {
  label: string;
  key: string;
  controlType: 'radio';
  options: NumberOption[];
}

export type ExpandableQuestion = {
  expandable: boolean;
  label: string;
  key: string;
  controlType: 'checkbox';
  conditonalQuestions: ConditionalQuestion[];
}