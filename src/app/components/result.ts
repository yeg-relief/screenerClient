import { Component, Input } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';

@Component({
  selector: 'ycb-result',
  template: `
    <md-card>
      <md-card-title>{{result.title}}</md-card-title> 
      <md-card-content>
        <p>{{result.details}}</p>
        <a href="{{result.link}}" target="_blank">link</a>
      </md-card-content>
    </md-card>
  `,
  styles: [],
  directives: [MD_CARD_DIRECTIVES]
})
export class ResultComponent{
  @Input() result: any;
}