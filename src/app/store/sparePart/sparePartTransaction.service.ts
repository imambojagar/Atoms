import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
/* import { environment } from 'src/environments/environment'; */
import { Observable } from 'rxjs';
import { SparePartTransactionModel } from './transaction-model';

@Injectable({
  providedIn: 'root',
})
export class sparePartTransaction {
  baseUrl: string = 'http://10.201.111.121:5000/api/'; //environment.BaseURL;
  url: string = 'SparePartTransaction/';
  constructor(private http: HttpClient) {}

  addTransaction(data: any) {
    return this.http
      .post<SparePartTransactionModel>(this.baseUrl + this.url, data)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getTransactions(params: any) {
    return this.http
      .get<SparePartTransactionModel[]>(this.baseUrl + this.url, params)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getTransaction(id: number) {
    return this.http
      .get<SparePartTransactionModel>(this.baseUrl + this.url + id)
      .pipe(
        map((res: any) => {
          console.log('get res:', res);
          return res;
        })
      );
  }

  search(data: any) {
    /* debugger; */
    console.log("filter to api",data)
    return this.http.post<any>(this.baseUrl + this.url + 'search', data).pipe(
      map((res: any) => {
        console.log("search res",res)
        return res;

      })
    );
  }

  filterQuantities(data: any) {
    console.log("filter to api",data)
    return this.http.post<any>(this.baseUrl + this.url + 'filterQuantities', data).pipe(
      map((res: any) => {
        console.log("search res",res)
        return res;

      })
    );
  }

  update(data: any) {
    return this.http
      .put<SparePartTransactionModel>(this.baseUrl + this.url, data)
      .pipe(
        map((res: any) => {
          console.log('update res:', res);
          return res;
        })
      );
  }

  delete(id: number) {
    return this.http
      .delete<SparePartTransactionModel>(this.baseUrl + this.url + id)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getLookups(data: any) {
    return this.http
      .get<any>(
        this.baseUrl + 'Lookups/GetLookup?lookupEnum=' + data.queryParams
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
}
