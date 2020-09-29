import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductService } from '@app/modules/master/services';
import { Subscription, Subject, of } from 'rxjs';
import { finalize } from 'rxjs/internal/operators/finalize';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, tap, debounceTime, switchMap } from 'rxjs/operators';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit, OnDestroy {
  selectedProduct: any = null;
  storeSubscription: Subscription;
  displayText: any;
  productList: any = [];
  selectedView: string = 'grid';
  productListPagination: any;
  isLoading = false;
  totalRecords: any;
  pageSize: number = 20;
  pageNumber: number = 1;
  secondaryLanguage: any;
  searchTerm: string = '';
  searchTerm$: Subject<string> = new Subject<string>();
  paramsSubscriber: any;
  active: boolean = true;
  isMobileView = false;
  configuration: any;

  constructor(
    private store: Store<any>,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.storeSubscription = this.store.subscribe(state => {
      this.displayText = state.displayText;
      this.configuration = state.configuration;
    });
    this.isMobileView = notificationService.isPhoneFormat();
    if (this.isMobileView) {
      this.selectedView = 'grid';
      this.updateQueryParams({ view: this.selectedView });
    }
  }

  ngOnInit(): void {
    const queryParams = this.activatedRoute.snapshot.queryParamMap;
    this.pageNumber = parseInt(queryParams.get('pageNumber'));
    this.pageNumber = isNaN(this.pageNumber) ? 1 : this.pageNumber;
    this.pageSize = parseInt(queryParams.get('pageSize'));
    this.pageSize = isNaN(this.pageSize) ? 20 : this.pageSize;
    this.secondaryLanguage = this.configuration.app.secondaryLanguage;

    this.searchTerm$
      .pipe(
        distinctUntilChanged(),
        tap(term => term),
        debounceTime(500),
        switchMap((term: string) => {
          this.updateQueryParams({ searchTerm: term, pageNumber: 1 });
          return of(null);
        })
      )
      .subscribe(() => { });

    this.paramsSubscriber = this.activatedRoute.queryParams.subscribe(params => {
      this.searchTerm = params.searchTerm != undefined ? params.searchTerm : this.searchTerm;
      this.pageNumber = params.pageNumber || this.pageNumber;
      this.pageSize = params.pageSize || this.pageSize;
      this.selectedView = params.view || this.selectedView;
      this.getProducts(params.searchTerm, this.pageNumber, this.pageSize);
    });
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
    this.paramsSubscriber.unsubscribe();
    this.searchTerm$.unsubscribe();
  }

  private getProducts(searchTerm: string = '', pageNumber: number = 1, pageSize: number = 20): any {
    this.isLoading = true;
    this.productService
      .getProducts({
        searchTerm: searchTerm,
        pageNumber: pageNumber,
        pageSize: pageSize,
        active: this.active
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((data: any) => {
        this.productList = data.products;
        this.productListPagination = data.pagination;
        this.totalRecords = this.productListPagination ? this.productListPagination.totalRows : 0;
      });
  }

  paginationChange($event) {
    const obj = $event;
    this.updateQueryParams({ pageNumber: obj.pageNumber, pageSize: obj.pageSize });
  }

  updateQueryParams(obj: any) {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    const newQueryParams = { ...queryParams };
    Object.keys(obj).forEach(key => {
      newQueryParams[key] = obj[key];
    });
    this.router.navigate([], { queryParams: newQueryParams });
  }

  onGridListViewChange({ selectedView }) {
    this.updateQueryParams({ view: selectedView });
  }

  handleAddNew() {
    this.router.navigate(['/master/product/add'], {
      replaceUrl: true,
      queryParams: { returnUrl: this.router.url }
    });
  }

  handleSearchInput(searchTerm: string) {
    this.searchTerm$.observers.length > 0 && this.searchTerm$.next(searchTerm);
  }

  handleProductClick(productId: number) {
    this.router.navigate([`master/product/edit/${productId}`], {
      replaceUrl: true,
      queryParams: { returnUrl: this.router.url }
    });
  }

  handleCardAction(product: any) {
    this.selectedProduct = product;
  }

  handleArchive() {
    if (this.selectedProduct) {
      this.notificationService.confirmArchive().then(({ value }) => {
        if (value) {
          this.isLoading = true;
          this.selectedProduct.active = false;
          this.productService
            .saveProduct(this.selectedProduct, true)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe((result: any) => {
              if (result) {
                this.notificationService.success(
                  this.displayText.success,
                  this.displayText.productArchived
                );
                this.refreshList();
              }
            });
        }
      });
    }
  }

  handleDelete() {
    if (this.selectedProduct) {
      this.notificationService.confirmDelete().then(({ value }) => {
        if (value) {
          this.isLoading = true;
          this.productService
            .deleteProduct(this.selectedProduct.id)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe((result: any) => {
              if (result) {
                this.notificationService.success(
                  this.displayText.success,
                  this.displayText.productDeleted
                );
                this.refreshList();
              }
            });
        }
      });
    }
  }

  refreshList() {
    this.getProducts(this.searchTerm, this.pageNumber, this.pageSize);
  }
  toggleSelectAll() {
    const allSelected = this.isAllSelected;
    this.productList.map(item => {
      item.selected = !allSelected;
    })
  }

  get isAllSelected() {
    return !this.productList.find(product => { return !product.selected });
  }

  get getSelectedProductIds() {
    return this.productList.filter(product => { return product.selected }).map(({ id }) => id);
  }

  get isListContainsSelectedItem() {
    return this.productList.find(product => { return product.selected });
  }

  changeStatusOfSelectedIds(status: Boolean) {
    if (this.isListContainsSelectedItem) {
      const confirmText = status ? this.displayText.confirmActiveText : this.displayText.confirmArchiveText;
      const confirmButtonText = status ? this.displayText.yesActiveIt : this.displayText.yesArchiveIt;
      this.notificationService.confirm(this.displayText.areYouSure, confirmText, confirmButtonText).then(({ value }) => {
        if (value) {
          this.isLoading = true;
          this.productService
            .updateStatusByIds(this.getSelectedProductIds, status)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe((result: any) => {
              if (result) {
                this.notificationService.success(
                  this.displayText.success,
                  this.displayText.itemsUpdated
                );
                this.refreshList();
              }
            });
        }
      });
    }
  }

  deleteSelectedProducts() {
    if (this.isListContainsSelectedItem) {
      this.notificationService.confirmDelete().then(({ value }) => {
        if (value) {
          this.isLoading = true;
          this.productService
            .deleteProducts(this.getSelectedProductIds)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe((res: any) => {
              if (res) {
                const partialSuccess = res.failureIds.length > 0;
                this.notificationService.success(
                  this.displayText.success,
                  partialSuccess ? this.displayText.itemsPartiallyDeleted : this.displayText.itemsDeleted
                );
                this.refreshList();
              }
            });
        }
      });
    }
  }
}
