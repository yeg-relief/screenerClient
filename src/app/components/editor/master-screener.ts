import { Component } from '@angular/core';
import { MD_TABS_DIRECTIVES } from '@angular2-material/tabs';
import { MsNewTab } from './ms-new-tab';
import { MsPreviewTab } from './ms-preview-tab';

@Component({
  template: `
    <div class="flex flex-column" style="width:100%;">
      <h3> NOT IMPLEMENTED </h3>
    </div>
  `,
  directives: [MD_TABS_DIRECTIVES, MsNewTab, MsPreviewTab]
})
export class MasterScreenerEdit{
  
}