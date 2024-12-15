import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfirmEventType,
  ConfirmationService,
  MenuItem,
  Message,
  MessageService,
} from 'primeng/api';
/* import { TranslateModel } from 'src/app/data/models/translate-model';
import { LookupService } from 'src/app/data/service/lookup.service';
import { TranslateServiceApi } from 'src/app/data/service/translate.service'; */
import { buildForm, getTransModel } from './add-form-builder';
import { LookupService } from '../../../services/lookup.service';
import { LanguagesService } from '../../../services/languages.service';
import { TranslateModel } from '../../../models/translate-model';
import { TranslateServiceApi } from '../../../services/translate.service';
import validateForm from '../../../shared/helpers/validateForm';
/* import validateForm from 'src/app/shared/helpers/validateForm';
import { LanguagesService } from 'src/app/data/service/languages.service';
import { TransactionHistory } from 'src/app/shared/models/transaction-history'; */

@Component({
  selector: 'app-add-edit-translate',
  templateUrl: './add-edit-translate.component.html',
  styleUrls: ['./add-edit-translate.component.scss'],
})
export class AddEditTranslateComponent {

  /* transactionHistory: TransactionHistory */
  transForm!: FormGroup;
  translateModel: TranslateModel = new TranslateModel();
  id!: number;
  isAddMode!: boolean;
  msgs!: Message[];
  items!: MenuItem[];
  tabIndex: number = 0;
  createdOn: any;
  modifiedOn: any;
  languages: any[] = [];
  languageName: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private formbuilder: FormBuilder,
    private api: TranslateServiceApi,
    private lookupApi: LookupService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private languagesService: LanguagesService
  ) {}

  ngOnInit(): void {
    this.transForm = buildForm(this.formbuilder);
    console.log('Translation Form:', this.transForm);

    this.route.queryParams.subscribe((params: any) => {
      this.id = params.data;
      this.isAddMode = !this.id;
      this.translateModel.id = params.data;
      this.tabIndex = params.index;
    });
    if (!this.isAddMode) {
      this.patchLangForm();
    } else {
      this.getLangs();
    }
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: this.isAddMode ? 'Add Translations' : 'Edit Translations' },
    ];
  }

  getLangs() {
    this.languagesService.getLanguages({}).subscribe((res: any) => {
      this.languages = res.data;
      console.log('languages', this.languages);
      for (let i = 0; i < this.languages.length; i++) {
        (this.transForm.get('translations') as FormArray).push(
          this.languagesFormControl({
            id: 0,
            langId: this.languages[i].id,
            dictionaryId: 0,
            langName: this.languages[i].name,
          })
        );
        this.languageName.push(this.languages[i].name);
      }
    });
  }

  patchLangForm() {
    this.api.getSingle(this.id).subscribe((res: any) => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
     /*  this.transactionHistory=new TransactionHistory();
      Object.assign( this.transactionHistory,res.data); */
      if (sucess == true) {
        this.transForm.patchValue(data);
        JSON.parse(JSON.stringify(data.translations)).forEach(
          (translation: translation) => {
            (this.transForm.get('translations') as FormArray).push(
              this.languagesFormControl(translation)
            );
            this.languageName.push(translation.langName);
          }
        );

        this.createdOn = data.createdOn;
        this.modifiedOn = data.modifiedOn;

        console.log('Form Value::', this.transForm.value);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        });
      }
    });
  }

  languagesFormControl(data: translation) {
    return this.formbuilder.group({
      id: data.id ?? 0,
      dictionaryId: data.dictionaryId ?? 0,
      langId: data.langId ?? 0,
      langName: data.langName,
      transValue: data.transValue,
    });
  }

  langsControl() {
    return (<FormArray>this.transForm.get('translations')).controls;
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.transForm.invalid) {
      validateForm.validateAllFormFields(this.transForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      if (this.isAddMode) {
        this.save();
      } else {
        this.update();
      }
    }
  }

  save() {
    let model = getTransModel(this.transForm.value);
    console.log('model', model);
    this.api.post(model).subscribe((res: any) => {
      console.log('api res:', res);
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
        this.transForm.reset();
        this.router.navigate(['/systemsettings/translate']).then(() => {
          window.location.reload();
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        });
      }
    });
  }

  update() {
    let model = getTransModel(this.transForm.value);
    console.log('model', model);
    this.api.update(model).subscribe((res: any) => {
      console.log('api res:', res);
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
        this.router.navigate(['/systemsettings/translate']).then(() => {
          // window.location.reload();
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        });
      }
    });
  }

  delete() {
    this.route.queryParams.subscribe((params: any) => {
      this.translateModel.id = params.data;
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this ?',
        header: 'Confirm',
        rejectButtonStyleClass: 'btn btn-danger',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.api.delete(this.translateModel.id).subscribe((res: any) => {
            console.log('delete res', res);
            const message = res.message;
            const sucess = res.isSuccess;
            if (sucess == true) {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: message,
                life: 3000,
              });
              this.router.navigate(['/systemsettings/translate']);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: message,
                life: 3000,
              });
            }
          });
        },
        reject: (type: any) => {
          switch (type) {
            case ConfirmEventType.REJECT:
              this.messageService.add({
                severity: 'warn',
                summary: 'Cancelled',
                detail: 'You have cancelled',
              });
              break;
            case ConfirmEventType.CANCEL:
              this.messageService.add({
                severity: 'warn',
                summary: 'Cancelled',
                detail: 'You have cancelled',
              });
              break;
          }
        },
      });
    });
  }

  cancel() {
    this.transForm.reset();
  }

  langsLookup() {
    this.languagesService.getLanguages({}).subscribe((res: any) => {
      this.languages = res.data;
    });
  }
}

type translation = {
  dictionaryId: number;
  id: number;
  langId: number;
  langName: string;
  transValue?: string;
};
