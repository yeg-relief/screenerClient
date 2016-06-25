/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import * as QTypes from './types'
import {controlReducer} from './functions';
import {FormControl, Validators} from '@angular/forms';

const FAKE_EXPANDABLE: QTypes.ExpandableGroup = {
    
      conditional: {
        key: 'expand',
        label: 'expand group 0?',
        controlType: 'checkbox',
        value: false,
        validators: ['REQUIRED'],
        conditional: 'true'
      },
      expandable: 
      [
        {
          key: 'firstName',
          label: 'First name',
          controlType: 'textbox',
          value: 'Bombasto',
          validators: ['REQUIRED'],
          order: 2
        },
        {
          key: 'emailAddress',
          label: 'Email',
          type: 'email',
          controlType: 'textbox',
          value: '',
          validators: [],
          order: 3
        },
        {
          key: 'numberChildren',
          label: "How many children under 18?",
          controlType: 'textbox',
          validators: ['REQUIRED'],
          value: '',
          order: 4
        }
      ]
      
  } 


const FAKE_GROUP: QTypes.QuestionGroup = 
{  
    group: [
        {
          key: 'firstName',
          label: 'First name',
          controlType: 'textbox',
          value: 'Bombasto',
          validators: ['REQUIRED'],
          order: 2
        },
        {
          key: 'emailAddress',
          label: 'Email',
          type: 'email',
          controlType: 'textbox',
          value: '',
          validators: [],
          order: 3
        },
        {
          key: 'numberChildren',
          label: "How many children under 18?",
          controlType: 'textbox',
          validators: ['REQUIRED'],
          value: '',
          order: 4
        }
    ]
}

const FAKE_GROUP_EXPECTED: QTypes.ControlMap = {};
FAKE_GROUP_EXPECTED['firstName'] = new FormControl('Bombasto', Validators.required);
FAKE_GROUP_EXPECTED['emailAddress'] = new FormControl('');
FAKE_GROUP_EXPECTED['numberChildren'] = new FormControl('', Validators.required);

const FAKE_EXPANDABLE_EXPECTED: QTypes.ControlMap = {};
FAKE_GROUP_EXPECTED['firstName'] = new FormControl('Bombasto', Validators.required);
FAKE_GROUP_EXPECTED['emailAddress'] = new FormControl('');
FAKE_GROUP_EXPECTED['numberChildren'] = new FormControl('', Validators.required);
FAKE_GROUP_EXPECTED['expand'] = new FormControl(false, Validators.required);

describe('control reducer', () => {
  /*
  it('will return a ControlMap with the controls for a QuestionGroup', () => {
    const controlMap: QTypes.ControlMap = controlReducer(FAKE_GROUP);
    Object.keys(controlMap).map( key => {
      expect(controlMap[key].value).toEqual(FAKE_GROUP_EXPECTED[key].value);
      expect(controlMap[key] instanceof FormControl).toBe(true);
    })
    expect(Object.keys(controlMap).length).toEqual(3);
  })
  
  it('will return a ControlMap with the controls for a ExpandableGroup', () => {
    const controlMap: QTypes.ControlMap = controlReducer(FAKE_EXPANDABLE);
    Object.keys(controlMap).map( key => {
      expect(controlMap[key].value).toEqual(FAKE_GROUP_EXPECTED[key].value);
      expect(controlMap[key] instanceof FormControl).toBe(true);
    })
    expect(Object.keys(controlMap).length).toEqual(4);
  })
  */
})