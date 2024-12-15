import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AssignedManagerService } from '../../../services/assignedManager.service';
import { CustomerService } from '../../../services/customer.service';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-view-manager-assigned',
  templateUrl: './view-manager-assigned.component.html',
  styleUrls: ['./view-manager-assigned.component.scss']
})
export class ViewManagerAssignedComponent {
  searchForm!: FormGroup;
  items!: MenuItem[];
  managers: any[] = [];
  totalRows: number = 0;
  loading!: boolean;
  filter: any = {
    pageSize: 10,
    pageNumber: 1
  };
  assescorTeamLeader: any;
  apiDirector: any;
  directorList: [] = [];
  teamLeaderList: [] = [];
  showmodal: boolean = false;
  addmodel: boolean = false;
  searchValue: string = '';
  editModeId: any = null;
  constructor(

    private route: ActivatedRoute,
    private siteApi: CustomerService,
    private empApi: EmployeeService,
    private api: AssignedManagerService,
    private formbuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService, private cdr: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.getEmployeeID();
    this.searchForm = this.formbuilder.group({
      id: null,
      apiDirectorId: null,
      assessorTeamLeaderId: null,
      siteId: null,
      hospitalManagementId: null
    });
    this.Reset();

    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Assigned Managers List' },
    ];



  }
  navToDetails(row: any, index: number) {
    // this.router.navigate(['traf/manager-assigned/edit-control'], { queryParams: { data: row.id, index } })
    this.editModeId = { data: row.id, index }
    this.openaddmodel()
  }
  getAllManagers() {
    this.api.getAll(this.filter).subscribe(res => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.managers = data;
        this.totalRows = res.totalRows;

        this.cdr.detectChanges();
        this.close_modal()
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

  paginate(event: any) {
    this.loading = true;
    this.filter.pageNumber = event.page + 1;
    this.getAllManagers();
    this.loading = false;

    this.cdr.detectChanges();
  }

  delete(row: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this ?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.delete(row.id).subscribe(res => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            this.getAllManagers();
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
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });

  }
  getEmployeeID() {

    this.empApi.searchRoles({ fixedName: 'R-19' }).subscribe((res: any) => {
      this.assescorTeamLeader = res.data[0].id;
      this.empApi.getAssignedEmp([this.assescorTeamLeader]).subscribe((res: any) => {
        this.teamLeaderList = res;

        this.cdr.detectChanges();

      });
    });
    this.empApi.searchRoles({ fixedName: 'R-30' }).subscribe((res: any) => {
      this.apiDirector = res.data[0].id;
      this.empApi.getAssignedEmp([this.apiDirector]).subscribe((res: any) => {
        this.directorList = res;

        this.cdr.detectChanges();

      });
    });



  }

  search() {
    this.getAllManagers();
  }
  Reset() {
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
      id: null,
      apiDirectorId: null,
      assessorTeamLeaderId: null,
      siteId: null,
      roleId: null,
      employeeId: null
    };
    this.searchForm.reset();
    this.getAllManagers();
  }

  close_modal() {
    this.showmodal = false;

    this.cdr.detectChanges();
  }
  close_modal_add() {
    this.addmodel = false;
    this.editModeId = null
    this.cdr.detectChanges();
    this.search()
  }
  openFilterModal() {
    this.showmodal = true;
  }
  openaddmodel() {
    this.addmodel = true;
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.managers = this.managers.filter((row: any) =>
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
    this.getAllManagers()
    this.cdr.detectChanges();
  }
}
