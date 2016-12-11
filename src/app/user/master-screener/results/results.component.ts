import { Component, OnInit } from '@angular/core';
import { MasterScreenerService } from '../master-screener.service';
import { Observable } from 'rxjs/Observable';
import { UserFacingProgram } from '../../../shared';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  responses$: Observable<UserFacingProgram[]>;

  constructor(private masterScreenerService: MasterScreenerService) { }

  ngOnInit() {
    //this.responses$ = this.masterScreenerService.loadResults();
  }

}
