/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject,
  injectAsync
} from '@angular/core/testing'; 
import {provide} from '@angular/core';
import { MasterScreenerComponent } from './master-screener.component';
import { DataService } from '../Screener/index';
import { TestComponentBuilder } from '@angular/compiler/testing';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/reduce';
import {
  GeneralQuestionGroup, MasterScreener, 
  ControlMap, controlReducer, assign 
} from '../Screener/index';
import { HTTP_PROVIDERS } from '@angular/http';


class MockDataService extends DataService {
  constructor() {
    super(null);
  }

  fakeData():Array<GeneralQuestionGroup>{
    return [
      {
      
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
    ] 
  }
  
  pullData(): Observable<any>{
    return Observable.from(this.fakeData());
  }
  
  getMasterScreener(): Observable<any>{    
    const masterScreener: MasterScreener = {
      controls: {},
      questionGroups: new Array<GeneralQuestionGroup>()
    }
    return this.pullData()
           .reduce( (screener: any, questionGroup: any) => {                            
              masterScreener.questionGroups.push(questionGroup);
              const cntrl: ControlMap = controlReducer(questionGroup);
              assign(masterScreener.controls, cntrl);
              return masterScreener;
           }, masterScreener)
  }
  
}



describe('Component: MasterScreener', () => {
  
  let mockDataService: MockDataService;
  
  beforeEachProviders(() => [DataService, HTTP_PROVIDERS]);
  
  beforeEach(() => {
    mockDataService = new MockDataService();
  });
  
  it('should create an instance', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb
    .overrideProviders(DataService, [provide(DataService, {useValue: mockDataService})])
    .createAsync(MasterScreenerComponent)
    .then((fixture) => {
      let nativeElement = fixture.nativeElement;
      fixture.detectChanges();
      expect(nativeElement.querySelector('#thing') === null).toBe(false);
    })
  }));
});







