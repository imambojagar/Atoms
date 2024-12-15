import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfirmEventType,
  ConfirmationService,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { MessageNotificationModel } from '../../../../models/msg-notify';
import { LookupService } from '../../../../services/lookup.service';
import { LanguagesService } from '../../../../services/languages.service';
import { MsgNotificationService } from '../../../../services/msg-notification.service';
import { PrimengModule } from '../../../../shared/primeng.module';
/* import { MessageNotificationModel } from 'src/app/data/models/msg-notify';
import { LanguagesService } from 'src/app/data/service/languages.service';
import { LookupService } from 'src/app/data/service/lookup.service';
import { MsgNotificationService } from 'src/app/data/service/msg-notification.service'; */

@Component({
  standalone: true,
  selector: 'app-view-msg-notify',
  imports: [PrimengModule],
  templateUrl: './view-msg-notify.component.html',
  styleUrls: ['./view-msg-notify.component.scss'],
})
export class ViewMsgNotifyComponent {
  searchForm!: FormGroup;
  msgNotifyModel: MessageNotificationModel = new MessageNotificationModel();

  items!: MenuItem[];
  msgs: [] = [];
  totalRows: number = 0;
  loading!: boolean;
  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };
  titleList!: [];
  languagesList: any[] = [];

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

  async ngOnInit(): Promise<void> {
    this.searchForm = this.formbuilder.group({
      id: null,
      code: null,
      name: null,
      title: null,
      text: null,
      langId: null,
    });

    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Message Notifications List' },
    ];
    await this.getAllLanguages();
    this.Reset();
  }
  navToDetails(row: any, index: number) {
    this.msgNotifyModel.id = row.id;
    this.router.navigate(
      ['/systemsettings/translate/msg-notification/edit-control'],
      {
        queryParams: { data: row.id, index },
      }
    );
  }
  getAllMsgs() {
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
    this.getAllMsgs();
    this.loading = false;
  }

  delete(row: any) {
    this.msgNotifyModel.id = row.id;
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
            this.getAllMsgs();
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
  titleFilter(event: any) {
    this.api.getAll({ title: event.query }).subscribe((res) => {
      console.log('title res:', res);
      res.data;
      this.titleList = res.data;
    });
  }

  namesList: any[] = [];
  nameFilter(event: any) {
    this.api.getAll({ name: event.query }).subscribe((res) => {
      res.data;
      this.namesList = res.data;
    });
  }

  textsList: any[] = [];
  textFilter(event: any) {
    this.api.getAll({ text: event.query }).subscribe((res) => {
      res.data;
      this.textsList = res.data;
    });
  }

  async getAllLanguages() {
    const languages = await firstValueFrom<any>(
      this.languagesService.getLanguages({})
    );
    this.languagesList = languages.data;
  }
  search() {
    this.getAllMsgs();
  }
  Reset() {
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
      id: null,
      code: null,
      name: null,
      title: null,
      text: null,
      langId: null,
    };
    this.searchForm.reset();
    this.getAllMsgs();
  }
}
