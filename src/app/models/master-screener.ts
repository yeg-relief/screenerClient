import { ValidatorTypes, DropdownOptions } from '../MasterScreener/index';
import { FormGroup, FormControl } from '@angular/forms';

export interface MasterScreener{
  questions: Question[];
  form: FormGroup;
  controls: {[key:string]:FormControl};
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

export interface ConditionalQuestion extends Question{
  conditionalQuestion: Question;
  expandableGroup: Question[];
}