import { Component, OnInit } from '@angular/core';
import { MasterScreenerService } from './master-screener.service';
@Component({
  template: `
    <router-outlet>
      <div id="parent">
      
      </div>
    </router-outlet>
    
  `,
  providers: [MasterScreenerService]
})
export class MasterScreenerComponent{ 
  constructor(private masterScreenerService: MasterScreenerService) {}
}
