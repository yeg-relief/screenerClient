import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  loading = false;
  timeout;

  constructor(private router: Router){}

  ngOnInit(){
    const questionsUrl = '/master-screener/questions';
    const adminUrl = '/admin/master-screener/overview';

    this.router.events
      .subscribe(
        event => {
          if(event instanceof NavigationStart && (event.url === questionsUrl || event.url === adminUrl) ) {
            this.timeout = setTimeout(() => this.loading = true, 100)
            this.loading = true;
          }
        }
      );
  }

  ngOnDestroy(){
    clearTimeout(this.timeout);
  }
}
