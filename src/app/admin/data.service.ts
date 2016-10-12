import { Injectable } from '@angular/core';
import { MasterScreener } from './models/master-screener';
import { Key } from './models/key';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/toArray';

@Injectable()
export class DataService {
  private screenerCache = new Map<string, MasterScreener>();
  constructor() { }
  private requestScreener(version: number): Observable<MasterScreener> | Observable<boolean> {
    const MOCK_VALID_VERSION = 3;
    const valid: boolean = version === MOCK_VALID_VERSION;
    return Observable.of(valid)
      .switchMap<boolean | MasterScreener>((res: boolean) => {
        if (!res) {
          return Observable.of(res);
        }
        // tslint:disable-next-line
        this.screenerCache.set(version.toString(), mockVersionThree);
        // tslint:disable-next-line
        return Observable.of(mockVersionThree);
      })
      .delay(1000);
  }

  loadScreener(version: number): Observable<MasterScreener> {
    return Observable.of(this.screenerCache.has(version.toString()))
      .switchMap<boolean | MasterScreener>((res: boolean) => {
        if (res) {
          const versionA = this.screenerCache.get(version.toString());
          return Observable.of(versionA);
        }
        return this.requestScreener(version);
      });
  }

  loadLatestScreener(): Observable<MasterScreener> {
    // tslint:disable-next-line
    const latest = availableVersions[availableVersions.length - 1];
    this.screenerCache.set(latest.meta.screener.version.toString(), latest);
    return Observable.of(latest).delay(1000);
  }

  loadVersionMetaData(): Observable<number[]> {
    return Observable.range(1, 3)
      .toArray()
      .delay(100);
  }

  loadKeys(): Observable<Key[]> {
    // tslint:disable-next-line
    return Observable.of(mockKeys)
      .delay(300);
  }

  saveScreener(screener: MasterScreener) {
    // tslint:disable-next-line
    const latest = availableVersions[availableVersions.length - 1];
    screener.meta.screener.version++;
    // tslint:disable-next-line
    availableVersions.push(screener);
    return Observable.of('').delay(2000);
  }
}

const mockKeys: Key[] = [
  {
    name: 'age', type: 'number'
  },
  {
    name: 'income', type: 'number'
  },
  {
    name: 'hasChildren', type: 'boolean'
  },
  {
    name: 'singleParent', type: 'boolean'
  },
  {
    name: 'nationalChildHealthBenefit', type: 'boolean'
  },
  {
    name: 'childBornAfter_2004', type: 'boolean'
  },
  {
    name: 'betweenSixty_and_SixtyFour', type: 'boolean'
  },
  {
    name: 'survivedSpouse', type: 'boolean'
  },
  {
    name: 'unused_number_key', type: 'number'
  },
  {
    name: 'unused_boolean_key', type: 'boolean'
  },
  {
    name: 'unused_text_key', type: 'text'
  },
];

const mockVersionThree: MasterScreener = {
  meta: {
    screener: {
      version: 3,
      created: '14-10-2016'
    },
    questions: {
      totalCount: 5,
    }
  },
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

const availableVersions = [mockVersionThree];
