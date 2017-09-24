import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, NavigationEnd,  } from '@angular/router';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/do';

import {
    trigger,
    state,
    style,
    animate,
    transition,
} from '@angular/animations'


@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('fadein', [
            state('*', style({opacity: 1 })),
            transition('void => *', [
                style({opacity: 0 }),
                animate('400ms ease-out')
            ]),
        ]),
        trigger('flyin', [
            state('in', style({transform: 'translateX(0)'})),
            transition('void => *', [
                style({transform: 'translateX(-50%)'}),
                animate('450ms ease-out')
            ]),
        ]),
    ]
})
export class ToolbarComponent implements OnInit {
    routes = [];

    userRoutes = [
        ["home", "home"],
        ["quick-links", "links"],
        ["about", "about"],
        ["admin/screener/edit", "admin/screener"]
    ];



    adminRoutes = [
        ["admin/programs/overview", "admin/programs"],
        ["admin/keys/overview", "admin/keys"]
    ];

    routesSmall = [
        ["home", "home"],
        ["master-screener/questions", "questionnaire"],
        ["browse-programs/all", "browse"],
        ["quick-links#documentation", "links"],
        ["about", "about"]
    ];

    selectControl = new FormControl(this.routesSmall[0][0]);
    form;
    constructor(private router: Router) {}

    ngOnInit() {
        this.form = new FormGroup({ 'selectControl': this.selectControl });
        this.routes = [...this.userRoutes];

        const navigationStart = this.router.events.filter(e => e instanceof NavigationEnd).map( e => e['url']);


        const hasAdminRoutes = () => {
            const urls = this.routes.map(routeTuple => routeTuple[0]);

            return urls.includes("admin/screener/edit") &&
                urls.includes("admin/programs/overview") &&
                urls.includes("admin/keys/overview");
        };

        navigationStart
            .do(url => {
                const urlTuple = this.routesSmall.find( thing => url.substring(1) === thing[0]);
                if (urlTuple) {
                    this.selectControl.setValue(urlTuple[0]);
                }
            })
            .map(url => url.split('/').indexOf('admin') > -1)
            .subscribe(val => {
                if (val && !hasAdminRoutes()) {
                    this.routes = [...this.userRoutes, ...this.adminRoutes];
                } else if (!val && hasAdminRoutes()) {
                    this.routes = this.userRoutes
                }
            });

        this.selectControl
            .valueChanges
            .withLatestFrom(navigationStart)
            .subscribe( ([val, route]) => {
                this.router.navigateByUrl(val);
            })


    }
}
