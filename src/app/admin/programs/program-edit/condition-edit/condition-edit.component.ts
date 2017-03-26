import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Key } from '../../../models/key';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import { ProgramCondition } from '../../../models/program';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';


@Component({
  selector: 'app-condition-edit',
  templateUrl: './condition-edit.component.html',
  styleUrls: ['./condition-edit.component.css']
})
export class ConditionEditComponent implements OnInit, OnDestroy {
  @Input() condition: EventEmitter<ProgramCondition>;
  @Output() save = new EventEmitter<ProgramCondition>();
  form: FormGroup;
  keys$: Observable<Key[]>;

  private destroy$ = new EventEmitter();
  readonly integerQualifierOptions = [
    {
      display: '>', value: 'greaterThan'
    },
    {
      display: '>=', value: 'greaterThanOrEqual'
    },
    {
      display: '=', value: 'equal'
    },
    {
      display: '<=', value: 'lessThanOrEqual'
    },
    {
      display: '<', value: 'lessThan'
    }
  ];

  readonly booleanValueOptions = [
    {
      display: 'true', value: true
    },
    {
      display: 'false', value: false
    }
  ];

  constructor(private fb: FormBuilder, private store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.form = this.fb.group({
      key: this.fb.group({
        name: new FormControl('select a key', Validators.required),
        type: new FormControl('', [Validators.required, Validators.minLength(7)])
      }),
      value: new FormControl('', Validators.required),
      qualifier: new FormControl('', Validators.required)
    });

    this.keys$ = this.store.let(fromRoot.allLoadedKeys);

    this.form.get(['key', 'name'])
        .valueChanges
        .filter( name => name !== 'select a key')
        .withLatestFrom(this.keys$)
        .takeUntil(this.destroy$)
        .subscribe( ([keyName, keys]) => {

          const key = keys.find(k => k.name === keyName);

          this.form.get(['key', 'type']).setValue(key.type);

          if (key.type === 'boolean') {

            if (typeof this.form.get('value').value !== 'boolean'){
              this.form.get('value').setValidators(Validators.required); 
              this.form.get('value').setValue(this.booleanValueOptions[0].value);
            }
            
            if (this.form.contains('qualifier'))
              this.form.removeControl('qualifier');  
          
        } else if(key.type === 'integer') {
            if (!this.form.contains('qualifier')){
              this.form.addControl('qualifier', new FormControl('', Validators.required));
              this.form.get('qualifier').setValue(this.integerQualifierOptions[0].value);
            }

            this.form.get('value').setValidators([Validators.required, Validators.pattern('^\\d+$')]);

            if (typeof this.form.get('value').value === 'boolean')
              this.form.get('value').setValue('');     
          } else {
            console.error(`strange behavior detected in condition-edit\nkey type: ${key.type}`);
          } 
        });

    //this is passed from query-edit... it may be bad form, 
    // and is probably a code smell that I should refactor to a service....
    this.condition
        .takeUntil(this.destroy$)
        .subscribe( condition => {
          if (condition.key.type === 'boolean') {
            if (this.form.contains('qualifier')) this.form.removeControl('qualifier');

            this.form.get('value').setValue(condition.value);
            this.form.get('key').setValue(condition.key);
                  
        } else if (condition.key.type === 'integer' ) {
            
            if (!this.form.contains('qualifier'))
              this.form.addControl('qualifier', new FormControl(condition.qualifier, Validators.required));
            else
              this.form.get('qualifier').setValue(condition.qualifier);

            this.form.get('value').setValue(condition.value);
            this.form.get('key').setValue(condition.key);  
            
          }
        })
  }

  ngOnDestroy() {
    this.destroy$.emit();
  }

  handleSave() {
    if (this.form.valid){
      const val = this.form.value;
      if(val.key.type === 'integer' && typeof val.value === 'string')
        val.value = Number.parseInt(val.value, 10);
      else if(val.key.type === 'boolean' && typeof val.value === 'string')
        val.value = val.value === 'true' ? true : false;
      

      this.save.emit(val);

      if (!this.form.contains('qualifier'))
        this.form.addControl('qualifier', new FormControl('', Validators.required));

      this.form.setValue({
        key: {
          name: 'select a key',
          type: ''
        },
        value: '',
        qualifier: ''
      });
    }
  }
}
