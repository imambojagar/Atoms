import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { EmailNotifiactionModel } from '../../../../models/emailNotification';
import { LookupService } from '../../../../services/lookup.service';
import { EmailNotificationService } from '../../../../services/email-notification.service';
import { LanguagesService } from '../../../../services/languages.service';
import { PrimengModule } from '../../../../shared/primeng.module';
/* import { EmailNotifiactionModel } from 'src/app/data/models/emailNotification';
import { EmailNotificationService } from 'src/app/data/service/email-notification.service';
import { LanguagesService } from 'src/app/data/service/languages.service';
import { LookupService } from 'src/app/data/service/lookup.service'; */

@Component({
  standalone: true,
  selector: 'app-view-email-notify',
  imports: [PrimengModule],
  templateUrl: './view-email-notify.component.html',
  styleUrls: ['./view-email-notify.component.scss']
})
export class ViewEmailNotifyComponent {
  searchForm!: FormGroup;
  emailNotifyModel: EmailNotifiactionModel = new EmailNotifiactionModel();

  items!: MenuItem[];
  msgs: [] = [];
  totalRows: number = 0;
  loading!: boolean;
  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };
  constructor(
    private route: ActivatedRoute,
    private formbuilder: FormBuilder,
    private api: EmailNotificationService,
    private lookupApi: LookupService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private languagesService: LanguagesService
  ) { }

  ngOnInit(): void {
    this.searchForm = this.formbuilder.group({
      subject: null,
      sent: null,
      sendDateFrom: null,
      sendDateTo: null,
      creationDateFrom: null,
      creationDateTo: null,
      ignore: null,
      email: null,
      userId: null,
    });

    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Email Notifications List' },
    ];

    this.Reset();
  }
  navToDetails(row: any, index: number) {
    this.emailNotifyModel.id = row.id;
    this.router.navigate(
      ['/systemsettings/translate/email-notification/edit-control'],
      {
        queryParams: { data: row.id, index },
      }
    );
  }
  getAllEmail() {
    this.api.getAll(this.filter).subscribe((res) => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.msgs = data;
        this.totalRows = res.totalRows;
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

  paginate(event: any) {
    this.loading = true;
    this.filter.pageNumber = event.page + 1;
    this.getAllEmail();
    this.loading = false;
  }

  delete(row: any) {
    this.emailNotifyModel.id = row.id;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this ?',
      header: 'Confirm',
      rejectButtonStyleClass: 'btn btn-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.delete(row.id).subscribe((res) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            this.getAllEmail();
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

  ignore(row: any) {
    debugger;
    this.emailNotifyModel.id = row.id;
    if(row.ignore==true){
      this.messageService.add({
        severity: 'warn',
        summary: 'Cancelled',
        detail: 'This Email Already Ignored !',
        life: 3000,
      });
    }
    else if(row.sent==true){
      this.messageService.add({
        severity: 'warn',
        summary: 'Cancelled',
        detail: 'This Email Already Sent !',
        life: 3000,
      });
    }
    else {
    this.confirmationService.confirm({
      message: 'Are you sure you want to Ignore this Email ?',
      header: 'Confirm',
      rejectButtonStyleClass: 'btn btn-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.IgnoreEmailNotification(row.id).subscribe((res) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            this.getAllEmail();
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
  }

  search() {
    this.getAllEmail();
  }
  Reset() {
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
      subject: null,
      sent: null,
      sendDateFrom: null,
      sendDateTo: null,
      creationDateFrom: null,
      creationDateTo: null,
      ignore: null,
      email: null,
      userId: null,
    };
    this.searchForm.reset();
    this.getAllEmail();
  }
}
