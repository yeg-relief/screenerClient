import { Component, Input, OnChanges } from '@angular/core';
import { PageMetaData } from '../helpers';
import { PageService } from '../services';

@Component({
  selector: 'app-program-list-paginator',
  templateUrl: './program-list-paginator.component.html',
  styleUrls: ['./program-list-paginator.component.css']
})
export class ProgramListPaginatorComponent implements OnChanges {
  @Input() metaData: PageMetaData;
  nextPage = undefined;
  previousPage = undefined;
  pages = {
    nextPage: {
      disabled: false,
    },
    previousPage: {
      disabled: false,
    }
  };

  constructor(private pageService: PageService) { }

  ngOnChanges(changes) {
    this.addjustDisplay();
  }

  addjustDisplay() {
    this.updateNextPage();
    this.updatePreviousPage();
  }

  private updateNextPage(){
    if (this.metaData.currentPage + 1 <= this.metaData.totalPages - 1) {
      this.nextPage = this.metaData.currentPage + 1;
      this.pages.nextPage.disabled = false;
    } else {
      this.nextPage = undefined;
      this.pages.nextPage.disabled = true;
    }
  }

  private updatePreviousPage(){
    if (this.metaData.currentPage === 0) {
      this.previousPage = undefined;
      this.pages.previousPage.disabled = true;
    } else {
      this.previousPage = this.metaData.currentPage - 1;
      this.pages.previousPage.disabled = false;
    }
  }

  pageChange(type: string) {
    switch (type) {
      case 'next': {
        if (!this.pages.nextPage.disabled)
          this.pageService.nextPage();
        break;
      }

      case 'previous': {
        if (!this.pages.previousPage.disabled)
          this.pageService.previousPage();
        break;
      }

      default: {
        console.warn(`ProgramListPaginator#pageChange: unkown pageChange type: ${type}`)
      }
    }
  }
}
