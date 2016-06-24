import { QuestionBase, IOptions } from '../../question-base';

export class CheckboxQuestion extends QuestionBase<boolean> {
  controlType: string = 'checkbox';

  constructor(options: IOptions<boolean>) {
    super(options);
  }
}