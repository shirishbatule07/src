import { OnDestroy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CompanyService } from '@app/modules/master/services';

import { finalize } from 'rxjs/operators';
import { types } from '../../helpers/types';
import { CommonService, NotificationService } from '@app/shared/services';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-upsert-company',
  templateUrl: './upsert-company.component.html'
})
export class UpsertCompanyComponent implements OnDestroy {
  displayText: any;
  private storeSubscription: Subscription;
  private routeSub: Subscription;
  cardTitle: string = '';
  companyId: number = 0;
  isValidCompany: boolean = true;
  companyForm: FormGroup;
  isSubmit: boolean = false;
  isLoading = false;
  isEditMode = false;
  errorMessage: string = '';
  auditInfo: any = '';
  secondaryLanguage: any;
  slNamePlaceHolder: any = '';
  activePlaceHolder: any = '';
  companyTypesForm: FormGroup;
  companiesList: any = [];
  configuration: any;
  isSecondaryLanguageDirectionRTL: Boolean = false;
  companyTypes: any = [];//types.CompanyTypes;
  companyLogo: string | ArrayBuffer;
  invalidIconFile: string;
  modeOfPayment: any[] =types.ModeOfPayment

  constructor(
    private store: Store<any>,
    private router: Router,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,   
    private notificationService: NotificationService
  ) {
    this.storeSubscription = this.store.subscribe(state => {
      this.displayText = state.displayText;
      this.configuration = state.configuration;
    });
    this.errorMessage = this.displayText.companyDoesntExists;
    const { secondaryLanguage, isSecondaryLanguageDirectionRTL, secondaryLanguagePlaceHolder } = this.configuration.app;
    this.secondaryLanguage = secondaryLanguage;
    this.isSecondaryLanguageDirectionRTL = isSecondaryLanguageDirectionRTL;
    this.slNamePlaceHolder = secondaryLanguagePlaceHolder;

    if (router.url.startsWith('/master/company/add')) {
      this.cardTitle = this.displayText.addNewCompany;

    } else if (router.url.startsWith('/master/company/edit/')) {
      this.isEditMode = true;
      this.routeSub = this.activatedRoute.params.subscribe(params => {
        this.companyId = +params['id'];
      });
      if (isNaN(this.companyId)) {
        this.isValidCompany = false;
      }
      this.getCompanyToEdit();
      this.cardTitle = this.displayText.editCompany;
    }
    if (this.isValidCompany) {
      this.createForm();
    }
  }

  getCompanyToEdit() {
    if (this.isValidCompany && this.companyId > 0) {
      this.isLoading = true;
      this.companyService
        .getCompany(this.companyId)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(
          (result: any) => {
            if (result) {
              const {
                id,
                companyName,
                contactNumber,
                email,
                alternatenumber,
                address,
                GST,
                city,
                pincode,
                companyLogo,
                coDetailInfo,
                operationatimeworkingday,
                yearofestablish,
                modeofpayment,
                wesiteurl,
                googlemap,              
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
              this.companyForm.patchValue({
                id: id,
                companyName:companyName,
                contactNumber: contactNumber,
                email: email,
                alternateNumber: alternatenumber,
                address:address,
                GST: GST,
                city:city,
                pincode:pincode,
                companyLogo: companyLogo,
                coDetailInfo:coDetailInfo,
                operationatimeworkingday:operationatimeworkingday,
                yearofestablish:yearofestablish,
                modeofpayment:this.modeOfPayment.find(x=>x.value === parseInt(modeofpayment)),
                wesiteurl:wesiteurl,
                googlemap:googlemap
               
              });
            }
          },
          (err: any) => {
            this.isValidCompany = false;
            this.errorMessage = err.error.errorMessage;
          }
        );
    } else {
      this.isValidCompany = false;
    }
  }

  private createForm() {
    this.companyForm = this.formBuilder.group({
      id: [0],
      companyName: ['', Validators.required],
      contactNumber: [null],
      email: ['', Validators.required],
      alternateNumber: [null],
      address: [''],
      GST: [null],
      city:['',Validators.required],
      pincode: ['', Validators.required],
      companyLogo: [null],
      coDetailInfo:[''],
      operationatimeworkingday:[null],
      yearofestablish:[''],
      modeofpayment:[this.modeOfPayment.find((modeOfPayment: any) => modeOfPayment.value === 1)],
      wesiteurl:[''],
      googlemap:['']
    });
  }

  saveCompany(isSaveAndAddNew: boolean) {
    this.isSubmit = true;
    if (this.companyForm.valid) {
      const {
        id,
        companyName,
        contactNumber,
        email,
        alternateNumber,
        address,
        GST,
        city,
        pincode,
        companyLogo,
        coDetailInfo,
        operationatimeworkingday,
        yearofestablish,
        modeofpayment,
        wesiteurl,
        googlemap, 
      } = this.companyForm.value;
      this.isLoading = true;
      const company = {
        id: this.isEditMode ? this.companyId : 0,       
        companyName:companyName,
        contactNumber: contactNumber.toString(),
        email: email,
        alternateNumber: alternateNumber.toString(),
        address:address,
        GST: GST,
        city:city,
        pincode:pincode,
        companyLogo: companyLogo,
        coDetailInfo:coDetailInfo,
        operationatimeworkingday:operationatimeworkingday,
        yearofestablish:yearofestablish,
        modeofpayment:modeofpayment.value.toString(),
        wesiteurl:wesiteurl,
        googlemap:googlemap
      };
      return this.companyService
        .saveCompany(company, this.isEditMode)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((result: any) => {
          if (result) {
            this.showSuccessNotification();
            this.resetForm();
            if (!isSaveAndAddNew) {
              this.navigateToCompanyList();
            }
          }
        });
    }
  }

  resetForm() {
    this.companyForm.reset();
    this.isSubmit = false;
  }

  onDiscard(e) {
    e.preventDefault();
    this.navigateToCompanyList();
  }

  navigateToCompanyList() {
    const queryParams = this.activatedRoute.snapshot.queryParamMap;
    const returnUrl = queryParams.get('returnUrl');
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else {
      this.router.navigate(['/master/company'], {
        replaceUrl: true,

        queryParams: { searchTerm: '', pageNumber: 1, pageSize: 20, view: 'grid' }
      });
    }
  }

  showSuccessNotification() {
    this.notificationService.success(
      this.displayText.success,
      this.isEditMode ? this.displayText.company+' '+this.displayText.updated : this.displayText.company+' '+this.displayText.added
    );
  }

  getCompanies(yourContext: any, term: string) {
    return yourContext.commonService.getCompanies({ searchTerm: term, pageNumber: 1, pageSize: 100 }).pipe(
      map((res: any) => res.companies),
      map((companies: any) => {
        return companies.map((companies: any) => ({ label: companies.name, value: companies.id }));
      })
    );
  }

  ngOnDestroy() {
    this.storeSubscription.unsubscribe();
    this.routeSub && this.routeSub.unsubscribe();
  }


  clearImg() {
    this.companyForm.value.companyLogo = null;
  }
  onFileChange(files: FileList) {
    const maxFileSize = 500000; //500kb
    const validFileTypes = ['image/png', 'image/jpeg'];
    const file = files[0];
    const reader = new FileReader();
    if (file) {
      const isValidFileFormat = validFileTypes.includes(file.type);
      this.invalidIconFile = '';
      const isValidSize = file.size <= maxFileSize;
      if (!isValidSize) {
        this.invalidIconFile = this.displayText.maximumUploadText + ' 500kb';
        this.notificationService.error(this.displayText.error, this.invalidIconFile);
      }
      if (!isValidFileFormat) {
        this.invalidIconFile = this.displayText.invalidFile;
        this.notificationService.error(this.displayText.error, this.invalidIconFile);
      }

      reader.onload = e => {
        this.companyLogo = this.invalidIconFile.length ? '' : reader.result;
      };

      reader.readAsDataURL(file);

      this.companyForm.patchValue({
        companyLogo: this.invalidIconFile.length ? null : file
      });
      this.companyForm.markAsDirty();
    }
  }


}
