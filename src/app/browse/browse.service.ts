import { Injectable } from '@angular/core';
import { UserFacingProgram } from '../shared';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/toArray';

@Injectable()
export class BrowseService {

  categories = ['adult', 'health', 'tax', 'savings', 'disabled', 'all'];

  private mockPrograms: UserFacingProgram[] = [
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

  getCategories(): Observable<Array<string>> {
    return Observable.of(this.categories);
  }

  getPrograms(category: string): Observable<Array<UserFacingProgram>> {
    if (category === 'all') {
      return Observable.of(this.mockPrograms);
    }

    return Observable.from(this.mockPrograms)
      .filter( (program: UserFacingProgram) => program.tags.indexOf(category) > -1)
      .toArray();
  }
}
