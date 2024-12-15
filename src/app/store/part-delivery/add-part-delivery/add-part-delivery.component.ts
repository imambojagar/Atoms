import { CallRequestService } from './../../../services/call-request.service';

import { partDeliverService } from './../partDelivery.service';
import { partDeliveryFormBuilder } from '../formBuilder';
import { PartCatalogService } from './../../partcatalog/part-catalog.service';
import { PartDeliveryModel } from './../part-delivery.model';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
  SelectItem,
} from 'primeng/api';
import { LookupService } from '../../../services/lookup.service';
import { EmployeeService } from '../../../services/employee.service';
import { AssetsService } from '../../../services/assets.service';
import { WorkOrderService } from '../../../services/work-order.service';
import { ServicerequestService } from '../../../services/servicerequest.service';
import { PurchaseOrderService } from '../../../services/purchase-order.service';
import { ApiService } from '../../../services/name-definition.service';
import { ModelDefinitionModel } from '../../../models/model-definition-model';
import validateForm from '../../../shared/helpers/validateForm';
import { Lookup } from '../../../shared/enums/lookup';
import { dateHelper } from '../../../shared/helpers/dateHelper';
import { TransactionHistory } from '../../../shared/models/transaction-history';
/* import validateForm from 'src/app/shared/helpers/validateForm';
import { LookupService } from 'src/app/data/service/lookup.service';
import { EmployeeService } from 'src/app/data/service/employee.service';
import { AssetsService } from 'src/app/data/service/assets.service';
import { ModelDefinitionModel } from 'src/app/data/models/model-definition-model';
import { WorkOrderService } from 'src/app/data/service/work-order.service';
import { PurchaseOrderService } from 'src/app/data/service/purchase-order.service';
import { ServicerequestService } from 'src/app/data/service/servicerequest.service';
import { ApiService } from 'src/app/data/service/name-definition.service'; */

@Component({
  selector: 'add-part-delivery',
  templateUrl: './add-part-delivery.component.html',
  styleUrls: ['./add-part-delivery.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class AddPartDeliveryComponent implements OnInit, OnChanges {

  @Input('showmodal') showmodal : boolean = false ;
  @Input('edit_asset_id') edit_asset_id: any = 0;
  @Input('deposite') deposite: any;
  @Input('queryData') queryData: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('drawer') public modalComponent: any;

  @Input() addPartDeliveryForm: FormGroup = <any>null;
  @Input() model: PartDeliveryModel = <any>null;
  // addPartDeliveryForm!: FormGroup;
  partDeliveryModel: PartDeliveryModel = new PartDeliveryModel();
  items!: MenuItem[];

  //Dropdown Lists
  relatedEmp: any[] = [];
  assets: any[] = [];
  statusWorkflow: any[] = [];
  statusPermission: any[] = [];
  PartsItems: any[] = [];
  customers: any[] = [];
  sparePartStatus: [] = [];
  poNoAutCompleteSource: any[] = [];
  callIdsAutoComplete: any[] = [];
  poId: any;
  workOrderId: any;
  ParentWOId: any;
  steps: any[] = [];
  idPart: any;
  assetId:any;
  storeKeeper:any;
  storeKeeperList:any[]=[];
  transactionHistory!: TransactionHistory
  createdOn!: any;
  modifiedOn!: any;
  noneValue = {
    value: 0,
    userId: null,
    userName: 'None',
  };
  isNeedSpare:boolean=false;
  constructor(
    private formbuilder: FormBuilder,
    private api: partDeliverService,
    private lookupService: LookupService,
    private router: Router,
    private messageService: MessageService,
    private partCatalogService: PartCatalogService,
    private employeeService: EmployeeService,
    private assetsService: AssetsService,
    /* private activatedRoute: ActivatedRoute, */
    private workOrdersService: WorkOrderService,
    private serviceRequest: ServicerequestService,
    private callRequestService: CallRequestService,
    private purchaseOrderService: PurchaseOrderService,
    private apiServiceNameDefinition:ApiService
  ) {}


  ngOnChanges(changes: SimpleChanges): void {
    this.Init();
  }

  close_modal() {
    this.openModals.emit(false);
  }

  ngOnInit(): void {
    this.Init();
  }

   Init(): void {
   /*  this.activatedRoute.queryParams.subscribe((params) => {
      this.poId = params['poId'];
      this.workOrderId = params['workOrderId'];
      this.ParentWOId = params['ParentWOId'];
      this.idPart = params['data'];
    }); */

    console.log("queryData", this.queryData);

    if(this.queryData) {
      this.poId = this.queryData['poId'];
      this.workOrderId = this.queryData['workOrderId'];
      this.ParentWOId = this.queryData['ParentWOId'];
      this.idPart = this.queryData['data'];
    }

    this.idPart = this.edit_asset_id;
    
    if(this.edit_asset_id) {
      this.buildForm();
     
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
         this.model = this.partDeliveryModel;
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
    }

    if (this.model) {
      this.lookupService.getLookUps(Lookup.PartDeliveryWorkFlowApproval).subscribe((a: any) => {
        let res=a.data as any[];
        let obj = res.filter(x=>x.id==this.model.statusWorkflow)
        if (obj[0] && obj[0].value==1)
        {
          this.isNeedSpare=true;
        }
        else
        {
          this.isNeedSpare=false;
        }
      });

    }
    if (this.idPart == undefined) {
      if (this.ParentWOId != undefined) {
        this.workOrdersService
          .getStepsWorkOrder(this.ParentWOId)
          .subscribe((res1) => {
            if (res1.isSuccess) {
              this.steps = res1.data;
            }
          });
      }
    }

    if (this.addPartDeliveryForm == null) this.buildForm();
    else {
      this.buildTempSuggessions();
      if (this.idPart != undefined) {
        this.buildPurchaseNoSuggessions();
        this.buildCallId();
      }
    }

    this.getAutoComplete(
      Lookup.PartDeliveryStatusOfPermission,
      (a) => (this.statusPermission = a)
    );
    this.getAutoComplete(
      Lookup.PartDeliveryWorkFlowApproval,
      (a) => (this.statusWorkflow = a)
    );
    this.getAutoComplete(
      Lookup.SparePartStatus,
      (a) => (this.sparePartStatus = a)
    );
    this.getAssignedEmployee();
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Add Part Delivery' },
    ];
    if (this.idPart == undefined) {
      if (!(this.poId == undefined || this.poId == 0 || this.poId=="" || this.poId==null)) {
        this.purchaseOrderService
          .getPurcahseOrder(this.poId)
          .subscribe((resPO) => {
            if (resPO.data.purchaseOrderSpareParts.length > 0) {

              (this.addPartDeliveryForm.controls['spareParts'] as FormArray).clear();
              let parts: any[] = [];
              parts = resPO.data.purchaseOrderSpareParts;
              parts.forEach((p) => {
                this.partCatalogService
                  .getAutoComplete({ Id: p.partId })
                  .subscribe((a) => {
                    console.log("pppp 1",a)
                    this.lookupService.getLookUps(Lookup.SparePartStatus).subscribe((ttt: any) => {
                      this.sparePartStatus = ttt.data;

                      let statusId=(ttt.data as any[])[0].id;
                    let model = {
                      partNo: a[0],
                      description: a[0].desc,
                      qty: p.quantityRequested,
                      sparePartStatusId: statusId,
                    };
                    (
                      this.addPartDeliveryForm.controls[
                        'spareParts'
                      ] as FormArray
                    ).push(
                      //  this.formbuilder.group(
                      partDeliveryFormBuilder.buildSpareParts(
                        this.formbuilder,
                        model
                      )
                      //   {
                      //   partNo:a[0],
                      //   description:a[0].desc,
                      //   qty:p.quantityRequested,
                      //   returnedQty:0,
                      //   expectedDate:'',
                      //   installedQty:0,
                      //   sparePartStatusId:null
                      // }
                      //   )
                    );
                  });
                 });
              });
            }
          });
      }
      if (!(this.workOrderId == undefined || this.workOrderId == 0)) {
        this.workOrdersService
          .getWorkOrder(this.workOrderId)
          .subscribe((resPO) => {
            if (resPO.data.sparePartsWorkOrders.length > 0) {

              (this.addPartDeliveryForm.controls['spareParts'] as FormArray).clear();
              let parts: any[] = [];
              parts = resPO.data.sparePartsWorkOrders;
              parts.forEach((p) => {
                this.partCatalogService
                  .getAutoComplete({ Id: p.sparePart.id })
                  .subscribe((a) => {
                    this.lookupService.getLookUps(Lookup.SparePartStatus).subscribe((ttt: any) => {
                      this.sparePartStatus = ttt.data;

                      let statusId=(ttt.data as any[])[0].id;
                    console.log("pppp 2",a)
                    let model = {
                      partNo: a[0],
                      description: a[0].desc,
                      qty: p.qty,
                      sparePartStatusId: statusId,
                    };
                    (
                      this.addPartDeliveryForm.controls[
                        'spareParts'
                      ] as FormArray
                    ).push(
                      //  this.formbuilder.group(
                      //{
                      partDeliveryFormBuilder.buildSpareParts(
                        this.formbuilder,
                        model
                      )
                      // partNo:a,
                      // description:a.desc,
                      // qty:p.qty
                      //}
                      //     )
                    );
                  });
                });
              });
            }
          });
      }

      if (!(this.ParentWOId == undefined || this.ParentWOId == 0)) {
        this.workOrdersService
          .getWorkOrder(this.ParentWOId)
          .subscribe((resWO) => {
            this.assetsService
              .GetAssetsAutoComplete(resWO.data.callRequest.asset.assetSerialNo)
              .subscribe((a) => {
                this.assets = a.data;
                this.GetAssetById(resWO.data.callRequest.asset.id);

                this.addPartDeliveryForm
                  .get('assetSN')
                  ?.setValue(resWO.data.callRequest.asset);
                this.addPartDeliveryForm
                  .get('assetNumber')
                  ?.setValue(resWO.data.callRequest.asset);
                this.addPartDeliveryForm
                  .get('assetName')
                  ?.setValue(resWO.data.callRequest.asset);

                // this.callIdsAutoComplete = [
                //   {
                //     id: resWO.data.callRequest.id,
                //     name: resWO.data.callRequest.callNo,
                //   },
                // ];
                this.addPartDeliveryForm.patchValue({
                  callId: resWO.data.callRequest.id,
                  callIdValue: {id:resWO.data.callRequest.id,name: resWO.data.callRequest.callNo},
                });
                let dto={
                  id:resWO.data.callRequest.asset.id
                }
                this.assetsService.GetAssetsAutoCompleteMultiFilter(dto).subscribe(a => {
                  this.assets = a.data
                  this.GetAssetById(resWO.data.callRequest.asset.id);
                   this.addPartDeliveryForm.get('assetNumber')?.setValue(resWO.data.callRequest.asset);
                  //  this.callIdsAutoComplete = [ { id: resWO.data.callRequest.id, name: resWO.data.callRequest.assetNumber } ];
                  //  this.addPartDeliveryForm.patchValue({
                  //   callId: this.callIdsAutoComplete[0].id,
                  //   callIdValue: this.callIdsAutoComplete[0]
                  // });
                });

              });
          });
        if (!(this.poId == undefined || this.poId == 0 || this.poId=="" || this.poId==null)){
          this.purchaseOrderService
            .getPurcahseOrder(this.poId)
            .subscribe((x) => {
             /*  this.poNoAutCompleteSource = [
                {
                  id: this.poId,
                  name: x.data.purchaseOrderNo,
                },
              ]; */
              this.addPartDeliveryForm.patchValue({
                poNo: this.poId,// this.poNoAutCompleteSource[0],
                poNoValue: {id:this.poId,name: x.data.importCodeNo}//x.data.purchaseOrderNo,
              });

            });
        }
      }
    }
  }

  getAssignedEmployee() {
    this.employeeService.searchRoles({ fixedName: 'R-6' }).subscribe((res) => {
      this.employeeService.GetUserByRoleValueSiteAndAssetGroup('R-6').subscribe((res) => {
        this.relatedEmp = res;
        this.relatedEmp.unshift(this.noneValue);
      });
    });

    this.employeeService.searchRoles({ fixedName: 'R-12' }).subscribe((res: any) => {
      this.storeKeeper = res.data[0].id;

      this.employeeService.getAssignedEmp([this.storeKeeper]).subscribe((res: any) => {
        this.storeKeeperList = res;
        console.log("this.storeKeeperList", this.storeKeeperList)
      });
    });
  }

  buildPurchaseNoSuggessions() {
    let data = this.addPartDeliveryForm.getRawValue();
    if (!(data.poNo == undefined || data.poNo == 0 || data.poNo=="" || data.poNo==null)){
      this.purchaseOrderService.getPurcahseOrder(data.poNo).subscribe((x) => {
        this.poNoAutCompleteSource = [
          {
            id: data.poNo,
            name: x.data.importCodeNo,
          },
        ];
        this.addPartDeliveryForm.patchValue({
          poNo: this.poNoAutCompleteSource[0].id,
          poNoValue: this.poNoAutCompleteSource[0],
        });
      });
    }
  }

  buildCallId() {
    let data = this.addPartDeliveryForm.getRawValue();
    if (data.callId != null) {
      this.serviceRequest.getServiceRequestPartById(data.callId).subscribe((x) => {
        this.callIdsAutoComplete = [{ id: data.callId, name: x.data.callNo }];
        this.addPartDeliveryForm.patchValue({
          callId: this.callIdsAutoComplete[0].id,
          callIdValue: this.callIdsAutoComplete[0],
        });
      });
    }
  }

  buildTempSuggessions() {
    if(this.model) {
      for (let index = 0; index < this.model.spareParts.length; index++) {
        const element = this.model.spareParts[index];
        this.partCatalogService
          .getAutoComplete({ Id: <any>element.partNo })
          .subscribe((a) => {
            try {
            this.PartsItems = [...this.PartsItems, a[0]];
            const control = (
              this.addPartDeliveryForm.controls['spareParts'] as FormArray
            ).controls[index] as FormGroup;
            console.log("pppp part items",this.PartsItems)
            control.patchValue({
              partNo: this.PartsItems[index],
              description: this.PartsItems[index].desc,
            });
            control.controls['description'].disable();
          } catch(error) {
             console.log("error", error);
          }

          });
      }
      this.GetAssetById(this.model.assetSN, true);
      this.GetAssetById(this.model.assetNumber, true);
      this.GetAssetById(this.model.assetName, true);
    }
  }

  getControlsFor(form: string) {
    return (this.addPartDeliveryForm.get(form) as FormArray).controls;
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

  buildForm() {
    let Parts = partDeliveryFormBuilder.buildSpareParts(this.formbuilder);
    this.addPartDeliveryForm = partDeliveryFormBuilder.buildForm(
      this.formbuilder,
      Parts
    );
  }

  changeRelatedEmp(event: any) {
    this.addPartDeliveryForm.value.PartType = event.value;
  }

  changeStatusWork(event: any) {
    this.addPartDeliveryForm.value.make = event.value;
    let obj = this.statusWorkflow.filter(x=>x.id==event.value)
    if (obj[0] && obj[0].value==1)
    {
      this.isNeedSpare=true;
    }
    else
    {
      this.isNeedSpare=false;
    }
  }

  changeStatusPermission(event: any) {
    this.addPartDeliveryForm.value.warranty = event.value;
  }

  save() {
    if (this.addPartDeliveryForm.invalid) {
      validateForm.validateAllFormFields(this.addPartDeliveryForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      let partDeliveryModel = JSON.parse(
        JSON.stringify(this.addPartDeliveryForm.getRawValue())
      ) as PartDeliveryModel;
      partDeliveryModel.spareParts.forEach((a) => {
        a.partNo = (<any>a.partNo).id;
        (a as any).sparePartStatus = '';
      });
      dateHelper.reverseDateFilds(partDeliveryModel.spareParts, [
        'expectedDate',
      ]);
      dateHelper.reverseDateFilds(partDeliveryModel, ['date']);
     /* partDeliveryModel.poNo =
        partDeliveryModel.poNo == undefined ? null : partDeliveryModel.poNo.id;
      partDeliveryModel.callId =
        partDeliveryModel.callId == undefined
          ? null
          : partDeliveryModel.callId.id;
      partDeliveryModel.assetSN = (<any>partDeliveryModel).assetSN.id;
      partDeliveryModel.assetName = (<any>partDeliveryModel).assetName.id;
      partDeliveryModel.assetNumber = (<any>partDeliveryModel).assetNumber.id;
      partDeliveryModel.ParentWOId = this.ParentWOId;
      partDeliveryModel.poId = this.poId;
      partDeliveryModel.workOrderId = this.workOrderId;*/
      partDeliveryModel.ParentWOId = this.ParentWOId;
      partDeliveryModel.workOrderId = this.workOrderId;
      partDeliveryModel.poId = this.poId;
      console.log("this.model",this.model)
      console.log("partDeliveryModel",partDeliveryModel)
      //partDeliveryModel.AssetNavigation.id=this.assetId;
     // partDeliveryModel.AssetNavigation={id:this.assetId};
      if (this.model == null || this.model.id == null)
        this.api
          .add(partDeliveryModel)
          .subscribe((res) => this.handleSaveUpdate(res));
      else
        this.api
          .update(partDeliveryModel)
          .subscribe((res) => this.handleSaveUpdate(res));
    }
  }

  handleSaveUpdate(res: any) {
    const message = res.message;
    const sucess = res.isSuccess;
    if (sucess == true) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: message,
        life: 3000,
      });
      this.addPartDeliveryForm.reset();
      this.close_modal();
      /* this.router.navigate(['store/partDelivery']); */
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000,
      });
    }
  }

  completePartCatalog(event: any) {

    return this.partCatalogService.getAutoComplete({ partName: event.query }).subscribe(d => {
      this.PartsItems = d;
    })

  }

  completeAssetService(event: any) {
    this.assetsService
      .GetAssetsAutoComplete(event.query)
      .subscribe((a) => (this.assets = a.data));
  }


  completeAssetName(event: any) {
    this.apiServiceNameDefinition.
    searchNameDefinition(<any>{ assetName: event.query })
    .subscribe((res) => {
      this.assets = res.data;
    })
  }

  // completeAssetNumberService(event: any) {
  //   this.assetsService
  //     .GetAssetsAutoCompleteMultiFilter(<any>{assetNumber:event.query})
  //     .subscribe((res) => {
  //       const data = res.data;
  //       console.log('asset number list', data);
  //       this.assets = data
  //     });
  // }

  getPoNo(data: PartDeliveryModel, addPartDeliveryForm: FormGroup<any>) {
    if (!(data.poNo == null || data.poNo == undefined || data.poNo == "")) {
      this.purchaseOrderService.getPurcahseOrder(data.poNo).subscribe((x) => {
        addPartDeliveryForm.patchValue({
          poNoValue: x.data.purchaseOrderNo,
        });
      });
    }
  }

  getPoNos($event: any) {
    this.purchaseOrderService
      .getAutoComplete({ importCodeNo: $event.query })
      .subscribe((x) => {
        this.poNoAutCompleteSource = x;
      });
      console.log("po numbers",this.poNoAutCompleteSource )
  }

  getCallId(data: PartDeliveryModel, addPartDeliveryForm: FormGroup<any>) {
    if (data.callId != null) {
      try {
      this.serviceRequest.getServiceRequestPartById(data.callId).subscribe((x) => {
        console.log("call id resp",x)
        this.addPartDeliveryForm.patchValue({
          callIdValue: x?.data?.callNo,
        });
      });
     } catch(error) {
       console.log("error", error);
     }
    }
  }

  getCallIds($event: any) {
    this.callRequestService
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
  onSelectCallId($event:any){
    console.log("call id",$event)
    this.addPartDeliveryForm.controls['callId'].patchValue($event.value.id);
    this.addPartDeliveryForm.controls['callIdValue'].patchValue($event.value);

  }
  onSelectPoNO(event:any){
    console.log("po no id",event)
    this.addPartDeliveryForm.controls['poNo'].patchValue(event.value.id);
    this.addPartDeliveryForm.controls['poNoValue'].patchValue(event.value);
  }
  onSelectAsset($event: any) {
    this.GetAssetById($event.id);
  }

  private GetAssetById($event: any, pushToAssetsLst: boolean = false) {

    if($event)
  {  this.assetsService.getAssetById($event).subscribe((a) => {
      const model = a.data.modelDefinition as ModelDefinitionModel;
      console.log("asset event",a)
      this.addPartDeliveryForm.patchValue({
        model: model.modelName,
        modelId: model.id,
        assetSerialNo: a.data.multiAssets[0],
        customerName: a.data.site.custName,
        assetSN: a.data.id,
        assetNumber: a.data.multiAssets[0].assetNumber,
        assetName: a.data.modelDefinition.assetName,
        assetId: a.data.id,
        bindAssetNumber:a.data.multiAssets[0],
        bindAssetSN:a.data.multiAssets[0],
        // expectedDate: null
      });
    //zzo  this.assetId=a.data.id;
      if (pushToAssetsLst) {
        const obj = {
          assetId: a.data.id,
          assetName: a.data.modelDefinition.assetName,
          assetSerialNo: a.data.multiAssets[0].assetSerialNo,
          assetSN: a.data.id,
          assetNumber: a.data.multiAssets[0].assetNumber
        };

        // this.addPartDeliveryForm.patchValue({ assetSN: obj, assetId: obj.id })
        // this.addPartDeliveryForm.patchValue({ assetName: obj, assetId: obj.id })
        // this.addPartDeliveryForm.patchValue({ assetNumber: obj, assetId: obj.id })
        this.assets.push(obj);
      }
    });}
  }

  getAutoComplete(lookup: Lookup, cb: (data: any) => {}) {
    this.lookupService.getLookUps(lookup).subscribe((a: any) => cb(a.data));
  }

  cancel() {
    this.addPartDeliveryForm.reset();
  }

  get partsFormArr() {
    return <FormArray>this.addPartDeliveryForm.get('spareParts');
  }

  getControls(formArr: FormArray) {
    return formArr.controls;
  }
  removeAt(index: number, arr: FormArray) {
    arr.removeAt(index);
  }
  addMoreParts() {
    let ctrl = partDeliveryFormBuilder.buildSpareParts(this.formbuilder);
    ctrl.controls['description'].disable();
    this.partsFormArr.push(ctrl);
  }
  partNoSelected($event: any, idx: number) {
    console.log("llll",$event)
    let ctrl = (this.getControls(this.partsFormArr)[idx] as FormGroup).controls[
      'description'
    ] as FormControl;
    ctrl.setValue($event.desc);
  }

  clickStep(step: any) {
    if (step.typeTransaction == 'W') {
      if (step.processed == false) {
        if (step.parentWOId == null) {
          this.router
            .navigate(['/maintenance/work-orders/add-control'], {
              queryParams: { callId: step.callId },
            })
            .then(() => {
              window.location.reload();
            });
        } else {
          this.router
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
              this.router.navigate(
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
                this.router.navigate(
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
                this.router.navigate(
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
              this.router.navigate(
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
                this.router.navigate(
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
                this.router.navigate(
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
                this.router.navigate(
                  ['/store/part-delivery/add-control'],
                  {
                    queryParams: {
                      poId: last.data.previousId,
                      ParentWOId: step.parentWOId,
                    },
                  }
                );
              } else {
                this.router.navigate(
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
}
