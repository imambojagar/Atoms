import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AppUrl } from 'src/app/atoms-http/models/app-url';
import { RequestParameter } from 'src/app/atoms-http/models/query-option';
import { HTTPService } from 'src/app/atoms-http/services/http.service';
import { NotificationService } from 'src/app/sys/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  // language
  public notificationService;
  private activeLanguagesSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private modulesSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private systemPreferncesSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  requestParameter: RequestParameter;

  constructor(
    private _notificationService: NotificationService,
    private httpService: HTTPService
  ) {
    this.notificationService = _notificationService;
    this.initialActiveLanguages();
    this.initialMoodules();
    this.initialSystemPrefernces();
    this.requestParameter = {};
    this.requestParameter.queryParameters = {};

  }
  initialActiveLanguages() {
    this.httpService.setProperties(
      'Language/GetActiveLanguageList',
      'SharedService',
      AppUrl.systemDefinitionApiUrl
    );

    this.httpService.getAll().subscribe(async (response: any) => {
      if (response.isSuccess) {
        this.activeLanguages = (response.data);
      } else {
        this.activeLanguages = ([]);

      }
    });
  }
  initialMoodules() {
    this.httpService.setProperties(
      'Module/GetModulesList',
      'SharedService',
      AppUrl.systemDefinitionApiUrl
    );

    this.httpService.getAll().subscribe(async (response: any) => {
      if (response.isSuccess) {
        this.modules = (response.data);
      } else {
        this.modules = ([]);

      }
    });
  }
  initialSystemPrefernces() {
    this.httpService.setProperties(
      'SystemPreferences/InitiateSystemPreferences',
      'SharedService',
      AppUrl.systemDefinitionApiUrl
    );

    return this.httpService.getAll()
      .subscribe(async (response: any) => {
        if (response.isSuccess && response.data) {

          this.systemPrefernces = (response.data);
        } else {
          this.systemPrefernces = ([]);
        }
      });
  }

  get getActiveLanguages(): Observable<any[]> {
    if (!this.activeLanguagesSubject.value) {
      this.initialActiveLanguages();
    }
    return this.activeLanguagesSubject;

  }

  private set activeLanguages(languages: any[]) {
    if (!languages || languages.length === 0) {
      this.initialActiveLanguages();
    }

    else {
      this.activeLanguagesSubject.next(languages);
    }
  }

  get getModules(): Observable<any[]> {
    if (!this.modulesSubject.value) {
      this.initialMoodules();
    }
    return this.modulesSubject;

  }

  private set modules(modules: any[]) {
    if (!modules || modules.length === 0) {
      this.initialMoodules();
    }
    else {
      this.modulesSubject.next(modules);
    }
  }

  get getSystemPrefernces(): Observable<any[]> {
    return this.systemPreferncesSubject;

  }

  private set systemPrefernces(systemPrefernces: any[]) {
    if (!systemPrefernces || systemPrefernces.length === 0) {
      this.initialSystemPrefernces();
    }
    else {
      this.systemPreferncesSubject.next(systemPrefernces);
    }
  }


}
