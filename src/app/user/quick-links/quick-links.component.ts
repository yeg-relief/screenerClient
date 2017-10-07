import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdSidenav } from "@angular/material";
import { Observable} from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith'

@Component({
    selector: 'app-quick-links',
    templateUrl: './quick-links.component.html',
    styleUrls: ['./quick-links.component.css']
})
export class QuickLinksComponent implements OnInit, AfterViewInit {

    @ViewChild('sidenav') public myNav: MdSidenav;

    smallView: Observable<boolean>;

    protected fragments = {
        'documentation' : [
            {
                subtitle: 'Social Insurance Number',
                title: 'Social Insurance Number (SIN)',
                fragment: 'social-insurance-number',
                content: `
                <p>The Social Insurance Number (SIN) is a nine-digit number that you need to work in Canada
                    or to have access to government programs and benefits.To register for a SIN or 
                    to replace a missing SIN letter please visit 
                    <a target="_blank" href="https://www.canada.ca/en/employment-social-development/services/sin">
                        here
                    </a> 
                    or call 1-800-206-7218
                </p>`
            },
            {
                subtitle: 'Notice of Assessment',
                title: 'Notice of Assessment',
                fragment: 'notice-of-assessment',
                content: `
                <p>The Notice of Assessment is proof of your income from your last tax return. Many benefits 
                  ask for this to verify that you are eligible.To get a copy of your Notice of Assessment, 
                  contact the Canada Revenue Agency at 1-800-959-8281 or visit their 
                  <a target="_blank" href="https://www.cra-arc.gc.ca"> website </a> 
                </p>`
            },
            {
                subtitle: 'Alberta Health Insurance Card',
                title: 'Alberta Health Insurance Card',
                fragment: 'alberta-health-insurance-card',
                content: `
                <p>The Alberta Health Card allows almost all Albertans to access medical services like hospitals and doctors. 
                To replace a lost Health Card call 780-427-1432 or visit an Alberta Registry Office.
                To register for a Health Card call 780-427-1432 or visit 
                <a target="_blank" href="http://www.health.alberta.ca/AHCIP/register-for-AHCIP.html">
                    http://www.health.alberta.ca/AHCIP/register-for-AHCIP.html
                </a>
                </p>`
            },
            {
                subtitle: 'Birth Certificate',
                title: 'Birth Certificate',
                fragment: 'birth-certificate',
                content: `
                <p>To get a copy of your birth certificate, contact Service Alberta at 780-427-7013 or by visiting 
                <a target="_blank" href="https://www.servicealberta.ca/birth-certificates.cfm" target="_blank">
                  here
                </a>
                </p>`
            },
            {
                subtitle: 'Immigration Documents',
                title: 'Immigration Documents',
                fragment: 'immigration-documents',
                content: `
                <p>An Immigration Document or a Verification of Status (VoS) is used to prove that someone has legally immigrated to Canada and is eligible for benefits.
                You can get either one of these documents by calling 1-888-242-2100 or visiting 
                 <a target="_blank" href="http://www.cic.gc.ca/english/information/applications/certcopy.asp" target="_blank">
                  here
                 </a>
                </p>`
            },
            {
                subtitle: 'Direct Deposit Information',
                title: 'Direct Deposit Information',
                fragment: 'direct-deposit-information',
                content: `
                <p>You can get it from your bank. You need 3 numbers your Transit ID, Your Bank ID, and your Account Number
                </p>`
            }
        ],
        'supports': [
            {
                subtitle: 'Alberta Works',
                title: 'Alberta Works',
                fragment: 'alberta-works',
                content: `
                <p>For people who are of working age (18-65) and do not have a permanent disability you 
                can apply through Alberta Works for the Expected to Work, Barriers to Employment/Medical, 
                or Learners programs. Visit the Alberta Works 
                <a href= "http://www.humanservices.alberta.ca/financial-support/689"> website</a>
                 for more information.
                </p>`
            },
            {
                subtitle: 'AISH',
                title: 'AISH',
                fragment: 'AISH',
                content: `
                <p>For people who are of working age (18-65) with a permanent disability you can apply for 
                Assured Income for the Severely Handicapped (AISH). 
                Visit the AISH <a href="https://www.alberta.ca/aish.aspx"> website </a> 
                </p>`
            },
            {
                subtitle: '2-1-1',
                title: '2-1-1',
                fragment: '211',
                content: `
                <p> TODO: Luc provide text
                `
            },
            {
                subtitle: 'LinkYEG',
                title: 'LinkYEG',
                fragment: 'LinkYEG',
                content: `
                <p> TODO: Luc provide text
                `
            },
            {
                subtitle: 'Federal Benefits',
                title: 'Federal Benefits',
                fragment: 'federal-benefits',
                content: `
                <p> TODO: Luc provide text
                `
            },
            {
                subtitle: 'Provincial Benefits',
                title: 'Provincial Benefits',
                fragment: 'provincial-benefits',
                content: `
                <p> TODO: Luc provide text
                `
            }
        ]
    };

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        const match = () => !(window.matchMedia("(min-width: 750px)").matches);

        this.smallView = Observable.fromEvent(window, 'resize')
            .map(match)
            .startWith(match());

    }

    ngAfterViewInit() {
        this.route.fragment.subscribe(f => {
            const element = document.querySelector("#" + f);
            if (element) {
                element.scrollIntoView(true);
            } else {
                console.log(`can't find element: ${f}`);
            }

            if (this.myNav && this.myNav.opened) {
                this.myNav.close();
            }

        })
    }
}
