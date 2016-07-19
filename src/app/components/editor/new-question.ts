import { Component, OnInit } from '@angular/core';

import { GenYcbQuestion } from '../question';
import { MainQuestion } from './main-question';
import { CollapsableQuestion } from './collapsable-question';
import { MD_TABS_DIRECTIVES } from '@angular2-material/tabs';

import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  template: `
    <div class="flex flex-column" style="width:100%;">
      <md-tab-group>
        <md-tab>
          <template md-tab-label>Preview Question</template>
          <template md-tab-content>
            <section style="width:85%; height:90vh; margin-left:10%; margin-top:5%;">
              <gen-ycb-question [question]="(question$ | async)" [controls]="false"></gen-ycb-question>
            </section>
          </template>
        </md-tab>
        <md-tab>
          <template md-tab-label>Main Question</template>
          <template md-tab-content>
            <section style="width:85%; height:90vh;">
              <main-question [question]="(question$ | async)"></main-question>
            </section>
          </template>
        </md-tab>
        <md-tab>
          <template md-tab-label>Collapsable Section</template>
          <template md-tab-content>
            <section style="width:85%; height:90vh;">
              <collapsable-question 
                [question]="(question$ | async)"
                [expandableQuestion]="(expandableQuestion$ | async)">
              </collapsable-question>
            </section>
          </template>
        </md-tab>
      </md-tab-group>
    </div>
  `,
  directives: [MD_TABS_DIRECTIVES, GenYcbQuestion, MainQuestion, CollapsableQuestion]
})
export class NewQuestion implements OnInit{
  question$: any
  expandableQuestion$: any
  
  constructor(private store: Store<AppState>){}
  
  ngOnInit(){
    this.question$ = this.store.select('masterScreenerEdit')
                     .map( (msEdit:any) => msEdit.editQuestion)
                     
    this.expandableQuestion$ = this.store.select('masterScreenerEdit')
                               .map( (msEdit:any) => msEdit.expandableQuestion)
  }
}




