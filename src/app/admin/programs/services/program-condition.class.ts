import { ProgramCondition, ProgramQuery } from '../../models'
import { FormGroup, FormBuilder, AbstractControl, Validators, FormControl, FormArray } from '@angular/forms';
import { UserProgram } from './user-program.class';

export class ProgramConditionClass {
  data: ProgramCondition;
  form: FormGroup;

  constructor(fb: FormBuilder, opts?){

    this.data = opts ? opts : {
      key: {
        name: 'invalid',
        type: 'invalid'
      },
      value: '',
      type: 'invalid',
      qualifier: ''
    };
    this._initForm(fb);

  }

  private _initForm(fb: FormBuilder) {
    this.form = fb.group({
      key: fb.group({
        name: new FormControl(this.data.key.name, Validators.required),
        type: new FormControl(this.data.key.type, Validators.required)
      }),
      value: new FormControl(this.data.value, Validators.required),
      type: new FormControl(this.data.type),
      qualifier: new FormControl(this.data.qualifier)
    })
  }

  validator(programGroup: AbstractControl): {[key: string]: any} {
    return null;
  }

  hashedValue(): string {
    return JSON.stringify(this.data);
  }
}
