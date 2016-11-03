import { Injectable } from '@angular/core';
import { MasterScreener } from './models/master-screener';
import { UserFacingProgram } from '../shared/models';
import { Key } from './models/key';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/do';
import { cloneDeep } from 'lodash';

@Injectable()
export class DataService {
  private screenerCache = new Map<string, MasterScreener>();
  private loadedPrograms: UserFacingProgram[] = [];
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
    // tslint:disable-next-line
    return Observable.of(versions)
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
    versions.push(screener.meta.screener.version);
    // tslint:disable-next-line
    availableVersions.push(screener);
    return Observable.of('').delay(2000);
  }

  loadPrograms(): Observable<UserFacingProgram[]> {
    if (this.loadedPrograms.length === 0) {
      console.log('loading from network');
      return Observable.of(mockPrograms)
        .delay(2000)
        .do(programs => this.loadedPrograms = [...programs]);
    }
    return Observable.of(this.loadedPrograms);
  }

  updateProgram(program: UserFacingProgram) {
    const updateProgramIndex = this.loadedPrograms.findIndex(mockProgram => mockProgram.guid === program.guid);
    if (updateProgramIndex >= 0) {
      this.loadedPrograms.splice(updateProgramIndex, 1, program);
    }
    return Observable.of(this.loadedPrograms)
      .delay(2000);
  }

  createProgram(program: UserFacingProgram) {
    const newGUID = Math.random().toString();
    program.guid = newGUID;
    program.description.guid = newGUID;
    this.loadedPrograms.push(program);
    return Observable.of(this.loadedPrograms)
      .delay(2000);
  }

  deleteProgram(program: UserFacingProgram) {
    const deleteProgramIndex = this.loadedPrograms.findIndex(mockProgram => mockProgram.guid === program.guid);
    if (deleteProgramIndex >= 0) {
      this.loadedPrograms.splice(deleteProgramIndex, 1);
    }
    return Observable.of(this.loadedPrograms)
      .delay(2000);
  }
}

const versions = [1, 2, 3];

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

const mockPrograms: UserFacingProgram[] = [
  {
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
  {
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
  {
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
  }
];
