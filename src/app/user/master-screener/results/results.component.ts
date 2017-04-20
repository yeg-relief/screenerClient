import { Component, OnInit } from '@angular/core';
import { UserFacingProgramComponent } from '../../../shared/components/program/user-facing-program/user-facing-program.component';
import { MasterScreenerService } from '../master-screener.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  errorMessage = '';
  results = [];

  constructor(private masterScreenerService: MasterScreenerService) { }

  ngOnInit() {
    if (this.masterScreenerService.results !== undefined &&  Array.isArray(this.masterScreenerService.results))
      this.results = [...this.masterScreenerService.results];
    else 
      this.errorMessage = 'error loading results, try again later.'; 
  }
}
