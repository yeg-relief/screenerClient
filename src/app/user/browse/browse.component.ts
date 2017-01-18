import { Component, OnInit, OnDestroy } from '@angular/core';
import { BrowseService } from './browse.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/multicast';
import { ActivatedRoute, Router } from '@angular/router';
import { UserFacingProgram } from '../../shared/models'

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css'],
})
export class BrowseComponent implements OnInit, OnDestroy {
  categories: Promise<string[]>;
  errorMsg = '';
  subscription: Subscription;
  currentCategory: string;

  constructor(
    private browseService: BrowseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.categories = this.browseService
      .getCategories()
      .catch(error => this.errorMsg = error);

    this.subscription = this.route.firstChild.params.subscribe(params => {
      this.currentCategory = params['category'];
    });
  }

  ngOnDestroy() {
    if(!this.subscription.closed){
      this.subscription.unsubscribe();
    }
  }

  selectChange($event) {
    const category = $event.target.value;
    this.router.navigate([`/browse-programs/${category}`]);
  }
}
