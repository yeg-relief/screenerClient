import { QuestionBase } from '../../base/question-base';

export class CheckboxQuestion extends QuestionBase<string> {
  controlType = 'checkbox';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
    this.checked = options['checked'] || false;
  }
}