import { Component } from '@angular/core';
import { EditorSidenav } from '../../components';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  template: `
    <div class="flex">
      <editor-sidenav
      class="flex flex-column flex-center" 
      [style.width]="'15%'" 
      [style.height]="'80vh'"
      [style.padding-top]="'5%'"
      [style.padding-bottom]="'5%'"
      [style.background-color]="'lightblue'">
      </editor-sidenav>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [''],
  directives: [EditorSidenav, ROUTER_DIRECTIVES],
  providers: []
})
export class Editor{
  
}