import { ROUTER_DIRECTIVES } from '@angular/router';
import { 
  Component, OnInit, 
  OnDestroy, ChangeDetectionStrategy, 
  Input 
} from '@angular/core'
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { MD_TOOLBAR_DIRECTIVES } from '@angular2-material/toolbar';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon/icon';


//TODO: merge DummyComponent into NavbarComponent

@Component({
  selector: 'ycb-dummy-navbar',
  template:`
  <div [ngSwitch] = "width.width" [style.height]="'5%'">
    <md-toolbar *ngSwitchCase="'LARGE'" [style.padding-top] = "'1%'" [style.background]="'lightyellow'" [style.color]="'yellow'">
      <span class="small-space"></span>
      <a [routerLink]="['']">
        <button md-button>HOME</button>
      </a>
      <a [routerLink]="['/404']">
        <button md-button>ABOUT</button>
      </a>
      <span class="tiny-space" ></span>
      <md-input class="space" placeholder="Search" align="middle">
        <span md-prefix>
          <md-icon svgIcon="search"></md-icon>
        </span>
      </md-input>
      <span class="tiny-space"></span>
      <a [routerLink]="['/master-screener-editor']">
        <button md-icon-button>
          <md-icon svgIcon="login"></md-icon>
        </button>
      </a>
      <span class="small-space"></span>
    </md-toolbar>
    
    <md-toolbar *ngSwitchDefault [style.background]="'lightyellow'">
      <!-- first row -->
      <span class="space"></span>
      <a [routerLink]="['']">
        <button md-button>HOME</button>
      </a>
      <span class="space"></span>
       <a [routerLink]="['/404']">
        <button md-button>ABOUT</button>
       </a>
      <span class="space"></span>
            
      <md-toolbar-row>
        <md-input class="space" placeholder="Search" align="middle">
          <span md-prefix>
            <md-icon svgIcon="search"></md-icon>
          </span>
        </md-input>
      </md-toolbar-row>
    </md-toolbar>
    
  </div>`,
  directives: 
    [
      MD_TOOLBAR_DIRECTIVES, 
      MD_BUTTON_DIRECTIVES, 
      MD_INPUT_DIRECTIVES, 
      MdIcon, ROUTER_DIRECTIVES
    ],
 viewProviders: [MdIconRegistry],
 styles: [`
  .space { flex: 2 1 auto;}
  .small-space { flex: 1 1 auto;}
  .tiny-space { flex: 0.5 1 auto;}
  button{
    color: black;
  }
 `],
 changeDetection: ChangeDetectionStrategy.OnPush
})
export class DummyComponent{
  @Input() width
  
  constructor( mdIconRegistry: MdIconRegistry){
    mdIconRegistry
    .addSvgIcon('search', '../../icons/ic_search_black_24px.svg')
    .addSvgIcon('login', '../../icons/ic_person_black_48px.svg')
  }
}


@Component({
  selector: 'ycb-navbar',
  template:`<ycb-dummy-navbar [width]="mediaWidth | async"></ycb-dummy-navbar>`,
  directives: [ DummyComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
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
