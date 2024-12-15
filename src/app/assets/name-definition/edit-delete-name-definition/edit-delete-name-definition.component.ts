import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  MessageService,
  ConfirmationService,
  Message,
  MenuItem,
  ConfirmEventType,
  SelectItem,
} from 'primeng/api';
import { NameDefinitionModel } from '../../../models/name-definition-model';
import { ApiService } from '../../../services/name-definition.service';
import validateForm from '../../../shared/helpers/validateForm';
import { PrimengModule } from '../../../shared/primeng.module';
import { TrPipe } from '../../../shared/pipes/tr.pipe';
import { TransactionHistoryComponent } from '../../../shared/components/transaction-history/transaction-history.component';
import { TransactionHistory } from '../../../models/transaction-history';
/* import { NameDefinitionModel } from 'src/app/data/models/name-definition-model';
import { AuthService } from 'src/app/data/service/auth.service';
import { ApiService } from 'src/app/data/service/name-definition.service';
import validateForm from 'src/app/shared/helpers/validateForm';
import { TransactionHistory } from 'src/app/shared/models/transaction-history'; */

@Component({
  standalone: true,
  selector: 'edit-delete-name-definition',
  imports: [PrimengModule, ReactiveFormsModule, TranslateModule, TrPipe, TransactionHistoryComponent],
  templateUrl: './edit-delete-name-definition.component.html',
  styleUrls: ['./edit-delete-name-definition.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class EditDeleteNameDefinitionComponent implements OnChanges {

  @Input('showmodal') showmodal: boolean = false;
  @ViewChild('drawer') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('edit_asset_id') edit_asset_id: any;
  @Input('index_tab') index_tab: any;


  PAGE_TITLE = 'name-definition';
  linkDialog: boolean = false;

  addNameForm!: FormGroup;
  nameDefinitionModel: NameDefinitionModel = new NameDefinitionModel();
  msgs!: Message[];
  items!: MenuItem[];
  tabIndex: number = 0;

  //Dropdown Lists
  businessOptions: [] = [];
  riskOptions: [] = [];
  classOptions: [] = [];
  categoriesOptions: [] = [];
  modilityOptions: [] = [];
  subModilityOptions: [] = [];
  functionOptions: [] = [];
  typeAssetOptions: [] = [];
  lifeSpanOptions: SelectItem[] = [];
  complexOptions: SelectItem[] = [];
  umdnsOptions: SelectItem[] = [];
  createdOn!: any;
  modifiedOn!: any;
  codes: any[] = [];
  codeNames: string[] = [];
  equipmentList: any[] = [];
  essentialEquipementView!: string;
  public transactionHistory: any;
  constructor(
    private router: ActivatedRoute,
    /*  private authService: AuthService, */
    private route: Router,
    private formbuilder: FormBuilder,
    private api: ApiService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,

    private cdr: ChangeDetectorRef,
  ) {
    translateService.onLangChange.subscribe((x) => {
      translateService
        .get(['Home', 'View Asset Nomenclature'])
        .subscribe((translations) => {
          this.items = [
            { label: translations['Home'], routerLink: ['/'] },
            { label: translations['View Asset Nomenclature'] },
          ];
        });
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.Init();
  }

  close_modal() {
    this.openModals.emit(false);
  }

  ngOnInit(): void { }

  Init() {
    this.addNameForm = this.formbuilder.group({
      assetname: ['', Validators.required],
      altassetname: [''],
      umdns: [''],
      umdnsId: [''],
      assetrisk: [''],
      complex: [''],
      classfication: [''],
      category: [''],
      business: [''],
      modility: [''],
      submodility: [''],
      functionclass: [''],
      typeasset: [''],
      lifespan: [''],
      assetndcode: [''],
      functionclassId: [''],
      classficationId: [''],
      assetriskId: [''],
      businessId: [''],
      categoryId: [''],
      typeassetId: [''],
      modilityId: [''],
      submodilityId: [''],
      oraclename: [''],
      oracleCodes: this.formbuilder.array([]),
      essentialEquipement: [''],
      essentialEquipementView: [''],
    });

    /* this.router.queryParams.subscribe((params: any) => { */
    this.tabIndex = this.index_tab;
    this.nameDefinitionModel.id = this.edit_asset_id; //params.data;
    console.log(this.nameDefinitionModel.id);
    this.api.getSingleNameDefinition(this.edit_asset_id).subscribe((res) => {
      this.transactionHistory = new TransactionHistory();
      Object.assign(this.transactionHistory, res.data);
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.addNameForm.controls['assetname'].setValue(data.assetname);
        this.addNameForm.controls['assetndcode'].setValue(data.assetndcode);
        this.addNameForm.controls['assetriskId'].setValue(data.assetriskId);
        this.addNameForm.controls['assetrisk'].setValue(data.assetrisk);
        this.addNameForm.controls['businessId'].setValue(data.businessId);
        this.addNameForm.controls['business'].setValue(data.business);
        this.addNameForm.controls['categoryId'].setValue(data.categoryId);
        this.addNameForm.controls['category'].setValue(data.category);
        this.addNameForm.controls['classficationId'].setValue(
          data.classficationId
        );
        this.addNameForm.controls['classfication'].setValue(
          data.classfication
        );
        this.addNameForm.controls['complex'].setValue(data.complex);
        this.addNameForm.controls['functionclassId'].setValue(
          data.functionclassId
        );
        this.addNameForm.controls['functionclass'].setValue(
          data.functionclass
        );
        this.addNameForm.controls['lifespan'].setValue(data.lifespan);
        this.addNameForm.controls['modilityId'].setValue(data.modilityId);
        this.addNameForm.controls['modility'].setValue(data.modility);
        this.addNameForm.controls['assetndcode'].setValue(data.assetndcode);
        this.addNameForm.controls['submodility'].setValue(data.submodility);
        this.addNameForm.controls['typeassetId'].setValue(data.typeassetId);
        this.addNameForm.controls['typeasset'].setValue(data.typeasset);
        this.addNameForm.controls['umdns'].setValue(data.umdns);
        this.addNameForm.controls['oraclename'].setValue(data.oraclename);
        this.addNameForm.controls['essentialEquipement'].setValue(
          data.essentialEquipement
        );
        if (data.essentialEquipement == true) {
          this.addNameForm.controls['essentialEquipementView'].setValue("Yes");
        } else {
          this.addNameForm.controls['essentialEquipementView'].setValue("No");
        }
        this.createdOn = data.createdOn;
        this.modifiedOn = data.modifiedOn;
        let codes = data.oracleCodes;

        this.cdr.detectChanges()

        this.getCodes(codes, data.id);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        });
      }
    });
    /*  }); */

    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'View Asset Nomenclature' },
    ];

    //get all dropdows
    this.getAssetRisk();
    this.getBusinessCritical();
    this.getCategories();
    this.getClassification();
    this.getFunction();
    this.getModility();
    this.getEquipment();
    this.getTypeAsset();

    //fill compelxity options
    Array(10)
      .fill(0)
      .map((x, i) => {
        this.complexOptions.push({ label: `${i + 1}`, value: i + 1 });
      });

    this.cdr.detectChanges()
  }

  getCodes(code: any, nameId: number) {
    this.api.getLookups({ queryParams: 408 }).subscribe((res) => {
      this.codes = res.data;
      console.log('this.codes', this.codes);
      let oracleCodes = this.addNameForm.get('oracleCodes') as FormArray;
      for (let i = 0; i < this.codes.length; i++) {
        const codeValue = code[i]?.codeValue ?? '';
        const formGroup = this.formbuilder.group({
          id: code[i]?.id ?? 0,
          assetNDId: nameId,
          codeTypeId: [this.codes[i].id],
          codeValue: [codeValue],
        });
        oracleCodes.push(formGroup);
        this.codeNames.push(this.codes[i].name);


        this.cdr.detectChanges()
        console.log("test", oracleCodes)
      }
    });
  }
  getEquipment() {
    let equipmentObj = [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ];
    this.equipmentList = equipmentObj;
  }
  oracleCodesControl() {
    return (<FormArray>this.addNameForm.get('oracleCodes')).controls;
  }

  getAssetRisk() {
    this.api.getLookups({ queryParams: 21 }).subscribe((res) => {
      this.riskOptions = res.data;

      this.cdr.detectChanges()
    });
  }

  getBusinessCritical() {
    this.api.getLookups({ queryParams: 22 }).subscribe((res) => {
      this.businessOptions = res.data;

      this.cdr.detectChanges()
    });
  }

  getCategories() {
    this.api.getLookups({ queryParams: 23 }).subscribe((res) => {
      this.categoriesOptions = res.data;

      this.cdr.detectChanges()
    });
  }

  getClassification() {
    this.api.getLookups({ queryParams: 24 }).subscribe((res) => {
      this.classOptions = res.data;
      this.cdr.detectChanges()
    });
  }
  getFunction() {
    this.api.getLookups({ queryParams: 25 }).subscribe((res) => {
      this.functionOptions = res.data;
      this.cdr.detectChanges()
    });
  }
  getModility() {
    this.api.getLookups({ queryParams: 26 }).subscribe((res) => {
      this.modilityOptions = res.data;
      this.cdr.detectChanges()
    });
  }

  getTypeAsset() {
    this.api.getLookups({ queryParams: 28 }).subscribe((res) => {
      this.typeAssetOptions = res.data;
      this.cdr.detectChanges()
    });
  }
  onSelectRisk(event: any) {
    this.addNameForm.value.assetriskId = event.value;
    this.cdr.detectChanges()
  }
  onSelectBusiness(event: any) {
    this.addNameForm.value.businessId = event.value;
    this.cdr.detectChanges()
  }
  onSelectCategories(event: any) {
    this.addNameForm.value.categoryId = event.value;
    this.cdr.detectChanges()
  }
  onSelectClassification(event: any) {
    this.addNameForm.value.classficationId = event.value;
    this.cdr.detectChanges()
  }
  onSelectFunction(event: any) {
    this.addNameForm.value.functionclassId = event.value;
    this.cdr.detectChanges()
    console.log(
      'this.addNameForm.value.functionclassId',
      this.addNameForm.value.functionclassId
    );
  }
  onSelectModility(event: any) {
    this.addNameForm.value.modilityId = event.value;
  }

  onSelectTypeAsset(event: any) {
    this.addNameForm.value.typeassetId = event.value;
  }
  onSelectEquipment(event: any) {
    this.addNameForm.value.essentialEquipement = event.value;
  }
  onSelectComplex(event: any) {
    console.log(
      'this.addNameForm.value.complex',
      this.addNameForm.value.complex
    );
    this.addNameForm.value.complex = event.value;
  }
  onSelectLifeSpan(event: any) {
    console.log(
      'this.addNameForm.value.lifespan',
      this.addNameForm.value.lifespan
    );
    this.addNameForm.value.lifespan = event.value;
  }

  updateNameDefiniton() {
    if (this.addNameForm.invalid) {
      validateForm.validateAllFormFields(this.addNameForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      this.nameDefinitionModel.assetname = this.addNameForm.value.assetname;
      this.nameDefinitionModel.lifespan = this.addNameForm.value.lifespan;
      this.nameDefinitionModel.umdns = this.addNameForm.value.umdns;
      this.nameDefinitionModel.assetriskId = this.addNameForm.value.assetriskId;
      this.nameDefinitionModel.businessId = this.addNameForm.value.businessId;
      this.nameDefinitionModel.categoryId = this.addNameForm.value.categoryId;
      this.nameDefinitionModel.classficationId =
        this.addNameForm.value.classficationId;
      this.nameDefinitionModel.functionclassId =
        this.addNameForm.value.functionclassId;
      this.nameDefinitionModel.modilityId = this.addNameForm.value.modilityId;
      this.nameDefinitionModel.submodility = this.addNameForm.value.submodility;
      this.nameDefinitionModel.typeassetId = this.addNameForm.value.typeassetId;
      this.nameDefinitionModel.complex = this.addNameForm.value.complex;
      this.nameDefinitionModel.oracleCodes = this.addNameForm.value.oracleCodes;
      this.nameDefinitionModel.oraclename = this.addNameForm.value.oraclename;
      this.nameDefinitionModel.essentialEquipement =
        this.addNameForm.value.essentialEquipement;
      console.log('this.nameDefinitionModel', this.nameDefinitionModel);
      this.api
        .updateNameDefinition(this.nameDefinitionModel)
        .subscribe((res) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            this.api
              .getSingleNameDefinition(this.nameDefinitionModel.id)
              .subscribe((res) => {
                const data = res.data;
                this.modifiedOn = data.modifiedOn;
                this.transactionHistory = new TransactionHistory();
                Object.assign(this.transactionHistory, res.data);
                this.close_modal();
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
    this.cdr.detectChanges()
  }

  handleChange() {
    this.api
      .getSingleNameDefinition(this.nameDefinitionModel.id)
      .subscribe((res) => {
        const data = res.data;
        this.addNameForm.controls['assetname'].setValue(data.assetname);
        this.addNameForm.controls['assetriskId'].setValue(data.assetriskId);
        this.addNameForm.controls['assetrisk'].setValue(data.assetrisk);
        this.addNameForm.controls['businessId'].setValue(data.businessId);
        this.addNameForm.controls['business'].setValue(data.business);
        this.addNameForm.controls['categoryId'].setValue(data.categoryId);
        this.addNameForm.controls['category'].setValue(data.category);
        this.addNameForm.controls['classficationId'].setValue(
          data.classficationId
        );
        this.addNameForm.controls['classfication'].setValue(data.classfication);
        this.addNameForm.controls['complex'].setValue(data.complex);
        this.addNameForm.controls['functionclassId'].setValue(
          data.functionclassId
        );
        this.addNameForm.controls['functionclass'].setValue(data.functionclass);
        this.addNameForm.controls['lifespan'].setValue(data.lifespan);
        this.addNameForm.controls['modilityId'].setValue(data.modilityId);
        this.addNameForm.controls['modility'].setValue(data.modility);
        this.addNameForm.controls['assetndcode'].setValue(data.assetndcode);
        this.addNameForm.controls['submodility'].setValue(data.submodility);
        this.addNameForm.controls['typeassetId'].setValue(data.typeassetId);
        this.addNameForm.controls['typeasset'].setValue(data.typeasset);
        this.addNameForm.controls['umdns'].setValue(data.umdns);
        this.addNameForm.controls['oraclename'].setValue(data.oraclename);
        this.addNameForm.controls['essentialEquipement'].setValue(
          data.essentialEquipement
        );
        if (data.essentialEquipement == true) {
          this.addNameForm.controls['essentialEquipementView'].setValue("Yes");
        } else {
          this.addNameForm.controls['essentialEquipementView'].setValue("No");
        }
        this.addNameForm.patchValue(data);
        this.createdOn = data.createdOn;
        this.modifiedOn = data.modifiedOn;
      });
    this.cdr.detectChanges()
  }

  deleteNameDefiniton() {
    this.router.queryParams.subscribe((params: any) => {
      this.nameDefinitionModel.id = params.data;
      this.confirmationService.confirm({
        message:
          'Are you sure you want to delete this ' +
          this.nameDefinitionModel.assetname +
          '?',
        header: 'Confirm',
        rejectButtonStyleClass: 'btn btn-danger',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.api
            .deleteNameDefinition(this.nameDefinitionModel.id)
            .subscribe((res) => {
              const message = res.message;
              const sucess = res.isSuccess;
              if (sucess == true) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: message,
                  life: 3000,
                });
                this.route.navigate(['/systemsettings/name-definition']);
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
    });
    this.cdr.detectChanges()
  }
}
