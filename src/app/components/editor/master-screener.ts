import { Component } from '@angular/core';
import { MD_TABS_DIRECTIVES } from '@angular2-material/tabs';
import { MsNewTab } from './ms-new-tab';
import { MsPreviewTab } from './ms-preview-tab';

@Component({
  template: `
    <div class="flex flex-column" style="width:100%;">
      <md-tab-group>
        <md-tab>
          <template md-tab-label>New Question</template>
          <template md-tab-content>
            <ms-new-tab></ms-new-tab>
          </template>
        </md-tab>
        <md-tab>
          <template md-tab-label>Preview Set</template>
          <template md-tab-content>
            <ms-preview-tab></ms-preview-tab>
          </template>
        </md-tab>
      </md-tab-group>
    </div>
  `,
  directives: [MD_TABS_DIRECTIVES, MsNewTab, MsPreviewTab]
})
export class MasterScreenerEdit{
  
}