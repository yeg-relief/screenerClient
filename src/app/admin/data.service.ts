import { Injectable } from '@angular/core';
import { MasterScreener, MasterScreenerMetaData } from './models/master-screener';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/toArray';

@Injectable()
export class DataService {
  private screenerCache = new Map<number, MasterScreener>();
  constructor() { }
  private requestScreener(version: number): Observable<MasterScreener> | Observable<boolean> {
    const MOCK_VALID_VERSION = 8;
    const valid: boolean = version === MOCK_VALID_VERSION;
    return Observable.of(valid)
      .switchMap<boolean | MasterScreener>((res: boolean) => {
        if (!res) {
          return Observable.of(res);
        }
        // tslint:disable-next-line
        this.screenerCache.set(version, mockVersionEight);
        // tslint:disable-next-line
        return Observable.of(mockVersionEight);
      })
      .delay(1000);
  }

  loadScreener(version: number): Observable<MasterScreener> | Observable<boolean> {
    return Observable.of(this.screenerCache.has(version))
      .switchMap<boolean | MasterScreener>((res: boolean) => {
        if (res) {
          console.log(`loading master-screener version ${version} from cache.`);
          return Observable.of(this.screenerCache.get(version));
        }
        console.log(`requesting master-screener version ${version} from network`);
        return this.requestScreener(version);
      });
  }

  loadVersionMetaData(): Observable<MasterScreenerMetaData> {
    return Observable.range(1, 8)
      .toArray()
      .delay(100)
      .map(versions => { return { versions: versions }; });
  }
}

const mockVersionEight: MasterScreener = {
  created: '10-26-2016',
  version: 8,
  questions: [
    {
      type: 'number',
      key: 'age',
      label: 'age',
      expandable: false,
      controlType: 'input'
    },
    {
      type: 'number',
      key: 'income',
      label: 'Yearly income',
      controlType: 'radio',
      options: [
        {
          display: '$10000',
          value: 10000
        },
        {
          display: '$20000',
          value: 20000
        },
        {
          display: '$30000',
          value: 30000
        },
        {
          display: '$40000',
          value: 40000
        },
        {
          display: '$50000',
          value: 50000
        },
        {
          display: '$60000',
          value: 60000
        }
      ],
      expandable: false
    },
    {
      type: 'boolean',
      key: 'hasChildren',
      label: 'Do you have children under 18?',
      expandable: true,
      value: '',
      controlType: 'radio',
      options: [
        {
          display: 'yes',
          value: true
        },
        {
          display: 'no',
          value: false
        }
      ],
      conditonalQuestions: [
        {
          type: 'boolean',
          key: 'singleParent',
          label: 'Are you a single Parent?',
          value: '',
          controlType: 'radio',
          options: [
            {
              display: 'yes',
              value: true
            },
            {
              display: 'no',
              value: false
            }
          ],
          expandable: false
        },
        {
          type: 'boolean',
          key: 'nationalChildHealthBenefit',
          label: 'Do you recieve the National Child Benefit Supplement?',
          value: '',
          controlType: 'radio',
          options: [
            {
              display: 'yes',
              value: true
            },
            {
              display: 'no',
              value: false
            }
          ],
          expandable: false
        },
        {
          type: 'boolean',
          key: 'childBornAfter_2004',
          label: 'Are your children born January 1, 2004 or later?',
          value: '',
          controlType: 'radio',
          options: [
            {
              display: 'yes',
              value: true
            },
            {
              display: 'no',
              value: false
            }
          ],
          expandable: false
        }
      ]
    },
    {
      type: 'boolean',
      key: 'betweenSixty_and_SixtyFour',
      label: 'Are you between the ages of 60 and 64?',
      value: '',
      controlType: 'radio',
      options: [
        {
          display: 'yes',
          value: true
        },
        {
          display: 'no',
          value: false
        }
      ],
      expandable: false
    },
    {
      type: 'boolean',
      key: 'survivedSpouse',
      label: 'has your spouse or common-law partner has died' +
      ' and you have not remarried or entered into a common-law relationship?',
      value: '',
      controlType: 'radio',
      options: [
        {
          display: 'yes',
          value: true
        },
        {
          display: 'no',
          value: false
        }
      ],
      expandable: false
    }
  ]
};
