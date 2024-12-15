import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../../modules/i18n/translation.service';


@Pipe({
  name: 'CustomeTranslate',
  standalone: true
})

export class CustomeTranslate implements PipeTransform {
    constructor(private translateService: TranslationService) {}

    transform(value: string): any {
       debugger;
        console.log("lang value in pipe",value)
        return this.translateService.setLanguage(value);
      }
  }

