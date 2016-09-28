import { Component, OnInit } from '@angular/core';
import { MasterScreenerService } from './master-screener.service';

@Component({
  template: '<router-outlet></router-outlet>',
  providers: [ MasterScreenerService ]
})
export class MasterScreenerComponent implements OnInit {

  constructor(private masterScreenerService: MasterScreenerService) { }

  ngOnInit() {}
}
