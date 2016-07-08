/* tslint:disable:no-unused-variable */
import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import {GeneralQuestionGroup, QuestionGroup} from '../../MasterScreener/question/index';
import {validateQuestionGroup} from './data.validation';

const TEST_DATA_1: any = 
{
  cats: [
    {
      value: true,
      validators: ["REQUIRED"],
      key: 'constantTwo',
      controlType: 'checkbox',
    },
    {
      key: 'constantOne',
      validators: [],
      controlType: 'textbox',
      value: 'stuff'
     }
  ]
}

const TEST_DATA_2: any = 
{
  cats: {
    value: true,
    validators: ["REQUIRED"],
    key: 'expand',
    controlType: 'checkbox',
  },
  
  expandable: [
    {
      value: true,
      validators: ["REQUIRED"],
      key: 'constantTwo',
      controlType: 'checkbox',
    },
    {
      key: 'constantOne',
      validators: [],
      controlType: 'textbox',
      value: 'stuff'
     }
  ]
}

const TEST_DATA_3: any = 
{
  conditional: {
    value: true,
    validators: ["REQUIRED"],
    key: 'expand',
    controlType: 'checkbox',
  },
  
  rats: [
    {
      value: true,
      validators: ["REQUIRED"],
      key: 'constantTwo',
      controlType: 'checkbox',
    },
    {
      key: 'constantOne',
      validators: [],
      controlType: 'textbox',
      value: 'stuff'
     }
  ]
}


describe('how validateQuestionGroup operates on TEST_DATA_1', () => {
  it('will throw a malformed group exception', () => {
    expect(() => {validateQuestionGroup(TEST_DATA_1)}).toThrow();
  })
});

describe('how validateQuestionGroup operates on TEST_DATA_2', () => {
  it('will throw a malformed group exception', () => {
    expect(() => {validateQuestionGroup(TEST_DATA_2)}).toThrow();
  })
});

describe('how validateQuestionGroup operates on TEST_DATA_3', () => {
  it('will throw a malformed group exception', () => {
    expect(() => {validateQuestionGroup(TEST_DATA_3)}).toThrow();
  })
});