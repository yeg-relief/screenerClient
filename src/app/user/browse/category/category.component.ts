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
  programs: UserFacingProgram[];
  filteredPrograms = [];
  subscription: any;

  constructor(
    private route: ActivatedRoute, 
    private browseService: BrowseService) {}

  ngOnInit(){
    this.programs = [];
    this.browseService.getAllPrograms().then(programs => this.programs = [].concat(programs));

    // no need to unsubscribe https://youtu.be/WWR9nxVx1ec?t=20m18s
    // and yet complete is never called.... going to unsub 
    this.subscription = this.route.params.subscribe({
        next: (params) => {
          console.log(`current category param: ${params['category']}`);
          if (params['category'] === 'all') {
            this.filteredPrograms = [].concat(this.programs)
          } else {
            this.filteredPrograms = this.programs.filter(program => program.tags.indexOf(params['category']) > -1);
          }
        },
        complete: () => console.log('category router param subscription complete')
      });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
