import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { NotificationService } from '@app/shared/services/notification.service';
const routes = {
  getCompanies: (c: SearchContext) =>
    `${environment.patheyamAPIUri}/v1/Companies?SearchTerm=${c.searchTerm}&PageNumber=${c.pageNumber}&PageSize=${c.pageSize}&active=${c.active}`,
  saveCompany: () => `${environment.patheyamAPIUri}/v1/companies`,
  deleteCompany: (companyId: number) =>
    `${environment.patheyamAPIUri}/v1/Companies?companyId=${companyId}`,
  getCompany: (companyId: number) => `${environment.patheyamAPIUri}/v1/Companies/${companyId}`,
  deleteCompanies: () => `${environment.patheyamAPIUri}/v1/Companies/deleteByIds`,
  updateStatusByIds: (status) => `${environment.patheyamAPIUri}/v1/Companies/updateStatusByIds/${status}`

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
export class CompanyService {
  constructor(private httpClient: HttpClient, private notification: NotificationService) { }

  getCompanies(context: SearchContext): Observable<any> {
    return this.httpClient.get(routes.getCompanies(context)).pipe(
      map((body: any) => body.result),
      catchError(() => of([]))
    );
  }

  getCompany(companyId: number) {
    return this.httpClient.get(routes.getCompany(companyId)).pipe(map((body: any) => body.result));
  }

  saveCompany(company: any, isUpdate: boolean): Observable<any> {
    if (isUpdate) {
      return this.httpClient.put(routes.saveCompany(), company).pipe(
        map((body: any) => body.result),
        catchError(error => of(null))
      );
    }
    return this.httpClient.post(routes.saveCompany(), company).pipe(
      map((body: any) => body.result),
      catchError(error => of(null))
    );
  }

  deleteCompany(companyId: number): Observable<any> {
    return this.httpClient.delete(routes.deleteCompany(companyId)).pipe(
      map((body: any) => body.result),
      catchError(error => of(null))
    );
  }
  deleteCompanies(ids: number[]): Observable<any> {
    return this.httpClient.post(routes.deleteCompanies(), ids).pipe(
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
