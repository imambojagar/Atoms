import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
/* import { CustomerService } from 'src/app/data/service/customer.service'; */
import { buildReferenceForm } from '../data/cylinders-reference-form-builder';
/* import validateForm from 'src/app/shared/helpers/validateForm'; */
import { CylindersReferenceService } from '../data/cylinders-reference.service';
import { ReferenceCylindersLOX } from '../data/cylinders-reference.model';
import { cylinderProperties } from '../../ordering-cylinders-lox/data/ordering-cylinders-lox.model';
import { TransactionHistory } from '../../../shared/models/transaction-history';
import { CustomerService } from '../../../services/customer.service';
import validateForm from '../../../shared/helpers/validateForm';
/* import { TransactionHistory } from 'src/app/shared/models/transaction-history'; */

@Component({
  selector: 'app-cylinders-reference-details',
  templateUrl: './cylinders-reference-details.component.html',
  styleUrls: ['./cylinders-reference.component.scss'],
})
export class CylindersReferenceDetailsComponent implements OnChanges {

  @Input('showmodal') showmodal : boolean = false ;
  @ViewChild('drawer') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('edit_asset_id') edit_asset_id: number = 0;
  @Input('editIndex') editIndex: number = 0;

  transactionHistory!: TransactionHistory
  refForm!: FormGroup;
  model!: ReferenceCylindersLOX;
  id: number = 0;
  items!: MenuItem[];
  tabIndex: number = 0;
  assignedEmpList: any[] = [];
  sitesList: any[] = [];
  backupStatusList: any[] = [];
  siteName: string = '';
  siteId: number = 0;

  inAddMode: boolean = false;
  inEditMode: boolean = false;
  inViewMode: boolean = false;
  isLoading: boolean = false;

  cylindersArr = cylinderProperties;
  constructor(
    private router: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: Router,
    private api: CylindersReferenceService,
    private apiCustomer: CustomerService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.Init();
  }

  close_modal() {
    this.openModals.emit(false);
  }

   Init() {
    /* this.router.queryParams.subscribe((params: any) => { */
      this.id = this.edit_asset_id;;
      this.tabIndex = this.editIndex;
      if (this.edit_asset_id) this.id = this.edit_asset_id;
   /*  }); */

    this.buildForm();
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Cylinders Reference' },
    ];
  }

  //#region Build Form and Get Index
  buildForm() {
    if (this.id == 0) {
      this.model = { id: 0 };
      this.refForm = buildReferenceForm(this.model, this.fb);
      this.inAddMode = true;
      console.log('Add Form Group:', this.refForm.value);
    } else {
      if (this.tabIndex == 0) {
        this.inViewMode = true;
      } else {
        this.inEditMode = true;
      }
      this.getbuildReferenceData();
    }
  }

  getbuildReferenceData() {
    this.api.getSingleCylinderReference(this.id).subscribe((res: any) => {
      console.log('Results', res.data);
      this.transactionHistory=new TransactionHistory();
      Object.assign( this.transactionHistory,res.data);
      this.model = res.data as ReferenceCylindersLOX;

      if (res.data.siteName) {
        this.siteId = res.data.siteId;
        this.siteName = res.data.siteName;
        this.model.siteName = {
          custName: res.data.siteName,
        };
      }
      this.refForm = buildReferenceForm(this.model, this.fb);
      console.log('Edit Form Group:', this.refForm.value);
    });
  }

  changeTabIndex(tab: any) {
    if (tab.index == 1) {
      this.inViewMode = false;
      this.inEditMode = true;
    } else {
      this.inViewMode = true;
      this.inEditMode = false;
    }
  }
  //#endregion

  //#region Site Autocomplete
  searchSites(name: any) {
    this.apiCustomer
      .searchCustomer({ custName: name.query })
      .subscribe((res) => {
        this.sitesList = res.data;
      });
  }
  sendSiteId(site: any) {
    this.refForm.controls['siteId'].setValue(site.id);
    this.siteName = site.custName;
    this.siteId = site.id;
  }
  //#endregion

  //#region Save and Delete
  save() {
    if (this.refForm.invalid) {
      validateForm.validateAllFormFields(this.refForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      this.isLoading = true;
      let m = this.refForm.value as ReferenceCylindersLOX;
      console.log(m);
      if (m.id == 0) {
        //add
        this.api.addCylinderReference(m).subscribe({
          next: (res) => {
            this.apiResponse(res);
            this.isLoading = false;
          },
          error: (e) => {
            console.error('unable to save ', e);
          },
        });
      } else {
        //update
        this.api.updateCylinderReference(m).subscribe({
          next: (res) => {
            this.apiResponse(res);
          },
          error: (e) => {
            console.error('unable to save ', e);
          },
        });
      }
    }
  }

  delete() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete This Reference?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteCylinderReference(this.id).subscribe((res) => {
          this.apiResponse(res);
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'You have cancelled',
        });
      },
    });
  }

  apiResponse(res: any) {
    const message = res.message;
    const sucess = res.isSuccess;
    if (sucess == true) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: message,
        life: 3000,
      });
      this.route.navigate(['maintenance/cylinders-reference/amount']);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000,
      });
    }
  }
}
