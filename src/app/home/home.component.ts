import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'app/home/home.component.html',
  styleUrls: ['app/home/home.component.css'],
  directives: [ROUTER_DIRECTIVES]
})
export class HomeComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

}
