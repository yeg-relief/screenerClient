import { Component, OnInit } from '@angular/core';
import { MasterScreenerService } from './master-screener.service';
@Component({
  selector: `app-master-screener`,
  template: 
  `
  <div id="parent">
    <router-outlet></router-outlet>
  </div>`,
  providers: [ MasterScreenerService]
})
export class MasterScreenerComponent{ 
  constructor(private masterScreenerService: MasterScreenerService) {}
}
