import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfirmationService,
  ConfirmEventType,
  MenuItem,
  Message,
  MessageService,
} from 'primeng/api';
import { WorkOrderService } from '../../../services/work-order.service';
import { SupplierService } from '../../../services/supplier.service';
import { CallRequestService } from '../../../services/call-request.service';
import { EmployeeService } from '../../../services/employee.service';
import { LookupService } from '../../../services/lookup.service';
import { QuotationService } from '../../../services/quotaion.service';
import { AssetsService } from '../../../services/assets.service';
import { PurchaseOrderService } from '../../../services/purchase-order.service';
import { SparePartService } from '../../../services/spare-part.service';
import { SiteContactsService } from '../../../services/site-contacts.service';
import { PartdeliveryService } from '../../../services/partdelivery.service';
import { AssistantEmployeesModel, Attachments } from '../../../models/workorder-model';
import { TransactionHistory } from '../../../shared/models/transaction-history';
import { Lookup } from '../../../shared/enums/lookup';
import { Role } from '../../../shared/enums/role';
import validateForm from '../../../shared/helpers/validateForm';
import { dateHelper } from '../../../shared/helpers/dateHelper';
/* import { SupplierService } from 'src/app/data/service/supplier.service';
import { CallRequestService } from 'src/app/data/service/call-request.service';
import validateForm from 'src/app/shared/helpers/validateForm';
import {
  AssistantEmployeesModel,
  Attachments,
} from 'src/app/data/models/workorder-model';
import { EmployeeService } from 'src/app/data/service/employee.service';
import { WorkOrderService } from 'src/app/data/service/work-order.service';
import { SiteContactsService } from 'src/app/data/service/site-contacts.service';
import { SparePartService } from 'src/app/data/service/spare-part.service';
import { Role } from 'src/app/data/Enum/role';
import { PartdeliveryService } from 'src/app/data/service/partdelivery.service';
import { LookupService } from 'src/app/data/service/lookup.service';
import { Lookup } from 'src/app/data/Enum/lookup';
import { QuotationService } from 'src/app/data/service/quotaion.service';
import { AssetsService } from 'src/app/data/service/assets.service';
import { PurchaseOrderService } from 'src/app/data/service/purchase-order.service';
import { dateHelper } from 'src/app/shared/helpers/dateHelper';
import { TransactionHistory } from 'src/app/shared/models/transaction-history'; */

@Component({
  selector: 'app-work-order-management',
  templateUrl: './work-order-management.component.html',
  styleUrls: ['./work-order-management.component.scss'],
  providers: [MessageService],
})
export class WorkOrderManagementComponent implements OnChanges {

  @Input('showmodal') showmodal : boolean = false ;
  @Input('edit_asset_id') edit_asset_id: any = 0;
  @Input('edit_index') edit_index: any = 0;
  @Input('querydata') querydata: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('drawer') public modalComponent: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    public workOrdersService: WorkOrderService,
    private messageService: MessageService,
    private formbuilder: FormBuilder,
    private supplierService: SupplierService,
    private callRequest: CallRequestService,
    private employeeService: EmployeeService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private sparePartService: SparePartService,
    private siteContactService: SiteContactsService,
    private partdeliveryService: PartdeliveryService,
    private lookupService: LookupService,
    private quotationService: QuotationService,
    private assetService: AssetsService,
    private purchaseService: PurchaseOrderService
  ) {}

 

  items!: MenuItem[];
  workOrderInfoForm!: FormGroup;
  callerInfoForm!: FormGroup;
  woDetailForm!: FormGroup;
  sparePartForm!: FormGroup;
  id: any;
  ParentWOId: any;
  callId: any;
  siteId: any;
  supplier: any;
  suppliers: any[] = [];
  siteContactsForm!: FormGroup;
  sparePartsForm!: FormGroup;
  uploadedFiles: any[] = [];
  siteContactsAutocomplete: any[] = [];
  sparePartsAutocomplete: any[] = [];
  selectedAssistantEmployees: AssistantEmployeesModel[] = [];
  assistantEmployees: AssistantEmployeesModel[] = [];
  isExternal: boolean = false;
  isExternalFromPerviousTransaction: boolean = false;
  typeScreen: string = 'Add';
  listDefect: any[] = [];
  assginedEmployeeId: any;
  listSuppContact: any[] = [];
  listEmployee: any[] = [];
  callslastSituationWO: any[] = [];
  repairLocation: any[] = [];
  steps: any[] = [];
  assetTypeName: any;
  clickSituationId: any;
  hideReturnQty: string = 'true';
  showMRNumber: string = 'false';
  loanAssetAuto: any[] = [];
  attachmentWorkOrderForm!: FormGroup;
  attachmentName: any[] = [];
  originSparePartsWorkOrders: any[] = [];
  assetId: number = 0;
  startMinDate!: Date;
  returnToServiceMinDate!: Date;

  startOfWorkTime: any;
  endOfWorkTime: any;
  isSubmitted: boolean = false;
  transactionHistory!: TransactionHistory;
  showDialog:boolean=false;
  formEngineerSupplier!: FormGroup;
  roleList:any[]=[];
  indexEngineer:number=0;


  ngOnChanges(changes: SimpleChanges): void {
     this.Init();
  }

  close_modal() {
    this.openModals.emit(false);
  }

   Init(): void {
    this.isSubmitted = false;
    this.getRoles();
   /*  this.activatedRoute.queryParams.subscribe((params) => { */
      this.id = this.edit_asset_id; // params['id'];
      this.callId = this.querydata['callId']; // params['callId'];
      this.ParentWOId = this.querydata['ParentWOId']; // params['ParentWOId'];
      this.clickSituationId = this.querydata['clickSituationId']; // params['clickSituationId'];
   /*  }); */

   /*  this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please Fill Required Data',
      life: 3000,
    }); */
    this.items = [{ label: 'Home', routerLink: ['/'] }];

    if (
      !(this.ParentWOId == undefined || this.ParentWOId == 0) ||
      this.id > 0
    ) {
      let parent: number = 0;
      if (this.ParentWOId == undefined || this.ParentWOId == 0) {
        parent = this.id;
      } else {
        parent = this.ParentWOId;
      }
      this.workOrdersService.getStepsWorkOrder(parent).subscribe((res1) => {
        if (res1.isSuccess) {
          this.steps = res1.data;
        }
      });
    }

    this.workOrderInfoForm = this.formbuilder.group({
      callId: [null],
      totalWorkingHours: [null],
      assetNo: [null],
      workOrderNo: [null],
      assetName: [null],
      department: [null],
      assetSN: [null],
      model: [null],
      manufacturer: [null],
      site: [null],
      assetType: [null, Validators.required],
      visitDate: [null],
      equipmentStatus: [null, Validators.required],
      serviceType: [null],
      reasons: [null, Validators.required],
      faultDescription: [null],
      workPerformed: [null],
      callComments: [null],
      loanAvailablity: [null],
      assetLoan: [null],
    });
    this.callerInfoForm = this.formbuilder.group({
      siteContacts: this.formbuilder.array([]),
    });
    this.woDetailForm = this.formbuilder.group({
      assignedEmployee: [null],
      assistantEmployees: [],
      startOfWorkDate: [null],
      startOfWorkTime: [null, Validators.required],
      endOfWorkDate: [null],
      endOfWorkTime: [null, Validators.required],
      workingHours: [null],
      travelingHours: [null],
      travelingExpenses: [null],
      MRNumber: [null],
      callslastSituationWO: [null, Validators.required],
      repairLocation: [null],
      comment: [null],
      supplier: [null],
      vendorTicketNumber: [null],
      suppEngineers: this.formbuilder.array([]),
    });
    this.sparePartForm = this.formbuilder.group({
      spareParts: this.formbuilder.array([]),
    });
    this.formEngineerSupplier = this.formbuilder.group({
      id:[0],
      supplierId:[this.workOrderInfoForm.value.supplier],
      personName:[null,Validators.required],
      personRoleId:[null],
      contact:[null],
      email:[null],
   });
    this.workOrdersService.getLookups(this.callId);
    this.lookupService
      .getLookUps(Lookup.RepairLocation)
      .subscribe((res: any) => {
        let result: any[] = res.data;
        this.repairLocation = result.filter((x) => x.value != 3);
      });
    this.attachmentWorkOrderForm = this.formbuilder.group({
      attachments: this.formbuilder.array([]),
    });

    if (this.ParentWOId == undefined || this.ParentWOId == 0) {
      this.GetLookupCallLastSituationBasedOnCase(0, true, 0, '1');
    } else if (
      (this.id == undefined || this.id == 0) &&
      !(this.ParentWOId == undefined || this.ParentWOId == 0)
    ) {
      this.GetLookupCallLastSituationBasedOnCase(this.ParentWOId, true, 0, '1');
    } else if (
      !(this.id == undefined || this.id == 0) &&
      !(this.ParentWOId == undefined || this.ParentWOId == 0)
    ) {
      this.GetLookupCallLastSituationBasedOnCase(
        this.ParentWOId,
        false,
        this.id,
        'W'
      );
    }

    if (this.id == undefined || this.id == 0) {
      this.typeScreen = 'Add';
      if (this.ParentWOId == null) {
        this.getCallRequestInfo(this.callId == undefined ? 0 : this.callId);
      } else {
        this.workOrdersService
          .lastTransaction(this.ParentWOId)
          .subscribe((last) => {
            if (last.data.previousType == 'W') {
              this.getWorkOrder(last.data.previousId, 'previouseWO', 0);
            } else if (last.data.previousType == 'PD') {
              this.workOrdersService
                .lastTransactionWO(this.ParentWOId)
                .subscribe((lastWo) => {
                  this.getWorkOrder(
                    lastWo.data.previousId,
                    'previousePD',
                    last.data.previousId
                  );
                });
            } else if (last.data.previousType == 'Q') {
              this.workOrdersService
                .lastTransactionWO(this.ParentWOId)
                .subscribe((lastWo) => {
                  this.getWorkOrder(
                    lastWo.data.previousId,
                    'previouseQ',
                    last.data.previousId
                  );
                });
            } else if (
              last.data.previousType == 'PR' ||
              last.data.previousType == 'PO'
            ) {
              this.workOrdersService
                .lastTransactionWO(this.ParentWOId)
                .subscribe((lastWo) => {
                  this.getWorkOrder(
                    lastWo.data.previousId,
                    'previouseP',
                    last.data.previousId
                  );
                });
            }
          });
      }
    } else {
      if (this.router.url.includes('view')) {
        this.typeScreen = 'View';
        this.workOrderInfoForm.disable();
        this.callerInfoForm.disable();
        this.woDetailForm.disable();
        this.sparePartForm.disable();
        this.getWorkOrder(this.id, 'Same', 0);
      } else {
        this.typeScreen = 'Edit';
        this.getWorkOrder(this.id, 'Same', 0);
      }
    }
  }

  GetLookupCallLastSituationBasedOnCase(
    parentWOId: any,
    isAdd: any,
    id: number,
    typeTransaction: string
  ) {
    this.workOrdersService
      .GetLookupCallLastSituationBasedOnCase(
        parentWOId,
        isAdd,
        id,
        typeTransaction
      )
      .subscribe((res: any) => {
        this.callslastSituationWO = res.data;

        if (this.clickSituationId != 5) {
          let sss = this.callslastSituationWO.filter(
            (x) => x.value == this.clickSituationId
          )[0];
          if (sss) {
            this.woDetailForm.controls['callslastSituationWO'].setValue(sss);
          }
        }
        if (this.clickSituationId == 12) {
          this.hideReturnQty = 'false';
          this.showMRNumber = 'true';
        }
      });
  }

  onSelectSupplier(event: any) {
    this.supplierService
      .getSuppliersAutoComplete(event.query)
      .subscribe((data) => {
        this.suppliers = data.data;
      });
  }

  bindSupplier(event: any) {
    this.supplier = event;
    this.listSuppContact = this.supplier?.suppPersons;
    (this.woDetailForm.get('suppEngineers') as FormArray).clear();
    this.addMoreSuppEngineer();
  }
  clearSupplier() {
    this.supplier = null;
    this.listSuppContact = [];
  }
  siteContacts() {
    return (<FormArray>this.callerInfoForm.get('siteContacts')).controls;
  }

  suppContacts() {
    return (<FormArray>this.woDetailForm.get('suppContacts')).controls;
  }

  removeSiteContact(index: number) {
    if ((this.callerInfoForm.get('siteContacts') as FormArray).length == 1) {
      return;
    }
    (this.callerInfoForm.get('siteContacts') as FormArray).removeAt(index);
  }

  addMoreSiteContact() {
    (this.callerInfoForm.get('siteContacts') as FormArray).push(
      this.formbuilder.group({
        id: [0],
        employeeCode: [''],
        contactUserId: [''],
        name: [''],
        telephone: [''],
        job: [''],
        email: [''],
        land: [''],
      })
    );
  }

  spareParts() {
    return (<FormArray>this.sparePartForm.get('spareParts')).controls;
  }

  suppEngineers() {
    return (<FormArray>this.woDetailForm.get('suppEngineers')).controls;
  }

  removeSparePart(index: number) {
    if ((this.sparePartForm.get('spareParts') as FormArray).length == 1) {
      return;
    }
    (this.sparePartForm.get('spareParts') as FormArray).removeAt(index);
  }

  addMoreSparePart() {
    (this.sparePartForm.get('spareParts') as FormArray).push(
      this.formbuilder.group({
        id: [0],
        partId: [0],
        partNo: [null],
        description: [null],
        qty: [0],
      })
    );
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
      console.log(event.files);
    }

    this.messageService.add({
      severity: 'success',
      summary: 'File Upload',
      detail: 'File Uploaded Successfully ! ',
    });
  }

  getCallRequestInfo(callId: number) {
    this.callRequest.GetCallRequestForWorkOrder(callId).subscribe((res) => {
      if (res.data == null) {
       /*  this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Call Request does not exist',
          life: 3000,
        }); */
        setTimeout(() => {
          // this.router.navigate(['maintenance/service-request']);
        }, 3000);
      } else {
        this.workOrderInfoForm.patchValue({
          site: res.data.asset.site.custName,
        });
        this.workOrderInfoForm.patchValue({ callId: res.data.callNo });
        this.workOrderInfoForm.patchValue({
          totalWorkingHours: res.data.totalWorkingHours,
        });
        this.workOrderInfoForm.patchValue({
          assetSN: res.data.asset.assetSerialNo,
        });
        this.workOrderInfoForm.patchValue({
          assetNo: res.data.asset.assetNumber,
        });
        this.workOrderInfoForm.patchValue({
          assetName: res.data.asset.modelDefinition.assetName,
        });
        this.workOrderInfoForm.patchValue({
          department: res.data.asset.department.departmentName,
        });
        this.workOrderInfoForm.patchValue({
          model: res.data.asset.modelDefinition.modelName,
        });
        this.workOrderInfoForm.patchValue({
          manufacturer: res.data.asset.modelDefinition.manufacturerName,
        });
        this.workOrderInfoForm.patchValue({
          callComments: res.data.callComments,
        });
        this.workOrderInfoForm.patchValue({
          loanAvailablity: res.data.loanAvailablity,
        });
        this.workOrderInfoForm.patchValue({ assetLoan: res.data.assetLoan });
        let assetType = this.workOrdersService.assetTypes.filter(
          (x) => x.value == res.data.assetType
        );
        this.workOrderInfoForm.controls['assetType'].setValue(assetType[0]);
        this.assetTypeName = assetType[0].name;
        this.workOrderInfoForm.controls['equipmentStatus'].setValue(
          res.data.defectType
        );
        this.listDefect = res.data.asset.modelDefinition.modelDefRelatedDefects;
        this.assetId = res.data.asset.id;
        this.startMinDate = new Date(res.data.requestedTime);
        this.returnToServiceMinDate = new Date(res.data.requestedTime);
        this.getAssignedEmployees(Role.engineersvalue, this.assetId);
        if (res.data.assignedEmployee == null) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'The Service request does not have assgined employee',
            life: 3000,
          });

          setTimeout(() => {
            // this.router.navigate(['maintenance/service-request']);
          }, 3000);
        } else {
          this.assginedEmployeeId = res.data.assignedEmployee.id;
        }
        if (res.data.firstAction == null) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'The Service request does not have first action',
            life: 3000,
          });

          setTimeout(() => {
            // this.router.navigate(['maintenance/service-request']);
          }, 3000);
        }
        this.woDetailForm.patchValue({
          assignedEmployee: res.data.assignedEmployee.name,
        });
        this.siteId = res.data.asset.site.id;
        this.setExsitingPersons(res.data.callSiteContactPerson);
        this.setExsitingParts();
        this.workOrdersService.GenerateWOCode().subscribe((code) => {
          this.workOrderInfoForm.controls['workOrderNo'].setValue(code.data);
        });
      }
    });
  }

  setExsitingPersons(persons: any[]) {
    persons.forEach((p) => {
      console.log("p", p);
      (this.callerInfoForm.get('siteContacts') as FormArray).push(
        this.formbuilder.group({
          id: 0,
          employeeCode: p.id,
          contactUserId: p.contactUserId,
          name: p.name,
          telephone: p.telephone,
          job: p.job,
          email: p.email,
          land: p.land,
        })
      );
    });
    if ((this.callerInfoForm.get('siteContacts') as FormArray).length == 0) {
      (this.callerInfoForm.get('siteContacts') as FormArray).push(
        this.formbuilder.group({
          id: 0,
          employeeCode: '',
          contactUserId: '',
          name: '',
          telephone: '',
          job: '',
          email: '',
          land: '',
        })
      );
    }

    for (let i = 0; i <= persons.length - 1; i++) {
      if (persons[i].contactUserId == null || persons[i].contactUserId == 0) {
        (this.callerInfoForm.get('siteContacts') as FormArray)
          .at(i)
          .get('employeeCode')
          ?.enable();
        (this.callerInfoForm.get('siteContacts') as FormArray)
          .at(i)
          .get('name')
          ?.enable();
        (this.callerInfoForm.get('siteContacts') as FormArray)
          .at(i)
          .get('telephone')
          ?.enable();
        (this.callerInfoForm.get('siteContacts') as FormArray)
          .at(i)
          .get('job')
          ?.enable();
        (this.callerInfoForm.get('siteContacts') as FormArray)
          .at(i)
          .get('email')
          ?.enable();
        (this.callerInfoForm.get('siteContacts') as FormArray)
          .at(i)
          .get('land')
          ?.enable();
      } else {
        (this.callerInfoForm.get('siteContacts') as FormArray)
          .at(i)
          .get('employeeCode')
          ?.disable();
        (this.callerInfoForm.get('siteContacts') as FormArray)
          .at(i)
          .get('name')
          ?.disable();
        (this.callerInfoForm.get('siteContacts') as FormArray)
          .at(i)
          .get('telephone')
          ?.disable();
        (this.callerInfoForm.get('siteContacts') as FormArray)
          .at(i)
          .get('job')
          ?.disable();
        (this.callerInfoForm.get('siteContacts') as FormArray)
          .at(i)
          .get('email')
          ?.disable();
        (this.callerInfoForm.get('siteContacts') as FormArray)
          .at(i)
          .get('land')
          ?.disable();
      }
    }
  }

  setExsitingParts() {
    (this.sparePartForm.get('spareParts') as FormArray).push(
      this.formbuilder.group({
        id: 0,
        partId: 0,
        partNo: '',
        description: '',
        qty: 0,
      })
    );
  }

  onSelectSiteContact(event: any, fieldSearch: any) {
    var dto = {
      contactPersonName: fieldSearch == 'Name' ? event.query : '',
      contactPersonTitle: fieldSearch == 'Title' ? event.query : '',
    };
    this.siteContactService
      .GetSiteContactsAutoComplete(dto)
      .subscribe((data) => {
        this.siteContactsAutocomplete = data.data;
      });
  }

  bindSiteContact(event: any, index: number) {
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('contactId')
      ?.setValue(event.id);
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('contactTitle')
      ?.setValue(event);
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('contactPerson')
      ?.setValue(event);
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('telephone')
      ?.setValue(event.telephone);
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('job')
      ?.setValue(event.job);
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('email')
      ?.setValue(event.email);
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('landLine')
      ?.setValue(event.land);
  }
  clearSiteContact(index: number) {
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('contactId')
      ?.setValue(0);
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('contactTitle')
      ?.setValue('');
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('contactPerson')
      ?.setValue('');
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('telephone')
      ?.setValue('');
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('job')
      ?.setValue('');
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('email')
      ?.setValue('');
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('landLine')
      ?.setValue('');
  }

  onSelectSparePart(event: any) {
    var dto = {
      id: 0,
      partNo: event.query,
      partName: '',
      AssetId: this.assetId,
    };
    this.sparePartService.GetPartAutoComplete(dto).subscribe((data) => {
      this.sparePartsAutocomplete = data.data;
    });
  }

  bindSparePart(event: any, index: number) {
    let isExists: boolean = false;
    (this.sparePartForm.get('spareParts') as FormArray).controls.forEach(
      (element) => {
        if (element.value.partId == event.id) {
          (this.sparePartForm.get('spareParts') as FormArray)
            .at(index)
            .get('description')
            ?.setValue('');
          (this.sparePartForm.get('spareParts') as FormArray)
            .at(index)
            .get('partId')
            ?.setValue(0);
          (this.sparePartForm.get('spareParts') as FormArray)
            .at(index)
            .get('partNo')
            ?.setValue('');
          isExists = true;
        }
      }
    );
    if (isExists == false) {
      (this.sparePartForm.get('spareParts') as FormArray)
        .at(index)
        .get('description')
        ?.setValue(event.partName);
      (this.sparePartForm.get('spareParts') as FormArray)
        .at(index)
        .get('partId')
        ?.setValue(event.id);
    }
  }
  clearSparePart(index: number) {
    (this.sparePartForm.get('spareParts') as FormArray)
      .at(index)
      .get('description')
      ?.setValue('');
    (this.sparePartForm.get('spareParts') as FormArray)
      .at(index)
      .get('partId')
      ?.setValue(0);
  }

  selectTypeOfWO(event: any) {
    if (this.callslastSituationWO.filter((x) => x.value == 5).length > 0) {
      if (!this.isExternalFromPerviousTransaction) {
        this.isExternal =
          event == null || event.value.value != 5 ? false : true;
      }
      if (event.value.value != 5) {
        this.repairLocation = this.workOrdersService.repairLocation.filter(
          (x) => x.value != 3
        );
      } else {
        this.repairLocation = this.workOrdersService.repairLocation.filter(
          (x) => x.value != 2
        );
      }
    }
    if (event.value.value == 12) {
      this.hideReturnQty = 'false';
      this.showMRNumber = 'true';
      if ((this.typeScreen = 'Add')) {
        this.fillSparePart(this.originSparePartsWorkOrders, '', false);
      } else {
        this.fillSparePart(this.originSparePartsWorkOrders, 'Same', false);
      }
    } else {
      this.hideReturnQty = 'true';
      this.showMRNumber = 'false';
      if ((this.typeScreen = 'Add')) {
        this.fillSparePart(this.originSparePartsWorkOrders, '', true);
      } else {
        this.fillSparePart(this.originSparePartsWorkOrders, 'Same', true);
      }
    }
  }

  save() {
    try {
      this.isSubmitted = true;
      if (
        this.workOrderInfoForm.invalid ||
        this.callerInfoForm.invalid ||
        this.woDetailForm.invalid ||
        this.sparePartForm.invalid
      ) {
        validateForm.validateAllFormFields(this.workOrderInfoForm);
        validateForm.validateAllFormFields(this.callerInfoForm);
        validateForm.validateAllFormFields(this.woDetailForm);
        validateForm.validateAllFormFields(this.sparePartForm);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please Fill Required Data',
          life: 3000,
        });
        this.isSubmitted = false;
      } else {
        let finalData: any = {
          //WO Info
          id: this.id == undefined ? 0 : this.id,
          callRequest: { id: this.callId },
          parentWOId: this.ParentWOId,
          visitDate: this.workOrderInfoForm.value.visitDate,
          assetType: this.workOrderInfoForm.value.assetType,
          equipmentStatus: this.workOrderInfoForm.value.equipmentStatus,
          serviceType: this.workOrderInfoForm.value.serviceType,
          reason:
            this.workOrderInfoForm.value.reasons == null ||
            this.workOrderInfoForm.value.reasons.id == 0
              ? null
              : this.workOrderInfoForm.value.reasons,
          assetLoan:
            this.workOrderInfoForm.value.assetLoan == null ||
            this.workOrderInfoForm.value.assetLoan.id == 0
              ? null
              : this.workOrderInfoForm.value.assetLoan,
          loanAvailablity:
            this.workOrderInfoForm.value.loanAvailablity == null ||
            this.workOrderInfoForm.value.loanAvailablity.id == 0
              ? null
              : this.workOrderInfoForm.value.loanAvailablity,
          faultDescription:
            this.workOrderInfoForm.value.faultDescription == null ||
            this.workOrderInfoForm.value.faultDescription.id == 0
              ? null
              : this.workOrderInfoForm.value.faultDescription,
          //Caller Info
          contactPersonWorkOrders: [],
          //WO Detail
          assignedEmployee: { id: this.assginedEmployeeId },
          assistantEmployees: [],
          startofWorkTime: this.woDetailForm.value.startOfWorkTime,
          endofWorkTime: this.woDetailForm.value.endOfWorkTime,
          workingHours: this.woDetailForm.value.workingHours,
          travelingHours: this.woDetailForm.value.travelingHours,
          travelingExpenses: this.woDetailForm.value.travelingExpenses,
          MRNumber: this.woDetailForm.value.MRNumber,
          calllastSituation:
            this.woDetailForm.value.callslastSituationWO == null ||
            this.woDetailForm.value.callslastSituationWO.id == 0
              ? null
              : this.woDetailForm.value.callslastSituationWO,
          repairLocation:
            this.woDetailForm.value.repairLocation == null ||
            this.woDetailForm.value.repairLocation.id == 0
              ? null
              : this.woDetailForm.value.repairLocation,
          comment: this.woDetailForm.value.comment,
          supplier: this.woDetailForm.value.supplier,
          vendorTicketNumber: this.woDetailForm.value.vendorTicketNumber,
          suppEngineerWorkOrders: [],

          //Spare Parts
          sparePartsWorkOrders: [],
        };
        try {
          finalData.startOfWorkTime = dateHelper.ConvertDateToStringTimeOnly(
            this.woDetailForm.value.startOfWorkTime
          );
        } catch {}
        try {
          finalData.endOfWorkTime = dateHelper.ConvertDateToStringTimeOnly(
            this.woDetailForm.value.endOfWorkTime
          );
        } catch {}
        // Fill Caller Info
        (this.callerInfoForm.get('siteContacts') as FormArray).controls.forEach(
          (element) => {
            if (element.value.name != '') {
              let person: any = {
                id: element.value.id,
                contactUserId: element.value.contactUserId,
                name: element.value.name,
                telephone: element.value.telephone,
                email: element.value.email,
                job: element.value.job,
                land: element.value.land,
              };
              finalData.contactPersonWorkOrders.push(person);
            }
          }
        );
        // Fill assistants employee
        let assistant: any[] = this.woDetailForm.value.assistantEmployees;
        if (assistant != null) {
          assistant.forEach((element) => {
            let emp: any = {
              id: element.id,
              user: { id: element.userId },
            };
            finalData.assistantEmployees.push(emp);
          });
        }
        // fill Spare Parts
        (this.sparePartForm.get('spareParts') as FormArray).controls.forEach(
          (element) => {
            if (element.value.partId != 0) {
              let part: any = {
                id: element.value.id,
                sparePart: {
                  id: element.value.partId,
                },
                qty: element.value.qty,
                returnQty:
                  element.value.returnQty == undefined
                    ? 0
                    : element.value.returnQty,
                installQty:
                  element.value.installQty == undefined
                    ? 0
                    : element.value.installQty,
              };
              finalData.sparePartsWorkOrders.push(part);
            }
          }
        );
        // fill Supplier Engineers
        (this.woDetailForm.get('suppEngineers') as FormArray).controls.forEach(
          (element) => {
            if (
              element.value.woEngineerId != 0 &&
              element.value.woEngineerId != null
            ) {
              let engineer: any = {
                id: element.value.id,
                SupplierContactId: element.value.woEngineerId,
              };
              finalData.suppEngineerWorkOrders.push(engineer);
            }
          }
        );

        if (!finalData.attachmentsWorkOrder) {
          finalData.attachmentsWorkOrder = [];
        }
        (
          this.attachmentWorkOrderForm.get('attachments') as FormArray
        ).controls.forEach((element) => {
          let attach = new Attachments();
          attach.id = element.value.id;
          attach.name = element.value.attachmentName;
          finalData.attachmentsWorkOrder.push(attach);
        });

        if (this.id == undefined || this.id == 0) {
          this.workOrdersService.saveWorkOrder(finalData).subscribe((res) => {
            const message = res.message;
            const sucess = res.isSuccess;
            if (sucess == true) {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: message,
                life: 3000,
              });
              // this.addCustomerForm.reset();
              this.Init();
              this.close_modal();
              // this.router.navigate(['maintenance/work-orders']);
              this.isSubmitted = false;
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: message,
                life: 3000,
              });
              this.isSubmitted = false;
            }
          });
        } else {
          this.workOrdersService.updateWorkOrder(finalData).subscribe((res) => {
            const message = res.message;
            const sucess = res.isSuccess;
            if (sucess == true) {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: message,
                life: 3000,
              });
              // this.addCustomerForm.reset();
              //this.router.navigate(['maintenance/work-orders']);
              this.Init();
              this.close_modal();
              this.isSubmitted = false;
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: message,
                life: 3000,
              });
              this.isSubmitted = false;
            }
          });
        }
      }
    } catch {
      this.isSubmitted = false;
    }
  }

  //GetById
  getWorkOrder(workOrderId: number,woType:string,idNotWO:number)
  {
    this.workOrdersService.getWorkOrder(workOrderId).subscribe(res => {
      if (res.isSuccess)
      {
        this.transactionHistory=new TransactionHistory();
        Object.assign( this.transactionHistory,res.data);

        this.listDefect = res.data.callRequest.asset.modelDefinition.modelDefRelatedDefects;
        this.callId = res.data.callRequest.id;
        this.workOrderInfoForm.controls['site'].setValue(
          res.data.callRequest.asset.site.custName
        );
        this.workOrderInfoForm.controls['callId'].setValue(
          res.data.callRequest.callNo
        );
        this.workOrderInfoForm.controls['totalWorkingHours'].setValue(
          res.data.totalWorkingHours
        );
        this.workOrderInfoForm.controls['assetSN'].setValue(
          res.data.callRequest.asset.assetSerialNo
        );
        this.workOrderInfoForm.controls['assetNo'].setValue(
          res.data.callRequest.asset.assetNumber
        );
        this.workOrderInfoForm.controls['assetName'].setValue(
          res.data.callRequest.asset.modelDefinition.assetName
        );
        this.workOrderInfoForm.controls['department'].setValue(
          res.data.callRequest.asset.department.departmentName
        );
        this.workOrderInfoForm.controls['model'].setValue(
          res.data.callRequest.asset.modelDefinition.modelName
        );
        this.workOrderInfoForm.controls['manufacturer'].setValue(
          res.data.callRequest.asset.modelDefinition.manufacturerName
        );
        this.workOrderInfoForm.controls['assetType'].setValue(
          res.data.assetType
        );
        this.workOrderInfoForm.controls['callComments'].setValue(
          res.data.callRequest.callComments
        );
        this.woDetailForm.controls['MRNumber'].setValue(res.data.mrNumber);
        // this.woDetailForm.controls['callslastSituationWO'].setValue(res.data.callslastSituationWO);
        //this.woDetailForm.value.callslastSituationWO = res.data.calllastSituation;
        this.assetTypeName = res.data.assetType.name;
        this.assetId = res.data.callRequest.asset.id;
        //this.getAssignedEmployees(Role.engineersvalue, this.assetId);
        this.workOrderInfoForm.controls['equipmentStatus'].setValue(
          res.data.equipmentStatus
        );
        this.workOrderInfoForm.controls['serviceType'].setValue(
          res.data.serviceType
        );
        this.startMinDate = new Date(res.data.endofWorkTime);
        this.returnToServiceMinDate = new Date(
          res.data.callRequest.requestedTime
        );

        if (res.data.visitDate) {
          this.workOrderInfoForm.controls['visitDate'].setValue(
            res.data.visitDate
          );
        } else {
          this.workOrderInfoForm.controls['visitDate'].setValue(null);
        }

        this.workOrderInfoForm.controls['reasons'].setValue(res.data.reason);
        this.workOrderInfoForm.controls['faultDescription'].setValue(
          res.data.faultDescription
        );
        this.workOrderInfoForm.controls['workPerformed'].setValue(
          res.data.faultDescription?.workPerformed
        );
        if (woType == 'Same') {
          this.workOrderInfoForm.controls['workOrderNo'].setValue(
            res.data.workOrderNo
          );
          this.workOrderInfoForm.controls['loanAvailablity'].setValue(
            res.data.loanAvailablity
          );
          this.workOrderInfoForm.controls['assetLoan'].setValue(
            res.data.assetLoan
          );
          this.attachmentName = [];
          var att = res.data.attachmentsWorkOrder as any[];
          if (att != null) {
            att.forEach((element) => {
              (
                this.attachmentWorkOrderForm.get('attachments') as FormArray
              ).push(
                this.formbuilder.group({
                  attachmentName: element.name,
                  attachmentURL: element.name,
                  id: element.id,
                })
              );
              this.attachmentName.push(element.name);
            });
          }
        } else {
          this.workOrderInfoForm.controls['loanAvailablity'].setValue(
            res.data.callRequest.loanAvailablity
          );
          this.workOrderInfoForm.controls['assetLoan'].setValue(
            res.data.callRequest.assetLoan
          );
          this.workOrdersService.GenerateWOCode().subscribe((code) => {
            this.workOrderInfoForm.controls['workOrderNo'].setValue(code.data);
          });
        }

        this.woDetailForm.controls['supplier'].setValue(res.data.supplier);
        this.supplier = res.data.supplier;
        this.listSuppContact = this.supplier?.suppPersons;
        this.woDetailForm.controls['vendorTicketNumber'].setValue(
          res.data.vendorTicketNumber
        );
        if (res.data.supplier != null) {
          let suppEngineerWorkOrders: any[] = [];
          suppEngineerWorkOrders = res.data.suppEngineerWorkOrders;
          suppEngineerWorkOrders.forEach((p) => {
            let selectcontact = this.listSuppContact.filter(
              (x) => x.id == p.supplierContactId
            );
            (this.woDetailForm.get('suppEngineers') as FormArray).push(
              this.formbuilder.group({
                id: woType == 'Same' ? p.id : 0,
                woEngineerId: p.supplierContactId,
                personName: selectcontact[0],
                personRoleName: p.personRoleName,
                contact: p.contact,
                externalEngCode: p.externalEngCode,
                email: p.email,
              })
            );
          });
          if (
            (this.woDetailForm.get('suppEngineers') as FormArray).length == 0
          ) {
            this.addMoreSuppEngineer();
          }
        }

        if (woType == 'Same') {
          if (res.data.visitDate) {
            this.workOrderInfoForm.patchValue({
              visitDate: new Date(res.data.visitDate),
            });
          }

          this.woDetailForm.patchValue({
            startOfWorkTime:
              res.data.startofWorkTime == null
                ? null
                : new Date(res.data.startofWorkTime),
            endOfWorkTime:
              res.data.endofWorkTime == null
                ? null
                : new Date(res.data.endofWorkTime),
          });
        }
        if (woType == 'Same') {
          this.woDetailForm.controls['assignedEmployee'].setValue(
            res.data.assignedEmployee.name
          );
          this.assginedEmployeeId = res.data.assignedEmployee.id;
        } else {
          this.woDetailForm.controls['assignedEmployee'].setValue(
            res.data.callRequest.assignedEmployee.name
          );
          this.assginedEmployeeId = res.data.callRequest.assignedEmployee.id;
        }

        this.isExternal = res.data.supplier != null ? true : false;
        this.isExternalFromPerviousTransaction = this.isExternal;
        if (this.isExternal == false) {
          this.repairLocation = this.workOrdersService.repairLocation.filter(
            (x) => x.value != 3
          );
        } else {
          this.repairLocation = this.workOrdersService.repairLocation.filter(
            (x) => x.value != 2
          );
        }

        if (woType == 'Same') {
          this.woDetailForm.controls['callslastSituationWO'].setValue(
            res.data.calllastSituation
          );
          if (res.data.calllastSituation.value == 12) {
            this.hideReturnQty = 'false';
            this.showMRNumber = 'true';
          }

          /* debugger; */
          //this.woDetailForm.controls['callslastSituationWO'].setValue(res.data.calllastSituation);
          this.woDetailForm.controls['MRNumber'].setValue(res.data.mrNumber);
          this.woDetailForm.controls['repairLocation'].setValue(
            res.data.repairLocation
          );
          this.woDetailForm.controls['workingHours'].setValue(
            res.data.workingHours
          );
          this.woDetailForm.controls['travelingHours'].setValue(
            res.data.travelingHours
          );
          this.woDetailForm.controls['travelingExpenses'].setValue(
            res.data.travelingExpenses
          );
          this.woDetailForm.controls['comment'].setValue(res.data.comment);
        }
        let contactPersonWorkOrders: any[] = [];
        contactPersonWorkOrders = res.data.contactPersonWorkOrders;
        contactPersonWorkOrders.forEach((p) => {
          (this.callerInfoForm.get('siteContacts') as FormArray).push(
            this.formbuilder.group({
              id: woType == 'Same' ? p.id : 0,
              employeeCode: p,
              contactUserId: p.contactUserId,
              name: p.name,
              telephone: p.telephone,
              job: p.job,
              email: p.email,
              land: p.land,
            })
          );
        });

        for (let i = 0; i <= contactPersonWorkOrders.length - 1; i++) {
          if (
            contactPersonWorkOrders[i].contactUserId == null ||
            contactPersonWorkOrders[i].contactUserId == 0
          ) {
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('employeeCode')
              ?.enable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('name')
              ?.enable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('telephone')
              ?.enable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('job')
              ?.enable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('email')
              ?.enable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('land')
              ?.enable();
          } else {
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('employeeCode')
              ?.disable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('name')
              ?.disable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('telephone')
              ?.disable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('job')
              ?.disable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('email')
              ?.disable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('land')
              ?.disable();
          }
        }

        if (
          this.typeScreen != 'View' &&
          (this.callerInfoForm.get('siteContacts') as FormArray).length == 0
        ) {
          (this.callerInfoForm.get('siteContacts') as FormArray).push(
            this.formbuilder.group({
              id: 0,
              employeeCode: '',
              contactUserId: '',
              name: '',
              telephone: '',
              job: '',
              email: '',
              land: '',
            })
          );
        }
        let sparePartsWorkOrders: any[] = [];
        if (woType == 'previouseWO') {
          sparePartsWorkOrders = res.data.sparePartsWorkOrders;
          this.originSparePartsWorkOrders = res.data.sparePartsWorkOrders;
          this.fillSparePartRetrieve(sparePartsWorkOrders, woType);
        } else if (woType == 'previousePD') {
          this.partdeliveryService.get(idNotWO).subscribe((respart) => {
            let sparePartsWorkOrders: any[] = [];
            sparePartsWorkOrders = respart.data.spareParts;
            sparePartsWorkOrders.forEach((p) => {
              var dto = {
                id: p.partNo,
              };
              this.sparePartService
                .GetPartAutoComplete(dto)
                .subscribe((dataPart) => {
                  (this.sparePartForm.get('spareParts') as FormArray).push(
                    this.formbuilder.group({
                      id: 0,
                      partId: dataPart.data[0].id,
                      partNo: dataPart.data[0],
                      description: dataPart.data[0].partName,
                      qty: p.qty,
                      returnQty: p.returnQty == undefined ? 0 : p.returnQty,
                      installQty: p.installQty == undefined ? 0 : p.installQty,
                    })
                  );
                });
            });
            if (this.typeScreen != 'View' && sparePartsWorkOrders.length == 0) {
              (this.sparePartForm.get('spareParts') as FormArray).push(
                this.formbuilder.group({
                  id: 0,
                  partId: 0,
                  partNo: '',
                  description: '',
                  qty: 0,
                  returnQty: 0,
                  installQty: 0,
                })
              );
            }
          });
        } else if (woType == 'previouseQ') {
          this.quotationService.getQuotation(idNotWO).subscribe((respart) => {
            let sparePartsWorkOrders: any[] = [];
            sparePartsWorkOrders = respart.data.quotationSpareParts;
            sparePartsWorkOrders.forEach((p) => {
              var dto = {
                id: p.partId,
              };
              this.sparePartService
                .GetPartAutoComplete(dto)
                .subscribe((dataPart) => {
                  (this.sparePartForm.get('spareParts') as FormArray).push(
                    this.formbuilder.group({
                      id: 0,
                      partId: dataPart.data[0].id,
                      partNo: dataPart.data[0],
                      description: dataPart.data[0].partName,
                      qty: p.quantity,
                      returnQty: p.returnQty == undefined ? 0 : p.returnQty,
                      installQty: p.installQty == undefined ? 0 : p.installQty,
                    })
                  );
                });
            });

            if (this.typeScreen != 'View' && sparePartsWorkOrders.length == 0) {
              (this.sparePartForm.get('spareParts') as FormArray).push(
                this.formbuilder.group({
                  id: 0,
                  partId: 0,
                  partNo: '',
                  description: '',
                  qty: 0,
                  returnQty: 0,
                  installQty: 0,
                })
              );
            }
          });
        } else if (woType == 'previouseP') {
          this.purchaseService
            .getPurcahseOrder(idNotWO)
            .subscribe((respart) => {
              let sparePartsWorkOrders: any[] = [];
              sparePartsWorkOrders = respart.data.purchaseOrderSpareParts;
              sparePartsWorkOrders.forEach((p) => {
                var dto = {
                  id: p.partId,
                };
                this.sparePartService
                  .GetPartAutoComplete(dto)
                  .subscribe((dataPart) => {
                    (this.sparePartForm.get('spareParts') as FormArray).push(
                      this.formbuilder.group({
                        id: 0,
                        partId: dataPart.data[0].id,
                        partNo: dataPart.data[0],
                        description: dataPart.data[0].partName,
                        qty: p.quantityRecieved,
                        returnQty: p.returnQty == undefined ? 0 : p.returnQty,
                        installQty:
                          p.installQty == undefined ? 0 : p.installQty,
                      })
                    );
                  });
              });

              if (
                this.typeScreen != 'View' &&
                sparePartsWorkOrders.length == 0
              ) {
                (this.sparePartForm.get('spareParts') as FormArray).push(
                  this.formbuilder.group({
                    id: 0,
                    partId: 0,
                    partNo: '',
                    description: '',
                    qty: 0,
                    returnQty: 0,
                    installQty: 0,
                  })
                );
              }
            });
        } else if (woType == 'Same') {
          sparePartsWorkOrders = res.data.sparePartsWorkOrders;
          this.originSparePartsWorkOrders = res.data.sparePartsWorkOrders;
          this.fillSparePartRetrieve(sparePartsWorkOrders, woType);
        }

        var assistantEmployees: any[] = [];
        assistantEmployees = res.data.assistantEmployees;

        this.employeeService
          .GetUserByRoleValue('R-6', res.data.callRequest.assetId)
          .subscribe((res: any) => {
            let result: any[] = [];
            result = res;
            result.forEach((t) => {
              var emp = new AssistantEmployeesModel();
              (emp.id = 0),
                (emp.userId = t.userId),
                (emp.userName = t.userName);
              this.assistantEmployees.push(emp);
            });

            assistantEmployees.forEach((p) => {
              let emp = new AssistantEmployeesModel();
              emp.id = woType == 'Same' ? p.id : 0;
              emp.userId = p.user.id;
              emp.userName = p.user.name;
              this.selectedAssistantEmployees.push(emp);
            });

            this.woDetailForm.controls['assistantEmployees'].setValue(
              this.selectedAssistantEmployees
            );
          });
      }
    });
  }
  // assistantemployee(assistantEmployees:any[],woType:string){
  //   let assignedEmployeeList:AssistantEmployeesModel[]=[]
  //   assistantEmployees.forEach((p:any) => {
  //     let emp = new AssistantEmployeesModel();
  //     emp.id= woType=="Same" ? p.id : 0;
  //     emp.userId=p.user.id;
  //     emp.userName=p.user.name;
  //     assignedEmployeeList.push(emp);
  //   });
  //   return assignedEmployeeList
  // }

  fillSparePart(
    sparePartsWorkOrders: any[],
    woType: string,
    calcQuantity: boolean = false
  ) {
    //(this.sparePartForm.get('spareParts') as FormArray).clear();
    sparePartsWorkOrders.forEach((p) => {
      (this.sparePartForm.get('spareParts') as FormArray).removeAt(p);
      (this.sparePartForm.get('spareParts') as FormArray).push(
        this.formbuilder.group({
          id: woType == 'Same' ? p.id : 0,
          partId: p.sparePart.id,
          partNo: p.sparePart,
          description: p.sparePart.partName,
          qty: calcQuantity
            ? p.installQty == undefined || p.installQty == 0
              ? p.qty
              : p.installQty
            : p.qty,
          returnQty: p.returnQty == undefined ? 0 : p.returnQty,
          installQty: p.installQty == undefined ? 0 : p.installQty,
        })
      );
    });
    if (
      this.typeScreen != 'View' &&
      (this.sparePartForm.get('spareParts') as FormArray).length == 0
    ) {
      (this.sparePartForm.get('spareParts') as FormArray).push(
        this.formbuilder.group({
          id: 0,
          partId: 0,
          partNo: '',
          description: '',
          qty: 0,
          returnQty: 0,
          installQty: 0,
        })
      );
    }
  }

  fillSparePartRetrieve(
    sparePartsWorkOrders: any[],
    woType: string,
    calcQuantity: boolean = false
  ) {
    //(this.sparePartForm.get('spareParts') as FormArray).clear();
    sparePartsWorkOrders.forEach((p) => {
      //  (this.sparePartForm.get('spareParts') as FormArray).removeAt(p);
      (this.sparePartForm.get('spareParts') as FormArray).push(
        this.formbuilder.group({
          id: woType == 'Same' ? p.id : 0,
          partId: p.sparePart.id,
          partNo: p.sparePart,
          description: p.sparePart.partName,
          qty: calcQuantity
            ? p.installQty == undefined || p.installQty == 0
              ? p.qty
              : p.installQty
            : p.qty,
          returnQty: p.returnQty == undefined ? 0 : p.returnQty,
          installQty: p.installQty == undefined ? 0 : p.installQty,
        })
      );
    });
    if (
      this.typeScreen != 'View' &&
      (this.sparePartForm.get('spareParts') as FormArray).length == 0
    ) {
      (this.sparePartForm.get('spareParts') as FormArray).push(
        this.formbuilder.group({
          id: 0,
          partId: 0,
          partNo: '',
          description: '',
          qty: 0,
          returnQty: 0,
          installQty: 0,
        })
      );
    }
  }

  assistantemployeeCopy(assistantEmployees: any[]) {
    let assignedEmployeeList: AssistantEmployeesModel[] = [];
    assistantEmployees.forEach((p: any) => {
      let emp = new AssistantEmployeesModel();
      emp.id = 0;
      emp.userId = p.user.id;
      emp.userName = p.user.name;
      assignedEmployeeList.push(emp);
    });
    return assignedEmployeeList;
  }
  delete() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this work order?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.workOrdersService.deleteWorkOrder(this.id).subscribe((res) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.router.navigate(['maintenance/work-orders']);
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

  selectStartOfWorkTime($event: any) {
    if (this.woDetailForm.controls['startOfWorkTime'].value) {
      this.startOfWorkTime = new Date(
        this.woDetailForm.controls['startOfWorkTime'].value
      );
      if (this.startOfWorkTime > this.endOfWorkTime) {
        this.woDetailForm.controls['startOfWorkTime'].setValue(null);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The Start date is greater than the End date',
          life: 3000,
        });
      } else if (this.startOfWorkTime < this.startMinDate) {
        this.woDetailForm.controls['startOfWorkTime'].setValue(null);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The Start date should be greater than service request date',
          life: 3000,
        });
      } else {
        this.calculateTime();
      }
    }
  }

  selectEndOfWorkTime($event: any) {
    if (this.woDetailForm.controls['endOfWorkTime'].value) {
      this.endOfWorkTime = new Date(this.woDetailForm.controls['endOfWorkTime'].value);
      if (this.endOfWorkTime < this.startOfWorkTime) {
        this.woDetailForm.controls['endOfWorkTime'].setValue(null);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The End date is less than the Start date',
          life: 3000,
        });
      } else {
        this.calculateTime();
      }
    }
  }

  calculateTime() {
    if (
      this.woDetailForm.value.endOfWorkTime == null ||
      this.woDetailForm.value.startOfWorkTime == null
    ) {
      return;
    }
    let end = new Date(this.woDetailForm.value.endOfWorkTime).getTime();
    let start = new Date(this.woDetailForm.value.startOfWorkTime).getTime();
    let minute = (end - start) / (1000 * 60 * 60);
    this.woDetailForm.controls['workingHours'].setValue(minute.toFixed(2));
  }

  displayWorkPerformed(event: any) {
    this.workOrderInfoForm.controls['workPerformed'].setValue(
      event.value.workPerformed
    );
  }

  onSelectEmployee(event: any) {
    this.employeeService
      .GetEmployeeContactsAutoComplete(event.query)
      .subscribe((data) => {
        this.listEmployee = data;
      });
  }

  bindEmployee(event: any, index: number) {
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('employeeCode')
      ?.setValue(event);
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('name')
      ?.setValue(event.userName);
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('name')
      ?.disable();
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('telephone')
      ?.setValue(event.phone);
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('telephone')
      ?.disable();
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('job')
      ?.setValue(event.job);
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('job')
      ?.disable();
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('email')
      ?.setValue(event.email);
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('email')
      ?.disable();
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('land')
      ?.setValue(event.land);
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('land')
      ?.disable();
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('contactUserId')
      ?.setValue(event.userId);
  }
  clearEmployee(index: number) {
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('employeeCode')
      ?.setValue('');
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('name')
      ?.setValue('');
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('name')
      ?.enable();
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('telephone')
      ?.setValue('');
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('telephone')
      ?.enable();
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('job')
      ?.setValue('');
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('job')
      ?.enable();
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('email')
      ?.setValue('');
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('email')
      ?.enable();
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('land')
      ?.setValue('');
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('land')
      ?.enable();
    (this.callerInfoForm.get('siteContacts') as FormArray)
      .at(index)
      .get('contactUserId')
      ?.setValue('');
  }

  // getParentInfo(id:number,parentId: number)
  // {
  //   this.workOrdersService.getParentInfo(id,parentId).subscribe(res1 => {
  //     if (res1.isSuccess)
  //     {
  //       this.isExternal = res1.data.callLastSituation.value==2?true:false;
  //       if (res1.data.callLastSituation.value!=2)
  //       {
  //         this.repairLocation = this.workOrdersService.repairLocation.filter(x=>x.value != 3);
  //       }
  //       else
  //       {
  //         this.repairLocation = this.workOrdersService.repairLocation.filter(x=>x.value != 2);
  //       }
  //       this.woDetailForm.controls['supplier'].setValue(res1.data.supplier);
  //       this.supplier=res1.data.supplier;
  //       this.listSuppContact=this.supplier?.suppPersons;
  //       this.woDetailForm.controls['vendorTicketNumber'].setValue(res1.data.vendorTicketNumber);
  //       this.workOrderInfoForm.controls['assetType'].setValue(res1.data.assetType);
  //       this.assetTypeName = res1.data.assetType.name;
  //     }
  //   })
  // }

  getAssignedEmployees(value: string, assetId?: number) {
    this.employeeService
      .GetUserByRoleValue(value, assetId)
      .subscribe((res: any) => {
        let result: any[] = [];
        result = res;
        result.forEach((t) => {
          var emp = new AssistantEmployeesModel();
          (emp.id = 0), (emp.userId = t.userId), (emp.userName = t.userName);
          this.assistantEmployees.push(emp);
        });
      });
  }

  clickStep(step: any) {
    if (step.typeTransaction == 'W') {
      if (step.processed == false) {
        if (step.parentWOId == null) {
          /* this.router
            .navigate(['/maintenance/work-orders/add-control'], {
              queryParams: { callId: step.callId },
            })
            .then(() => {
              window.location.reload();
            }); */

            this.querydata.callId = step.callId;
        } else {
          /* this.router
            .navigate(['/maintenance/work-orders/add-control'], {
              queryParams: { callId: step.callId, ParentWOId: step.parentWOId },
            })
            .then(() => {
              window.location.reload();
            }); */
            this.querydata.callId = step.callId;
            this.querydata.ParentWOId = step.parentWOId;
        }
      } else {
        let perantId = step.parentWOId == null ? step.id : step.parentWOId;
        this.workOrdersService
          .GetPreviousAndNextStepById('W', step.id, perantId)
          .subscribe((res) => {
            if (res.isSuccess) {
              if (res.data.nextId != null) {
                if (res.data.previousId == null) {
                  this.router
                    .navigate(['/maintenance/work-orders/view-control'], {
                      queryParams: { id: step.id, callId: step.callId },
                    })
                    .then(() => {
                      window.location.reload();
                    });
                } else {
                  this.router
                    .navigate(['/maintenance/work-orders/view-control'], {
                      queryParams: {
                        id: step.id,
                        ParentWOId: step.parentWOId,
                        callId: step.callId,
                      },
                    })
                    .then(() => {
                      window.location.reload();
                    });
                }
              } else {
                if (res.data.previousId == null) {
                  this.router
                    .navigate(['/maintenance/work-orders/edit-control'], {
                      queryParams: { id: step.id, callId: step.callId },
                    })
                    .then(() => {
                      window.location.reload();
                    });
                } else {
                  this.router
                    .navigate(['/maintenance/work-orders/edit-control'], {
                      queryParams: {
                        id: step.id,
                        ParentWOId: step.parentWOId,
                        callId: step.callId,
                      },
                    })
                    .then(() => {
                      window.location.reload();
                    });
                }
              }
            }
          });
      }
    }
    if (step.typeTransaction == 'Q') {
      if (step.processed == false) {
        this.workOrdersService
          .lastTransaction(step.parentWOId)
          .subscribe((last) => {
            if (last.isSuccess) {
              this.router.navigate(['/maintenance/quotations/add-control'], {
                queryParams: {
                  workerorderId: last.data.previousId,
                  ParentWOId: step.parentWOId,
                },
              });
            }
          });
      } else {
        this.workOrdersService
          .GetPreviousAndNextStepById('Q', step.id, step.parentWOId)
          .subscribe((res) => {
            if (res.isSuccess) {
              if (res.data.nextId != null) {
                this.router.navigate(['/maintenance/quotations/view-control'], {
                  queryParams: {
                    id: step.id,
                    workerorderId: res.data.previousId,
                    ParentWOId: step.parentWOId,
                  },
                });
              } else {
                this.router.navigate(['/maintenance/quotations/edit-control'], {
                  queryParams: {
                    id: step.id,
                    workerorderId: res.data.previousId,
                    ParentWOId: step.parentWOId,
                  },
                });
              }
            }
          });
      }
    }
    if (step.typeTransaction == 'PR') {
      if (step.processed == false) {
        this.workOrdersService
          .lastTransaction(step.parentWOId)
          .subscribe((last) => {
            if (last.isSuccess) {
              this.router.navigate(
                ['/maintenance/purchase-order/add-control'],
                {
                  queryParams: {
                    quotationId: last.data.previousId,
                    ParentWOId: step.parentWOId,
                    isPR: 'PR',
                  },
                }
              );
            }
          });
      } else {
        this.workOrdersService
          .GetPreviousAndNextStepById('PR', step.id, step.parentWOId)
          .subscribe((res) => {
            if (res.isSuccess) {
              if (res.data.nextId != null) {
                this.router.navigate(
                  ['/maintenance/purchase-order/view-control'],
                  {
                    queryParams: {
                      id: step.id,
                      quotationId: res.data.previousId,
                      ParentWOId: step.parentWOId,
                      isPR: 'PR',
                    },
                  }
                );
              } else {
                this.router.navigate(
                  ['/maintenance/purchase-order/edit-control'],
                  {
                    queryParams: {
                      id: step.id,
                      quotationId: res.data.previousId,
                      ParentWOId: step.parentWOId,
                      isPR: 'PR',
                    },
                  }
                );
              }
            }
          });
      }
    }
    if (step.typeTransaction == 'PO') {
      if (step.processed == false) {
        this.workOrdersService
          .lastTransaction(step.parentWOId)
          .subscribe((last) => {
            if (last.isSuccess) {
              this.router.navigate(
                ['/maintenance/purchase-order/add-control'],
                {
                  queryParams: {
                    quotationId: last.data.previousId,
                    ParentWOId: step.parentWOId,
                    isPR: 'PO',
                  },
                }
              );
            }
          });
      } else {
        this.workOrdersService
          .GetPreviousAndNextStepById('PO', step.id, step.parentWOId)
          .subscribe((res) => {
            if (res.isSuccess) {
              if (res.data.nextId != null) {
                this.router.navigate(
                  ['/maintenance/purchase-order/view-control'],
                  {
                    queryParams: {
                      id: step.id,
                      quotationId: res.data.previousId,
                      ParentWOId: step.parentWOId,
                      isPR: 'PO',
                    },
                  }
                );
              } else {
                this.router.navigate(
                  ['/maintenance/purchase-order/edit-control'],
                  {
                    queryParams: {
                      id: step.id,
                      quotationId: res.data.previousId,
                      ParentWOId: step.parentWOId,
                      isPR: 'PO',
                    },
                  }
                );
              }
            }
          });
      }
    }
    if (step.typeTransaction == 'PD') {
      if (step.processed == false) {
        this.workOrdersService
          .lastTransaction(step.parentWOId)
          .subscribe((last) => {
            if (last.isSuccess) {
              if (last.typeTransaction == 'PO') {
                this.router.navigate(
                  ['/store/part-delivery/add-part-delivery'],
                  {
                    queryParams: {
                      poId: last.data.previousId,
                      ParentWOId: step.parentWOId,
                    },
                  }
                );
              } else {
                this.router.navigate(
                  ['/store/part-delivery/add-part-delivery'],
                  {
                    queryParams: {
                      workOrderId: last.data.previousId,
                      ParentWOId: step.parentWOId,
                    },
                  }
                );
              }
            }
          });
      } else {
        this.workOrdersService
          .GetPreviousAndNextStepById('PD', step.id, step.parentWOId)
          .subscribe((res) => {
            if (res.isSuccess) {
              if (res.data.nextId != null) {
                if (res.data.previousType == 'PO') {
                  this.router.navigate(['store/partDelivery/edit-control'], {
                    queryParams: {
                      data: step.id,
                      index: 0,
                      poId: res.data.previousId,
                      ParentWOId: step.parentWOId,
                    },
                  });
                } else {
                  this.router.navigate(['store/partDelivery/edit-control'], {
                    queryParams: {
                      data: step.id,
                      index: 0,
                      workOrderId: res.data.previousId,
                      ParentWOId: step.parentWOId,
                    },
                  });
                }
              } else {
                if (res.data.previousType == 'PO') {
                  this.router.navigate(['store/partDelivery/edit-control'], {
                    queryParams: {
                      data: step.id,
                      index: 1,
                      poId: res.data.previousId,
                      ParentWOId: step.parentWOId,
                    },
                  });
                } else {
                  this.router.navigate(['store/partDelivery/edit-control'], {
                    queryParams: {
                      data: step.id,
                      index: 1,
                      workOrderId: res.data.previousId,
                      ParentWOId: step.parentWOId,
                    },
                  });
                }
              }
            }
          });
      }
    }
  }

  getWorkOrderAddForNextWO(workOrderId: number)
  {
    this.workOrdersService.getWorkOrder(workOrderId).subscribe(res => {
      if (res.isSuccess)
      {
        this.transactionHistory=new TransactionHistory();
        Object.assign( this.transactionHistory,res.data);

        this.listDefect = res.data.callRequest.asset.modelDefinition.modelDefRelatedDefects;
        this.callId = res.data.callRequest.id;
        this.workOrderInfoForm.controls['assistantEmployees'].setValue(
          this.assistantemployeeCopy(res.data.assistantEmployees)
        );
        this.workOrderInfoForm.controls['assetType'].setValue(
          res.data.assetType
        );
        this.workOrderInfoForm.controls['repairLocation'].setValue(
          res.data.repairLocation
        );
        this.workOrderInfoForm.controls['reasons'].setValue(res.data.reason);
        this.workOrderInfoForm.controls['workingHours'].setValue(
          res.data.workingHours
        );
        this.workOrderInfoForm.controls['travelingHours'].setValue(
          res.data.travelingHours
        );
        this.workOrderInfoForm.controls['faultDescription'].setValue(
          res.data.faultDescription
        );
        this.workOrderInfoForm.controls['workPerformed'].setValue(
          res.data.faultDescription?.workPerformed
        );
        this.workOrderInfoForm.controls['reviewComment'].setValue(
          res.data.reviewComment
        );
        this.workOrderInfoForm.controls['comment'].setValue(res.data.comment);
        // this.woDetailForm.controls['callslastSituationWO'].setValue(res.data.callslastSituationWO);
        this.woDetailForm.controls['MRNumber'].setValue(res.data.mrNumber);
        let contactPersonWorkOrders: any[] = [];
        contactPersonWorkOrders = res.data.contactPersonWorkOrders;
        contactPersonWorkOrders.forEach((p) => {
          (this.callerInfoForm.get('siteContacts') as FormArray).push(
            this.formbuilder.group({
              id: 0,
              employeeCode: p,
              contactUserId: p.contactUserId,
              name: p.name,
              telephone: p.telephone,
              job: p.job,
              email: p.email,
              land: p.land,
            })
          );
        });

        for (let i = 0; i <= contactPersonWorkOrders.length - 1; i++) {
          if (
            contactPersonWorkOrders[i].contactUserId == null ||
            contactPersonWorkOrders[i].contactUserId == 0
          ) {
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('name')
              ?.enable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('telephone')
              ?.enable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('job')
              ?.enable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('email')
              ?.enable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('land')
              ?.enable();
          } else {
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('name')
              ?.disable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('telephone')
              ?.disable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('job')
              ?.disable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('email')
              ?.disable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('land')
              ?.disable();
          }
        }

        if (this.typeScreen != 'View') {
          (this.callerInfoForm.get('siteContacts') as FormArray).push(
            this.formbuilder.group({
              id: 0,
              employeeCode: '',
              contactUserId: '',
              name: '',
              telephone: '',
              job: '',
              email: '',
              land: '',
            })
          );
        }
        let sparePartsWorkOrders: any[] = [];
        sparePartsWorkOrders = res.data.sparePartsWorkOrders;
        sparePartsWorkOrders.forEach((p) => {
          (this.sparePartForm.get('spareParts') as FormArray).push(
            this.formbuilder.group({
              id: 0,
              partId: p.sparePart.id,
              partNo: p.sparePart,
              description: p.sparePart.partName,
              qty: p.qty,
              returnQty: p.returnQty == undefined ? 0 : p.returnQty,
              installQty: p.installQty == undefined ? 0 : p.installQty,
            })
          );
        });
        if (this.typeScreen != 'View') {
          (this.sparePartForm.get('spareParts') as FormArray).push(
            this.formbuilder.group({
              id: 0,
              partId: 0,
              partNo: '',
              description: '',
              qty: 0,
              returnQty: 0,
              installQty: 0,
            })
          );
        }
        let assistantEmployees: any[] = [];
        assistantEmployees = res.data.assistantEmployees;
        assistantEmployees.forEach((p) => {
          let emp = new AssistantEmployeesModel();
          emp.id = 0;
          emp.userId = p.user.id;
          emp.userName = p.user.name;
          this.selectedAssistantEmployees.push(emp);
        });
        // this.getParentInfo(workOrderId,res.data.parentWOId==null?0:res.data.parentWOId);
      }
    });
  }

  getPartDeliveryAddForNextWO(workOrderId: number,partdeliveryId: number)
  {
    this.workOrdersService.getWorkOrder(workOrderId).subscribe(res => {
      if (res.isSuccess)
      {
        this.transactionHistory=new TransactionHistory();
        Object.assign( this.transactionHistory,res.data);

        this.listDefect = res.data.callRequest.asset.modelDefinition.modelDefRelatedDefects;
        this.callId = res.data.callRequest.id;
        this.workOrderInfoForm.controls['assistantEmployees'].setValue(
          this.assistantemployeeCopy(res.data.assistantEmployees)
        );
        this.workOrderInfoForm.controls['assetType'].setValue(
          res.data.assetType
        );
        this.workOrderInfoForm.controls['repairLocation'].setValue(
          res.data.repairLocation
        );
        this.workOrderInfoForm.controls['reasons'].setValue(res.data.reason);
        this.workOrderInfoForm.controls['workingHours'].setValue(
          res.data.workingHours
        );
        this.workOrderInfoForm.controls['travelingHours'].setValue(
          res.data.travelingHours
        );
        this.workOrderInfoForm.controls['faultDescription'].setValue(
          res.data.faultDescription
        );
        this.workOrderInfoForm.controls['workPerformed'].setValue(
          res.data.faultDescription?.workPerformed
        );
        this.workOrderInfoForm.controls['reviewComment'].setValue(
          res.data.reviewComment
        );
        this.workOrderInfoForm.controls['comment'].setValue(res.data.comment);
        // this.woDetailForm.controls['callslastSituationWO'].setValue(res.data.callslastSituationWO);
        this.woDetailForm.controls['MRNumber'].setValue(res.data.mrNumber);
        let contactPersonWorkOrders: any[] = [];
        contactPersonWorkOrders = res.data.contactPersonWorkOrders;
        contactPersonWorkOrders.forEach((p) => {
          (this.callerInfoForm.get('siteContacts') as FormArray).push(
            this.formbuilder.group({
              id: 0,
              employeeCode: p,
              contactUserId: p.contactUserId,
              name: p.name,
              telephone: p.telephone,
              job: p.job,
              email: p.email,
              land: p.land,
            })
          );
        });

        for (let i = 0; i <= contactPersonWorkOrders.length - 1; i++) {
          if (
            contactPersonWorkOrders[i].contactUserId == null ||
            contactPersonWorkOrders[i].contactUserId == 0
          ) {
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('name')
              ?.enable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('telephone')
              ?.enable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('job')
              ?.enable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('email')
              ?.enable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('land')
              ?.enable();
          } else {
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('name')
              ?.disable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('telephone')
              ?.disable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('job')
              ?.disable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('email')
              ?.disable();
            (this.callerInfoForm.get('siteContacts') as FormArray)
              .at(i)
              .get('land')
              ?.disable();
          }
        }

        if (this.typeScreen != 'View') {
          (this.callerInfoForm.get('siteContacts') as FormArray).push(
            this.formbuilder.group({
              id: 0,
              employeeCode: '',
              contactUserId: '',
              name: '',
              telephone: '',
              job: '',
              email: '',
              land: '',
            })
          );
        }
        this.partdeliveryService.get(partdeliveryId).subscribe((respart) => {
          let sparePartsWorkOrders: any[] = [];
          sparePartsWorkOrders = respart.data.spareParts;
          sparePartsWorkOrders.forEach((p) => {
            var dto = {
              id: p.partNo,
            };
            this.sparePartService
              .GetPartAutoComplete(dto)
              .subscribe((dataPart) => {
                (this.sparePartForm.get('spareParts') as FormArray).push(
                  this.formbuilder.group({
                    id: 0,
                    partId: dataPart.data[0].id,
                    partNo: dataPart.data[0],
                    description: dataPart.data[0].partName,
                    qty: p.qty,
                    returnQty: 0,
                    installQty: 0,
                  })
                );
              });
          });
          if (this.typeScreen != 'View') {
            (this.sparePartForm.get('spareParts') as FormArray).push(
              this.formbuilder.group({
                id: 0,
                partId: 0,
                partNo: '',
                description: '',
                qty: 0,
                returnQty: 0,
                installQty: 0,
              })
            );
          }
        });

        let assistantEmployees: any[] = [];
        assistantEmployees = res.data.assistantEmployees;
        assistantEmployees.forEach((p) => {
          let emp = new AssistantEmployeesModel();
          emp.id = 0;
          emp.userId = p.user.id;
          emp.userName = p.user.name;
          this.selectedAssistantEmployees.push(emp);
        });
        // this.getParentInfo(workOrderId,res.data.parentWOId==null?0:res.data.parentWOId);
      }
    });
  }

  addMoreSuppEngineer() {
    (this.woDetailForm.get('suppEngineers') as FormArray).push(
      this.formbuilder.group({
        id: [0],
        woEngineerId: [0],
        personName: [null],
        personRoleName: [null],
        contact: [null],
        externalEngCode: [null],
        email: [null],
      })
    );
  }

  removeSuppEngineer(index: number) {
    if ((this.woDetailForm.get('suppEngineers') as FormArray).length == 1) {
      return;
    }
    (this.woDetailForm.get('suppEngineers') as FormArray).removeAt(index);
  }
  selectSuppEngineer(index: number, event: any) {
    (this.woDetailForm.get('suppEngineers') as FormArray)
      .at(index)
      .get('woEngineerId')
      ?.setValue(event.value.id);
    (this.woDetailForm.get('suppEngineers') as FormArray)
      .at(index)
      .get('personName')
      ?.setValue(event.value);
    (this.woDetailForm.get('suppEngineers') as FormArray)
      .at(index)
      .get('personRoleName')
      ?.setValue(event.value.personRoleName);
    (this.woDetailForm.get('suppEngineers') as FormArray)
      .at(index)
      .get('contact')
      ?.setValue(event.value.contact);
    (this.woDetailForm.get('suppEngineers') as FormArray)
      .at(index)
      .get('externalEngCode')
      ?.setValue(event.value.externalEngCode);
    (this.woDetailForm.get('suppEngineers') as FormArray)
      .at(index)
      .get('email')
      ?.setValue(event.value.email);
  }

  selectSuppEngineerAfterAdd(index: number, data: any) {
    (this.woDetailForm.get('suppEngineers') as FormArray)
      .at(index)
      .get('woEngineerId')
      ?.setValue(data.id);
    (this.woDetailForm.get('suppEngineers') as FormArray)
      .at(index)
      .get('personName')
      ?.setValue(data);
    (this.woDetailForm.get('suppEngineers') as FormArray)
      .at(index)
      .get('personRoleName')
      ?.setValue(data.personRoleName);
    (this.woDetailForm.get('suppEngineers') as FormArray)
      .at(index)
      .get('contact')
      ?.setValue(data.contact);
    (this.woDetailForm.get('suppEngineers') as FormArray)
      .at(index)
      .get('externalEngCode')
      ?.setValue(data.externalEngCode);
    (this.woDetailForm.get('suppEngineers') as FormArray)
      .at(index)
      .get('email')
      ?.setValue(data.email);
  }
  createSurvey() {
    this.router.navigate(
      ['../hr/customer-service/customer-service-management'],
      { queryParams: { callId: this.callId } }
    );
  }

  getAssetLoan(searchText: any = '') {
    var dto = {
      assetNumber: searchText,
    };
    this.assetService.GetAssetsAutoCompleteMultiFilter(dto).subscribe((res) => {
      this.loanAssetAuto = res.data;
    });
  }

  bindAssetLoan(event: any) {
    var assetLoan = this.workOrderInfoForm.get('assetLoan') as FormControl;
    assetLoan.setValue({ id: event.id, assetNumber: event.assetNumber });
  }
  clearAssetLoan() {
    var assetLoan = this.workOrderInfoForm.get('assetLoan') as FormControl;
    assetLoan.setValue(null);
  }
  onChange(event: any) {
    if (event.value != 1) {
      var assetLoan = this.workOrderInfoForm.get('assetLoan') as FormControl;
      assetLoan.setValue(null);
    }
  }
  get loanAvaliblity() {
    return this.workOrderInfoForm.get('loanAvailablity') as FormControl;
  }

  attachmentReady(event: any) {
    (this.attachmentWorkOrderForm.get('attachments') as FormArray).push(
      this.formbuilder.group({
        attachmentName: event[0],
        attachmentURL: [''],
        id: 0,
      })
    );
  }
  attachmentDelete(event: any) {
    (this.attachmentWorkOrderForm.get('attachments') as FormArray).removeAt(
      event
    );
  }

  addEngineerForSupplier(i:number){

    if (this.woDetailForm.value.supplier ==undefined || this.woDetailForm.value.supplier ==null)
    {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select supplier',
        life: 3000,
      });
    }
    else
    {
    this.formEngineerSupplier.reset();
    this.indexEngineer=i;
    this.showDialog=true;
    }

  }

  addengineer(){

    if (
      this.formEngineerSupplier.invalid
    ) {
      validateForm.validateAllFormFields(this.formEngineerSupplier);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    }
    else
    {
      var finalData:any={
        id:0,
        supplierId:this.woDetailForm.value.supplier.id,
        personName:this.formEngineerSupplier.value.personName,
        personRoleId:this.formEngineerSupplier.value.personRoleId,
        contact:this.formEngineerSupplier.value.contact,
        email:this.formEngineerSupplier.value.email,
      };
      this.supplierService.AddSupplierEngineer(finalData).subscribe((res) => {
      if (res.isSuccess==true)
      {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.message,
          life: 3000,
        });
        this.listSuppContact.push(res.data);
        this.selectSuppEngineerAfterAdd(this.indexEngineer,res.data);
        this.showDialog=false;
      }
      else
      {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: res.message,
          life: 3000,
        });
      }
      });

    }



  }

  getRoles(){

    this.lookupService.getLookUps(Lookup.Person_Role).subscribe((res: any) => {
      this.roleList=res.data;
    })


  }
}
