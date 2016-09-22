import { Component, OnInit } from '@angular/core';
import { BrowseService } from './browse.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css'],
  providers: [ BrowseService ]
})
export class BrowseComponent implements OnInit {
  categories$: Observable<string[]>;
  tests = ['tse', 'ts,', 'sss'];
  constructor(private browseService: BrowseService) { }

  ngOnInit() {
    this.categories$ = this.browseService.getCategories();
  }

}
