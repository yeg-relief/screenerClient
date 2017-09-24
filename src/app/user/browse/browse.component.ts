import { Component, OnInit, OnDestroy } from '@angular/core';
import { BrowseService } from './browse.service';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/take';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramModalService } from '../../shared/components/program-modal.service'

@Component({
    selector: 'app-browse',
    templateUrl: './browse.component.html',
    styleUrls: ['./browse.component.css'],
    providers: [ ProgramModalService ]
})
export class BrowseComponent implements OnInit, OnDestroy {
    categories: Promise<string[]>;
    errorMsg = '';
    subscriptions: Subscription[] = [];

    currentCategory: string;

    constructor(
        private browseService: BrowseService,
        private route: ActivatedRoute,
        private router: Router,
        private modalDetailService: ProgramModalService
    ) { }

    ngOnInit() {

        this.browseService.programs$.take(1)
            .let(this.modalDetailService.setPrograms.bind(this.modalDetailService))
            .subscribe();

        this.categories = this.browseService
            .getCategories();

        this.subscriptions.push(
            this.route.firstChild.params.subscribe(params => {
                this.currentCategory = params['category'];
            })
        );

        if(this.route.snapshot.queryParams.program){
            this.router.navigate([`./${this.currentCategory}`], { relativeTo: this.route});
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => {
            if(!sub.closed){
                sub.unsubscribe();
            }
        });
    }

    selectChange($event) {
        const category = $event.target.value;
        this.currentCategory = category;
        this.router.navigate([`/browse-programs/${category}`]);
    }
}
