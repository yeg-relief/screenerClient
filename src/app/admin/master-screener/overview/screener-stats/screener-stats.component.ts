import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-screener-stats',
  templateUrl: './screener-stats.component.html',
  styleUrls: ['./screener-stats.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScreenerStatsComponent implements OnInit {
  @Input() questionCount: number;
  @Input() creationDate: string;
  @Input() versionNumber: number;
  @Input() error: string;
  constructor() { }

  ngOnInit() {
  }

}
