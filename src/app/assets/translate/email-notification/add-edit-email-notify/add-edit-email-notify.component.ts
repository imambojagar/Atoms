import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MenuItem, Message, MessageService } from 'primeng/api';
/* import { EmailNotifiactionModel } from 'src/app/data/models/emailNotification';
import { EmailNotificationService } from 'src/app/data/service/email-notification.service';
import { LanguagesService } from 'src/app/data/service/languages.service';
import { LookupService } from 'src/app/data/service/lookup.service'; */
import { buildForm, getEmailNotifyModel } from './add-form-builder';
import { EmailNotifiactionModel } from '../../../../models/emailNotification';
import { EmailNotificationService } from '../../../../services/email-notification.service';
import { LookupService } from '../../../../services/lookup.service';
import { LanguagesService } from '../../../../services/languages.service';
import validateForm from '../../../../shared/helpers/validateForm';
import { PrimengModule } from '../../../../shared/primeng.module';
/* import validateForm from 'src/app/shared/helpers/validateForm';
import { TransactionHistory } from 'src/app/shared/models/transaction-history';
 */
@Component({
  standalone: true,
  selector: 'app-add-edit-email-notify',
  imports: [PrimengModule],
  templateUrl: './add-edit-email-notify.component.html',
  styleUrls: ['./add-edit-email-notify.component.scss']
})
export class AddEditEmailNotifyComponent {

 /*  transactionHistory: TransactionHistory */
  EmailForm!: FormGroup;
  emailModel: EmailNotifiactionModel = new EmailNotifiactionModel();
  id!: number;
  isAddMode!: boolean;
  msgs!: Message[];
  items!: MenuItem[];
  tabIndex: number = 0;
  createdOn: any;
  modifiedOn: any;
  isChecked:boolean=false;
  isHtmlList:any[]= [
   {id:false , name:"No"} ,
   {id:true , name:"Yes"},
]
  constructor(
    private route: ActivatedRoute,
    private formbuilder: FormBuilder,
    private api: EmailNotificationService,
    private lookupApi: LookupService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private languagesService: LanguagesService
  ) {}

  ngOnInit(): void {
    this.EmailForm = buildForm(this.formbuilder);
    console.log(' this.EmailForm',  this.EmailForm);

    this.route.queryParams.subscribe((params: any) => {
      this.id = params.data;
      this.isAddMode = !this.id;
      this.emailModel.id = params.data;
      this.tabIndex = params.index;
    });
    if (!this.isAddMode) {
      this.getById(this.id);
    }
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: this.isAddMode ? 'Add Email Notifications' : 'Edit Email Notifications' },
    ];
  }

  getById(id:number){
    this.api.getSingle(id).subscribe((res) => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
     /*  this.transactionHistory=new TransactionHistory();
      Object.assign( this.transactionHistory,res.data); */
      if (sucess == true) {
        console.log('data', data);
        this.EmailForm.patchValue(data);
        if(data.isHTML == false){
          this.EmailForm.controls['isHTML'].setValue(this.isHtmlList[0].id);
          this.isChecked=false;
        }
        else{
          this.EmailForm.controls['isHTML'].setValue(this.isHtmlList[1].id);
          this.isChecked=true;
        }
        this.createdOn = data.createdOn;
        this.modifiedOn = data.modifiedOn;

      }
      else {
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
    if (this.EmailForm.invalid) {
      validateForm.validateAllFormFields(this.EmailForm);
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
    let model = getEmailNotifyModel(this.EmailForm.value);

    if(model.ignore==null){
      model.ignore=false ;
    }
    if(model.sent==null){
      model.sent=false ;
    }
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
        this.EmailForm.reset();
        this.router.navigate(['/systemsettings/translate/email-notification']);
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
    let model = getEmailNotifyModel(this.EmailForm.value);
     if(model.ignore==null){
      model.ignore=false ;
    }
    if(model.sent==null){
      model.sent=false ;
    }
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
        this.router.navigate(['/systemsettings/translate/email-notification']);
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
    this.emailModel.id = this.id;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this ?',
      header: 'Confirm',
      rejectButtonStyleClass: 'btn btn-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api
          .delete(this.emailModel.id)
          .subscribe((res) => {
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
              this.router.navigate(['/systemsettings/translate/email-notification']);
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

  }
  setCheckbox(event: any) {
    console.log("check event",event)
    this.isChecked = event.value;
  }
  cancel() {
    this.EmailForm.reset();
  }

}
