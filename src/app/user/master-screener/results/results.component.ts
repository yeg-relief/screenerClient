import { Component, OnInit } from '@angular/core';
import { UserFacingProgram } from '../../../shared';
import { MasterScreenerService } from '../master-screener.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  errorMessage = '';
  results = [];
  timeout;
  loading = false;
  constructor(private masterScreenerService: MasterScreenerService) { }

  ngOnInit() {
    if (this.masterScreenerService.results !== undefined &&  Array.isArray(this.masterScreenerService.results)){
      this.results = [].concat(this.masterScreenerService.results);
      console.log(this.results);
    } else {
      this.errorMessage = 'error loading results, try again later.';
    }
  }
}
