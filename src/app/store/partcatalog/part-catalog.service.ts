import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
/* import { environment } from 'src/environments/environment'; */
import { Observable } from 'rxjs';
import { NameDefinitionModel } from '../../models/name-definition-model';
/* import { NameDefinitionModel } from 'src/app/data/models/name-definition-model'; */

@Injectable({
  providedIn: 'root',
})
export class PartCatalogService {
  baseUrl: string = 'http://10.201.111.121:5000/api/'; /* environment.BaseURL; */
  url: string = 'partCatalog/';
  constructor(private http: HttpClient) {}

  addPartCatalogItem(data: any) {
    return this.http
      .post<NameDefinitionModel>(this.baseUrl + this.url, data)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getAutoCompleteByPartName(PartName:string) {
    return this.getAutoComplete({ partName: PartName });
  }

  getAutoComplete(params: any) {
    
    return this.searchPartCatalog(params).pipe(
      map((a:any) => {
        return <any>(<any[]>a.data).map(x => {
          return {
            partName: x.partNumber,
            id: x.id,
            desc: x.partName
          }
        })
      })
    );
  }

  getPartCatalog(params: any) {
    return this.http
      .get<NameDefinitionModel[]>(this.baseUrl + this.url, params)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getPartItem(id: number) {
    return this.http
      .get<NameDefinitionModel>(this.baseUrl + this.url + id)
      .pipe(
        map((res: any) => {
          console.log('get res:', res);
          return res;
        })
      );
  }

  searchPartCatalog(data: any) {
    console.log("filter to api",data)
    return this.http.post<any>(this.baseUrl + this.url + 'search', data).pipe(
      map((res: any) => {
        console.log("search res",res)
        return res;

      })
    );
  }

  updatePartItem(data: any) {
    return this.http
      .put<NameDefinitionModel>(this.baseUrl + this.url, data)
      .pipe(
        map((res: any) => {
          console.log('update res:', res);
          return res;
        })
      );
  }

  deletePartCatalog(id: number) {
    return this.http
      .delete<NameDefinitionModel>(this.baseUrl + this.url + id)
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

    debugger
  }

  GetPartAutoComplete(data:any){
    return this.http.post<any>(this.baseUrl + this.url +'GetPartAutoComplete',data).
    pipe(map((res:any)=>{
      return res;    
    }))
  }
}
