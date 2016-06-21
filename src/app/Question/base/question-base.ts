export class QuestionBase<T>{
  value: T;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
  conditon: string;
  checked: boolean;
  lead: boolean;
  constructor(options: {
      value?: T,
      key?: string,
      label?: string,
      required?: boolean,
      order?: number,
      controlType?: string,
      condition?: string,
      checked?: boolean,
      lead?: boolean;
    } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.conditon = options.condition || '';
    this.checked = !!options.checked;
    this.lead = !!options.lead;
  }
}
