import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/delay';
import { Program } from '../../models';

@Injectable()
export class ProgramService{
  private mockPrograms: Program[] = [
    {
      conditions: [
        {
          concreteCondition: {
            keyID: 'children',
            value: true
          },
          type: 'boolean'
        }
      ],
      details: {
        title: 'Modo nullam ne nam',
        description: `Te exerci forensibus adipiscing vix. Vitae scriptorem eu per, qui aeterno persius cu. Nostrud eripuit iracundia ex eum, ex sit saperet argumentum. Dolorum propriae luptatum est ei, eu stet blandit has.`,
        link: 'https://fake.link'
      }
    },
    {
      conditions: [
        {
          type: 'number',
          concreteCondition: {
            keyID: 'numberChildren',
            value: 3,
            qualifier: 'lessThan'
          }
        },
        {
          type: 'string',
          concreteCondition: {
            keyID: 'firstName',
            value: ''
          }
        }
        
      ],
      details: {
        title: 'Vix laudem discere corrumpit eu',
        description: 'Duo cu quando nullam, id nam case natum dissentias. Id aliquam adversarium quo, quas latine periculis vel cu. No soleat altera vis. Mei amet molestie offendit cu, vix ea decore graece.',
        link: 'https://another.fake.link'
      }
      
    },
    {
      conditions: [
        {
          type: 'boolean',
          concreteCondition: {
            keyID: 'expand',
            value: true
          }
        }
      ],
      details: {
        title: 'Modo nullam ne nam',
        description: ' Cu consul senserit duo, no dicam vivendum principes sed, ne consulatu comprehensam usu. Tollit ornatus facilisis at quo, at vix fugit libris principes, te graeco molestiae vel. Vim ea alia elit melius, eu nonumy dissentiet his.',
        link: 'https://last.fake.link'
      }
      
    }
  ]

  
  loadPrograms():Observable<Program[]>{
    return <Observable<Program[]>>Observable.from(this.mockPrograms).toArray();
  }
  
  uploadProgram(program, time):Observable<Program[]>{
    this.mockPrograms.push(program);
    return <Observable<Program[]>>Observable.from(this.mockPrograms).toArray().delay(time);
  }
}

