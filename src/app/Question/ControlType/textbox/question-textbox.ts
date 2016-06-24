import { QuestionBase, IOptions } from '../../question-base';

export class TextboxQuestion extends QuestionBase<string> {
  controlType: string = 'textbox';

  constructor(options: IOptions<string>) {
    super(options);
  }
}