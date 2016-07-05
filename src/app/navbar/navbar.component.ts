import { ROUTER_DIRECTIVES } from '@angular/router';
import { 
  Component, OnInit, 
  OnDestroy, ChangeDetectionStrategy, 
  Input, Output, 
  EventEmitter 
} from '@angular/core'
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/distinctUntilChanged';
import { MD_TOOLBAR_DIRECTIVES } from '@angular2-material/toolbar';



@Component({
  selector: 'ycb-dummy',
  template:`
  <div [ngSwitch] = "width.width">
  
    <md-toolbar *ngSwitchCase="'LARGE'" color="primary">
      <span>First Row</span>
    </md-toolbar>
    
    <md-toolbar *ngSwitchDefault color="primary">
      <span>First Row</span>
            
      <md-toolbar-row>
        <span>Third Row</span>
      </md-toolbar-row>
    </md-toolbar>
    
  </div>`,
  directives: [MD_TOOLBAR_DIRECTIVES]
})
export class DummyComponent{
  @Input() width
}


@Component({
  selector: 'ycb-navbar',
  templateUrl:'app/navbar/navbar.component.html',
  directives: [ROUTER_DIRECTIVES, MD_TOOLBAR_DIRECTIVES, DummyComponent]
})
export class NavbarComponent implements OnInit, OnDestroy {
  public mediaWidth;
  
  constructor(public store: Store<AppState>){}
  
  ngOnInit(){
    this.mediaWidth = this.store.select('media')                   
  }
  
  ngOnDestroy(){
    this.mediaWidth.unsubscribe();
  }
}
