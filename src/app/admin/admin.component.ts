import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataService } from './data.service';
import { AuthGuardService } from './core/services/auth-guard.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ ]
})
export class AdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
