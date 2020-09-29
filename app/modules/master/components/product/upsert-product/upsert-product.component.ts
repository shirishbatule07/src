import { OnDestroy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProductService } from '@app/modules/master/services';

import { finalize } from 'rxjs/operators';
import { types } from '../../helpers/types';
import { CommonService, NotificationService } from '@app/shared/services';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-upsert-product',
  templateUrl: './upsert-product.component.html'
})
export class UpsertProductComponent implements OnDestroy {
  displayText: any;
  private storeSubscription: Subscription;
  private routeSub: Subscription;
  cardTitle: string = '';
  productId: number = 0;
  isValidProduct: boolean = true;
  productForm: FormGroup;
  isSubmit: boolean = false;
  isLoading = false;
  isEditMode = false;
  errorMessage: string = '';
  auditInfo: any = '';
  secondaryLanguage: any;
  slNamePlaceHolder: any = '';
  activePlaceHolder: any = '';
  productTypesForm: FormGroup;
  productsList: any = [];
  configuration: any;
  isSecondaryLanguageDirectionRTL: Boolean = false;
  productTypes: any = [];//types.ProductTypes;
  productLogo: string | ArrayBuffer;
  invalidIconFile: string;
  modeOfPayment: any[] =types.ModeOfPayment

  constructor(
    private store: Store<any>,
    private router: Router,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,   
    private notificationService: NotificationService
  ) {
    this.storeSubscription = this.store.subscribe(state => {
      this.displayText = state.displayText;
      this.configuration = state.configuration;
    });
    this.errorMessage = this.displayText.productDoesntExists;
    const { secondaryLanguage, isSecondaryLanguageDirectionRTL, secondaryLanguagePlaceHolder } = this.configuration.app;
    this.secondaryLanguage = secondaryLanguage;
    this.isSecondaryLanguageDirectionRTL = isSecondaryLanguageDirectionRTL;
    this.slNamePlaceHolder = secondaryLanguagePlaceHolder;

    if (router.url.startsWith('/master/product/add')) {
      this.cardTitle = this.displayText.addNewProduct;

    } else if (router.url.startsWith('/master/product/edit/')) {
      this.isEditMode = true;
      this.routeSub = this.activatedRoute.params.subscribe(params => {
        this.productId = +params['id'];
      });
      if (isNaN(this.productId)) {
        this.isValidProduct = false;
      }
      this.getProductToEdit();
      this.cardTitle = this.displayText.editProduct;
    }
    if (this.isValidProduct) {
      this.createForm();
    }
  }

  getProductToEdit() {
    if (this.isValidProduct && this.productId > 0) {
      this.isLoading = true;
      this.productService
        .getProduct(this.productId)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(
          (result: any) => {
            if (result) {
              const {
                ProductId,
                ProductName,
                Price,
                Techname,
                SoldBy,
                Searchname,
                PrimeImage,
                additionalImagesPrimeImageescription,
                Description,
                Specifications,
                YrofLaunch,
                AvgCustReview,
                ProductURL,
                reviewCount ,             
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
              this.productForm.patchValue({
                id: ProductId,
                productName:ProductName,
                price: Price,
                technicalName: Techname,
                soldBy: SoldBy,
                searchKeywords:Searchname,
                primeImage: PrimeImage,
                additionalImagesDescription:additionalImagesPrimeImageescription,
                productDescription:Description,
                productSpecifications: Specifications,
                yearOfLaunch:YrofLaunch,
                avgCustomerReview:AvgCustReview,
                productURL:ProductURL,
                reviewCount:reviewCount  
              });
            }
          },
          (err: any) => {
            this.isValidProduct = false;
            this.errorMessage = err.error.errorMessage;
          }
        );
    } else {
      this.isValidProduct = false;
    }
  }

  private createForm() {
    this.productForm = this.formBuilder.group({
      id: [0],
      productName: ['', Validators.required],
      price: [0, Validators.required],
      technicalName: ['', Validators.required],
      soldBy: [null],
      searchKeywords: [''],
      primeImage: [null],
      additionalImagesDescription:[''],
      productDescription: [''],
      productSpecifications: [null],
      yearOfLaunch:[''],
      avgCustomerReview:[null],
      productURL:[''],
      reviewCount:['']
    });
  }

  saveProduct(isSaveAndAddNew: boolean) {
    this.isSubmit = true;
    if (this.productForm.valid) {
      const {
        id,
        productName,
        price,
        technicalName,
        soldBy,
        searchKeywords,
        primeImage,
        additionalImagesDescription,
        productDescription,
        productSpecifications,
        yearOfLaunch,
        avgCustomerReview,
        productURL,
        reviewCount 
      } = this.productForm.value;
      this.isLoading = true;
      const product = {
        id: this.isEditMode ? this.productId : 0,       
        productName:productName,
        price: price,
        Techname: technicalName,
        soldBy: soldBy,
        Searchname:searchKeywords,
        PrimeImage: primeImage,
        additionalImagesDescription:additionalImagesDescription,
        Description:productDescription,
        Specifications: productSpecifications,
        YrofLaunch:yearOfLaunch,
        AvgCustReview:avgCustomerReview,
        productURL:productURL,
        reviewCount:reviewCount  
      };
      return this.productService
        .saveProduct(product, this.isEditMode)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((result: any) => {
          if (result) {
            this.showSuccessNotification();
            this.resetForm();
            if (!isSaveAndAddNew) {
              this.navigateToProductList();
            }
          }
        });
    }
  }

  resetForm() {
    this.productForm.reset();
    this.isSubmit = false;
  }

  onDiscard(e) {
    e.preventDefault();
    this.navigateToProductList();
  }

  navigateToProductList() {
    const queryParams = this.activatedRoute.snapshot.queryParamMap;
    const returnUrl = queryParams.get('returnUrl');
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else {
      this.router.navigate(['/master/product'], {
        replaceUrl: true,

        queryParams: { searchTerm: '', pageNumber: 1, pageSize: 20, view: 'grid' }
      });
    }
  }

  showSuccessNotification() {
    this.notificationService.success(
      this.displayText.success,
      this.isEditMode ? this.displayText.product+' '+this.displayText.updated : this.displayText.product+' '+this.displayText.added
    );
  }

  getProducts(yourContext: any, term: string) {
    return yourContext.commonService.getProducts({ searchTerm: term, pageNumber: 1, pageSize: 100 }).pipe(
      map((res: any) => res.products),
      map((products: any) => {
        return products.map((products: any) => ({ label: products.name, value: products.id }));
      })
    );
  }

  ngOnDestroy() {
    this.storeSubscription.unsubscribe();
    this.routeSub && this.routeSub.unsubscribe();
  }


  clearImg() {
    this.productForm.value.productLogo = null;
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
        this.productLogo = this.invalidIconFile.length ? '' : reader.result;
      };

      reader.readAsDataURL(file);

      this.productForm.patchValue({
        productLogo: this.invalidIconFile.length ? null : file
      });
      this.productForm.markAsDirty();
    }
  }


}
