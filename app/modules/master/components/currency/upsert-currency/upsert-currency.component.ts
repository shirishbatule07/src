import { OnDestroy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CurrencyService } from '@app/modules/master/services';

import { finalize } from 'rxjs/operators';
import { types } from '../../helpers/types';
import { CommonService, NotificationService } from '@app/shared/services';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-upsert-currency',
  templateUrl: './upsert-currency.component.html'
})
export class UpsertCurrencyComponent implements OnDestroy {
  displayText: any;
  private storeSubscription: Subscription;
  private routeSub: Subscription;
  cardTitle: string = '';
  currencyId: number = 0;
  isValidCurrency: boolean = true;
  currencyForm: FormGroup;
  isSubmit: boolean = false;
  isLoading = false;
  isEditMode = false;
  errorMessage: string = '';
  auditInfo: any = '';
  secondaryLanguage: any;
  slNamePlaceHolder: any = '';
  activePlaceHolder: any = '';
  currencyTypesForm: FormGroup;
  currenciesList: any = [];
  configuration: any;
  isSecondaryLanguageDirectionRTL: Boolean = false;
  currencyTypes: any = types.CurrencyTypes;

  constructor(
    private store: Store<any>,
    private router: Router,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private currencyService: CurrencyService,   
    private notificationService: NotificationService
  ) {
    this.storeSubscription = this.store.subscribe(state => {
      this.displayText = state.displayText;
      this.configuration = state.configuration;
    });
    this.errorMessage = this.displayText.currencyDoesntExists;
    const { secondaryLanguage, isSecondaryLanguageDirectionRTL, secondaryLanguagePlaceHolder } = this.configuration.app;
    this.secondaryLanguage = secondaryLanguage;
    this.isSecondaryLanguageDirectionRTL = isSecondaryLanguageDirectionRTL;
    this.slNamePlaceHolder = secondaryLanguagePlaceHolder;

    if (router.url.startsWith('/master/currency/add')) {
      this.cardTitle = this.displayText.addNewCurrency;

    } else if (router.url.startsWith('/master/currency/edit/')) {
      this.isEditMode = true;
      this.routeSub = this.activatedRoute.params.subscribe(params => {
        this.currencyId = +params['id'];
      });
      if (isNaN(this.currencyId)) {
        this.isValidCurrency = false;
      }
      this.getCurrencyToEdit();
      this.cardTitle = this.displayText.editCurrency;
    }
    if (this.isValidCurrency) {
      this.createForm();
    }
  }

  getCurrencyToEdit() {
    if (this.isValidCurrency && this.currencyId > 0) {
      this.isLoading = true;
      this.currencyService
        .getCurrency(this.currencyId)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(
          (result: any) => {
            if (result) {
              const {
                id,
                name,
                slName,
                code,
                numberOfDigits,
                currencySymbol,
                exchangeRate,
                symbolPosition,
                active,
                createdById,
                createdByName,
                createdDate,
                lastUpdatedById,
                lastUpdatedByName,
                lastUpdatedDate
              } = result;
              this.auditInfo = {
                createdById,
                createdByName,
                createdDate,
                lastUpdatedById,
                lastUpdatedByName,
                lastUpdatedDate
              };
              this.currencyForm.patchValue({
                id: id,
                name: name,
                slName: slName,
                code: code,
                numberOfDigits: numberOfDigits,
                currencySymbol: currencySymbol,
                exchangeRate: exchangeRate,
                symbolPosition:
                  this.currencyTypes && result.symbolPosition
                    ? this.currencyTypes.find((symbolPosition: any) => symbolPosition.value === result.symbolPosition)
                    : null,
                active: result.active
              });
            }
          },
          (err: any) => {
            this.isValidCurrency = false;
            this.errorMessage = err.error.errorMessage;
          }
        );
    } else {
      this.isValidCurrency = false;
    }
  }

  private createForm() {
    this.currencyForm = this.formBuilder.group({
      id: [0],
      name: ['', Validators.required],
      slName: [''],
      code: ['', Validators.required],
      numberOfDigits: [null],
      currencySymbol: [''],
      exchangeRate: [null],
      symbolPosition: [this.currencyTypes.find((symbolPosition: any) => symbolPosition.value === 3), Validators.required],
      active: ['']
    });
  }

  saveCurrency(isSaveAndAddNew: boolean) {
    this.isSubmit = true;
    if (this.currencyForm.valid) {
      const {
        name,
        slName,
        code,
        numberOfDigits,
        currencySymbol,
        exchangeRate,
        symbolPosition,
        active
      } = this.currencyForm.value;
      this.isLoading = true;
      const currency = {
        id: this.isEditMode ? this.currencyId : 0,
        name: name,
        slName: slName,
        code: code,
        numberOfDigits: numberOfDigits ? Number(numberOfDigits) : null,
        currencySymbol: currencySymbol,
        exchangeRate: exchangeRate ? Number(exchangeRate) : null,
        symbolPosition: symbolPosition.value,
        active: true
      };
      return this.currencyService
        .saveCurrency(currency, this.isEditMode)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((result: any) => {
          if (result) {
            this.showSuccessNotification();
            this.resetForm();
            if (!isSaveAndAddNew) {
              this.navigateToCurrencyList();
            }
          }
        });
    }
  }

  resetForm() {
    this.currencyForm.reset();
    this.isSubmit = false;
  }

  onDiscard(e) {
    e.preventDefault();
    this.navigateToCurrencyList();
  }

  navigateToCurrencyList() {
    const queryParams = this.activatedRoute.snapshot.queryParamMap;
    const returnUrl = queryParams.get('returnUrl');
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else {
      this.router.navigate(['/master/currency'], {
        replaceUrl: true,

        queryParams: { searchTerm: '', pageNumber: 1, pageSize: 20, view: 'grid' }
      });
    }
  }

  showSuccessNotification() {
    this.notificationService.success(
      this.displayText.success,
      this.isEditMode ? this.displayText.currencyUpdated : this.displayText.currencyAdded
    );
  }

  getCurrencies(yourContext: any, term: string) {
    return yourContext.commonService.getCurrencies({ searchTerm: term, pageNumber: 1, pageSize: 100 }).pipe(
      map((res: any) => res.currencies),
      map((currencies: any) => {
        return currencies.map((currencies: any) => ({ label: currencies.name, value: currencies.id }));
      })
    );
  }

  ngOnDestroy() {
    this.storeSubscription.unsubscribe();
    this.routeSub && this.routeSub.unsubscribe();
  }
}
