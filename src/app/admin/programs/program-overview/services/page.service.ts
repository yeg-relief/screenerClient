import { Injectable } from '@angular/core';
import { PageMetaData } from '../helpers'
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class PageService {
  valueChanges: ReplaySubject<PageMetaData>;
  private _value: PageMetaData;
  

  constructor() { 
    this.valueChanges = new ReplaySubject<PageMetaData>(1);
    this.valueChanges.subscribe(val => this._value = {...val})
  }

  setState(config: PageMetaData) {
    this._value = config;
    const totalPages = this.calcTotalPages();
    config.totalPages = totalPages;
    this.valueChanges.next(config);
  }

  nextPage(){
    if (this._value.currentPage < this._value.totalPages - 1 && this._value.currentPage >= 0) {
      this.valueChanges.next(new PageMetaData({
        currentPage: this._value.currentPage + 1,
        totalPages: this._value.totalPages,
        totalItems: this._value.totalItems,
        pageSize: this._value.pageSize,
      }))
    }
  }

  previousPage(){
    if (this._value.currentPage > 0) {
      this.valueChanges.next(new PageMetaData({
        currentPage: this._value.currentPage - 1,
        totalPages: this._value.totalPages,
        totalItems: this._value.totalItems,
        pageSize: this._value.pageSize,
      }))
    }
  }

  private caclOnPage(currentPage: number): number {
    const itemsSeen = currentPage * this._value.pageSize;
    if (this._value.totalItems - itemsSeen < this._value.pageSize) {
      return this._value.totalItems - itemsSeen;
    }

    return this._value.pageSize;
  }

  private calcTotalPages(): number {
    const floor = Math.floor(this._value.totalItems / this._value.pageSize);
    const rem = this._value.totalItems % this._value.pageSize;

    if (floor > 0) {
      return floor + rem;
    }
    return rem;
  }

}
