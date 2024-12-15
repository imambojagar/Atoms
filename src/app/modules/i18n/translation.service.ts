// import { LanguageFileNames, LanguageCode } from 'src/app/shared/enums/shared.enum';
// import { StorageService } from 'src/app/atoms-http/services/storage.service';
// Localization is based on '@ngx-translate/core';
// Please be familiar with official documentations first => https://github.com/ngx-translate/core

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

const LOCALIZATION_LOCAL_STORAGE_KEY = 'language';
export interface Locale {
  lang: string;
  data: any;
}


@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  public Current_Language: BehaviorSubject<string> =
  new BehaviorSubject<string>(
    localStorage.getItem(LOCALIZATION_LOCAL_STORAGE_KEY) ?? 'en'
  );
  // Private properties
  private langIds: any = [];
// private storageService: StorageService
  constructor(private translate: TranslateService,) {
    // add new langIds to the list
    // this.translate.addLangs([LanguageFileNames.English, LanguageFileNames.Arabic, LanguageFileNames.French, LanguageFileNames.German]);

    // this language will be used as a fallback when a translation isn't found in the current language
    // this.translate.setDefaultLang(LanguageCode.English.toLowerCase());
  }

  loadTranslations(...args: Locale[]): void {
    const locales = [...args];
    locales.forEach((locale) => {
      // use setTranslation() with the third argument set to true
      // to append translations instead of replacing them
      this.translate.setTranslation(locale.lang, locale.data, true);

      this.langIds.push(locale.lang);
    });

    // add new languages to the list
    this.translate.addLangs(this.langIds);
  }

  setLanguage(lang:any) {
    if (lang) {
      this.translate.use(this.translate.getDefaultLang());
      this.translate.use(lang.toLowerCase());
      // this.storageService.selectedLanguage = lang;
      // this.storageService.isResetCache = false;

    }
  }

  /**
   * Returns selected language
   */
  getSelectedLanguage(): any {
    // return this.storageService.selectedLanguage;


  }
}
