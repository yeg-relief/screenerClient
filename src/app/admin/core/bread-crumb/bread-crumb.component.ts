import { Component, OnInit } from '@angular/core';
import { LocationService } from './location.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css'],
  providers: [LocationService]
})
export class BreadCrumbComponent implements OnInit {
  url$: Observable<string[]>;
  root$: Observable<string>;
  param$: Observable<string>;
  constructor(private locationService: LocationService) { }

  ngOnInit() {
    this.url$ = this.locationService.getUrl();
    this.root$ = this.url$.map(url => url[0]);
    this.param$ = this.url$.map(url => url[1]);
  }

}
