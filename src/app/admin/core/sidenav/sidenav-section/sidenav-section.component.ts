import { Component, OnInit, Input } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

interface AdminSection {
  heading: string;
  subsections: string[];
}

@Component({
  selector: 'app-sidenav-section',
  templateUrl: './sidenav-section.component.html',
  styleUrls: ['./sidenav-section.component.css'],
  providers: [LocationService]
})
export class SidenavSectionComponent implements OnInit {
  @Input() section: AdminSection;
  isRoot$: Observable<boolean>;
  url$: Observable<string[]>;
  root$: Observable<string>;
  param$: Observable<string>;
  expand$: BehaviorSubject<boolean>;
  expanded: boolean;
  constructor(private locationService: LocationService) { }

  ngOnInit() {
    this.url$ = this.locationService.getUrl();
    this.root$ = this.url$.map(url => url[0]);
    this.param$ = this.url$.map(url => url[1]);
    this.isRoot$ = this.root$.map( (root: string) => root === this.section.heading );

    const sub = this.isRoot$.subscribe(result => {
      this.expand$ = new BehaviorSubject(result);
      this.expanded = result;
    });
    sub.unsubscribe();
  }

  toggleExpansion() {
    this.expanded = !this.expanded;
    this.expand$.next(this.expanded);
  }
}
