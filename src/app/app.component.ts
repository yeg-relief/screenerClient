import { Component } from '@angular/core';
import { MasterScreenerComponent } from './master-screener';
@Component({
  selector: 'my-app',
  template: `
    <div>
      <master-screener></master-screener>
    </div>
  `,
  directives: [MasterScreenerComponent]
})
export class AppComponent {
  constructor() {
  }
}
