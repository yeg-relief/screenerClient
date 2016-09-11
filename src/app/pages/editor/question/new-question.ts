import { Component, OnInit } from '@angular/core';

import { GenYcbQuestion } from '../../../components/question';
import { MainQuestion } from '../../../components/editor/main-question';
import { CollapsableQuestion } from '../../../components/editor/collapsable-question';
import { MsPreviewTab } from '../../../components/editor/ms-preview-tab';
import { MD_TABS_DIRECTIVES } from '@angular2-material/tabs';

import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  template: `
    <div class="flex flex-column" style="width:80vw;">
      <md-tab-group>
        <md-tab>
          <template md-tab-label>Preview Question</template>
          <template md-tab-content>
            <section style="width:65%; margin-left:10%; margin-top:5%; height:95vh; margin-right:5vw; overflow: hidden;">
              <ms-preview-tab [question]="(question$ | async)"></ms-preview-tab>
            </section>
          </template>
        </md-tab>
        <md-tab>
          <template md-tab-label>Main Question</template>
          <template md-tab-content>
            <section style="width:100%; padding-bottom:10vh; height:95vh; overflow: hidden;">
              <main-question 
                [question]="(question$ | async)"
                [keys]="(keys$ | async)">
              </main-question>
            </section>
          </template>
        </md-tab>
        <md-tab>
          <template md-tab-label>Collapsable Section</template>
          <template md-tab-content>
            <section style="width:100%; padding-bottom:10vh; height:95vh; overflow: hidden;">
              <collapsable-question 
                [question]="(question$ | async)"
                [expandableQuestion]="(expandableQuestion$ | async)"
                [keys]="(keys$ | async)">
              </collapsable-question>
            </section>
          </template>
        </md-tab>
      </md-tab-group>
    </div>
  `,
  directives: [MD_TABS_DIRECTIVES, GenYcbQuestion, MainQuestion, CollapsableQuestion, MsPreviewTab]
})
export class NewQuestion implements OnInit{
  question$: any
  expandableQuestion$: any
  keys$: any;
  constructor(private store: Store<AppState>){}
  
  ngOnInit(){
    this.question$ = this.store.select('masterScreenerEdit')
                     .map( (msEdit:any) => msEdit.editQuestion)
                     
    this.expandableQuestion$ = this.store.select('masterScreenerEdit')
                               .map( (msEdit:any) => msEdit.expandableQuestion)
                               
    this.keys$ = this.store.select('keys')
                 .map( (keys:any) => keys.keys)
  }
}




