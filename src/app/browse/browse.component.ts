import { Component, OnInit } from '@angular/core';
import { BrowseService } from './browse.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css'],
  providers: [ BrowseService ]
})
export class BrowseComponent implements OnInit {
  categories$: Observable<string[]>;
  constructor(
    private browseService: BrowseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.categories$ = this.browseService.getCategories();
    console.log('here 1');
  }

  // called 12 times per render on my home machine :((
  // this feels like a hack...
  currCategory(): string {
    const category = this.extractCategoryFromRoute();
    if ( category !== false) {
      return <string>category;
    }
    return 'undefined';
  }

  selectChange($event) {
    const category = $event.target.value;
    this.router.navigate([`/browse-programs/category/${category}`]);
  }

  extractCategoryFromRoute(): string | boolean {
    let category = null;
    // i'm scared
    if ( this.router.routerState.snapshot.url ) {
      category = this.router.routerState.snapshot.url.split('/')[3];
    }
    if (category) {
      return category;
    }
    return false;
  }
}
