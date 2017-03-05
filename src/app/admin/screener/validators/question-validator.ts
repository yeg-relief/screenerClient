import { ValidatorFn, AbstractControl } from '@angular/forms';
import { Question, ControlType } from '../../models';
import { Key } from '../../models';

export function questionValidator(control: AbstractControl): {[key: string]: any} {
   

    const label: string = control.get('label').value; 
    const controlType: ControlType = control.get('controlType').value;
     
    let key: Key = { name: 'invalid.sdkjflsajfkljsalfkjsdlkfjslf', type: ''};
     
    let options: number[] = [];
    let conditionals: string[] = []; 
    let expandable: boolean = false;
    
    if (control.get('expandable') !== null) {
        expandable = control.get('expandable').value;
    }
    
    
    if (control.get('options') !== null){
        options = control.get('options').value;
    }

    if (control.get('conditionalQuestions') !== null) {
        conditionals = control.get('conditionalQuestions').value;
    }

    if (control.get('key') !== null) {
        key = control.get('key').value;
    } else {
        console.warn(`KEY IS NULL!!`);
        console.log('-----------------')
        console.log(control.value);
        console.log('-----------------')
    }

    let errors = { }

  


    if(label.length === 0){
        errors = (<any>Object).assign({}, errors, {emptyLabel: true } ); 
    } 

    if(controlType === 'CheckBox' && key.type !== 'boolean' ){
        errors = (<any>Object).assign({}, errors, {checkbox_mismatch: true } ); 
    } 

    if(controlType !== 'CheckBox' && key.type === 'boolean'){
        errors = (<any>Object).assign({}, errors, {checkbox_mismatch: true } ); 
    } 

    if(controlType === 'NumberSelect' && options.length === 0){
        errors = (<any>Object).assign({}, errors, {no_options: true} ); 
    } 

    const rawControlType = <string>controlType;
    if(rawControlType === 'invalid')
    {
        errors = (<any>Object).assign({}, errors, {unnassigned_controlType: rawControlType} );
    }

    if(key.name.substr(0, 7) === 'invalid') {
        errors = (<any>Object).assign({}, errors, {unnassigned_key: true} );
    }

    if(key.type === '') {
        errors = (<any>Object).assign({}, errors, {invalid_key_type: true} );
    }

    if(expandable && controlType !== 'CheckBox' && key.type !== 'boolean') {
        errors = (<any>Object).assign({}, errors, {invalid_expandable: true} );
    }

    if(expandable && conditionals.length === 0) {
        errors = (<any>Object).assign({}, errors, {empty_expandable: true} );
    }

    if(!expandable && conditionals.length > 0) {
        errors = (<any>Object).assign({}, errors, {not_expandable_with_conditionals: true})
    }


    if (Object.keys(errors).length === 0) return null;

    return errors;

}