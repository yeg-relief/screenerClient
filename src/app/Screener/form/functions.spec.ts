/* tslint:disable:no-unused-variable */
import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { DataService, MasterScreener, toForm } from '../index';
import { HTTP_PROVIDERS } from '@angular/http';
import { FormGroup } from '@angular/forms';

describe('toForm', () => {
  beforeEachProviders(() => [DataService, HTTP_PROVIDERS]);

  it('should exposes an observable that pushes a masterScreener',
      inject([DataService], (service: DataService) => {
    let masterScreener: MasterScreener;      
    service.getMasterScreener().subscribe(
          (output) => {masterScreener = output}
         ); 
    const formGroup: FormGroup = toForm(masterScreener);
    // check '../data/fake-data' for where these names come from  
    expect(formGroup.contains('expand')).toBe(true);
    
    })
  );
});  