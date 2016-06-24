import { FormControl, Validators } from '@angular/forms';

export interface IOptions<T>{
  value: T;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType?: string;
  checked?: boolean;
  lead?: boolean;
  type?: string;
}


export class QuestionBase<T>{
  value: T;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
  checked: boolean;
  lead: boolean;
  type: string; 
  control: FormControl;
  
  constructor(options: IOptions<T>) {
    this.value = options.value;
    this.key = options.key;
    this.label = options.label;
    this.required = !!options.required;
    this.order = options.order;
    this.controlType = options.controlType || '';
    this.checked = !!options.checked;
    this.lead = !!options.lead;
    this.type = options.type || '';
  }
  
  getFormControl(): FormControl{
    if(this.control === undefined){  
      return this._buildFormControl();
    }
    return this.control;
  }
  
  private _buildFormControl(): FormControl{
    if(this.required === true){
      return new FormControl(this.value, Validators.required);
    }
    return new FormControl(this.value);
  }
}

