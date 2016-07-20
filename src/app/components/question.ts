import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Question } from '../models/index';
import { MsControls } from './master-screener-controls';

import { MD_RADIO_DIRECTIVES } from '@angular2-material/radio';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MD_CHECKBOX_DIRECTIVES } from '@angular2-material/checkbox'; 

import {
  MdUniqueSelectionDispatcher
} from '@angular2-material/core/coordination/unique-selection-dispatcher';

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
        {{question.label}}<br>
         <md-radio-group name="more_options" [(ngModel)]="question.value">
          <div *ngFor="let option of question.options">
            <md-radio-button  name="more_options" [value]="option">
              {{option}}
            </md-radio-button>
            <br>
          </div>
         </md-radio-group>
      </div>
      <div *ngSwitchDefault style="color:red">
        <p> No Input Option Found </p>
      </div>
    </div>
  `,
  providers: [MdUniqueSelectionDispatcher],
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
      
      <div *ngFor="let expandableQuestion of question.expandable">
        <br>
        <ycb-question [question]="expandableQuestion"></ycb-question>
        <br>
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
          <div *ngIf="question.type !== 'expandable'">
            <ycb-question [question]="question"></ycb-question>
          </div>
          <div *ngIf="question.type === 'expandable'">
            <exp-ycb-question [question]="question"></exp-ycb-question>
          </div>
      </md-card-content>
      <ms-controls *ngIf="controls" [width]="width"></ms-controls> 
    </md-card>
  `,
  styles: [``], 
  directives: [MD_CARD_DIRECTIVES, ExpandableYcbQuestion, MsControls, YcbQuestion]
})
export class GenYcbQuestion{
  @Input() question: Question;
  @Input() width: any;
  @Input() controls: boolean;
}