import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DemoReqService {
  baseUrl = environment.BaseURL;
  url = 'DemoRequest/';
  assessUrl = 'asset/';
  evaluationUrl = 'evaluation/';
  GatePassUrl = 'gatpass/';
  constructor(private http: HttpClient) { }

  addDemoReq(model: any) {
    return this.http.post(this.baseUrl + this.url, model).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  updateDemoReq(model: any) {
    return this.http.put(this.baseUrl + this.url, model).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getSingelDemoReq(id: number) {
    return this.http.get(this.baseUrl + this.url + id).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  searchDemoReq(filter: any) {
    return this.http.post(this.baseUrl + this.url + 'search', filter).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  deleteDemoReq(id: number) {
    return this.http.delete(this.baseUrl + this.url + id).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  updateMultipleDemos(model: any) {
    return this.http.put(this.baseUrl + this.url + 'multiple', model).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  /* Demo Assessment APIs */
  addDemoAssess(model: any) {
    return this.http.post(this.baseUrl + this.url + this.assessUrl, model).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  updateDemoAssess(model: any) {
    return this.http.put(this.baseUrl + this.url + this.assessUrl, model).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  getSingelDemoAssess(id: number) {
    return this.http.get(this.baseUrl + this.url + this.assessUrl + id).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  deleteDemoAssess(id: number) {
    return this.http.delete(this.baseUrl + this.url + this.assessUrl + id).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  searchDemoAssess(filter: any) {
    return this.http
      .post(this.baseUrl + this.url + this.assessUrl + 'search', filter)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getSpecificData() {
    return this.http.get(this.baseUrl + this.url + 1).pipe(
      map((res: any) => {
        let data = res.data;
        return { employeeName: data.employeeName, employeeId: data.employeeId };
      })
    );
  }

  /* End User Evaluation APIs */
  addEvaluation(model: any) {
    return this.http
      .post(this.baseUrl + this.url + this.evaluationUrl, model)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  updateEvaluation(model: any) {
    return this.http
      .put(this.baseUrl + this.url + this.evaluationUrl, model)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  getSingelEvaluation(id: number) {
    return this.http
      .get(this.baseUrl + this.url + this.evaluationUrl + id)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  deleteEvaluation(id: number) {
    return this.http
      .delete(this.baseUrl + this.url + this.evaluationUrl + id)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  searchEvaluation(filter: any) {
    return this.http
      .post(this.baseUrl + this.url + this.evaluationUrl + 'search', filter)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  /* Gate Pass APIs */
  addGatePass(model: any) {
    return this.http
      .post(this.baseUrl + this.url + this.GatePassUrl, model)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  updateGatePass(model: any) {
    return this.http
      .put(this.baseUrl + this.url + this.GatePassUrl, model)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  getSingelGatePass(id: number) {
    return this.http.get(this.baseUrl + this.url + this.GatePassUrl + id).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  deleteGatePass(id: number) {
    return this.http
      .delete(this.baseUrl + this.url + this.GatePassUrl + id)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  searchGatePass(filter: any) {
    return this.http
      .post(this.baseUrl + this.url + this.GatePassUrl + 'search', filter)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  moveStatus(data: {
    demoRequestIds: number[] | undefined;
    isApproved?: boolean;
  }) {
    return this.http.put(this.baseUrl + this.url + 'move-status', data).pipe();
  }

  getDataForApprovals(filter: {
    pageSize?: number;
    pageNumber?: number;
    demoRequestId?: number;
  }) {
    return this.http
      .post(this.baseUrl + this.url + 'get-approval', filter)
      .pipe();
  }

  getShortDemoRequestData(demoReqId: number) {
    return this.http
      .get(this.baseUrl + this.url + 'demo-site/' + demoReqId)
      .pipe();
  }

  getDemoCountBySite() {
    return this.http.get(this.baseUrl + this.url + 'GetDemoCountBySite').pipe();
  }
  getDemoCompletedAndRejectedPercentage() {
    return this.http
      .get(this.baseUrl + this.url + 'GetDemoCompletedAndRejectedPercentage')
      .pipe();
  }
  getDemoStatusCount() {
    return this.http.get(this.baseUrl + this.url + 'GetDemoStatusCount').pipe();
  }
  getDemosExceededDemoDurationCount() {
    return this.http
      .get(this.baseUrl + this.url + 'GetDemosExceededDemoDurationCount')
      .pipe();
  }
}
