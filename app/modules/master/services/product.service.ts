import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { NotificationService } from '@app/shared/services/notification.service';
const routes = {
  getProducts: (c: SearchContext) =>
    `${environment.patheyamAPIUri}/v1/Products?SearchTerm=${c.searchTerm}&PageNumber=${c.pageNumber}&PageSize=${c.pageSize}&active=${c.active}`,
  saveProduct: () => `${environment.patheyamAPIUri}/v1/products`,
  deleteProduct: (productId: number) =>
    `${environment.patheyamAPIUri}/v1/Products?productId=${productId}`,
  getProduct: (productId: number) => `${environment.patheyamAPIUri}/v1/Products/${productId}`,
  deleteProducts: () => `${environment.patheyamAPIUri}/v1/Products/deleteByIds`,
  updateStatusByIds: (status) => `${environment.patheyamAPIUri}/v1/Products/updateStatusByIds/${status}`

};

interface SearchContext {
  searchTerm: string;
  pageNumber: number;
  pageSize: number;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private httpClient: HttpClient, private notification: NotificationService) { }

  getProducts(context: SearchContext): Observable<any> {
    return this.httpClient.get(routes.getProducts(context)).pipe(
      map((body: any) => body.result),
      catchError(() => of([]))
    );
  }

  getProduct(productId: number) {
    return this.httpClient.get(routes.getProduct(productId)).pipe(map((body: any) => body.result));
  }

  saveProduct(product: any, isUpdate: boolean): Observable<any> {
    if (isUpdate) {
      return this.httpClient.put(routes.saveProduct(), product).pipe(
        map((body: any) => body.result),
        catchError(error => of(null))
      );
    }
    return this.httpClient.post(routes.saveProduct(), product).pipe(
      map((body: any) => body.result),
      catchError(error => of(null))
    );
  }

  deleteProduct(productId: number): Observable<any> {
    return this.httpClient.delete(routes.deleteProduct(productId)).pipe(
      map((body: any) => body.result),
      catchError(error => of(null))
    );
  }
  deleteProducts(ids: number[]): Observable<any> {
    return this.httpClient.post(routes.deleteProducts(), ids).pipe(
      map((body: any) => body.result),
      catchError(error => of(null))
    );
  }

  updateStatusByIds(ids: number[], status: Boolean): Observable<any> {
    return this.httpClient.post(routes.updateStatusByIds(status), ids).pipe(
      map((body: any) => body.result),
      catchError(error => of(null))
    );
  }
}
