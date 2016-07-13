import { ValidatorTypes, DropdownOptions } from '../MasterScreener/index';
import { FormGroup, FormControl } from '@angular/forms';

export interface MasterScreener{
  questions: Question[];
  form: FormGroup;
  payload: any; // get rid of this after prototyping
}

export interface Question{
  id: number;
  value: any;
  validators: ValidatorTypes[];
  key: string;
  label: string;
  controlType: string;
  type?: string;
  options?: DropdownOptions;
  control: FormControl;
}



export interface NestedQuestion extends Question{
  head: Question
  tail: Question[];
}