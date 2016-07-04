import { ROUTER_DIRECTIVES } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core'
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ycb-navbar',
  templateUrl:'app/navbar/navbar.component.html',
  directives: [ROUTER_DIRECTIVES],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit{
  private subscription: Subscription;
  private mediaWidth;

  constructor(public store: Store<AppState>){}
  
  ngOnInit(){
    this.subscription = this.store.
                        select('media').
                        subscribe( (mediaState: {width: string}) => {
                          this.mediaWidth = mediaState.width;
                        });                        
  }
}
