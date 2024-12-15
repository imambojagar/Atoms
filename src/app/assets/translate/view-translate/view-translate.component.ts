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
import { TranslateModel } from '../../../models/translate-model';
import { TranslateServiceApi } from '../../../services/translate.service';
import { LookupService } from '../../../services/lookup.service';
import { ExportService } from '../../../shared/services/export.service';
import { LanguagesService } from '../../../services/languages.service';
/* import { TranslateModel } from 'src/app/data/models/translate-model';
import { LanguagesService } from 'src/app/data/service/languages.service';
import { LookupService } from 'src/app/data/service/lookup.service';
import { TranslateServiceApi } from 'src/app/data/service/translate.service';
import { ExportService } from 'src/app/shared/service/export.service'; */

@Component({
  selector: 'app-view-translate',
  templateUrl: './view-translate.component.html',
  styleUrls: ['./view-translate.component.scss'],
})
export class ViewTranslateComponent {
  searchForm!: FormGroup;
  translateModel: TranslateModel = new TranslateModel();

  items!: MenuItem[];
  trans: [] = [];
  totalRows: number = 0;
  loading!: boolean;
  serialList: [] = [];
  siteList: [] = [];
  assetNumbs: [] = [];
  assetNames: [] = [];
  departmentList: [] = [];
  reasonsOptions: [] = [];
  pagesNamesList: [] = [];
  languagesList: any[] = [];
  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };

  isTranslatedList: any[] = [
    { name: 'Translated', id: true },
    { name: 'Not Translated', id: false },
    { name: 'All', id: null },
  ];

  constructor(
    private route: ActivatedRoute,
    private formbuilder: FormBuilder,
    private api: TranslateServiceApi,
    private lookupApi: LookupService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private exportService: ExportService,
    private languagesService: LanguagesService
  ) {}

  async ngOnInit(): Promise<void> {
    this.searchForm = this.formbuilder.group({
      id: null,
      word: null,
      pageName: null,
      isTranslated: null,
    });

    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Translation List' },
    ];
    await this.getAllLanguages();
    this.Reset();
  }

  navToDetails(row: any, index: number) {
    this.translateModel.id = row.id;
    this.router.navigate(['/systemsettings/translate/edit-control'], {
      queryParams: { data: row.id, index },
    });
  }

  async getAllLanguages() {
    const languages = await firstValueFrom<any>(
      this.languagesService.getLanguages({})
    );
    this.languagesList = languages.data;
  }

  getAllTrans() {
    this.api.getAll(this.filter).subscribe((res) => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.trans = data;
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
    this.getAllTrans();
    this.loading = false;
  }

  pageNameFilter(text: any) {
    this.api.getPageNameAutocomplete(text.query).subscribe((res) => {
      this.pagesNamesList = res.data;
    });
  }

  export() {
    this.exportService
      .export(
        { langId: JSON.parse(localStorage.getItem('arID') || '0') },
        'Dictionary/ExportTranslationFile'
      )
      .subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'File should be downloaded now',
          life: 3000,
        });
        var downloadURL = URL.createObjectURL(res);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'ar';
        link.click();
      });
  }

  delete(row: any) {
    this.translateModel.id = row.id;
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
            this.getAllTrans();
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

  search() {
    this.getAllTrans();
  }
  Reset() {
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
      id: null,
      word: null,
      isTranslated: null,
      pageName: null,
    };
    this.searchForm.reset();
    this.getAllTrans();
  }
}
