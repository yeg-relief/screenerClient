import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-overview-controls',
  templateUrl: './overview-controls.component.html',
  styleUrls: ['./overview-controls.component.css']
})
export class OverviewControlsComponent implements OnInit {
  @Input() loaded: boolean;

  constructor() { }

  ngOnInit() {
  }

}
