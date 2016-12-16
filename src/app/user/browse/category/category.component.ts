import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserFacingProgram } from '../../../shared';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { BrowseService } from '../browse.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit{
  programs: UserFacingProgram[] = [];
  filteredPrograms = [];
  subscription: any;

  constructor(
    private route: ActivatedRoute, 
    private browseService: BrowseService) {}

  ngOnInit(){
    // this code could be refactored by keeping this as an observable and using 
    // a combination operator in conjuction with route param 
    this.browseService.getAllPrograms()
      .then(programs => {
        this.programs = programs.reduce( (accum, program) => {
          return accum.concat(program);
        }, [])
      })
      .catch(error => console.error(error));

    // no need to unsubscribe https://youtu.be/WWR9nxVx1ec?t=20m18s
    // and yet complete is never called.... going to unsub, but should investigate 
    // if this implies subscription is still active.
    this.subscription = this.route.params.subscribe({
        next: (params) => {
          if (params['category'] === 'all') {
            this.filteredPrograms = [].concat(this.programs)
          } else {
            this.filteredPrograms = this.programs.filter(program => program.tags.indexOf(params['category']) > -1);
          }
        }
      });
  }

  ngOnDestroy(){
    if (!this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    
  }
}
