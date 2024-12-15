import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RecurrentTaskModel } from './recurrent-task.model';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { RecurrentTaskService } from './recurrent-task.service';
import { Router } from '@angular/router';
import { ExportService } from '../../shared/services/export.service';
import { PrimengModule } from '../../shared/primeng.module';
import { AddRecurrentTaskComponent } from './add-recurrent-task/add-recurrent-task.component';
import { RecurrentSearchComponent } from './recurrent-search/recurrent-search.component';
import { dateHelper } from '../../shared/helpers/dateHelper';
import { EditDeleteRecurrentTaskComponent } from './edit-delete-recurrent-task/edit-delete-recurrent-task.component';
import { ViewRecurrentTaskComponent } from './view-recurrent-task/view-recurrent-task.component';

@Component({
  selector: 'app-recurrent-task',
  standalone: true,
  imports: [
    PrimengModule,
    AddRecurrentTaskComponent,
    RecurrentSearchComponent,
    EditDeleteRecurrentTaskComponent,
    ViewRecurrentTaskComponent
  ],
  providers: [RecurrentTaskService],
  templateUrl: './recurrent-task.component.html',
  styleUrl: './recurrent-task.component.scss'
})
export class RecurrentTaskComponent implements OnInit {
  RecurrentForm!: FormGroup;
  tasks: RecurrentTaskModel[] = [];

  //#region Lookup Lists
  taskTypeList: [] = [];
  frequentList: [] = [];
  renewedList: any[] = [
    { name: 'None', value: null },
    { name: 'Yes', value: true },
    { name: 'No', value: false },
  ];
  statusList: [] = [];
  assignedEmpList: [] = [];
  titleList: any[] = [];
  siteList: [] = [];
  teamLeaderList: [] = [];
  searchValue: string = '';
  YesOrNo = [
    { label: 'Child', value: true },
    { label: 'Parent', value: false },
  ];
  //#endregion

  //#region Filter
  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };
  userId: any;
  totalRows: number = 0;
  loading!: boolean;
  first: number = 0;
  //#endregion

  items!: MenuItem[];
  selectedTasks!: any[] | null;
  userRoles: any[] = []; // JSON.parse(localStorage.getItem('userRoles') || '');

  isChildrenView: boolean = false;
  public addTransferLoaded: boolean = false;
  public ViewRecurrentEntriesLoaded: boolean = false;
  public addEntriesLoaded: boolean = false;
  public filterLoaded: boolean = false;
  isEntriesMode: boolean = false;
  currentDate: Date = new Date();
  url: string = '';


  constructor(
    private api: RecurrentTaskService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private formbuilder: FormBuilder,
    private exportService: ExportService,
    private cdr: ChangeDetectorRef
  ) {
    this.userId = localStorage.getItem('userId');
    /* this.checkUserRole(); */
  }

  async openModal() {
    this.addTransferLoaded = !this.addTransferLoaded;
  }

  async openEditModal() {
    this.edit_id = 0;
    this.addEntriesLoaded = !this.addEntriesLoaded;
  }

  async openViewModal() {
    this.edit_id = 0;
    this.ViewRecurrentEntriesLoaded = !this.ViewRecurrentEntriesLoaded;
  }

  async openFilterModal() {
    this.filterLoaded = !this.filterLoaded;
  }

  ngOnInit(): void {

    this.items = [
      {
          separator: true
      },
      {
          label: 'Documents',
          items: [
              {
                  label: 'New',
                  icon: 'pi pi-plus',
                  shortcut: '⌘+N'
              },
              {
                  label: 'Search',
                  icon: 'pi pi-search',
                  shortcut: '⌘+S'
              }
          ]
      },
      {
          label: 'Profile',
          items: [
              {
                  label: 'Settings',
                  icon: 'pi pi-cog',
                  shortcut: '⌘+O'
              },
              {
                  label: 'Messages',
                  icon: 'pi pi-inbox',
                  badge: '2'
              },
              {
                  label: 'Logout',
                  icon: 'pi pi-sign-out',
                  shortcut: '⌘+Q'
              }
          ]
      },
      {
          separator: true
      }
    ];

    this.RecurrentForm = this.formbuilder.group({
      title: [],
      taskTypeId: [],
      frequesntId: [],
      taskStatusId: [],
      siteId: [],
      parentId: [],
      date: [],
    });
    this.changeView();
    this.Search();
    this.getLookups();
    this.checkMode()
  }

  checkMode() {
    this.url = this.router.url;
    if (this.url.includes('entries'))
      this.isEntriesMode = true

  }

  checkUserRole() {
    this.userRoles.find((role) => role.value === 'R-6')
      ? (this.filter.userId = this.userId)
      : (this.filter.userId = null);
  }

  changeView() {
    if (this.router.url.includes('entries')) {
      this.isChildrenView = true;
      this.filter.isChild = true;
      this.filter.date = this.date(new Date());
      this.RecurrentForm.get('date')?.setValue(new Date());
    } else {
      this.isChildrenView = false;
      this.filter.isChild = false;
      this.filter.date = null;
      this.RecurrentForm.get('date')?.setValue(null);
    }
  }

  date(e: any) {
    let myDate = e;
    myDate = dateHelper.ConvertDateWithSameValue(new Date(myDate));
    return myDate;
  }

  checkDate(taskDate: any) {
    if (this.isChildrenView) {
      const currentDate = new Date();
      if (new Date(taskDate).getTime() <= currentDate.getTime()) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  //#region Table View and Naving Method
  searchRequest() {
    this.loading = true;
    this.api.searchRecurrentTasks(this.filter).subscribe((res: any) => {
      this.totalRows = res.totalRows;
      this.tasks = res.data;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  Search() {
    this.filter.pageNumber = 1;
    this.searchRequest();
  }

  Reset() {
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
      frequentId: null,
      statusId: null,
      taskStatusId: null,
      taskTypeId: null,
      title: null,
      siteId: null,
      parentId: null,
      userId: this.filter.userId,
      date: null,
    };
    this.filter.isChild = this.isChildrenView;
    this.searchRequest();
    this.RecurrentForm.reset();
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.tasks = this.tasks.filter((row: any) =>
        Object.values(row).some((val: any) => String(val).toLowerCase().includes(this.searchValue))
      );
    }
    else {
      this.resetGlobalFilter()
    }
    this.cdr.detectChanges();
  }

  resetGlobalFilter() {
    this.searchValue = ''; // Clear the search input
    this.searchRequest()
    this.cdr.detectChanges();
  }

  paginate(event: any) {
    this.filter.pageNumber = event.page + 1;
    this.searchRequest();
  }

  edit_id: number = 0;
  edit_index: number = 0;
  navToDetails(id: any, index: number) {
    this.edit_id = id;
    this.edit_index = index;
   if (this.isEntriesMode == true) {
     this.addTransferLoaded = !this.addTransferLoaded;
   /*  this.router.navigate(['maintenance/recurrent-task/entries/edit-control'], {
      queryParams: { data: id, index },
    }); */
   }  else {

     this.addEntriesLoaded = !this.addEntriesLoaded;
    /*  this.router.navigate(['maintenance/recurrent-task/schedule/edit-control'], {
        queryParams: { data: id, index },
      }); */
   }

  }


  navToView(id: any, index: number) {
    this.edit_id = id;
    this.edit_index = index;
   if (this.isEntriesMode == true) {
     this.addTransferLoaded = !this.addTransferLoaded;
   /*  this.router.navigate(['maintenance/recurrent-task/entries/edit-control'], {
      queryParams: { data: id, index },
    }); */
   }  else {

     this.ViewRecurrentEntriesLoaded = !this.ViewRecurrentEntriesLoaded;
    /*  this.router.navigate(['maintenance/recurrent-task/schedule/edit-control'], {
        queryParams: { data: id, index },
      }); */
   }
  }
  //#endregion

  //#region Filters
  titleFilter(name: any) {
    this.api.searchRecurrentTasks({ title: name.query }).subscribe((res: any) => {
      const data = res.data;
      this.titleList = data;
    });
  }

  onTitleSelect(name: any) {
    this.filter.title = name.title;
  }

  getTasksSearch(searchdata: any) {
    this.filter.assetGroup = searchdata;
  }

  siteFilter(e: any) {
    this.api.searchSites(e.query).subscribe((res: any) => {
      const data = res.data;
      this.siteList = data;
    });
  }

  onSiteSelect(name: any) {
    this.filter.site = name.site;
    this.api.searchRecurrentTasks(this.filter).subscribe((res: any) => {
      const data = res.data;
      this.totalRows = res.totalRows;
      this.siteList = data;
    });
  }
  //#endregion

  //#region Lookups
  getLookups() {
    this.api.getLookups({ queryParams: 506 }).subscribe((res: any) => {
      this.taskTypeList = res.data;
    });
    this.api.getLookups({ queryParams: 508 }).subscribe((res: any) => {
      this.frequentList = res.data;
    });
    this.api.getLookups({ queryParams: 801 }).subscribe((res: any) => {
      this.statusList = res.data;
    });
  }
  //#endregion

  //#region API Requests
  export() {
    this.exportService
      .export(this.filter, 'RecurrentTask/export')
      .subscribe((res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'File should be downloaded now',
          life: 3000,
        });
        var downloadURL = URL.createObjectURL(res);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'Recurrent-Task-Report';
        link.click();
      });
  }

  deleteRecurrentTask(row: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete This Recurring Task?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteRecurrentTasks(row.id).subscribe((res: any) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            this.Search();
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
