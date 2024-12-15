import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RecurrentTaskService {
  baseUrl: string = 'http://10.201.111.121:5000/api/'; // environment.BaseURL;
  url: string = 'RecurrentTask/';
  constructor(private http: HttpClient) {}

  addRecurrentTask(task: any) {
    return this.http.post(this.baseUrl + this.url, task).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  editRecurrentTask(task: any) {
    return this.http.put(this.baseUrl + this.url, task).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  getRecurrentTaskId(id: number) {
    return this.http.get(this.baseUrl + this.url + id).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  searchRecurrentTasks(tasks: any) {
    return this.http.post(this.baseUrl + this.url + 'search/', tasks).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  deleteRecurrentTasks(task: any) {
    return this.http.delete(this.baseUrl + this.url + +task).pipe(
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

  searchSites(q: any) {
    return this.http.get<any>(
      this.baseUrl + 'Customer/GetCustomersAutoComplete?searchText=' + q
    );
  }

  getLastNumber() {
    return this.http.get(this.baseUrl + this.url + 'last-number');
  }
}
