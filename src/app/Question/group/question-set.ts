import { QuestionBase, IOptions } from '../question-base';
import { FormControl, Validators } from '@angular/forms';

export class QuestionSet{
  _constantQuestions: QuestionBase<any>[];

  
  constructor(constantQuestions: IOptions<string|boolean>[]){
    this._constantQuestions = new Array<QuestionBase<any>>();
    constantQuestions.map( question => {
      
    })
  }
  
  sort(): void{
    this._constantQuestions.sort( (a: QuestionBase<any>, b: QuestionBase<any>) => {
      return a.order - b.order;
    });
  }
  
  getControls(): FormControl[]{
    this.sort();
    const output: FormControl[] = new Array<FormControl>();
    this._constantQuestions.map( question => {
      output.push(question.getFormControl());
    })
    return output;
  }
}