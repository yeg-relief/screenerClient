import { Component } from '@angular/core';
import { EditorSidenav } from '../../components';

@Component({
  selector: 'ycb-ms-editor',
  template: `
    <editor-sidenav></editor-sidenav>
  `,
  styles: [''],
  directives: [EditorSidenav],
  providers: []
})
export class MasterScreenerEditor{
  
}