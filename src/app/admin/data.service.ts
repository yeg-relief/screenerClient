import { Injectable } from '@angular/core';
import { MasterScreener } from './models/master-screener';
import { ApplicationFacingProgram } from './models/program';
import { Key } from './models/key';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/reduce';

@Injectable()
export class DataService {
  private screeners$: Observable<MasterScreener[]>;
  private keys$: Observable<Key[]>;

  constructor(private http: Http) {
    this.loadAllScreeners();
    this.loadKeys();
  }

  private loadKeys() {
    let httpCalls = 0;
    this.keys$ = this.http.get('/api/keys/')
      .do(() => {
        if (httpCalls > 1) {
          console.error('multiple http calls from DataService.loadKeys() being made!!');
        }
      })
      .map(res => res.json().response)
      .multicast(new ReplaySubject(1)).refCount()
      .catch(this.loadError);
  }

  // load every screener again naive, but it works at this point TODO: rewrite to improve scalability
  private loadAllScreeners() {
    let httpCalls = 0;
    this.screeners$ = this.http.get('/api/master_screener/')
      .do(() => {
        if (httpCalls > 1) {
          console.error('multiple http calls from DataService.loadAllScreeners() being made!!');
        }
      })
      .map(res => res.json().response)
      .multicast(new ReplaySubject(1)).refCount()
      .catch(this.loadError);
  }


  loadScreener(version: number): Observable<MasterScreener> {
    return this.screeners$
      .switchMap(x => x)
      .filter((screener: MasterScreener) => screener.version === version)
  }


  loadError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.message || JSON.stringify(body);
      errMsg = err;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  loadLatestScreener(): Observable<MasterScreener> {
    return this.screeners$
      .map((screeners: MasterScreener[]) => {
        const sorted = screeners.sort((a, b) => a.version - b.version)
        return sorted[sorted.length - 1]
      });
  }

  loadVersionMetaData(): Observable<number[]> {
    return this.screeners$
      .switchMap(x => x)
      .reduce((accum: number[], screener: MasterScreener) => accum.concat(screener.version), []);
  }

  getKeys(): Observable<Key[]> {
    return this.keys$;
  }

  saveScreener(screener: MasterScreener) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const body = JSON.stringify({ data: screener });
    return this.http.post('/api/master_screener/', body, options)
      .map(res => res.json().response)
      .catch(this.loadError)
      .toPromise();
  }

  loadPrograms(): Observable<ApplicationFacingProgram[]> {
    return this.http.get('/api/programs/')
      .map(res => res.json().programs)
      .reduce((accum, program) => accum.concat(program.application), [])
      .catch(this.loadError)
  }

  updateProgram(program: ApplicationFacingProgram) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const body = JSON.stringify({ data: program });
    return this.http.post('/api/programs/', body, options)
      .map(res => res.json().response)
      .catch(this.loadError)
      .toPromise();
  }

  createProgram(program: ApplicationFacingProgram) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const body = JSON.stringify({ data: program });
    return this.http.post('/api/programs/', body, options)
      .map(res => res.json().response)
      .catch(this.loadError)
      .toPromise();
  }

  deleteProgram(program: ApplicationFacingProgram) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.delete(`/api/programs/${program.guid}`, options)
      .map(res => res.json().removed)
      .catch(this.loadError)
      .toPromise()
  }

  updateKey(key: Key) {
    const keys = mockKeys.filter(mockKey => mockKey.name !== key.name);
    mockKeys = [key, ...keys];
    return Observable.of(mockKeys).delay(200);
  }

  delete(key: Key) {
    mockKeys = mockKeys.filter(mockKey => mockKey.name !== key.name);
  }
}

let mockKeys: Key[] = [
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
      controlType: 'input',
      options: [],
      conditonalQuestions: []
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
      conditonalQuestions: [],
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
          conditonalQuestions: [],
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
          conditonalQuestions: [],
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
          conditonalQuestions: [],
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
      conditonalQuestions: [],
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
      conditonalQuestions: [],
      expandable: false
    }
  ]
};

const availableVersions = [mockVersionThree];

const mockPrograms: ApplicationFacingProgram[] = [
  {
    guid: 'f41608cb-09aa-4e5b-a050-75d9166fbf6b',
    user: {
      guid: 'f41608cb-09aa-4e5b-a050-75d9166fbf6b',
      description: {
        guid: 'f41608cb-09aa-4e5b-a050-75d9166fbf6b',
        title: 'Alberta Adult Health Benefit',
        details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
        'Mauris quis ornare elit. Nam feugiat mollis lorem, sed ultricies tellus accumsan at. ' +
        'Donec augue diam, condimentum ac lobortis nec, finibus ut ante. Phasellus eget enim nec neque ' +
        'rutrum mattis sit amet tincidunt justo. Etiam porttitor dolor vitae felis rutrum, ' +
        'sit amet iaculis sapien condimentum. Aenean scelerisque eros vel tellus fermentum, sed tempor ' +
        'neque pellentesque. Morbi scelerisque dolor massa, facilisis suscipit dolor interdum a.',
        externalLink: 'http://www.humanservices.alberta.ca/financial-support/2085.html'
      },
      created: '',
      tags: ['adult', 'health']
    },
    application: []
  },
  {
    guid: '86959ea1-7e27-461c-b274-c08cdcffc193',
    user: {
      guid: '86959ea1-7e27-461c-b274-c08cdcffc193',
      description: {
        guid: '86959ea1-7e27-461c-b274-c08cdcffc193',
        title: 'Alberta Child Health Benefit',
        details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
        'Mauris quis ornare elit. Nam feugiat mollis lorem, sed ultricies tellus accumsan at. ' +
        'Donec augue diam, condimentum ac lobortis nec, finibus ut ante. Phasellus eget enim nec neque ' +
        'rutrum mattis sit amet tincidunt justo. Etiam porttitor dolor vitae felis rutrum, ' +
        'sit amet iaculis sapien condimentum. Aenean scelerisque eros vel tellus fermentum, sed tempor ' +
        'neque pellentesque. Morbi scelerisque dolor massa, facilisis suscipit dolor interdum a.',
        externalLink: 'http://www.humanservices.alberta.ca/financial-support/2076.html'
      },
      created: '',
      tags: ['child', 'health']
    },
    application: []
  },
  {
    guid: 'ee4ee200-9c8e-4e2c-9b1f-b9e6b0b330e0',
    user: {
      guid: 'ee4ee200-9c8e-4e2c-9b1f-b9e6b0b330e0',
      description: {
        guid: 'ee4ee200-9c8e-4e2c-9b1f-b9e6b0b330e0',
        title: 'RDSP: Registered Disablity Savings Plan',
        details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
        'Mauris quis ornare elit. Nam feugiat mollis lorem, sed ultricies tellus accumsan at. ' +
        'Donec augue diam, condimentum ac lobortis nec, finibus ut ante. Phasellus eget enim nec neque ' +
        'rutrum mattis sit amet tincidunt justo. Etiam porttitor dolor vitae felis rutrum, ' +
        'sit amet iaculis sapien condimentum. Aenean scelerisque eros vel tellus fermentum, sed tempor ' +
        'neque pellentesque. Morbi scelerisque dolor massa, facilisis suscipit dolor interdum a.',
        externalLink: 'http://www.cra-arc.gc.ca/rdsp/'
      },
      created: '',
      tags: ['tax', 'savings', 'disabled']
    },
    application: []
  }
];
