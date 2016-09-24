import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MasterScreenerDataService } from '../../master-screener-data.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-screener-stats',
  templateUrl: './screener-stats.component.html',
  styleUrls: ['./screener-stats.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScreenerStatsComponent implements OnInit {
  questionCount$: Observable<number>;
  creationDate$: Observable<string>;
  versionNumber$: Observable<number>;
  constructor(private data: MasterScreenerDataService) { }

  ngOnInit() {
    this.questionCount$ = this.data.questionCount();
    this.creationDate$ = this.data.creationDate();
    this.versionNumber$ = this.data.version();
  }

}
