import { Component } from '@angular/core';
import { MasterScreenerComponent } from './master-screener';
@Component({
  selector: 'my-app',
  template: `
    <div>
      <master-screener></master-screener>
    </div>
  `,
  directives: [MasterScreenerComponent],
  styles: ['app/app.component.css']
})
export class AppComponent {
  constructor() {
  }
}
