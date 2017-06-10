import { Injectable } from '@angular/core';
import { ProgramQuery, ApplicationFacingProgram, ProgramCondition } from '../../../models/program';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { conditionValidator } from '../../program-edit/condition-edit-v2/condition-edit.validator';
@Injectable()
export class ConditionEditService {
  private _formArray: FormArray;
  constructor(private fb: FormBuilder) { }

  condtionsToControls(conditions: ProgramCondition[]): FormArray {
    // assign different validators based upon boolean or interger key type
    const valueControl = condition => {
      return condition.key.type === 'boolean' ? new FormControl(condition.value, Validators.required) :
        condition.key.type === 'number' || condition.key.type === 'integer' ?
          new FormControl(condition.value, [Validators.required, Validators.pattern('^\\d+$')]) :
          null;
    }

    const controls = conditions.map(
      cond => {

        return this.fb.group({
          key: this.newKeyControl(cond.key),
          value: valueControl(cond),
          qualifier: new FormControl(cond.qualifier),
          type: ''
        }, { validator: conditionValidator })

      })
    this._formArray = new FormArray(controls);

    return this._formArray;
  }

  updateConditionShape(key, conditionFormGroup) {
    const localFormIndex = this._formArray.controls.findIndex(c => c === conditionFormGroup);

    if (localFormIndex < 0) return;

    const update = key.type === 'boolean' ? this.blankBooleanShape(key) : this.blankNumberShape(key);

    this._formArray.controls.splice(localFormIndex, 1, update);
  }

  private blankBooleanShape(key): FormGroup {
    return this.fb.group({
      key: this.newKeyControl(key),
      value: new FormControl(true, Validators.required),
      qualifier: new FormControl()
    });
  }

  private blankNumberShape(key): FormGroup {
    return this.fb.group({
      key: this.newKeyControl(key),
      value: new FormControl(0, Validators.required),
      qualifier: new FormControl('equal')
    }); 
  }

  private newKeyControl(key) {
    return this.fb.group({
        name: new FormControl(key.name),
        type: new FormControl(key.type)
      }, {validator: Validators.required})
  }

}
