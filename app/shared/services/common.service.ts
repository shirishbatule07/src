import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '@env/environment';
const routes = {
  getTitles: (c: SearchContext) =>
    `${environment.patheyamAPIUri}/v1/titles?SearchTerm=${c.searchTerm}&PageNumber=${c.pageNumber}&PageSize=${c.pageSize}&Active=true`,
  getLanguages: (c: SearchContext) =>
    `${environment.patheyamAPIUri}/v1/languages?SearchTerm=${c.searchTerm}&PageNumber=${c.pageNumber}&PageSize=${c.pageSize}&Active=true`,
  getCurrencies: (c: SearchContext) =>
    `${environment.patheyamAPIUri}/v1/currencies?SearchTerm=${c.searchTerm}&PageNumber=${c.pageNumber}&PageSize=${c.pageSize}&Active=true`,
  getCities: (c: SearchContext) =>
    `${environment.patheyamAPIUri}/v1/locations/cities?SearchTerm=${c.searchTerm}&PageNumber=${c.pageNumber}&PageSize=${c.pageSize}`,
  getCountries: (c: SearchContext) =>
    `${environment.patheyamAPIUri}/v1/locations/countries?SearchTerm=${c.searchTerm}&PageNumber=${c.pageNumber}&PageSize=${c.pageSize}`,
  getStates: (c: SearchContext) =>
    `${environment.patheyamAPIUri}/v1/locations/states?SearchTerm=${c.searchTerm}&PageNumber=${c.pageNumber}&PageSize=${c.pageSize}`,
  getLocationByCityId: (id: number) => `${environment.patheyamAPIUri}/v1/locations/city/${id}`
 
};

interface SearchContext {
  searchTerm: string;
  pageNumber: number;
  pageSize: number;

}

interface PartnerSearchTypeContext extends SearchContext {
  IsCompany?: boolean;
  IsCustomer?: boolean;
  IsVendor?: boolean;
  IsEmployee?: boolean;

}
interface LocationSearchContext extends SearchContext {
  locationType: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  [x: string]: any;
  constructor(private httpClient: HttpClient) { }

  getTitles(context: SearchContext): Observable<any> {
    return this.httpClient.get(routes.getTitles(context)).pipe(
      map((body: any) => body.result),
      catchError(() => of([]))
    );
  }

  getLanguages(context: SearchContext): Observable<any> {
    return this.httpClient.get(routes.getLanguages(context)).pipe(
      map((body: any) => body.result),
      catchError(() => of([]))
    );
  }

  getCurrencies(context: SearchContext): Observable<any> {
    return this.httpClient.get(routes.getCurrencies(context)).pipe(
      map((body: any) => body.result),
      catchError(() => of([]))
    );
  }

  getCities(context: SearchContext): Observable<any> {
    return this.httpClient.get(routes.getCities(context)).pipe(
      map((body: any) => body.result),
      catchError(() => of([]))
    );
  }

  getStates(context: SearchContext): Observable<any> {
    return this.httpClient.get(routes.getStates(context)).pipe(
      map((body: any) => body.result),
      catchError(() => of([]))
    );
  }

  getCountries(context: SearchContext): Observable<any> {
    return this.httpClient.get(routes.getCountries(context)).pipe(
      map((body: any) => body.result),
      catchError(() => of([]))
    );
  }

  getLocationByCityId(cityId: number): Observable<any> {
    return this.httpClient.get(routes.getLocationByCityId(cityId)).pipe(
      map((body: any) => body.result),
      catchError(() => of([]))
    );
  }


}
