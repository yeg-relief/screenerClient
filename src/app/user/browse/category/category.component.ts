import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { UserFacingProgram } from '../../../shared';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { BrowseService } from '../browse.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styles: [`
    section {
      width: 100vw;
      overflow-x: hidden;
      height: 95vh;
      position: fixed;
      margin: 0 auto;
    }

    loading-section {
      background: transparent;
    }

    md-progress-spinner {
      margin: 10% auto 0 auto;
    }
  `]
})
export class CategoryComponent implements OnInit{
  programs: UserFacingProgram[] = [];
  filteredPrograms: UserFacingProgram[] = [];
  subscription: Subscription;
  loading = false;
  timeout;

  constructor(
    private route: ActivatedRoute, 
    private browseService: BrowseService) {}

  ngOnInit(){
    this.timeout = setTimeout(() => this.loading = true, 100);
    this.browseService.getAllPrograms()
      .then(programs => this.loadPrograms(programs))
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

  loadPrograms(programs: UserFacingProgram[]): Promise<any> {
    this.programs = [...programs];
    this.filterByCategory(this.route.snapshot.params['category']);
    this.loading = false;
    clearTimeout(this.timeout);
    return Promise.resolve();
  }
}
