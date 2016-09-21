import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-home-content',
  templateUrl: './home-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeContentComponent implements OnInit {
  constructor() { }
  ngOnInit() {}
}
