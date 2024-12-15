import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MenuItem, Message, MessageService } from 'primeng/api';
/* import { MessageNotificationModel } from 'src/app/data/models/msg-notify';
import { LookupService } from 'src/app/data/service/lookup.service';
import { MsgNotificationService } from 'src/app/data/service/msg-notification.service'; */
import { buildForm, getMsgNotifyModel } from './add-form-builder';
import { MessageNotificationModel } from '../../../../models/msg-notify';
import { MsgNotificationService } from '../../../../services/msg-notification.service';
import { LookupService } from '../../../../services/lookup.service';
import { LanguagesService } from '../../../../services/languages.service';
import validateForm from '../../../../shared/helpers/validateForm';
import { PrimengModule } from '../../../../shared/primeng.module';
/* import validateForm from 'src/app/shared/helpers/validateForm';
import { LanguagesService } from 'src/app/data/service/languages.service';
import { TransactionHistory } from 'src/app/shared/models/transaction-history';
 */
@Component({
  standalone: true,
  selector: 'app-add-edit-msg-notify',
  imports: [PrimengModule, ReactiveFormsModule],
  templateUrl: './add-edit-msg-notify.component.html',
  styleUrls: ['./add-edit-msg-notify.component.scss']
})
export class AddEditMsgNotifyComponent {
  msgsForm!: FormGroup;
  msgNotifyModel: MessageNotificationModel = new MessageNotificationModel();
  id!: number;
  isAddMode!: boolean;
  msgs!: Message[];
  items!: MenuItem[];
  tabIndex: number = 0;
  createdOn: any;
  modifiedOn: any;
  translations:any;
  languages: any[] = [];
  languageName: any[] = [];

  /* transactionHistory: TransactionHistory */
  constructor(
    private route: ActivatedRoute,
    private formbuilder: FormBuilder,
    private api: MsgNotificationService,
    private lookupApi: LookupService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private languagesService: LanguagesService

  ) {}

  ngOnInit(): void {
    this.msgsForm = buildForm(this.formbuilder);
    console.log('this.msgsForm:', this.msgsForm.value);

    this.route.queryParams.subscribe((params: any) => {
      this.id = params.data;
      this.isAddMode = !this.id;
      this.msgNotifyModel.id = params.data;
      this.tabIndex = params.index;
    });
    if (!this.isAddMode) {
      this.getByID(this.id);
    } else {
      this.getLangs();
    }

    this.langsLookup();
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: this.isAddMode ? 'Add Message Notifications' : 'Edit Message Notifications' },
    ];
  }
  getByID(id:number){
    this.api.getSingle(id).subscribe((res) => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
    /*   this.transactionHistory=new TransactionHistory();
       Object.assign( this.transactionHistory,res.data); */
      if (sucess == true) {

        this.msgsForm.patchValue(data);
        JSON.parse(JSON.stringify(data.translations)).forEach(
          (translation: translation) => {
            (this.msgsForm.get('translations') as FormArray).push(
              this.languagesFormControl(translation)
            );
            this.languageName.push(translation.langName);
          }
        );
        this.translations = data.translations;
        this.createdOn = data.createdOn;
        this.modifiedOn = data.modifiedOn;
        console.log('data', data);
        console.log('Form:', this.msgsForm.value);

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

  onSubmit() {
    // stop here if form is invalid
    if (this.msgsForm.invalid) {
      validateForm.validateAllFormFields(this.msgsForm);
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
    let model = getMsgNotifyModel(this.msgsForm.value);
    console.log('model', model);
    this.api.post(model).subscribe((res) => {
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
        this.msgsForm.reset();
        this.router.navigate(['/systemsettings/translate/msg-notification']).then(() => {
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
    let model = getMsgNotifyModel(this.msgsForm.value);
    console.log('model', model);
    this.api.update(model).subscribe((res) => {
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
        this.router.navigate(['/systemsettings/translate/msg-notification']).then(() => {

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
      this.msgNotifyModel.id = params.data;
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this ?',
        header: 'Confirm',
        rejectButtonStyleClass: 'btn btn-danger',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.api.delete(this.msgNotifyModel.id).subscribe((res) => {
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
              this.router.navigate(['/systemsettings/translate/msg-notification']);
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
  getLangs() {
    this.languagesService.getLanguages({}).subscribe((res: any) => {
      this.languages = res.data;
      console.log('languages', this.languages);
      for (let i = 0; i < this.languages.length; i++) {
        (this.msgsForm.get('translations') as FormArray).push(
          this.languagesFormControl({
            id: 0,
            messageId: 0,
            langId: this.languages[i].id,
            langName: this.languages[i].name,
          })
        );
        this.languageName.push(this.languages[i].name);
      }
    });
  }
  languagesFormControl(data: translation) {
    return this.formbuilder.group({
      id: data.id ?? 0,
      messageId: data.messageId ?? 0,
      langId: data.langId ?? 0,
      langName: data.langName,
      titleValue: data.titleValue,
      textValue:data.textValue
    });
  }

  langsControl() {
    return (<FormArray>this.msgsForm.get('translations')).controls;
  }

  langsLookup() {
    this.languagesService.getLanguages({}).subscribe((res: any) => {
      this.languages = res.data;
    });
  }

  cancel() {
    this.msgsForm.reset();
  }


}

type translation = {
  id: number;
  messageId: number ;
  langId: number ;
  langName: string;
  titleValue?: string ;
  textValue?: string ;
};
