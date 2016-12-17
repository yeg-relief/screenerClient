import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ DataService ]
})
export class AdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
