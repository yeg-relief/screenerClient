import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/toArray';
import { Program } from '../../models';

@Injectable()
export class ProgramService{
  private mockPrograms: Program[] = [
    {
      conditions: [
        {
          condition: {
            keyID: 'children',
            value: true
          },
          type: 'boolean'
        }
      ],
      title: 'Modo nullam ne nam',
      details: `Te exerci forensibus adipiscing vix. Vitae scriptorem eu per, qui aeterno persius cu. Nostrud eripuit iracundia ex eum, ex sit saperet argumentum. Dolorum propriae luptatum est ei, eu stet blandit has.`,
      link: 'https://fake.link'
    },
    {
      conditions: [
        {
          type: 'number',
          condition: {
            keyID: 'numberChildren',
            value: 3,
            qualifier: {
              greaterThan: true,
              lessThan: false,
              equal: false
            }
          }
        },
        {
          type: 'string',
          condition: {
            keyID: 'firstName',
            value: ''
          }
        }
        
      ],
      title: 'Vix laudem discere corrumpit eu',
      details: 'Duo cu quando nullam, id nam case natum dissentias. Id aliquam adversarium quo, quas latine periculis vel cu. No soleat altera vis. Mei amet molestie offendit cu, vix ea decore graece.',
      link: 'https://another.fake.link'
    },
    {
      conditions: [
        {
          type: 'boolean',
          condition: {
            keyID: 'expand',
            value: true
          }
        }
      ],
      title: 'Modo nullam ne nam',
      details: ' Cu consul senserit duo, no dicam vivendum principes sed, ne consulatu comprehensam usu. Tollit ornatus facilisis at quo, at vix fugit libris principes, te graeco molestiae vel. Vim ea alia elit melius, eu nonumy dissentiet his.',
      link: 'https://last.fake.link'
    }
  ]
  
  loadPrograms():Observable<any>{
    return <Observable<any>>Observable.from(this.mockPrograms).toArray();
  }
}