import { Component } from '@angular/core';
import { EditorSidenav } from '../../components';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  template: `
    <div class="flex" [style.width]="'100vw'">
      <editor-sidenav
        class="flex flex-column flex-center" 
        [style.width]="'15vw'" 
        [style.padding-top]="'5vh'"
        [style.padding-bottom]="'5vh'"
        [style.background-color]="'lightblue'">
      </editor-sidenav>
      <div class="flex-grow">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [''],
  directives: [EditorSidenav, ROUTER_DIRECTIVES],
  providers: []
})
export class Editor{
  
}