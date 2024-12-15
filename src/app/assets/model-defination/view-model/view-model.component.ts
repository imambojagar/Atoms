import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  Attachments,
  ModelDefinitionModel,
  modelDefRelatedDefects,
  Suppliers,
} from '../../../models/model-definition-model';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ConfirmationService,
  ConfirmEventType,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ModelService } from '../../../services/model-definition.service';
import { dateHelper } from '../../../shared/helpers/dateHelper';
import { TransactionHistory } from '../../../shared/models/transaction-history';
import { PrimengModule } from '../../../shared/primeng.module';
import { CommonModule } from '@angular/common';
import { TransactionHistoryComponent } from '../../../shared/components/transaction-history/transaction-history.component';
import { AttachmentsComponent } from '../../../shared/components/attachments/attachments.component';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TrPipe } from '../../../shared/pipes/tr.pipe';

@Component({
  selector: 'app-view-model',
  standalone: true,
  imports: [PrimengModule, ReactiveFormsModule, TranslateModule, TrPipe, TransactionHistoryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './view-model.component.html',
  styleUrl: './view-model.component.scss',
  providers: [TranslatePipe, TrPipe]

})
export class ViewModelComponent implements OnChanges {
  @Input('showmodal') showmodal: boolean = false;
  @ViewChild('drawer') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('edit_model_id') edit_model_id: any;
  @Input('edit_model_index') edit_model_index: any;
  PAGE_TITLE: 'model-definition' = "model-definition";
  modelDefinitionModel: ModelDefinitionModel = new ModelDefinitionModel();
  addModelForm!: FormGroup;
  attachmentForm!: FormGroup;
  items!: MenuItem[];
  tabIndex: number = 0;
  transactionHistory!: TransactionHistory;
  //For Asset
  assetId!: number;
  asset = [];
  modelId!: number;
  manufacturer = '';
  model = [];
  supplierId!: number;
  suppliersList = [];

  uploadedFiles: any[] = [];
  fileList: File[] = [];
  photoList: File[] = [];

  country = [];
  warranty = [];
  frequency: any[] = [];
  RelatedDefects!: FormGroup;
  defectsList: any[] = [];
  defects: any[] = [];
  attachmentName: any[] = [];
  picNameApi: any[] = [];
  pics: any;

  createdOn: any;
  modifiedOn: any;

  check: boolean = false;
  style = '';

  suppliers: any[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private router: ActivatedRoute,
    private authService: AuthService,
    private route: Router,
    private formbuilder: FormBuilder,
    private api: ModelService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.Init();
  }

  Init(): void {
    // this.authService.isAuthenticated = true;
    this.addModelForm = this.formbuilder.group({
      id: [],
      modelDefCode: [],
      assetNDId: ['', Validators.required],
      assetNDAssetName: [],
      assetNDAssetNameView: [],
      modelId: ['', Validators.required],
      modelTaxonomyName: [],
      modelTaxonomyNameView: [],
      modelParentTaxonomyName: [],
      supplierId: [],
      suppliersuppliername: [],
      suppliersuppliernameView: [],
      countryOfOriginId: [],
      countryOfOriginName: [],
      endOfSupportDate: [],
      stopProductionDate: [],
      endOfSupportDateView: [],
      stopProductionDateView: [],
      sfda: [],
      warrantyPeriodId: [],
      warrantyPeriodName: [],
      initials: [],
      division: [],
      ecri: [],
      ppmFrequencyId: ['', Validators.required],
      ppmFrequencyName: [],
      specialTools: [],
      preInstallationChkLst: [],
      installationChkLst: [],
      calibrationTask: [],
      modelAccessories: [],
      ppmChkLst: [],
      picName: [],
      modelDefRelatedDefects: this.formbuilder.array([]),
      suppliers: this.formbuilder.array([]),
      modelDefTCodes: this.formbuilder.array([]),
      createdDate: [],
      modifiedOn: [],
    });

    this.attachmentForm = this.formbuilder.group({
      attachments: this.formbuilder.array([]),
    });
    this.getCountry();
    this.getWarranty();
    this.getFrequency();
    this.getDefects();
    // this.router.queryParams.subscribe((params: any) => {
    this.modelDefinitionModel.id = this.edit_model_id;
    this.tabIndex = this.edit_model_index;
    this.api
      .getSingleModelDefinition(this.modelDefinitionModel.id)
      .subscribe((res: any) => {
        this.transactionHistory = new TransactionHistory();
        Object.assign(this.transactionHistory, res?.data);
        if (res?.endOfSupportDate != null) {
          this.addModelForm.controls['endOfSupportDateView'].setValue(
            new Date(res?.endOfSupportDate).toDateString()
          );
        }

        if (res?.stopProductionDate != null) {
          this.addModelForm.controls['stopProductionDateView'].setValue(
            new Date(res?.stopProductionDate).toDateString()
          );
        }
        dateHelper.parseDateFilds(res, [
          'endOfSupportDate',
          'stopProductionDate',
        ]);

        this.createdOn = res?.createdOn;
        this.modifiedOn = res?.modifiedOn;

        this.addModelForm.controls['id'].setValue(res?.id);

        this.attachmentName = [];
        var att = res?.attachments as any[];
        if (att != null) {
          att.forEach((element) => {
            (this.attachmentForm.get('attachments') as FormArray).push(
              this.formbuilder.group({
                attachmentName: element.attachmentName,
                attachmentURL: element.attachmentName,
                id: element.id,
              })
            );
            this.attachmentName.push(element.attachmentName);
          });
        }

        if (res?.picName) {
          this.picNameApi[0] = res?.picName;
          console.log('this.picName[0]', this.picNameApi[0]);
        }
        this.addModelForm.controls['modelDefCode'].setValue(res?.modelDefCode);
        this.addModelForm.controls['assetNDAssetName'].setValue({
          assetname: res?.assetNDAssetName,
        });
        this.addModelForm.controls['assetNDAssetNameView'].setValue(
          res?.assetNDAssetName
        );
        this.addModelForm.controls['assetNDId'].setValue(res?.assetNDId);
        this.addModelForm.controls['modelId'].setValue(res?.modelId);
        this.addModelForm.controls['modelTaxonomyName'].setValue({
          modelName: res?.modelTaxonomyName,
        });
        this.addModelForm.controls['modelTaxonomyNameView'].setValue(
          res?.modelTaxonomyName
        );
        this.addModelForm.controls['modelParentTaxonomyName'].setValue(
          res?.modelParentTaxonomyName
        );

        this.addModelForm.controls['countryOfOriginId'].setValue(
          res?.countryOfOriginId
        );
        this.addModelForm.controls['countryOfOriginName'].setValue(
          res?.countryOfOriginName
        );
        if (res?.endOfSupportDate != null) {
          this.addModelForm.controls['endOfSupportDate'].setValue(
            res?.endOfSupportDate
          );
        }

        if (res?.stopProductionDate != null) {
          this.addModelForm.controls['stopProductionDate'].setValue(
            res?.stopProductionDate
          );
        }

        this.addModelForm.controls['sfda'].setValue(res?.sfda);
        this.addModelForm.controls['warrantyPeriodId'].setValue(
          res?.warrantyPeriodId
        );
        this.addModelForm.controls['warrantyPeriodName'].setValue(
          res?.warrantyPeriodName
        );
        this.addModelForm.controls['initials'].setValue(res?.initials);
        this.addModelForm.controls['division'].setValue(res?.division);
        this.addModelForm.controls['ecri'].setValue(res?.ecri);
        this.addModelForm.controls['ppmFrequencyId'].setValue(
          res?.ppmFrequencyId
        );
        this.addModelForm.controls['ppmFrequencyName'].setValue(
          res?.ppmFrequencyName
        );
        this.addModelForm.controls['specialTools'].setValue(res?.specialTools);
        this.addModelForm.controls['preInstallationChkLst'].setValue(
          res?.preInstallationChkLst
        );
        this.addModelForm.controls['installationChkLst'].setValue(
          res?.installationChkLst
        );
        this.addModelForm.controls['calibrationTask'].setValue(
          res?.calibrationTask
        );
        this.addModelForm.controls['modelAccessories'].setValue(
          res?.modelAccessories
        );
        this.addModelForm.controls['ppmChkLst'].setValue(res?.ppmChkLst);
        this.addModelForm.controls['picName'].setValue(res?.picName);
        if (this.frequency[0].id == res?.ppmFrequencyId) {
          this.check = true;
          this.style = 'background-color:#BDBDBD; cursor: not-allowed;';
        }
        this.defects = res?.modelDefRelatedDefects;
        // this.setExistingDefects(defects);
        let codes = res?.modelDefTCodes;
        this.getCodes(codes, res?.id);
        let supplier = res?.suppliers;
        this.setExsistingSupplier(supplier);

        res?.modelDefRelatedDefects.forEach((defect: modelDefRelatedDefects) => {
          console.log('in defects');
          (this.addModelForm.get('modelDefRelatedDefects') as FormArray).push(
            this.formbuilder.group({
              id: defect.id ?? null,
              modelDefinitionId: defect.modelDefinitionId ?? null,
              defectId: defect.defectId ?? null,
              defectNameView: defect.defectName ?? null,
              // defectName: { name: defect.defectName } ?? null,
              defectName: defect.defectName
                ? { name: defect.defectName }
                : null,
              workPerformed: defect.workPerformed ?? null,
              cause: defect.cause ?? null,
              estimatedTime: defect.estimatedTime ?? null,
            })
          );
        });

        this.suppliers = res?.suppliers;
        this.cdr.detectChanges();
      });
    // });

    // this.items = [
    //   { label: 'Home', routerLink: ['/'] },
    //   { label: 'Update Model' },
    // ];
  }

  //#region Suppliers Array
  suppliersControls() {
    return <FormArray>this.addModelForm.get('suppliers');
  }

  addMoreSuppliers() {
    (this.addModelForm.get('suppliers') as FormArray).push(
      this.formbuilder.group({
        id: 0,
        modelDefinitionId: 0,
        supplierId: [],
        supplierName: [],
      })
    );
  }
  removeSuppliers(index: number) {
    (this.addModelForm.get('suppliers') as FormArray).removeAt(index);
  }

  onSelectSupplier(supplier: any, i: number) {
    this.supplierId = supplier.id;
    this.suppliersControls()
      .at(i)
      ?.get('supplierId')
      ?.setValue(this.supplierId);
  }

  setExsistingSupplier(suppliers: Suppliers[]) {
    const modelSupplierArray = this.suppliersControls();
    const mofelSupplierFormGroup = new Suppliers();
    if (suppliers.length === 0) {
      modelSupplierArray.push(
        this.createSupplierFormGroup(mofelSupplierFormGroup)
      );
    } else {
      suppliers.forEach((supplier) => {
        modelSupplierArray.push(this.createSupplierFormGroup(supplier));
      });
    }
  }

  private createSupplierFormGroup(supplier: Suppliers) {
    return this.formbuilder.group({
      id: supplier?.id ?? null,
      modelDefinitionId: supplier?.modelDefinitionId ?? null,
      supplierId: supplier?.supplierId ?? null,
      // supplierName: { suppliername: supplier?.supplierName } ?? null,
      supplierName: supplier?.supplierName
        ? { suppliername: supplier.supplierName }
        : null,
    });
  }
  //#endregion

  checkList(e: any) {
    if (e.value == this.frequency[0].id) {
      this.check = true;
      this.style = 'background-color:#BDBDBD; cursor: not-allowed;';
      this.addModelForm.controls['ppmChkLst'].setValue(null);
    } else {
      this.check = false;
      this.style = '';
    }
  }

  setExistingDefects(defects: modelDefRelatedDefects[]) {
    const modelDefectsArray = this.addModelForm.get(
      'modelDefRelatedDefects'
    ) as FormArray;
    const mofelDefFormGroup = new modelDefRelatedDefects();
    if (defects.length === 0) {
      modelDefectsArray.push(this.createDefectFormGroup(mofelDefFormGroup));
    } else {
      defects.forEach((defect) => {
        modelDefectsArray.push(this.createDefectFormGroup(defect));
      });
    }
  }
  searchDefects($event: any) {
    let defect = {
      pageSize: 10,
      pageNumber: 1,
      name: $event.query,
    };
    this.api.getDefects(defect).subscribe((res: any) => {
      const data = res?.data;
      this.defectsList = data;
      console.log(this.defectsList);
      this.cdr.detectChanges();
    });
  }
  onSelectDefect(defect: any, i: number) {
    this.relatedDefectsControl()[i].get('defectId')?.setValue(defect.id);
  }
  private createDefectFormGroup(defect: modelDefRelatedDefects) {
    return this.formbuilder.group({
      id: defect?.id ?? null,
      modelDefinitionId: defect?.modelDefinitionId ?? null,
      defectId: defect?.defectId ?? null,
      // defectName: { name: defect?.defectName } ?? null,
      defectName: defect.defectName ? { name: defect.defectName } : null,
      workPerformed: defect?.workPerformed ?? null,
      cause: defect?.cause ?? null,
      estimatedTime: defect?.estimatedTime ?? null,
    });
  }
  codes: any[] = [];
  codeNames: string[] = [];
  getCodes(code: any, modelId: number) {
    this.api.getLookups({ queryParams: 405 }).subscribe((res: any) => {
      this.codes = res?.data;
      let modelDefTCodes = this.addModelForm.get('modelDefTCodes') as FormArray;
      for (let i = 0; i < this.codes.length; i++) {
        const codeValue = code[i]?.codeValue ?? '';
        const formGroup = this.formbuilder.group({
          id: code[i]?.id ?? 0,
          modelDefinitionId: modelId,
          codeTypeId: [this.codes[i].id],
          codeValue: [codeValue],
        });
        modelDefTCodes.push(formGroup);
        this.codeNames.push(this.codes[i].name);
      }
      this.cdr.detectChanges();
    });
  }
  modelDefTCodesControl() {
    return (<FormArray>this.addModelForm.get('modelDefTCodes')).controls;
  }
  //Defects Array
  relatedDefectsControl() {
    return (<FormArray>this.addModelForm.get('modelDefRelatedDefects'))
      .controls;
  }
  removeDefects(index: number) {
    (this.addModelForm.get('modelDefRelatedDefects') as FormArray).removeAt(
      index
    );
  }
  addMoreDefects() {
    (this.addModelForm.get('modelDefRelatedDefects') as FormArray).push(
      this.formbuilder.group({
        id: 0,
        modelDefinitionId: 0,
        defectId: [],
        defectName: [],
        cause: [],
        workPerformed: [],
        estimatedTime: [],
      })
    );
  }
  //For Asset
  searchAsset($event: any) {
    let asset = {
      pageSize: 10,
      pageNumber: 1,
      assetName: $event.query,
    };
    this.api.getAssetName(asset).subscribe((res: any) => {
      const data = res?.data;
      this.asset = data;
    });
  }
  onSelectAsset(asset: any) {
    this.addModelForm.value.assetNDId = asset.id;
  }

  searchModel($event: any) {
    let model = {
      pageSize: 10,
      pageNumber: 1,
      name: $event.query,
      parentId: null,
    };
    this.api.getModel(model).subscribe((res: any) => (this.model = res?.data));
  }
  onSelectModel(model: any) {
    this.addModelForm.value.modelId = model.modelId;
    this.manufacturer = model.manufacturerName;
  }
  getSpplier($event: any) {
    let supplier = {
      pageSize: 10,
      pageNumber: 1,
      suppliername: $event.query,
    };
    return this.api.getSupplier(supplier).subscribe((res: any) => {
      const data = res?.data;
      this.suppliersList = data;
    });
  }
  // Drop Downs Functions
  getCountry() {
    return this.api.getCountry().subscribe((res: any) => {
      this.country = res?.data;
    });
  }

  getWarranty() {
    return this.api.getWarranty().subscribe((res: any) => {
      const data = res?.data;
      this.warranty = data;
    });
  }

  getFrequency() {
    return this.api.getFrequency().subscribe((res: any) => {
      this.frequency = res?.data;
    });
  }
  attachLength: number = 0;

  handlePhotoInput(files: any) {
    this.photoList = files.currentFiles[0];
    this.api.uploadFiles(this.photoList).subscribe((res: any) => {
      const data = res?.data;
      this.addModelForm.value.picName = data[0];
      const sucess = res?.isSuccess;
      const message = res?.message;
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
  }

  photoReady(event: any) {
    this.addModelForm.value.picName = event[0];
  }
  attachmentReady(event: any) {
    debugger;
    (this.attachmentForm.get('attachments') as FormArray).push(
      this.formbuilder.group({
        attachmentName: event[0],
        attachmentURL: [''],
        id: 0,
      })
    );
  }

  updateModelDefinition() {
    this.modelDefinitionModel.id = this.addModelForm.value.id;
    this.modelDefinitionModel.assetNDId = this.addModelForm.value.assetNDId;
    this.modelDefinitionModel.modelId = this.addModelForm.value.modelId;
    this.modelDefinitionModel.supplierId = this.addModelForm.value.supplierId;
    this.modelDefinitionModel.countryOfOriginId =
      this.addModelForm.value.countryOfOriginId;
    dateHelper.reverseDateFilds(this.addModelForm.value, [
      'stopProductionDate',
      'endOfSupportDate',
    ]);

    this.modelDefinitionModel.endOfSupportDate =
      this.addModelForm.value.endOfSupportDate;
    this.modelDefinitionModel.stopProductionDate =
      this.addModelForm.value.stopProductionDate;

    this.modelDefinitionModel.ppmFrequencyId =
      this.addModelForm.value.ppmFrequencyId;
    this.modelDefinitionModel.specialTools =
      this.addModelForm.value.specialTools;

    this.modelDefinitionModel.modelAccessories =
      this.addModelForm.value.modelAccessories;
    this.modelDefinitionModel.ppmChkLst = this.addModelForm.value.ppmChkLst;
    this.modelDefinitionModel.picName = this.addModelForm.value.picName;
    this.modelDefinitionModel.modelDefTCodes =
      this.addModelForm.value.modelDefTCodes;
    if (this.addModelForm.value.suppliers[0].supplierId) {
      this.modelDefinitionModel.suppliers = this.addModelForm.value.suppliers;
    }
    if (!this.modelDefinitionModel.modelDefRelatedDefects) {
      this.modelDefinitionModel.modelDefRelatedDefects = [];
    }
    this.modelDefinitionModel.modelDefRelatedDefects = [];
    (
      this.addModelForm.get('modelDefRelatedDefects') as FormArray
    ).controls.forEach((element) => {
      console.log('element.value', element.value);
      if (
        element.value.defectId == null &&
        element.value.workPerformed == null &&
        element.value.estimatedTime == null &&
        element.value.cause == null
      ) {
      } else {
        let defects = new modelDefRelatedDefects();

        defects.modelDefinitionId = element.value.modelDefinitionId;
        defects.id = element.value.id;
        defects.defectId = element.value.defectId;
        defects.workPerformed = element.value.workPerformed;
        defects.estimatedTime = element.value.estimatedTime;
        defects.cause = element.value.cause;
        console.log('defects: ', defects);
        this.modelDefinitionModel.modelDefRelatedDefects.push(defects);
      }
    });
    this.modelDefinitionModel.attachments = [];
    (this.attachmentForm.get('attachments') as FormArray).controls.forEach(
      (element) => {
        let attach = new Attachments();
        attach.modelDefinitionId = this.modelDefinitionModel.id;
        attach.attachmentName = element.value.attachmentName;
        attach.attachmentURL = null;
        attach.id = element.value.id;
        this.modelDefinitionModel.attachments.push(attach);
      }
    );

    this.api
      .updateModelDefinition(this.modelDefinitionModel)
      .subscribe((res: any) => {
        console.log('res', res);
        console.log('Model Definition model :', this.modelDefinitionModel);
        const message = res?.message;
        const sucess = res?.isSuccess;
        if (sucess == true) {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: message,
            life: 3000,
          });

          setTimeout(() => {
            this.route.navigate(['/assets/model-definition']);
          }, 500);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000,
          });
        }
        this.cdr.detectChanges();
      });
  }

  deleteModelDefiniton() {
    // this.router.queryParams.subscribe((params: any) => {
    this.modelDefinitionModel.id = this.edit_model_id;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Model Definition?',
      header: 'Confirm',
      rejectButtonStyleClass: 'btn btn-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api
          .deleteModelDefinition(this.modelDefinitionModel.id)
          .subscribe((res: any) => {
            const message = res?.message;
            const sucess = res?.isSuccess;

            if (sucess == true) {
              this.route.navigate(['/assets/model-definition']);

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
    // });
  }
  handleChange() {
    this.api
      .getSingleModelDefinition(this.modelDefinitionModel.id)
      .subscribe((res: any) => {
        const data = res?.data;
        this.transactionHistory = new TransactionHistory();
        Object.assign(this.transactionHistory, res?.data);
        this.addModelForm.patchValue(data);
      });
  }
  getDefects() {
    this.api.getDefects({}).subscribe((res: any) => {
      this.defectsList = res?.data;
    });
  }

  close_modal() {
    this.openModals.emit(false);
  }
}
