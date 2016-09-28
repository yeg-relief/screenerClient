import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BrowseService } from '../browse.service';
import { Observable } from 'rxjs/Observable';
import { UserFacingProgram } from '../../../shared';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  programs$: Observable<UserFacingProgram[]>;
  constructor(
    private route: ActivatedRoute,
    private browseService: BrowseService
  ) {}

  ngOnInit() {
    this.programs$ = this.route.params
                     .switchMap( (param: any) => Observable.of(param.category))
                     .switchMap( (category: string) => this.browseService.getPrograms(category));
  }

}
