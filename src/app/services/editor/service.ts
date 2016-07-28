import { Injectable } from '@angular/core';
import { Question } from '../../models/index';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EditorService{

  
  updateMasterScreener(questions):Observable<Question[]>{
    return questions.asObservable();
  }
}