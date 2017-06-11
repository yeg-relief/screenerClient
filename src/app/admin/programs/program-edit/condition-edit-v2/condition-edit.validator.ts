import { ValidatorFn, AbstractControl } from '@angular/forms';
import { ProgramCondition, Key } from '../../../models';

export function conditionValidator(control: AbstractControl): {[key: string]: any} {
   

  const key: Key = control.get('key').value;
  const value: boolean | string  = control.get('value').value;
  const type: string = control.get('type').value;
  let qualifier: string = '';
  if (control.get('qualifer') !== null)
    qualifier = control.get('qualifier').value;

  let errors = {};

  const isNumber = (key.type === 'number' || key.type === 'integer');
  const isBoolean = key.type === 'boolean';

  if (!key.name)
    errors['invalidKeyName'] = 'The key name is invalid.';

  if (!key.type || !(isNumber || isBoolean))
    errors['invalidKeyType'] = 'The key type is invalid';

  if (isBoolean && typeof value !== 'boolean') {
    errors['invalidBooleanKey'] = 'The key type is boolean, but the value type is not.'
  }
    
  if (isNumber) {
    if (control.get('qualifier') !== null && control.get('qualifier').value === ''){
      errors['invalidQualifier'] = '(b) The qualifier is invalid.';
      control.get('qualifier').setErrors({err: 'The qualifier is invalid.'})
    }
      
  }

  if (isBoolean && qualifier !== '' ) {
    errors['invalidQualifier'] = '(a) The qualifier is invalid.';
  }

  if (Object.keys(errors).length === 0) return null;

  return errors;
}