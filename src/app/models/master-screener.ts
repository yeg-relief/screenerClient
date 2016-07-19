import { FormGroup, FormControl } from '@angular/forms';

export interface MasterScreener{
  questions: Question[];
  form: FormGroup;
  payload: any;
}

export interface Question{
  value: any;
  key: string;
  label: string;
  controlType: string;
  type?: string;
  control: FormControl;
  expandable: Question[];
  options?: string[];
}