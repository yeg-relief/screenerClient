/* tslint:disable:no-unused-variable */
import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { MasterScreener, QuestionGroup, ExpandableGroup, Question, toForm } from '../index';
import { FormGroup, Validators, FormControl, Validator } from '@angular/forms';



const TEST_DATA_1: MasterScreener = {
  controls: {
    expand: new FormControl(false, Validators.required),
    collapsedOne: new FormControl('present', Validators.required),
    constantOne: new FormControl('stuff'),
    constantTwo: new FormControl(true, Validators.required)
  },
  questionGroups: [
    <QuestionGroup>{
        group: [
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
    },
    <ExpandableGroup>
    {
       conditional: {
         key: 'expand',
         validators: ["REQUIRED"],
         value: false,
         controlType: 'checkbox'
       },
       expandable: [
        {
           key:'collapsedOne',
           validators: ["REQUIRED"],
           label: '',
           value: 'stuff',
         }
       ]
    }
  ]
}






describe('how toForm operates on TEST_DATA_1', () => {
  let formGroup: FormGroup;
  const masterScreener: MasterScreener = TEST_DATA_1;  
  beforeEach(()=> {
    formGroup = toForm(masterScreener);
  })

  it('should map all constant and "expanded collapsed groups" to the formGroup',() => {
    
    // present in formgroup
    expect(formGroup.contains('expand')).toBe(true);
    expect(formGroup.contains('collapsedOne')).toBe(false);
    expect(formGroup.contains('constantOne')).toBe(true);
    expect(formGroup.contains('constantTwo')).toBe(true);
    
  });
  
  it('should copy the values to the form group', () => {
    // value is correct
    expect(formGroup.find('expand').value).toBe(false);
    expect(formGroup.find('collapsedOne')).toBeNull();
    expect(formGroup.find('constantOne').value).toBe('stuff');
    expect(formGroup.find('constantTwo').value).toBe(true);
  })
  
  it('should register the proper validators', () => {
    // validators are correct
    expect(formGroup.find('expand').validator).toBe(Validators.required)
    expect(formGroup.find('constantOne').validator).toBe(null)
    expect(formGroup.find('constantTwo').validator).toBe(Validators.required)
  })  
});  

