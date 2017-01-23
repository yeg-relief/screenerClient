import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter} from '@angular/core';


@Component({
  selector: 'app-screener-toolbar',
  templateUrl: './screener-toolbar.component.html',
  styleUrls: ['./screener-toolbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScreenerToolbarComponent{
  @Input() created;
  @Input() count;
  @Output() filter = new EventEmitter<string>();
}
