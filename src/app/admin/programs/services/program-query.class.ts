import { ProgramCondition, ProgramQuery } from '../../models'
import { FormGroup, FormBuilder, AbstractControl, Validators, FormControl, FormArray } from '@angular/forms';
import { UserProgram } from './user-program.class';
import { ProgramConditionClass } from './program-condition.class';

export class ProgramQueryClass {
  data: ProgramQuery;
  conditions: ProgramConditionClass[];
  form: FormGroup;
  fb: FormBuilder;

  constructor(opts, fb: FormBuilder){
    this.fb = fb;
    this.data = opts ? opts : {
      guid: 'new',
      id: 'new',
      conditions: []
    };

    this.conditions = this.data.conditions.map(c => new ProgramConditionClass(fb, c));
    this._initForm(fb);

  }

  private _initForm(fb: FormBuilder) {
    this.form = fb.group({
      guid: new FormControl(this.data.guid, Validators.required),
      id: new FormControl(this.data.id, Validators.required),
      conditions: new FormArray(this.conditions.map(c => c.form))
    })
  }

  addCondition() {
    const condition = new ProgramConditionClass(this.fb);
    (<FormArray>this.form.get('conditions')).insert(0, condition.form);
    this.conditions = [condition, ...this.conditions]; 
  }


  commit() {
    this.data = this.form.value;
  }


  validator(programGroup: AbstractControl): {[key: string]: any} {
    return null;
  }
}
