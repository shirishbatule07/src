import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { CurrencyService } from '@app/modules/master/services';
import { Subscription, Subject, of } from 'rxjs';
import { finalize } from 'rxjs/internal/operators/finalize';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, tap, debounceTime, switchMap } from 'rxjs/operators';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-currency-list',
  templateUrl: './currency-list.component.html'
})
export class CurrencyListComponent implements OnInit, OnDestroy {
  selectedCurrency: any = null;
  storeSubscription: Subscription;
  displayText: any;
  currencyList: any = [];
  selectedView: string = 'grid';
  currencyListPagination: any;
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
    private currencyService: CurrencyService,
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
      this.getCurrencies(params.searchTerm, this.pageNumber, this.pageSize);
    });
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
    this.paramsSubscriber.unsubscribe();
    this.searchTerm$.unsubscribe();
  }

  private getCurrencies(searchTerm: string = '', pageNumber: number = 1, pageSize: number = 20): any {
    this.isLoading = true;
    this.currencyService
      .getCurrencies({
        searchTerm: searchTerm,
        pageNumber: pageNumber,
        pageSize: pageSize,
        active: this.active
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((data: any) => {
        this.currencyList = data.currencies;
        this.currencyListPagination = data.pagination;
        this.totalRecords = this.currencyListPagination ? this.currencyListPagination.totalRows : 0;
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
    this.router.navigate(['/master/currency/add'], {
      replaceUrl: true,
      queryParams: { returnUrl: this.router.url }
    });
  }

  handleSearchInput(searchTerm: string) {
    this.searchTerm$.observers.length > 0 && this.searchTerm$.next(searchTerm);
  }

  handleCurrencyClick(currencyId: number) {
    this.router.navigate([`master/currency/edit/${currencyId}`], {
      replaceUrl: true,
      queryParams: { returnUrl: this.router.url }
    });
  }

  handleCardAction(currency: any) {
    this.selectedCurrency = currency;
  }

  handleArchive() {
    if (this.selectedCurrency) {
      this.notificationService.confirmArchive().then(({ value }) => {
        if (value) {
          this.isLoading = true;
          this.selectedCurrency.active = false;
          this.currencyService
            .saveCurrency(this.selectedCurrency, true)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe((result: any) => {
              if (result) {
                this.notificationService.success(
                  this.displayText.success,
                  this.displayText.currencyArchived
                );
                this.refreshList();
              }
            });
        }
      });
    }
  }

  handleDelete() {
    if (this.selectedCurrency) {
      this.notificationService.confirmDelete().then(({ value }) => {
        if (value) {
          this.isLoading = true;
          this.currencyService
            .deleteCurrency(this.selectedCurrency.id)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe((result: any) => {
              if (result) {
                this.notificationService.success(
                  this.displayText.success,
                  this.displayText.currencyDeleted
                );
                this.refreshList();
              }
            });
        }
      });
    }
  }

  refreshList() {
    this.getCurrencies(this.searchTerm, this.pageNumber, this.pageSize);
  }
  toggleSelectAll() {
    const allSelected = this.isAllSelected;
    this.currencyList.map(item => {
      item.selected = !allSelected;
    })
  }

  get isAllSelected() {
    return !this.currencyList.find(currency => { return !currency.selected });
  }

  get getSelectedCurrencyIds() {
    return this.currencyList.filter(currency => { return currency.selected }).map(({ id }) => id);
  }

  get isListContainsSelectedItem() {
    return this.currencyList.find(currency => { return currency.selected });
  }

  changeStatusOfSelectedIds(status: Boolean) {
    if (this.isListContainsSelectedItem) {
      const confirmText = status ? this.displayText.confirmActiveText : this.displayText.confirmArchiveText;
      const confirmButtonText = status ? this.displayText.yesActiveIt : this.displayText.yesArchiveIt;
      this.notificationService.confirm(this.displayText.areYouSure, confirmText, confirmButtonText).then(({ value }) => {
        if (value) {
          this.isLoading = true;
          this.currencyService
            .updateStatusByIds(this.getSelectedCurrencyIds, status)
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

  deleteSelectedCurrencies() {
    if (this.isListContainsSelectedItem) {
      this.notificationService.confirmDelete().then(({ value }) => {
        if (value) {
          this.isLoading = true;
          this.currencyService
            .deleteCurrencies(this.getSelectedCurrencyIds)
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
