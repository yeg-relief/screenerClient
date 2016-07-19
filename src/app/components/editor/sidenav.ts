import { Component } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'editor-sidenav',
  template: `

      <md-card [style.width]="'50%'">
        <md-card-subtitle>
           <a [routerLink]="['/editor/master-screener']">
            Master Screener
          </a>
        </md-card-subtitle>
      </md-card>
      <span class="spacer"></span>
      <md-card [style.width]="'50%'">
        <md-card-subtitle>
           <a [routerLink]="['/editor/new-question']">
            New Question
          </a>
        </md-card-subtitle>
      </md-card>
      <span class="spacer"></span>
      <md-card [style.width]="'50%'">
        <md-card-subtitle>
          <a [routerLink]="['/editor/programs']">
            Programs
          </a>
        </md-card-subtitle>
      </md-card>
      <span class="spacer"></span>
      <md-card [style.width]="'50%'">
        <md-card-subtitle>
          <a [routerLink]="['/editor/keys']">
            Keys
          </a>
        </md-card-subtitle>
      </md-card>
  `,
  styles: [`
    .spacer{
      height:5%;
    }
  `],
  directives: [MD_CARD_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class EditorSidenav{}