import { partDeliveryFormBuilder } from '../formBuilder';
import { partDeliverService } from './../partDelivery.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MessageService,
  ConfirmationService,
  Message,
  MenuItem,
} from 'primeng/api';
import { PartDeliveryModel } from '../part-delivery.model';
import { TransactionHistory } from '../../../shared/models/transaction-history';
import { WorkOrderService } from '../../../services/work-order.service';
import { PurchaseOrderService } from '../../../services/purchase-order.service';
import { ServicerequestService } from '../../../services/servicerequest.service';
import { EmployeeService } from '../../../services/employee.service';
import { LookupService } from '../../../services/lookup.service';
import { Lookup } from '../../../shared/enums/lookup';
import { dateHelper } from '../../../shared/helpers/dateHelper';
/* import { dateHelper } from 'src/app/shared/helpers/dateHelper';
import { WorkOrderService } from 'src/app/data/service/work-order.service';
import { PurchaseOrderService } from 'src/app/data/service/purchase-order.service';
import { ServicerequestService } from 'src/app/data/service/servicerequest.service';
import { EmployeeService } from 'src/app/data/service/employee.service';
import { Lookup } from 'src/app/data/Enum/lookup';
import { LookupService } from 'src/app/data/service/lookup.service';
import { TransactionHistory } from 'src/app/shared/models/transaction-history'; */

@Component({
  selector: 'view-details-part-delivery',
  templateUrl: './view-details-part-delivery.component.html',
  styleUrls: ['./edit-delete-part-delivery.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class ViewDetailsPartDeliveryComponent implements OnChanges {

  @Input('showmodal') showmodal : boolean = false ;
  @Input('edit_asset_id') edit_asset_id: any = 0;
  @Input('deposite') deposite: any;
  @Input('queryData') queryData: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('drawer') public modalComponent: any;

  addPartDeliveryForm!: FormGroup;
  partDeliveryModel: PartDeliveryModel = <any>null;
  items!: MenuItem[];
  tabIndex: number = 0;

  //Dropdown Lists
  createdOn!: any;
  callIdsAutoComplete: any[] = [];
  poNoAutCompleteSource: any[] = [];
  modifiedOn!: any;
  poId: any;
  workOrderId: any;
  ParentWOId: any;
  idPart: any;
  isDisplayEdit: boolean = true;
  isDisplayView: boolean = false;
  steps: any[] = [];
  isNeedSpare:boolean=false;
  statusWorkflow:any[]=[];

  transactionHistory!: TransactionHistory
  constructor(
    private router: ActivatedRoute,
    private formbuilder: FormBuilder,
    private api: partDeliverService,

    private messageService: MessageService,
    private workOrdersService: WorkOrderService,
    private purchaseOrder: PurchaseOrderService,
    private serviceRequest: ServicerequestService,
    private route: Router,
    private employeeService: EmployeeService,
    private lookupService:LookupService
  ) {}

  close_modal() {
    this.openModals.emit(false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.Init();
  }

   Init(): void {
    this.buildForm();
    this.getAutoComplete(
      Lookup.PartDeliveryWorkFlowApproval,
      (a) => (this.statusWorkflow = a)
    );
    /* this.router.queryParams.subscribe((params: any) => { */
      /* this.tabIndex = params.index;
      this.ParentWOId = params.ParentWOId;
      this.workOrderId = params.workOrderId;
      this.poId = params.poId; */
      console.log("edit_asset_id", this.edit_asset_id);
      if(this.queryData) {
        this.poId = this.queryData['poId'];
        this.workOrderId = this.queryData['workOrderId'];
        this.ParentWOId = this.queryData['ParentWOId'];
        this.idPart = this.queryData['data'];
      }
      if (this.ParentWOId) {
        this.workOrdersService
          .getStepsWorkOrder(this.ParentWOId)
          .subscribe((res1) => {
            if (res1.isSuccess) {
              this.steps = res1.data;
            }
          });
      }

      /* if (!(this.ParentWOId == undefined || this.ParentWOId == 0)) {
        if (this.tabIndex == 0) {
          this.isDisplayEdit = false;
        } else {
          this.isDisplayView = false;
        }
      } */

      this.api.get(this.edit_asset_id).subscribe((res) => {
         console.log("Api res:",res)
        const data = res.data as PartDeliveryModel;
        const message = res.message;
        const sucess = res.isSuccess;
        this.transactionHistory=new TransactionHistory();
        Object.assign( this.transactionHistory,res.data);
        if (sucess == true) {
          dateHelper.parseDateFilds(data, ['date']);
          this.partDeliveryModel = data;
          console.log("this.partDeliveryModel",this.partDeliveryModel)
          console.log("data.spareParts",data.spareParts)
          data.spareParts.forEach((element: any) =>
            dateHelper.parseDateFilds(element, ['expectedDate'])
          );
          for (let index = 0; index < data.spareParts.length - 1; index++)
            this.getControlsFor('spareParts').push(
              partDeliveryFormBuilder.buildSpareParts(this.formbuilder)
            );
            let obj = this.statusWorkflow.filter(x=>x.id==data.statusWorkflow)
            if (obj[0] && obj[0].value==1)
            {
              this.isNeedSpare=true;
            }
            else
            {
              this.isNeedSpare=false;
            }
          data.spareParts.forEach(
            (x) => (x.sparePartStatusId = parseInt(x.sparePartStatusId))
          );
          this.getPoNo(data, this.addPartDeliveryForm);
          this.getCallId(data, this.addPartDeliveryForm);
          this.addPartDeliveryForm.patchValue(data);
          if (data.relatedEmp != null)
          {
            this.employeeService
            .getEmployeeById(<any>data.relatedEmp)
            .subscribe((a) => {
              this.addPartDeliveryForm
                .get('relatedEmpName')
                ?.setValue(a.userName);
            });
          }

          this.createdOn = data.createdOn;
          this.modifiedOn = data.modifiedOn;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000,
          });
        }
      });
    /* }); */
  }
  getCallId(data: PartDeliveryModel, addPartDeliveryForm: FormGroup<any>) {
    try {
    if (data.callId != null) {
      this.serviceRequest.getServiceRequestPartById(data.callId).subscribe((x) => {
        console.log("call id resp",x)
        this.addPartDeliveryForm.patchValue({
          callIdValue: x?.data?.callNo,
        });
      });
    } 
    } catch(error) {
      console.log("error", error);
    }
  }
  getCallIds($event: any) {
    this.serviceRequest
      .GetCallRequestAutoComplete($event.query)
      .subscribe((r) => {
        this.callIdsAutoComplete = r.data.map(
          (x: any) =>
            <any>{
              id: x.id,
              name: x.callNo,
            }
        );
      });
  }
  getPoNo(data: PartDeliveryModel, addPartDeliveryForm: FormGroup<any>) {
    if (!(data.poNo == null || data.poNo == undefined || data.poNo == "")) {
      this.purchaseOrder.getPurcahseOrder(data.poNo).subscribe((x) => {
        addPartDeliveryForm.patchValue({
          poNoValue: x.data.purchaseOrderNo,
        });
      });
    }
  }

  getPoNos($event: any) {
    this.purchaseOrder
      .getAutoComplete({ purchaseOrderNo: $event.query })
      .subscribe((x) => {
        this.poNoAutCompleteSource = x;
      });
      console.log("po numbers",this.poNoAutCompleteSource )
  }


  get assetNumber() {
    if (this.addPartDeliveryForm.value.assetNumber)
      return this.addPartDeliveryForm.value.assetNumber;
    return "";
  }

  get assetName() {
    if (this.addPartDeliveryForm.value.assetName)
      return this.addPartDeliveryForm.value.assetName;
    return "";
  }

  get assetSN() {
    if (this.addPartDeliveryForm.value.assetSN)
      return this.addPartDeliveryForm.value.assetSN.assetSerialNo;
    return '';
  }

  private buildForm() {
    let parts = partDeliveryFormBuilder.buildSpareParts(this.formbuilder);
    this.addPartDeliveryForm = partDeliveryFormBuilder.buildForm(
      this.formbuilder,
      parts
    );
  }

  getControlsFor(form: string) {
    return (this.addPartDeliveryForm.get(form) as FormArray).controls;
  }

  clickStep(step: any) {
    if (step.typeTransaction == 'W') {
      if (step.processed == false) {
        if (step.parentWOId == null) {
          this.route
            .navigate(['/maintenance/work-orders/add-control'], {
              queryParams: { callId: step.callId },
            })
            .then(() => {
              window.location.reload();
            });
        } else {
          this.route
            .navigate(['/maintenance/work-orders/add-control'], {
              queryParams: { callId: step.callId, ParentWOId: step.parentWOId },
            })
            .then(() => {
              window.location.reload();
            });
        }
      } else {
        let perantId = step.parentWOId == null ? step.id : step.parentWOId;
        this.workOrdersService
          .GetPreviousAndNextStepById('W', step.id, perantId)
          .subscribe((res) => {
            if (res.isSuccess) {
              if (res.data.nextId != null) {
                if (res.data.previousId == null) {
                  this.route
                    .navigate(['/maintenance/work-orders/view-control'], {
                      queryParams: { id: step.id, callId: step.callId },
                    })
                    .then(() => {
                      window.location.reload();
                    });
                } else {
                  this.route
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
                  this.route
                    .navigate(['/maintenance/work-orders/edit-control'], {
                      queryParams: { id: step.id, callId: step.callId },
                    })
                    .then(() => {
                      window.location.reload();
                    });
                } else {
                  this.route
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
              this.route.navigate(
                ['/maintenance/quotations/add-control'],
                {
                  queryParams: {
                    workerorderId: last.data.previousId,
                    ParentWOId: step.parentWOId,
                  },
                }
              );
            }
          });
      } else {
        this.workOrdersService
          .GetPreviousAndNextStepById('Q', step.id, step.parentWOId)
          .subscribe((res) => {
            if (res.isSuccess) {
              if (res.data.nextId != null) {
                this.route.navigate(
                  ['/maintenance/quotations/view-control'],
                  {
                    queryParams: {
                      id: step.id,
                      workerorderId: res.data.previousId,
                      ParentWOId: step.parentWOId,
                    },
                  }
                );
              } else {
                this.route.navigate(
                  ['/maintenance/quotations/edit-control'],
                  {
                    queryParams: {
                      id: step.id,
                      workerorderId: res.data.previousId,
                      ParentWOId: step.parentWOId,
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
              this.route.navigate(
                ['/maintenance/purchase-order/add-control'],
                {
                  queryParams: {
                    quotationId: last.data.previousId,
                    ParentWOId: step.parentWOId,
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
                this.route.navigate(
                  ['/maintenance/purchase-order/view-control'],
                  {
                    queryParams: {
                      id: step.id,
                      quotationId: res.data.previousId,
                      ParentWOId: step.parentWOId,
                    },
                  }
                );
              } else {
                this.route.navigate(
                  ['/maintenance/purchase-order/adit-control'],
                  {
                    queryParams: {
                      id: step.id,
                      quotationId: res.data.previousId,
                      ParentWOId: step.parentWOId,
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
                this.route.navigate(
                  ['/store/part-delivery/add-control'],
                  {
                    queryParams: {
                      poId: last.data.previousId,
                      ParentWOId: step.parentWOId,
                    },
                  }
                );
              } else {
                this.route.navigate(
                  ['/store/part-delivery/add-control'],
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
                  this.route.navigate(['store/partDelivery/edit-control'], {
                    queryParams: {
                      data: step.id,
                      index: 0,
                      poId: res.data.previousId,
                      ParentWOId: step.parentWOId,
                    },
                  });
                } else {
                  this.route.navigate(['store/partDelivery/edit-control'], {
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
                  this.route.navigate(['store/partDelivery/edit-control'], {
                    queryParams: {
                      data: step.id,
                      index: 1,
                      poId: res.data.previousId,
                      ParentWOId: step.parentWOId,
                    },
                  });
                } else {
                  this.route.navigate(['store/partDelivery/edit-control'], {
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

  getAutoComplete(lookup: Lookup, cb: (data: any) => {}) {
    this.lookupService.getLookUps(lookup).subscribe((a: any) => cb(a.data));
  }


}
