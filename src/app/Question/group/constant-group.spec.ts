/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { ConstantGroup } from './constant-group';
import { QuestionGroup, GROUP_TYPE } from './interface';
import { TextboxQuestion } from './../ControlType/textbox/question-textbox';
import { FormControl, Validators } from '@angular/forms';

const DATA: TextboxQuestion[] = 
        [
          new TextboxQuestion({
          key: 'firstName',
          label: 'First name',
          value: 'Bombasto',
          required: true,
          order: 2
          }),
          new TextboxQuestion({
            key: 'emailAddress',
            label: 'Email',
            type: 'email',
            value: '',
            required: false,
            order: 3
          }),
          new TextboxQuestion({
            key: 'numberChildren',
            label: "How many children under 18?",
            required: true,
            value: '',
            order: 4
          })
        ];

const EXPECTED: FormControl[] = 
  [
    new FormControl('Bombasto', Validators.required),
    new FormControl(''),
    new FormControl('', Validators.required)
  ]


describe('ConstantGroup', () => {
  it('is constructable', () => {
    expect(new ConstantGroup(DATA)).toBeTruthy();
  })
  
  it('is of a CONSTANT GOUP_TYPE', () => {
    expect(new ConstantGroup(DATA).GROUP_TYPE()).toEqual(GROUP_TYPE.CONSTANT())
  })
  
  it('Can convert all questions to a FormControl', () => {
    expect(new ConstantGroup(DATA).getControls().constantQuestions).toEqual(EXPECTED);
  })
});
