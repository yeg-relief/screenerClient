import { Component } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';

@Component({
  selector: 'editor-sidenav',
  template: `
    <div class="flex flex-column flex-center" 
      [style.background-color]="'lightblue'" 
      [style.width]="'15%'" 
      [style.height]="'90vh'"
      [style.padding-top]="'5%'"
      [style.padding-bottom]="'5%'">
      <md-card [style.width]="'50%'">
        <md-card-subtitle>MasterScreener</md-card-subtitle>
      </md-card>
      <span class="spacer"></span>
      <md-card [style.width]="'50%'">
        <md-card-subtitle>Programs</md-card-subtitle>
      </md-card>
      <span class="spacer"></span>
      <md-card [style.width]="'50%'">
        <md-card-subtitle>keys</md-card-subtitle>
      </md-card>
    </div>
  `,
  styles: [`
    .spacer{
      height:5%;
    }
  `],
  directives: [MD_CARD_DIRECTIVES]
})
export class EditorSidenav{
  
}