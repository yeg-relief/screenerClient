import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserFacingProgram } from '../../../shared';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { BrowseService } from '../browse.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
})
export class CategoryComponent implements OnInit{
  programs: UserFacingProgram[] = [];
  filteredPrograms = [];
  subscription: any;

  constructor(
    private route: ActivatedRoute, 
    private browseService: BrowseService) {}

  ngOnInit(){
    this.browseService.getAllPrograms()
      .then(programs => {
        this.programs = [...programs];
        this.filterByCategory(this.route.snapshot.params['category']);
      })
      .catch(error => console.error(error));

    // no need to unsubscribe https://youtu.be/WWR9nxVx1ec?t=20m18s
    // and yet complete is never called.... going to unsub, but should investigate 
    // if this implies subscription is still active.
    this.subscription = this.route.params.subscribe({
        next: (params) => {
          this.filterByCategory(params['category'])
        }
      });
  }

  ngOnDestroy(){
    if (!this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    
  }

  filterByCategory(category: string) {
    if (category === 'all') {
      this.filteredPrograms = this.programs;
    } else {
      this.filteredPrograms = this.programs.filter(program => program.tags.indexOf(category) >= 0);
    }
  }
}
