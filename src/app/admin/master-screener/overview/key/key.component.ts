import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { MasterScreenerDataService } from '../../master-screener-data.service';

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.css']
})
export class KeyComponent implements OnInit, OnDestroy {
  @Input() toggle: Subject<boolean>;
  toggleSub: Subscription;
  toggled = true;
  keys$: Observable<any>;

  constructor(private data: MasterScreenerDataService) { }

  ngOnInit() {
    this.toggleSub = this.toggle.subscribe(
      (event: boolean) => this.toggled = event,
      (error) => console.log(error)
    );
    this.keys$ = this.data.extractKeys();
  }

  ngOnDestroy() {
    this.toggleSub.unsubscribe();
  }

}
