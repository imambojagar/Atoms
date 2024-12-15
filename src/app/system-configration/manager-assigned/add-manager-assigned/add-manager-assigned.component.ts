
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Message, MenuItem, MessageService, ConfirmationService, ConfirmEventType } from "primeng/api";
import { TransactionHistory } from "../../../models/transaction-history";
import { AssetsService } from "../../../services/assets.service";
import { CustomerService } from "../../../services/customer.service";
import { EmployeeService } from "../../../services/employee.service";
import { LookupService } from "../../../services/lookup.service";
import validateForm from "../../../shared/helpers/validateForm";
import { buildManagersForm, buildForm, getModel } from "./add-form-builder";
import { AssignedManagerModel } from "../../../models/assignedManager-model";
import { AssignedManagerService } from "../../../services/assignedManager.service";


@Component({
  selector: 'app-add-manager-assigned',
  templateUrl: './add-manager-assigned.component.html',
  styleUrls: ['./add-manager-assigned.component.scss']
})
export class AddManagerAssignedComponent {

  @Input('showmodal') showmodal: boolean = false;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input('editModelobject') editModelobject: any = null;
  transactionHistory!: TransactionHistory

  assignManagerForm!: FormGroup;
  managersForm!: FormGroup;

  assignedManagerModel: AssignedManagerModel = new AssignedManagerModel();
  id!: number;
  isAddMode!: boolean;

  msgs!: Message[];
  items!: MenuItem[];
  tabIndex: number = 0;
  createdOn: any;
  modifiedOn: any;
  siteList: [] = [];
  engineerId: any;
  hospitalId: any;
  assescorTeamLeader: any;
  apiDirector: any;
  directorList: [] = [];
  teamLeaderList: [] = [];
  hospitalList: [] = [];
  employee: [] = [];
  sites: any;
  rolesList: [] = [];
  empList: any[] = [];
  roleId: any;

  constructor(
    // private route: ActivatedRoute,
    private formbuilder: FormBuilder,
    private api: AssignedManagerService,
    private assetApi: AssetsService,
    private empApi: EmployeeService,
    private siteApi: CustomerService,
    private lookupApi: LookupService,
    // private router: Router,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getRoles();
    this.getEmployeeID();
    this.managersForm = buildManagersForm(this.formbuilder);
    this.assignManagerForm = buildForm(this.formbuilder, this.managersForm);
    // this.route.queryParams.subscribe((params: any) => {
    if (this.editModelobject) {
      this.id = this.editModelobject.data;
      this.tabIndex = this.editModelobject.index;
    }

    this.isAddMode = !this.id;
    console.log("id:", this.id, this.isAddMode);
    if (this.isAddMode == false) (
      this.getByID(this.id)
    )

    // });





    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: this.isAddMode ? 'Add Manager' : 'Edit Manager' },
    ];



  }
  getByID(id: number) {
    this.api.getSingle(id).subscribe((res: { data: any; message: any; isSuccess: any; }) => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      this.transactionHistory = new TransactionHistory();

      this.cdr.detectChanges();
      Object.assign(this.transactionHistory, res.data);

      this.cdr.detectChanges();
      if (sucess == true) {
        for (let index = 0; index < data.sites.length - 1; index++) this.addMoreManagers();
        this.assignManagerForm.patchValue(data);
        this.sites = data.sites;
        this.createdOn = data.createdOn;
        this.modifiedOn = data.modifiedOn;
        this.cdr.detectChanges();
        if (data.sites.length == 0) {
          return;
        } else {
          let counter = 0;

          (<FormArray>(
            this.assignManagerForm.controls['sites']
          )).controls.forEach((c) => {
            this.roleId = data.sites[counter].roleId;
            this.getEmpData(this.roleId, counter);
            const objToBind = {
              custName: data.sites[counter].siteName,
              id: data.sites[counter].siteId,
            };
            c.patchValue({ bind: objToBind });
            this.siteList = <any>[...this.siteList, objToBind];
            counter++;

          });

          this.cdr.detectChanges();
        }
      }

    });
  }
  onSubmit() {
    // stop here if form is invalid
    if (this.assignManagerForm.invalid) {
      validateForm.validateAllFormFields(this.assignManagerForm);
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
    let model = getModel(this.assignManagerForm.value);

    this.api.post(model).subscribe((res: { message: any; isSuccess: any; }) => {
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
    let model = getModel(this.assignManagerForm.value);

    this.api.update(model).subscribe((res: { message: any; isSuccess: any; }) => {
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        }); this.close_modal()

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

    this.assignedManagerModel.id = this.id;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this ?',
      header: 'Confirm',
      rejectButtonStyleClass: 'btn btn-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api
          .delete(this.assignedManagerModel.id)
          .subscribe((res: { message: any; isSuccess: any; }) => {
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
  getRoles() {
    this.empApi.getRoles().subscribe((data: any) => {
      this.rolesList = data;
      this.cdr.detectChanges();
    });
  }
  onChangeRole(event: any, i: number) {
    // this.empList=[];
    this.managersControl()[i].patchValue({
      roleId: event.value,
    });
    this.getEmpData(event.value, i);

    this.cdr.detectChanges();

  }
  getEmpData(roleId: any, i: number) {
    this.empApi.getAssignedEmp([roleId]).subscribe((res: any) => {
      this.empList[i] = res;

      this.cdr.detectChanges();

    });
  }
  selectEmp(event: any, i: number) {
    this.managersControl()[i].patchValue({
      employeeId: event.userId,
    });
  }
  //suppliers
  managersControl() {
    return (<FormArray>this.assignManagerForm.get('sites')).controls;
  }

  removeManagers(index: number) {
    if ((this.assignManagerForm.get('sites') as FormArray).length > 1)
      (this.assignManagerForm.get('sites') as FormArray).removeAt(index);
  }
  addMoreManagers() {
    (this.assignManagerForm.get('sites') as FormArray).push(buildManagersForm(this.formbuilder));
  }

  FillSite(event: any) {
    this.siteApi.GetCustomersAutoComplete(event.query).subscribe((res) => {
      this.siteList = res.data;

      this.cdr.detectChanges();
    });
  }
  selectSite(event: any, i: number) {
    this.managersControl()[i].patchValue({
      siteId: event.id,
      bind: event,
      siteName: event.custName,

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

  cancel() {
    this.assignManagerForm.reset();
  }

  close_modal() {
    // Reset the form to clear any entered values
    this.assignManagerForm.reset();

    // Reinitialize the form if needed
    this.ngOnInit();

    // Emit the event to notify the parent component to close the modal
    this.openModals.emit(false);

    // Hide the modal
    this.showmodal = false;

    // Clear any edit mode state
    this.editModelobject = null;

    // Trigger change detection to reflect the changes
    this.cdr.detectChanges();
  }


}
