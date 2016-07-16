import { Component } from '@angular/core';
import { MD_TABS_DIRECTIVES } from '@angular2-material/tabs';
import { MsEditTab } from './ms-edit-tab';
import { MsPreviewTab } from './ms-preview-tab';

@Component({
  template: `
    <div class="flex flex-column" style="width:80%; margin-top:5vh; margin-left:10%; margin-right:10%;">
      <md-tab-group>
        <md-tab>
          <template md-tab-label>Edit</template>
          <template md-tab-content>
            <ms-edit-tab></ms-edit-tab>
          </template>
        </md-tab>
        <md-tab>
          <template md-tab-label>Preview</template>
          <template md-tab-content>
            <ms-preview-tab></ms-preview-tab>
          </template>
        </md-tab>
      </md-tab-group>
    </div>
  `,
  directives: [MD_TABS_DIRECTIVES, MsEditTab, MsPreviewTab]
})
export class MasterScreenerEdit{
  
}