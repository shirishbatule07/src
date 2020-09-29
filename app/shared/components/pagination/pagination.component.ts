import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {
  currentPage: number = 1;
  inputCurrentPage: number;
  totalPages: number;
  defaultPageNumber: number = 1;
  defaultPerPageDisplayText: string = 'Items per page:';
  numberRegex: any = /^null$|^[1-9]*$/;
  optionsList: any[];
  @Input() perPageDisplayText: string;
  @Input() pageSize: number;
  @Input() totalRecords: number;
  @Input() pageNumber: number;
  @Input() pageSizeOptions: any;
  @Output() onPaginationChange = new EventEmitter();

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pageSize || changes.totalRecords || changes.pageSizeOptions) {
      this.calculateTotalPages();
    }
  }

  ngOnInit() {
    this.optionsList = this.pageSizeOptions || [10, 20, 50, 100];
    this.perPageDisplayText = this.perPageDisplayText || this.defaultPerPageDisplayText;
    this.currentPage = this.pageNumber || this.defaultPageNumber;
    this.inputCurrentPage = this.currentPage;
    this.pageSize = this.pageSize || this.optionsList[0];
    this.totalRecords = this.totalRecords || 0;
    this.calculateTotalPages();
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    if (this.totalPages < this.currentPage) {
      this.currentPage = this.defaultPageNumber;
      this.inputCurrentPage = this.currentPage;
    }
  }

  handleNext() {
    if (this.currentPage < this.totalPages) {
      this.currentPage = this.currentPage + 1;
      this.onPaginationChange.emit(this.getPaginationObject());
    }
    this.inputCurrentPage = this.currentPage;
  }

  handlePrevious() {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1;
      this.onPaginationChange.emit(this.getPaginationObject());
    }
    this.inputCurrentPage = this.currentPage;
  }

  handlePageSizeChange() {
    this.calculateTotalPages();
    this.onPaginationChange.emit(this.getPaginationObject());
  }

  handleInputChange($event) {
    const isValid = this.numberRegex.test(this.inputCurrentPage);
    if (isValid && this.inputCurrentPage > 0 && this.inputCurrentPage <= this.totalPages) {
      this.currentPage = this.inputCurrentPage;
      this.onPaginationChange.emit(this.getPaginationObject());
    }
  }

  getPaginationObject() {
    return {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      totalPages: this.totalPages
    };
  }
}
