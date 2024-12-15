import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
/* import { environment } from 'src/environments/environment'; */

@Injectable({
  providedIn: 'root',
})
export class CustomCardsService {
  constructor(private http: HttpClient) {}

  BASE_URL: string = 'http://10.201.111.121:5000/api/'; //environment.BaseURL;
  URL: string = 'CustomLabel/';

  addCustomCard(data: any) {
    return this.http
      .post(this.BASE_URL + this.URL + 'AddCustomLabel', data)
      .pipe();
  }

  getCustomCardById(id: number) {
    return this.http
      .get(this.BASE_URL + this.URL + `GetCustomLabelById?customLabelId=${id}`)
      .pipe();
  }

  filterCustomCards(filter: any) {
    return this.http
      .post(this.BASE_URL + this.URL + 'GetCustomLabels', filter)
      .pipe();
  }

 

  deleteCustomCard(id: number) {
    return this.http
      .delete(
        this.BASE_URL + this.URL + `GetCustomLabelById?customLabelId=${id}`
      )
      .pipe();
  }

  updateCustomCard(data: any) {
    return this.http
      .put(this.BASE_URL + this.URL + 'UpdateCustomLabel', data)
      .pipe();
  }
}
