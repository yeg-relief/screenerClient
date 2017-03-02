import { ValidatorFn, AbstractControl } from '@angular/forms';
import { Question } from '../../models';

export function questionValidator(control: AbstractControl): {[key: string]: any} {
    if(control.get('label').value.length === 0) return {emptyLabel: true }

    return null;
}