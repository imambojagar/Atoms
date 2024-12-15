import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CylindersReferenceService {
  BaseUrl = 'http://10.201.111.121:5000/api/'; // environment.BaseURL;
  url = 'Cylinder/';
  priceURL = this.url + 'reference/';
  searchPriceURL = this.url + 'search/reference/';
  constructor(private http: HttpClient) {}

  // Cylinders Reference
  addCylinderReference(model: any) {
    return this.http.post(this.BaseUrl + this.url, model).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  updateCylinderReference(model: any) {
    return this.http.put(this.BaseUrl + this.url, model).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getSingleCylinderReference(id: number) {
    return this.http.get(this.BaseUrl + this.url + id).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  deleteCylinderReference(id: number) {
    return this.http.delete(this.BaseUrl + this.url + id).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  searchCylinderReference(model: any) {
    return this.http.post(this.BaseUrl + this.url + 'search', model).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Cylinders Reference Price
  addCylinderPrice(model: any) {
    return this.http.post(this.BaseUrl + this.priceURL, model).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  updateCylinderPrice(model: any) {
    return this.http.put(this.BaseUrl + this.priceURL, model).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getSingleCylinderPrice(id: number) {
    return this.http.get(this.BaseUrl + this.priceURL + id).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  deleteCylinderPrice(id: number) {
    return this.http.delete(this.BaseUrl + this.priceURL + id).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  searchCylinderPrice(filter: any) {
    return this.http.post(this.BaseUrl + this.searchPriceURL, filter).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getFullyCylindersReportData(filter: any) {
    return this.http
      .post(this.BaseUrl + this.url + 'FullCylinderReport', filter)
      .pipe();
  }

  getEmptyCylindersReportData(filter: any) {
    return this.http
      .post(this.BaseUrl + this.url + 'EmptyCylinderReport', filter)
      .pipe();
  }
}
