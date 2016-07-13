import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Question } from '../models/index';
import { MsControls } from './master-screener-controls';

import { MD_RADIO_DIRECTIVES } from '@angular2-material/radio';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MD_CHECKBOX_DIRECTIVES } from '@angular2-material/checkbox'; 

@Component({
  selector: 'ycb-question',
  template: `
    <div [ngSwitch] = "question.controlType">
      <div *ngSwitchCase="'textbox'">
        <div style="margin-left: 10%; margin-right: 10%" class="flex">
          <md-input class="flex-grow" [(ngModel)]="question.value" placeholder="{{question.label}}"></md-input>
        </div>
      </div>
      <div *ngSwitchCase="'radio'">
        <p> Not implemented as of yet </p>
      </div>
      <div *ngSwitchDefault>
        <p> unrecognized control type found: <strong>{{question.controlType}}</strong></p>
      </div>
    </div>
  `,
  directives: [MD_INPUT_DIRECTIVES, MD_RADIO_DIRECTIVES]
})
class YcbQuestion{
  @Input() question: Question;  
}

@Component({
  selector: 'exp-ycb-question',
  template: `
    <div [ngSwitch] = "question.controlType">
      <div *ngSwitchCase="'checkbox'">
        <md-checkbox [(ngModel)]="question.value">
          {{question.label}}
        </md-checkbox>
      </div>
      <span *ngSwitchDefault>
        Expected controlType === 'checkbox'... found {{question.controlType}}
      </span>
    </div>
    
    <div *ngIf="question.expandable && question.value === true">
      <div class="flex" style="height: 5vh; width:100%">
        <span class="flex-grow"></span>
      </div>
      <div *ngFor="let expandableQuestion of question.expandable">
        <ycb-question [question]="expandableQuestion"></ycb-question>
      </div>
    </div>
  `,
  styles: [``],
  directives: [MD_CHECKBOX_DIRECTIVES, YcbQuestion]
})
class ExpandableYcbQuestion{
  @Input() question: Question;
}

@Component({
  selector: 'gen-ycb-question',
  template:`
    <md-card> 
      <md-card-content> 
          <div *ngIf="question.expandable.length === 0">
            <ycb-question [question]="question"></ycb-question>
          </div>
          <div *ngIf="question.expandable.length > 0">
            <exp-ycb-question [question]="question"></exp-ycb-question>
          </div>
      </md-card-content>
      <ms-controls></ms-controls> 
    </md-card>
  `,
  styles: [``], 
  directives: [MD_CARD_DIRECTIVES, ExpandableYcbQuestion, MsControls, YcbQuestion]
})
export class GenYcbQuestion{
  @Input() question: Question;
}