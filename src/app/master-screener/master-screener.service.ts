import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/delay';
import { Question, UserFacingProgram } from '../shared';

@Injectable()
export class MasterScreenerService {
  private mockQuestions: Question[] = [
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
  ];

  private results = new Array<UserFacingProgram>();
  private mockResults: UserFacingProgram[] = [
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
      tags: ['tax', 'savings', 'disabled']
    }
  ];

  constructor() { }

  loadQuestions(): Observable<Question[]> {
    return Observable.from(this.mockQuestions).toArray();
  }

  fetchResults(responsePayload: string): boolean {
    this.results = this.results.concat(this.mockResults);
    return true;
  }

  loadResults(): Observable<UserFacingProgram[]> {
    // return Observable.from(this.results).delay(400).toArray();
    return Observable.from(this.mockResults).delay(400).toArray();
  }
}
