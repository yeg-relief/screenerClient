import { QuestionBase } from '../question-base';
import { FormControl, Validators } from '@angular/forms';


export class QuestionSet{
  _constantQuestions: QuestionBase<any>[];

  
  constructor(constantQuestions: QuestionBase<any>[]){
    this._constantQuestions = constantQuestions;
    
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