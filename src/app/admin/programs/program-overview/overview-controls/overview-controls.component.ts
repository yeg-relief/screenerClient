import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-overview-controls',
  templateUrl: './overview-controls.component.html',
  styleUrls: ['./overview-controls.component.css']
})
export class OverviewControlsComponent implements OnInit, OnDestroy {
  @Input() loaded: boolean;
  @Input() deleteInitiated: boolean;
  @Output() onFilter = new EventEmitter<any>();
  private form: FormGroup;
  private subscription;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      value: [''],
      type: ['', Validators.required]
    })

    this.subscription = this.form.valueChanges
      .filter( _ => this.form.valid )
      .subscribe(filter => this.onFilter.emit(filter));
  }

  ngOnDestroy() {
    if(!this.subscription.closed) this.subscription.unsubscribe();
  }

}
