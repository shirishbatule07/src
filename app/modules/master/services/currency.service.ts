import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { NotificationService } from '@app/shared/services/notification.service';
const routes = {
  getCurrencies: (c: SearchContext) =>
    `${environment.patheyamAPIUri}/v1/Currencies?SearchTerm=${c.searchTerm}&PageNumber=${c.pageNumber}&PageSize=${c.pageSize}&active=${c.active}`,
  saveCurrency: () => `${environment.patheyamAPIUri}/v1/Currencies`,
  deleteCurrency: (currencyId: number) =>
    `${environment.patheyamAPIUri}/v1/Currencies?currencyId=${currencyId}`,
  getCurrency: (currencyId: number) => `${environment.patheyamAPIUri}/v1/Currencies/${currencyId}`,
  deleteCurrencies: () => `${environment.patheyamAPIUri}/v1/Currencies/deleteByIds`,
  updateStatusByIds: (status) => `${environment.patheyamAPIUri}/v1/Currencies/updateStatusByIds/${status}`

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
export class CurrencyService {
  constructor(private httpClient: HttpClient, private notification: NotificationService) { }

  getCurrencies(context: SearchContext): Observable<any> {
    return this.httpClient.get(routes.getCurrencies(context)).pipe(
      map((body: any) => body.result),
      catchError(() => of([]))
    );
  }

  getCurrency(currencyId: number) {
    return this.httpClient.get(routes.getCurrency(currencyId)).pipe(map((body: any) => body.result));
  }

  saveCurrency(currency: any, isUpdate: boolean): Observable<any> {
    if (isUpdate) {
      return this.httpClient.put(routes.saveCurrency(), currency).pipe(
        map((body: any) => body.result),
        catchError(error => of(null))
      );
    }
    return this.httpClient.post(routes.saveCurrency(), currency).pipe(
      map((body: any) => body.result),
      catchError(error => of(null))
    );
  }

  deleteCurrency(currencyId: number): Observable<any> {
    return this.httpClient.delete(routes.deleteCurrency(currencyId)).pipe(
      map((body: any) => body.result),
      catchError(error => of(null))
    );
  }
  deleteCurrencies(ids: number[]): Observable<any> {
    return this.httpClient.post(routes.deleteCurrencies(), ids).pipe(
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
