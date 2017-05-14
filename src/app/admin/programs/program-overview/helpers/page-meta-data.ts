import { PAGE_SIZE } from './index';
export class PageMetaData {
  currentPage = 0;
  totalPages = 0;
  totalItems = 0;
  pageSize = 0;
  
  constructor(config: any) {
    (<any>Object).assign(this, config);
  } 
}

export function pageMetaDataFactory(items: any[], pageSize = PAGE_SIZE, currentPage = 0) {
  const fullPages = Math.floor(items.length / pageSize);
  const remainder = items.length % pageSize;
  const totalPages = fullPages + remainder;

  return new PageMetaData({
    currentPage: currentPage,
    totalPages,
    totalItems: items.length,
    pageSize
  });
}