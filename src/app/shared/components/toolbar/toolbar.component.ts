import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, NavigationEnd,  } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/startWith';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations'


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
   animations: [
    trigger('fadein', [
      state('*', style({opacity: 1 })),
      transition('void => *', [
        style({opacity: 0 }),
        animate('400ms ease-out')
      ]),
    ]),
    trigger('flyin', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(-50%)'}),
        animate('300ms ease-out')
      ]),
    ]),
  ]
})
export class ToolbarComponent implements OnInit {
  routes = [
    ["home", "home"],
    ["quick-links", "links"],
    ["about", "about"],
    ["admin/screener/edit", "admin"]
  ]

  routesSmall = [
    ["home", "home"],
    ["master-screener/questions", "questionnaire"],
    ["browse-programs/all", "browse"],
    ["quick-links#documentation", "links"]

  ]
  flydown;
  selectControl = new FormControl(this.routesSmall[0][0]);
  form; 
  constructor(private router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({ 'selectControl': this.selectControl })

    const navigationStart = this.router.events.filter(e => e instanceof NavigationEnd).map( e => e['url']);
    

    this.selectControl
        .valueChanges
        .withLatestFrom(navigationStart)
        .subscribe( ([val, route]) => {
          this.router.navigateByUrl(val)

        })

    
  }
}
