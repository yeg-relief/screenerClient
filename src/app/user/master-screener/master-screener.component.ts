import { Component, OnInit } from '@angular/core';
import { MasterScreenerService } from './master-screener.service';
@Component({
  selector: `app-master-screener`,
  template: 
  `
    <router-outlet></router-outlet>
  `,
  providers: [ MasterScreenerService]
})
export class MasterScreenerComponent{ 
  constructor(private masterScreenerService: MasterScreenerService) {}
}
