import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { UserFacingProgram } from '../../../shared';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { BrowseService } from '../browse.service';
import { Animations } from '../../../shared/animations';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styles: [`
    section {
      width: 100vw;
      margin: 0 auto;
    }

    loading-section {
      background: transparent;
    }

    md-progress-spinner {
      margin: 10% auto 0 auto;
    }

    .program-animation-container {
      will-change: opacity;
    }
    
    app-user-facing-program {
      margin-bottom: 0.5em;
    }

    app-user-facing-program:first-child {
      margin-top: 0.5em;
    }
  `],
  animations: [
    Animations.fadeinAndOut
  ]
})
export class CategoryComponent implements OnInit{
  programs: UserFacingProgram[] = [];
  filteredPrograms: UserFacingProgram[] = [];
  subscription: Subscription;
  loading = false;
  fade;
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
          this.fade = 'out';
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
    this.fade = 'in';
  }

  loadPrograms(programs: UserFacingProgram[]): Promise<any> {
    this.programs = [...programs];
    this.filterByCategory(this.route.snapshot.params['category']);
    this.loading = false;
    clearTimeout(this.timeout);
    return Promise.resolve();
  }

  handleFadeDone($event) {
    if ($event.fromState === 'void' && $event.toState === 'null')
      this.fade = 'in';
    else if($event.fromState === 'in' && $event.toState === 'out')
      this.filterByCategory(this.route.snapshot.params['category']);
  }
}
