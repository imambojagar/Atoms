import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
  MenuItem
} from 'primeng/api';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-roles-control',
  templateUrl: './roles-control.component.html',
  styleUrls: ['./roles-control.component.scss'],
})
export class RolesControlComponent {

  showmodal: boolean = false;
  updateRole!: FormGroup;
  addedRole: any[] = [];
  rolesList = [];

  RoleModel = {
    id: 0,
    name: '',
  };
  totalRows!: number;
  loading!: boolean;
  fixedName: any;

  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };

  displayAdd: boolean = false;
  displayUpdate: boolean = false;
  items!: MenuItem[];
  roleId!: number;
  searchValue: any;
  constructor(
    private fb: FormBuilder,
    private api: EmployeeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
  ) { }
  ngOnInit() {
    this.getRoles();
    this.updateRole = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      fixedName: ['']
    });
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Role List' },
    ];
  }
  getRoles() {
    this.api.searchRoles(this.filter).subscribe((res) => {
      this.totalRows = res.totalRows;
      this.rolesList = res.data;

      this.cdr.detectChanges();

    });
  }

  paginate(event: any) {
    this.loading = true;
    console.log('paginate event', event);
    this.filter.pageNumber = event.page + 1;
    setTimeout(() => {
      this.api.searchRoles(this.filter).subscribe((res) => {
        const data = res.data;
        this.rolesList = data;
        this.totalRows = res.totalRows;
        this.loading = false;

        this.cdr.detectChanges();
      });
    }, 500);
  }
  showAddDialog() {
    this.displayAdd = true;
  }
  showUpdateDialog(name: any, fixedname: any) {
    this.displayUpdate = true;
    this.updateRole.controls['fixedName'].setValue(fixedname);
    this.updateRole.controls['name'].setValue(name);
    // this.transactionHistory=new TransactionHistory();
    // Object.assign( this.transactionHistory,res.data);

    this.cdr.detectChanges();

  }
  onAdd() {
    // let arr = [];
    // arr.push(this.updateRole.value.name);
    this.RoleModel.name = this.updateRole.value.name;
    this.api.addRole(this.RoleModel).subscribe((res) => {
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
        this.close_modal()
        this.getRoles();

        this.cdr.detectChanges();
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
  onUpdate() {
    this.RoleModel.id = this.roleId;
    this.RoleModel.name = this.updateRole.value.name;
    // let arr = [];
    // arr.push(this.RoleModel);
    this.api.updateRole(this.RoleModel).subscribe((res) => {
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
        this.close_modals()

        this.cdr.detectChanges();
        this.getRoles();
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
  onDelete(role: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + role.name + '?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteRole(role.id).subscribe((res) => {
          this.getRoles();
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
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
  onHideDialog() {
    this.updateRole.reset();
  }

  close_modal() {
    this.showmodal = false;
    this.ngOnInit()
  }

  close_modals() {
    this.displayUpdate = !this.displayUpdate;
    this.ngOnInit()
  }

  openFilterModal() {
    this.showmodal = true
  }


  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.rolesList = this.rolesList.filter((row: any) =>
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
    this.getRoles()
    this.cdr.detectChanges();
  }
}
