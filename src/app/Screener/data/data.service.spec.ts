/* tslint:disable:no-unused-variable */
import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { DataService } from './data.service';
import { HTTP_PROVIDERS } from '@angular/http';
import {fakeData} from './fake-data';
import {MasterScreener , ExpandableGroup, ConditionalQuestion} from '../question/types'

describe('Data Service', () => {
  beforeEachProviders(() => [DataService, HTTP_PROVIDERS]);

  it('should exposes an observable that pushes a masterScreener',
      inject([DataService], (service: DataService) => {
        let masterScreener: MasterScreener,
            error: any,
            completed: boolean,
            count: number = 0;
        service.getMasterScreener().subscribe(
          (output) => {count++;masterScreener = output},
          (err) => {error = err},
          () => {completed = true}
        )
        expect(error).toBeUndefined();
        expect(completed).toBe(true);
        expect(count).toBe(1);
        // I should implement some type of deep equality check...
        expect(masterScreener.questionGroups.length).toBe(1);
        let ex: ExpandableGroup = <ExpandableGroup>masterScreener.questionGroups[0];
        expect(ex.expandable.length).toBe(3);
        expect(ex.conditional).toBeDefined();
        expect(ex.conditional.key).toBe('expand');
        expect(Object.keys(masterScreener.controls).length).toBe(4);
  }));
});

