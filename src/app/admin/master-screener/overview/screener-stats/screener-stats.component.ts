import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-screener-stats',
  templateUrl: './screener-stats.component.html',
  styleUrls: ['./screener-stats.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScreenerStatsComponent {
  @Input() questionCount: number;
  @Input() creationDate: number;
  @Input() versionNumber: number;
  @Input() error: string;

  newCreationDate() {
    return (new Date).getTime();
  }
}
