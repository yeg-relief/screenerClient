import { Component, ViewEncapsulation } from '@angular/core';
import { DataSharingService } from './data-sharing.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DataSharingService]
})
export class AppComponent {
  constructor(public dataSharingService: DataSharingService) {}
}
