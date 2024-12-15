import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable, delay } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';



@Injectable({ providedIn: 'root' })
export class CommonService {
  private defaultConfig : any = {
    appConfig: {
      showProgress: null,
      breadcrumText: null,
      lastRoute: null,
      showAppIDBar: null,
      isDarkTheme: null
    }
 };
 /*  breadcrumlist: string = ''; */
   _messageSource: BehaviorSubject<any>  = new BehaviorSubject<any>(this.defaultConfig);
   // public currentMessage$ = this._messageSource.asObservable();
   app_Settings: any = this.defaultConfig;
  /* currentMessage = this._messageSource.asObservable(); */

  /*  private dataSubject = new BehaviorSubject({});
    data$ = this.dataSubject.asObservable(); */

  public currentMessage: Observable<any>;

  constructor(private titleService: Title) {
    this.currentMessage = this._messageSource.asObservable();
  }

    /* constructor(private titleService: Title) {
      this.currentMessage$ = this._messageSource.asObservable();
    } */

    updateConfig(val: Partial<any>) {
      this.app_Settings = {...this.app_Settings, ...val };
      this._messageSource.next(this.app_Settings);
    }

  /* private messageProgress = new BehaviorSubject<boolean>(false); */
  /* isProgress = this.messageProgress.asObservable(); */

    getData(): Observable<any> {
      return this.currentMessage;
    }

    changeMessage(message: string) {
      /* this.breadcrumlist = message; */
      this._messageSource.next({breadcrumText: message});
      console.log("currentMessage", this._messageSource.getValue());
    }

    changeProgressBar(active: boolean) {
      // this._messageSource.next(active);
      this.patch({active});
    }

    public setShowSideBar(showSideBar: boolean) {
      this.patch({showSideBar});
    }

    private patch(value: Partial<any>) {
      this._messageSource.next({...this._messageSource.getValue(), ...value});
    }
}
