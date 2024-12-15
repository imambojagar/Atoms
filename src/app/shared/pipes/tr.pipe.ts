import { Pipe, PipeTransform } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../modules/i18n/translation.service';
import { TranslateServiceApi } from '../../services/translate.service';
/* import { TranslateServiceApi as callTranslateApi } from '../../data/service/translate.service';
import { TranslationService } from 'src/app/modules/i18n'; */
@Pipe({
  name: 'tr',
  standalone: true 
})
export class TrPipe implements PipeTransform {
  translationResult: Subscription | undefined;

  constructor(
    private translatePipe: TranslatePipe,
    private translate: TranslateService,
    private translateService: TranslateServiceApi,
    private translationService: TranslationService
  ) {}

  transform(value: any, pageName: string) {
    const addToDictionary = JSON.parse(
      localStorage.getItem('addToDictionary') || 'false'
    );

    this.translate.use(this.translationService.getSelectedLanguage());
    this.translationResult = this.translatePipe.transform(value);

    if (value == this.translationResult && addToDictionary) {
      this.translateService
        .translate({
          word: value,
          pageName,
          langId: JSON.parse(localStorage.getItem('currentLanguageId') || '0'),
        })
        .subscribe();
    }
    return value;
  }
}
