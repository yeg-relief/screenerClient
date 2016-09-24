import { Injectable } from '@angular/core';
import { Question } from '../../shared';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/count';

@Injectable()
export class MasterScreenerDataService {
  private mockScreener: Question[] = [
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

  private mockMetaData = {
    creationDate: '10-26-2016',
    versionNumber: 8
  };

  private mockScreener$: Observable<Question> = Observable.from(this.mockScreener);
  private mockMetaData$: Observable<any> = Observable.of(this.mockMetaData);

  constructor() { }

  private flattenMockScreener(): Observable<Question> {
    return this.mockScreener$.switchMap((question: Question) => {
      if (!question.expandable) {
        return Observable.of(question);
      }
      const questions: Question[] = [];
      questions.push(question);
      question.conditonalQuestions.forEach((conditionalQuestion: Question) => {
        questions.push(conditionalQuestion);
      });
      return Observable.from(questions);
    });
  }

  questionCount(): Observable<number> {
    return this.flattenMockScreener().count();
  }

  creationDate(): Observable<string> {
    return this.mockMetaData$.map(data => data.creationDate);
  }

  version(): Observable<number> {
    return this.mockMetaData$.map(data => data.versionNumber);
  }

  extractKeys(): Observable<any> {
    return this.flattenMockScreener().switchMap((question: Question) => {
      return Observable.of({
        name: question.key,
        type: question.type
      });
    })
      .toArray();
  }

  questions(): Observable<Question[]> {
    return this.flattenMockScreener().toArray();
  }
}
