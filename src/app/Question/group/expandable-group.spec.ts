/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { ExpandableGroup } from './expandable-group';
import { QuestionGroup, GROUP_TYPE } from './interface';
import { TextboxQuestion } from './../ControlType/textbox/question-textbox';
import { CheckboxQuestion } from './../ControlType/checkbox/question-checkbox';
import { FormControl, Validators } from '@angular/forms';

const DATA: any = {
  lead: new CheckboxQuestion({
            key: 'expand',
            label: 'expand group 0?',
            value: false,
            checked: false,
            required: false,
            lead: true,
            order: 1
          }),
  following: 
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
   ]        
}

const EXPECTED: any = {
  leadQuestion: new FormControl(false),
  hiddenQuestions: 
    [
      new FormControl('Bombasto', Validators.required),
      new FormControl(''),
      new FormControl('', Validators.required)
    ]
}


describe('ConstantGroup', () => {
  it('is constructable', () => {
    expect(new ExpandableGroup(DATA.lead, DATA.following)).toBeTruthy();
  })
  
  it('is of a EXPANDABLE GOUP_TYPE', () => {
    expect(new ExpandableGroup(DATA.lead, DATA.following).GROUP_TYPE()).
      toEqual(GROUP_TYPE.EXPANDABLE())
  })
  
  it('Can convert all questions to a FormControl', () => {   
    expect(new ExpandableGroup(DATA.lead, DATA.following).getControls().leadQuestion).
      toEqual(EXPECTED.leadQuestion);
    expect(new ExpandableGroup(DATA.lead, DATA.following).getControls().hiddenQuestions).
      toEqual(EXPECTED.hiddenQuestions);
  })
});