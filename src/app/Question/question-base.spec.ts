/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { QuestionBase } from './question-base';
import { FormControl, Validators } from '@angular/forms';

describe( 'QuestionBase', ()=> {
  it('can convert to a form control', () => {
    const options = {
      key: 'numberChildren',
      label: "How many children under 18?",
      required: true,
      value: '',
      order: 4
    }
    let test: QuestionBase<string> = new QuestionBase<string>(options);
    expect(test.getFormControl()).toEqual(new FormControl('', Validators.required));
  })
})