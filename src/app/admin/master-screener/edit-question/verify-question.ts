import { Question } from '../../../shared/models';
import { QuestionErrors, ERRORS } from './question-errors';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export function verifyQuestion(question: Question): Observable<QuestionErrors> {
  const errorDetails: QuestionErrors = [];
  if (question.key === 'empty' || question.key === undefined) {
    errorDetails.push(ERRORS.NO_KEY_PICKED);
  }

  if (question.controlType === undefined) {
    errorDetails.push(ERRORS.NO_CONTROL_PICKED);
  }

  if (question.label === undefined || question.label === '') {
    errorDetails.push(ERRORS.NO_LABEL_PICKED);
  }

  if (question.type === undefined) {
    errorDetails.push(ERRORS.NO_TYPE_PICKED);
  }

  if (question.controlType !== undefined && question.options !== undefined) {
    if (question.options.length > 0 && question.controlType === 'radio') {
      errorDetails.push(ERRORS.NO_OPTIONS);
    }
  }

  return Observable.of(errorDetails);
}
