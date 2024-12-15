/* import { DataField } from './../custom-cards/data/enums'; */
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
/* import { Lookup } from 'src/app/data/Enum/lookup';
import { ModelDefinitionModel } from 'src/app/data/models/model-definition-model';
import { AssetsService } from 'src/app/data/service/assets.service';
import { CustomerService } from 'src/app/data/service/customer.service';
import { DepartmentService } from 'src/app/data/service/department.service';
import { LookupService } from 'src/app/data/service/lookup.service';
import { ModelService } from 'src/app/data/service/model-definition.service';
import validateForm from 'src/app/shared/helpers/validateForm';
import { TaxonomyService } from 'src/app/data/service/taxonomy.service';
import { Attachments } from 'src/app/data/models/asset';
import { dateHelper } from 'src/app/shared/helpers/dateHelper';
import { AssetGroupService } from 'src/app/data/service/asset-group.service';
import { FileServiceService } from 'src/app/data/service/file-service.service'; */
import { HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Attachments, ModelDefinitionModel } from '../../models/model-definition-model';
import { TransactionHistory } from '../../models/transaction-history';
import { ModelService } from '../../services/model-definition.service';
import { CustomerService } from '../../services/customer.service';
import { DepartmentService } from '../../services/department.service';
import { LookupService } from '../../services/lookup.service';
import { AssetsService } from '../../services/assets.service';
import { TaxonomyService } from '../../services/taxonomy.service';
import { AssetGroupService } from '../../services/asset-group.service';
import { FileServiceService } from '../../services/file-service.service';
import { InstructionDescriptionService } from '../../services/instruction-description.service';
import { InstructionTextDescriptionMappingService } from '../../services/instruction-text-description-mapping.service';
import { Lookup } from '../../shared/enums/lookup';
import validateForm from '../../shared/helpers/validateForm';
import { dateHelper } from '../../shared/helpers/dateHelper';
/* import { InstructionDescriptionService } from 'src/app/data/service/instruction-description.service';
import { InstructionTextDescriptionMappingService } from 'src/app/data/service/instruction-text-description-mapping.service';
import { TransactionHistory } from 'src/app/shared/models/transaction-history'; */

@Injectable({
  providedIn: 'root',
})
export class AssetFormService {
  assetForm!: FormGroup;
  assetInfoForm!: FormGroup;
  oldAssetNums: any[] = [];
  Asset_SNs: any[] = [];
  Asset_Replaces: any[] = [];
  Parent_Childs: any[] = [];
  Asset_Types: any[] = [];
  AssetGroups: any[] = [];
  ModelDefinitions: ModelDefinitionModel[] = [];
  Contractors: any[] = [];
  Location_Category!: FormGroup;
  public Assets_Buildings: any[] = [];
  public Assets_Floors: any[] = [];
  public Departments: any[] = [];
  public Sites: any[] = [];
  public Rooms: any[] = [];

  assetutilForm!: FormGroup;
  economicdataForm!: FormGroup;
  Currencies: any[] = [];
  formerDepartments: any[] = [];
  budgetYears: any[] = [];
  commissioningStatuses: any[] = [];
  warrantyForm!: FormGroup;
  isEnabled: any[] = [];
  ppmTimePeriods: any[] = [];
  assetPeriods: any[] = [];
  libraryForm!: FormGroup;
  customForm!: FormGroup;
  technicalGuidanceBooks: any[] = [];
  installationForm!: FormGroup;
  id: any;
  isSubmitted: boolean = false;
  // url!: string;
  Operator_Dates: any[] = []
  MAINTANAN_CECONTRACTs: any[] = []
  Asset_Classifications: any[] = []
  Asset_Statuses: any[] = []
  Not_Scraped: any[] = []
  manufacturers: any[] = [];
  isViewMode: boolean = false;
  callInfoForm: any;
  isEditMode: boolean = false;
  isAddMode: boolean = false;
  originDepartment: any;
  originSite: any;
  lifeSpan: number = 0;
  suppliers: any[] = [];
  attachmentAssetForm!: FormGroup;
  attachmentName: any[] = [];
  isDispalyMassege: string = "false";
  messageText: string = "";
  oldassetid: any;
  oldassetnumber: any;
  parentassetid: any;
  parentassetnumber: any;
  imageSource: any;
  assetInstructionForm!: FormGroup;
  InstructionDescription: any[] = [];
  InstructionText: any[] = [];
  ListInstructionTextId: any[] = [];
  AssetInstructionTextId: any[] = [];
  ListInstructionDescription: number[] = [];
  transactionHistory!: TransactionHistory;
  isVisiable: boolean = false;

  instructionDescriptions: any[] = [];
  expanded: { [key: string]: boolean } = {};


  constructor(private formbuilder: FormBuilder, private modelService: ModelService,
    private lookupService: LookupService, private customerService: CustomerService,
    private assetService: AssetsService, private departmentService: DepartmentService,
    private router: Router, private messageService: MessageService,
    private taxonamyService: TaxonomyService,
    private assetGroupService: AssetGroupService,
    private fileService: FileServiceService,
    private domSanitizer: DomSanitizer,
    private svcInstructionDescription: InstructionDescriptionService,
    private svcTextDescription: InstructionTextDescriptionMappingService,
    private cdr: ChangeDetectorRef) {


  }

  checkMode(mode: any) {
    this.isViewMode = false
    this.isEditMode = false
    this.isAddMode = false
    // this.url = this.router.url;
    if (this.id) {
      if (mode == 'view')
        this.isViewMode = true

      else (mode !== 'view')
      this.isEditMode = true
    }
    else {
      this.isAddMode = true
    }



  }
  intiateForm() {

    this.oldassetid = null;
    this.oldassetnumber = null;
    this.parentassetid = null;
    this.parentassetnumber = null;


    this.assetInstructionForm = this.formbuilder.group({
      instructionDescription: [null],
      instructionText: [null],
    });


    this.assetForm = this.formbuilder.group({
      demoRequest: [''],
      assetType: [{ value: null, disabled: this.isEditMode }, Validators.required],
      multiAssets: this.formbuilder.array([]),
      assetGroup: [{ value: null, disabled: this.isEditMode }],
    });
    this.assetInfoForm = this.formbuilder.group({
      modelDefinition: [null, Validators.required],
      Model: [{ value: null, disabled: true }],
      Manufacturer: [{ value: null, disabled: true }],
      supplier: [{ value: null }],
      assetName: [{ value: null, disabled: true }],
      ipAddress: [null],
      macAddress: [null],
      portNumber: [null],
      assetReplace: [null, Validators.required],
      oldAsset: [null],
      isParent: [null, Validators.required],
      parentAsset: [null],
      isEnabled: [null],
      tagCode: [null],
      missionCritical: [null],
      essentialEquipement: [null],
      parentassetnumber: [null],
      retirementTypeName: [null],
      retirementStatusName: [null],
      retirementDate: [{ value: null, disabled: true }],
      assetPhoto: [null],

    });

    this.Location_Category = this.formbuilder.group({
      site: [null, Validators.required],
      building: [null],
      floor: [null],
      department: [null, Validators.required],
      room: [null],
    });

    this.economicdataForm = this.formbuilder.group({
      purchasingPrice: [null],
      nbv: [null],
      testsDay: [null],
      currency: [null],
      poDate: [null],
      poNo: [null],
      invoiceNumber: [null],
      invoiceDate: [null],
      lastPOPrice: [{ value: null, disabled: true }],
      replacementDate: [{ value: null, disabled: true }],
      originDepartment: [{ value: null, disabled: true }],
      originSite: [{ value: null, disabled: true }],
      budgetYear: [null],
      commissioningStatus: [null],
      marketPrice: [null],
      internalPONo: [null],
      internalPODate: [null]
    });
    this.installationForm = this.formbuilder.group({
      productionDate: [null],
      edd: [null],
      technicalInspectionDate: [null],
      deliveryInspectionDate: [null],
      endUserAcceptanceDate: [null],
      technicalAcceptanceDate: [null],
      finalAcceptanceDate: [null],
      installationDate: [null],
    });
    this.warrantyForm = this.formbuilder.group({
      siteWarrantyMonthNo: [null],
      extendedWarrantyMonthNo: [null],
      remainderWarrantyMonthNo: [null],
      eomWarrantyMonthsNo: [null],
      warrantyValue: [null],
      warrantyEndDateDisplay: [null],
      warrantyContractConditions: [null],
      assetPeriods: [null],
      isStartDate: [null]
    })
    this.libraryForm = this.formbuilder.group({
      technicalGuidanceBooks: [null],
      comment: [null],
    });
    this.attachmentAssetForm = this.formbuilder.group({
      attachments: this.formbuilder.array([]),
    });
    if (this.isViewMode) {
      this.assetForm.disable()
      this.assetInfoForm.disable()
      this.Location_Category.disable()
      this.economicdataForm.disable()
      this.installationForm.disable()
      this.warrantyForm.disable()
      this.libraryForm.disable()
      this.assetInstructionForm.disable()
    }
    this.loadLookups();
    let assetGroup = JSON.parse(localStorage.getItem('selectedAssetGroup') || '{}')?.id?.toString() || '{}'
    if (assetGroup == 2) {
      this.getAllInstructionDescription();
    }
  }


  getAssetById() {
    this.assetService.getAssetById(this.id).subscribe(res => {
      if (res['data']) {
        this.transactionHistory = new TransactionHistory();
        Object.assign(this.transactionHistory, res.data);
        let InstD = [];
        if (res.data.assetsInstructionDescription != null || res.data.assetsInstructionDescription) {
          for (let v = 0; v < res.data.assetsInstructionDescription.length; v++) {
            InstD.push(res.data.assetsInstructionDescription[v].instructionDescription)
            this.InstructionDescription.push(res.data.assetsInstructionDescription[v].instructionDescription)
          }
          this.assetInstructionForm.controls["instructionDescription"].setValue(InstD);
          this.isVisiable = true;
          this.onChange(null, res.data.assetsInstructionDescription);
        }
        this.suppliers = res.data.modelDefinition.suppliers
        this.onSelectContractor1(res.data.site);
        this.Location_Category.controls["site"].setValue(res.data.site);
        if (this.Assets_Buildings != null) {
          this.Assets_Buildings.forEach(b => {
            if (res.data.building?.id == b.id) {
              this.Location_Category.controls["building"].setValue(b);
              this.onSelectBulding1(b);
              if (this.Assets_Floors != null) {
                this.Assets_Floors.forEach(f => {
                  if (res.data.floor?.id == f.id) {
                    this.Location_Category.controls["floor"].setValue(f);
                    this.onSelectFloor1(f);
                    if (this.Departments != null) {
                      this.Departments.forEach(d => {
                        if (res.data.department?.id == d.id) {
                          this.Location_Category.controls["department"].setValue({ id: d.id, name: d.name, rooms: d.rooms });
                          this.onSelectDepartment1(d);
                          if (this.Rooms != null) {
                            this.Rooms.forEach(r => {
                              if (res.data.room?.id == r.id) {
                                this.Location_Category.controls["room"].setValue(r);
                              }
                            })
                          }
                        }
                      })
                    }
                  }
                })
              }

            }
          })
        }

        this.originDepartment = res.data.originDepartment?.departmentName;
        this.originSite = res.data.originSite?.custName;
        this.assetForm.patchValue(res.data)
        this.assetInfoForm.patchValue(res.data)
        this.economicdataForm.patchValue(res.data)
        this.installationForm.patchValue(res.data)
        this.warrantyForm.patchValue(res.data)
        this.libraryForm.patchValue(res.data)
        this.assetInstructionForm.patchValue(res.data);

        this.oldassetid = res.data.oldAsset?.id;
        this.oldassetnumber = res.data.oldAsset?.assetNumber;
        this.parentassetid = res.data.parentAsset?.id;
        this.parentassetnumber = res.data.parentAsset?.assetNumber;
        this.assetInfoForm.controls['retirementTypeName'].setValue(res.data.retirementTypeName);
        this.assetInfoForm.controls['retirementStatusName'].setValue(res.data.retirementStatusName);
        this.assetInfoForm.patchValue({
          retirementDate: res.data.retirementDate ? new Date(res.data.retirementDate) : res.data.retirementDate
        })
        this.assetInfoForm.patchValue({
          Model: res.data.modelDefinition.modelName,
          Manufacturer: res.data.modelDefinition.manufacturerName,
          supplier: res.data.supplier,
          assetName: res.data.modelDefinition.assetName,
          essentialEquipement: res.data.modelDefinition.essentialEquipement,
          missionCritical: res.data.modelDefinition.businessCritical,
          assetPhoto: res.data.assetPhoto
        })
        this.imageSource = '';
        if (res.data.assetPhoto) {
          this.downloadImage(res.data.assetPhoto);
        }

        this.lifeSpan = res.data.modelDefinition.lifeSpan;

        this.installationForm.patchValue({
          productionDate: res.data.productionDate ? new Date(res.data.productionDate) : res.data.productionDate,
          technicalInspectionDate: res.data.technicalInspectionDate ? new Date(res.data.technicalInspectionDate) : res.data.technicalInspectionDate,
          deliveryInspectionDate: res.data.deliveryInspectionDate ? new Date(res.data.deliveryInspectionDate) : res.data.deliveryInspectionDate,
          endUserAcceptanceDate: res.data.endUserAcceptanceDate ? new Date(res.data.endUserAcceptanceDate) : res.data.endUserAcceptanceDate,
          edd: res.data.edd ? new Date(res.data.edd) : res.data.edd,
          technicalAcceptanceDate: res.data.technicalAcceptanceDate ? new Date(res.data.technicalAcceptanceDate) : res.data.technicalAcceptanceDate,
          finalAcceptanceDate: res.data.finalAcceptanceDate ? new Date(res.data.finalAcceptanceDate) : res.data.finalAcceptanceDate,
          installationDate: res.data.installationDate ? new Date(res.data.installationDate) : res.data.installationDate,
        })
        this.economicdataForm.patchValue({
          invoiceDate: res.data.invoiceDate ? new Date(res.data.invoiceDate) : res.data.invoiceDate,
          poDate: res.data.poDate ? new Date(res.data.poDate) : res.data.poDate,
          replacementDate: res.data.replacementDate ? new Date(res.data.replacementDate) : res.data.replacementDate,
          internalPODate: res.data.internalPODate ? new Date(res.data.internalPODate) : res.data.internalPODate
        })
        if (res.data.warrantyEndDate) {
          this.warrantyForm.controls['warrantyEndDateDisplay'].setValue(new Date(res.data.warrantyEndDate));
        }
        else {
          this.warrantyForm.controls['warrantyEndDateDisplay'].setValue(null);
        }

        this.libraryForm.controls['technicalGuidanceBooks'].setValue(this.getSelectedBooks(res.data.technicalGuidanceBooks));
        this.getLastPoPrice(res.data.modelDefinition.id);
        if (res.data.isEnabled == true) {
          let selectYes = this.isEnabled.find(x => x.value == 1);
          if (selectYes) {
            this.assetInfoForm.controls['isEnabled'].setValue(selectYes);
          }

        }
        else {
          let selectNo = this.isEnabled.find(x => x.value == 0);
          if (selectNo) {
            this.assetInfoForm.controls['isEnabled'].setValue(selectNo);
          }
        }
        if (res.data.assetGroup.id == 3) {
          this.calcNBVAJAJI(this.lifeSpan);
        }

        this.attachmentName = [];
        var att = res.data.assetAttachments as any[];
        att.forEach(element => {
          (this.attachmentAssetForm.get('attachments') as FormArray).push(
            this.formbuilder.group({
              attachmentName: element.attachmentName,
              attachmentURL: element.attachmentURL,
              id: element.id,
            })
          );
          this.attachmentName.push(element.attachmentName);
        });


      }
      this.cdr.detectChanges()
      console.log(this.Location_Category.value, this.Assets_Buildings);
    });

  }

  getSelectedBooks(technicalGuidanceBooks: any[]) {
    let books: any[] = [];
    let selected: any[] = [];
    books = technicalGuidanceBooks;
    books.forEach((p) => {
      var book = {
        id: p.id,
        lookupId: p.guidanceBook.id,
        name: p.guidanceBook.name
      }
      selected.push(book);

    });
    return selected;
  }

  get multiAssets(): FormArray {
    return this.assetForm.get('multiAssets') as FormArray;
  }

  getAssetsData(searchText: any = '') {
    console.log(searchText);
    this.assetService.GetAssetsAutoComplete(searchText).subscribe((res) => {
      this.oldAssetNums = res.data;
      this.Asset_SNs = res.data;
    });
  }

  getAssetNumbers(searchText: any = '') {
    var dto = { assetNumber: searchText };
    this.assetService.GetAssetsAutoCompleteMultiFilter(dto).subscribe((res) => {
      this.oldAssetNums = res.data;
      this.Asset_SNs = res.data
    });
  }

  getManufacturers(searchText: any = '') {

    this.taxonamyService.GetManufacturerOrModelAutoComplete3(true, searchText).subscribe((res) => {
      this.manufacturers = res.data;

    });
  }

  getAllInstructionDescription() {
    this.svcInstructionDescription.GetAllInstructionDescription().subscribe(res => {
      this.InstructionDescription = res.data

    });
  }

  onChange_old(event: any, Id: number) {

    debugger;

    let filter: any = {
      instructionDescription: "",
      pageSize: 100,
      pageNumber: 1,

    };
    if (Id > 0) {
      filter.instructionDescription = this.InstructionDescription.filter(x => x.id == Id)[0].description;
    } else {
      filter.ListInstructionDescription.push(event.itemValue.description);
    }

    this.svcTextDescription.searchInstructionTextDescription(filter).subscribe((res) => {

      this.InstructionText = res.data;


    });
    this.isVisiable = true;
  }


  transformData(): void {
    const instructionMap = new Map<string, any>();

    this.InstructionText.forEach(instruction => {
      if (!instructionMap.has(instruction.instructionDescription)) {
        instructionMap.set(instruction.instructionDescription, {
          description: instruction.instructionDescription,
          instructionTexts: [],
        });
      }

      instructionMap.get(instruction.instructionDescription)?.instructionTexts.push({
        id: instruction.id,
        instructionText: instruction.instructionText,
      });
    });

    this.instructionDescriptions = Array.from(instructionMap.values());

    // Initialize the expanded state for each description
    this.instructionDescriptions.forEach(description => {
      this.expanded[description.description] = false;
    });
  }


  toggle(description: string): void {
    this.expanded[description] = !this.expanded[description];
  }


  //New change
  onChange(event: any, data: any) {

    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.ListInstructionDescription.push(data[i].instructionDescriptionId)
      }
    }
    else {
      const selectedItems = event.value.map((item: any) => item.id);
      const previousItems = this.ListInstructionDescription;

      // Determine the added and removed items
      const addedItems = selectedItems.filter((id: number) => !previousItems.includes(id));
      const removedItems = previousItems.filter(id => !selectedItems.includes(id));

      // Add new items
      addedItems.forEach((id: number) => {
        if (!this.ListInstructionDescription.includes(id)) {
          this.ListInstructionDescription.push(id);
        }
      });

      // Remove unchecked items
      removedItems.forEach(id => {
        const index = this.ListInstructionDescription.indexOf(id);
        if (index > -1) {
          this.ListInstructionDescription.splice(index, 1);
        }
      });

    }
    // Fetch the instruction text descriptions if the list is not empty
    if (this.ListInstructionDescription.length > 0) {
      this.svcTextDescription.getInstructionTextDescriptionMappings(this.ListInstructionDescription).subscribe((res) => {
        //this.InstructionText = res.data;

        this.InstructionText = res.data;
        this.transformData();
      });
      this.isVisiable = true;
    } else {
      // Handle the case when the list is empty
      this.isVisiable = false;
    }



  }





  getLookup() {
    this.lookupService.getLookUps(Lookup.Asset_Replace).subscribe((res: any) => {
      this.Asset_Replaces = res.data
      this.Not_Scraped = res.data
      this.Asset_Replaces.splice(0, 0, { id: null, name: "Select", value: null })
    })
    this.lookupService.getLookUps(Lookup.Parent_Childs).subscribe((res: any) => {
      this.Parent_Childs = res.data
      this.Parent_Childs.splice(0, 0, { id: null, name: "Select", value: null })
    })

    this.lookupService.getLookUps(Lookup.Asset_Type).subscribe((res: any) => {
      this.Asset_Types = res.data
      this.Asset_Types.splice(0, 0, { id: null, name: "Select", value: null })
    })
    this.lookupService.getLookUps(Lookup.Floor).subscribe((res: any) => {
      this.Assets_Floors = res.data
      this.Assets_Floors.splice(0, 0, { id: null, name: "Select", value: null })
    })

    this.lookupService.getLookUps(Lookup.Currency).subscribe((res: any) => {
      this.Currencies = res.data
      this.Currencies.splice(0, 0, { id: null, name: "Select", value: null })
    })

    this.assetGroupService.searchAssetGroups({}).subscribe((res: any) => {
      this.AssetGroups = res.data
    })

    this.lookupService.getLookUps(Lookup.Commissioning_Status).subscribe((res: any) => {
      this.commissioningStatuses = res.data
      this.commissioningStatuses.splice(0, 0, { id: null, name: "Select", value: null })
    })
    // this.lookupService.getLookUps(Lookup.Months).subscribe((res: any) => {
    //   this.siteWarrantyMonths = res.data
    //   this.extendedWarrantyMonths = res.data
    //   this.remainderWarrantyMonths = res.data
    //   this.motherSupplierWarrantyMonths = res.data
    //   this.motherSupplierWarrantyMonths.splice(0, 0, { id: null, name: "Select", value: null })

    //   let selected3Months = this.remainderWarrantyMonths.find(x => x.value ==3);
    //   if (selected3Months)
    //   {
    //     this.warrantyForm?.controls["remainderWarrantyMonths"].setValue(selected3Months);
    //   }

    // })
    this.lookupService.getLookUps(Lookup.Asset_Replace).subscribe((res: any) => {
      this.isEnabled = res.data
      let selectedYes = this.isEnabled.find(x => x.value == 1);
      if (selectedYes) {
        this.assetInfoForm?.controls["isEnabled"].setValue(selectedYes);
      }
    })
    this.lookupService.getLookUps(Lookup.Operator_Date).subscribe((res: any) => {
      this.Operator_Dates = res.data

    })
    this.lookupService.getLookUps(Lookup.MAINTANAN_CECONTRACT).subscribe((res: any) => {
      this.MAINTANAN_CECONTRACTs = res.data
      this.MAINTANAN_CECONTRACTs.splice(0, 0, { id: null, name: "Select", value: null })
    })
    this.lookupService.getLookUps(Lookup.Asset_Classifications).subscribe((res: any) => {
      this.Asset_Classifications = res.data
      this.Asset_Classifications.splice(0, 0, { id: null, name: "Select", value: null })
    })
    this.lookupService.getLookUps(Lookup.Asset_Status).subscribe((res: any) => {
      this.Asset_Statuses = res.data
      this.Asset_Statuses.splice(0, 0, { id: null, name: "Select", value: null })
    })
    this.lookupService.getLookUps(Lookup.Technical_guidance_books).subscribe((res: any) => {
      this.technicalGuidanceBooks = [];
      let result: any[] = [];
      result = res.data;
      result.forEach(t => {
        var book = {
          id: 0,
          lookupId: t.id,
          name: t.name
        }
        this.technicalGuidanceBooks.push(book);
      })

    })
    this.lookupService.getLookUps(Lookup.Rooms).subscribe((res: any) => {
      this.Rooms = res.data
      this.Rooms.splice(0, 0, { id: null, name: "Select", value: null })
    })
  }
  searchonmodels(filter: any) {
    this.modelService.GetModelDefinitionAsset(filter.query).subscribe((data) => {
      this.ModelDefinitions = data.data;
    });
  }
  onSelectName(filter: any) {
    //this.searchonmodels(filter.query);
    this.assetInfoForm.controls['modelDefinition'].setValue(
      filter
    );
    this.assetInfoForm.controls['Manufacturer'].setValue(
      filter.manufacturerName
    );

    if (this.isAddMode == true) {
      this.economicdataForm.controls['replacementDate'].setValue(new Date(filter.replacementDate));
      this.lifeSpan = filter.lifeSpan;
      this.calcNBV();
    }
    this.assetInfoForm.controls['Model'].setValue(filter.modelName);
    this.suppliers = filter.suppliers
    this.assetInfoForm.controls['assetName'].setValue(filter.assetName);
    this.assetInfoForm.controls['essentialEquipement'].setValue(filter.essentialEquipement);
    this.assetInfoForm.controls['missionCritical'].setValue(filter.businessCritical);


    this.getLastPoPrice(filter.id);
  }

  getLastPoPrice(modelDefinitionId: any) {
    let assetId = this.isAddMode == true ? 0 : this.id
    this.assetService.getLastPOPriceByModelDefinition(modelDefinitionId, assetId).subscribe(res => {
      this.economicdataForm.controls['lastPOPrice'].setValue(res.data);

    })
  }


  searchonContractor(code: any) {
    this.customerService.GetCustomersAutoComplete(code).subscribe((data: any) => {
      this.Contractors = data.data;
      this.Sites = data.data;
      // TO DO ::
      // this.Assets_Buildings=data.data.buildings
      // this.Assets_Floor

    });
  }
  onSelectContractor(filter: any) {


    this.searchonContractor(filter.query);
    this.Assets_Buildings = filter.value ? filter.value.buildings : [];
    console.log(this.Assets_Buildings);

  }
  onSelectContractor1(filter: any) {


    this.searchonContractor(filter.custName);
    this.Assets_Buildings = filter.buildings
  }
  onSelectBulding(filter: any) {
    this.Assets_Floors = filter.value.floors
  }
  onSelectBulding1(filter: any) {
    this.Assets_Floors = filter.floors
  }
  onSelectFloor(filter: any) {
    this.Departments = filter.value.departments
  }
  onSelectFloor1(filter: any) {
    this.Departments = filter.departments
  }
  onSelectDepartment(filter: any) {
    console.log("onSelectDepartment", filter);
    this.Rooms = filter.value.rooms
  }
  onSelectDepartment1(filter: any) {
    this.Rooms = filter.rooms
  }


  loadLookups() {
    // this.getAssetNumbers();
    // this.getDepartments();
    this.getManufacturers();
    this.getLookup();
  }


  Save(): any {
    /* debugger; */
    if (this.assetForm.value.assetType != null && this.assetForm.value.assetType.value == null) {
      this.assetForm.controls['assetType'].setValue(null);
    }

    if (this.assetInfoForm.value.assetReplace != null && this.assetInfoForm.value.assetReplace.value == null) {
      this.assetInfoForm.controls['assetReplace'].setValue(null);
    }
    if (this.assetInfoForm.value.isParent != null && this.assetInfoForm.value.isParent.value == null) {
      this.assetInfoForm.controls['isParent'].setValue(null);
    }
    this.isSubmitted = true;
    if (
      this.assetForm.invalid ||
      this.assetInfoForm.invalid ||
      this.Location_Category.invalid ||
      this.economicdataForm.invalid ||
      this.installationForm.invalid ||
      this.warrantyForm.invalid ||
      this.libraryForm.invalid
    ) {
      validateForm.validateAllFormFields(this.assetForm);
      validateForm.validateAllFormFields(this.assetInfoForm);
      validateForm.validateAllFormFields(this.Location_Category);
      validateForm.validateAllFormFields(this.economicdataForm);
      validateForm.validateAllFormFields(this.installationForm);
      validateForm.validateAllFormFields(this.warrantyForm);
      validateForm.validateAllFormFields(this.libraryForm);

      validateForm.validateAllFormFields(this.assetInstructionForm);


      // this.messageText='Please Fill Required Data';
      // this.isDispalyMassege="true";
      // setInterval(() => {
      //   this.isDispalyMassege="false";
      // }, 5000);


      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
      return false;
    } else {

      this.assetForm.controls['assetGroup'].setValue(JSON.parse(localStorage.getItem('selectedAssetGroup') || '{}'));
      /* console.log("JSON.parse(selctedAssetGroup)", JSON.parse(selctedAssetGroup)); */
      let finalData: any = {};
      Object.assign(finalData, this.assetForm.getRawValue(),
        this.assetInfoForm.getRawValue(),
        this.Location_Category.getRawValue(),
        this.economicdataForm.getRawValue(),
        this.installationForm.getRawValue(),
        this.warrantyForm.getRawValue(),
        this.assetInstructionForm.getRawValue());

      //this.libraryForm.getRawValue());
      finalData.technicalGuidanceBooks = [];
      finalData.listInstructionDescriptionId = [];
      finalData.comment = this.libraryForm.value.comment;

      if (this.assetInstructionForm.value.instructionDescription != null) {
        // Extract the list of IDs
        const instructionDescriptionIds = this.assetInstructionForm.value.instructionDescription.map((item: any) => item.id);

        // Assign the extracted IDs to finalData
        finalData.listInstructionDescriptionId = instructionDescriptionIds;

        // Ensure instructionDescriptionId is not undefined
        finalData.listInstructionDescriptionId = finalData.listInstructionDescriptionId !== undefined ? finalData.listInstructionDescriptionId : 0;
      }

      if (this.oldassetid != undefined && this.oldassetid != null && this.oldassetid != 0) {
        finalData.oldAsset = { id: this.oldassetid };
      }
      if (this.parentassetid != undefined && this.parentassetid != null && this.parentassetid != 0) {
        finalData.parentAsset = { id: this.parentassetid };
      }

      let books: any[] = this.libraryForm.value.technicalGuidanceBooks;
      if (books != null) {
        books.forEach(element => {
          let book: any = {
            id: element.id,
            guidanceBook: { id: element.lookupId, name: "" }
          }
          finalData.technicalGuidanceBooks.push(book);
        });

      }
      finalData.isEnabled = this.assetInfoForm.value.isEnabled.value == 1 ? true : false;
      if (!finalData.assetAttachments) {
        finalData.assetAttachments = [];
      }
      (this.attachmentAssetForm.get('attachments') as FormArray).controls.forEach(
        (element) => {
          let attach = new Attachments();
          attach.id = element.value.id;
          attach.attachmentName = element.value.attachmentName;
          attach.attachmentURL = null;
          finalData.assetAttachments.push(attach);
        }
      );

      try { finalData.invoiceDate = dateHelper.ConvertDateWithSameValue(this.economicdataForm.value.invoiceDate); } catch { }
      try { finalData.poDate = dateHelper.ConvertDateWithSameValue(this.economicdataForm.value.poDate); } catch { }
      try { finalData.internalPODate = dateHelper.ConvertDateWithSameValue(this.economicdataForm.value.internalPODate); } catch { }
      try { finalData.replacementDate = dateHelper.ConvertDateWithSameValue(this.economicdataForm.value.replacementDate); } catch { }
      try { finalData.internalPODate = dateHelper.ConvertDateWithSameValue(this.economicdataForm.value.internalPODate); } catch { }

      try { finalData.productionDate = dateHelper.ConvertDateWithSameValue(this.installationForm.value.productionDate); } catch { }
      try { finalData.technicalInspectionDate = dateHelper.ConvertDateWithSameValue(this.installationForm.value.technicalInspectionDate); } catch { }
      try { finalData.deliveryInspectionDate = dateHelper.ConvertDateWithSameValue(this.installationForm.value.deliveryInspectionDate); } catch { }
      try { finalData.endUserAcceptanceDate = dateHelper.ConvertDateWithSameValue(this.installationForm.value.endUserAcceptanceDate); } catch { }
      try { finalData.edd = dateHelper.ConvertDateWithSameValue(this.installationForm.value.edd); } catch { }
      try { finalData.technicalAcceptanceDate = dateHelper.ConvertDateWithSameValue(this.installationForm.value.technicalAcceptanceDate); } catch { }
      try { finalData.finalAcceptanceDate = dateHelper.ConvertDateWithSameValue(this.installationForm.value.finalAcceptanceDate); } catch { }
      try { finalData.installationDate = dateHelper.ConvertDateWithSameValue(this.installationForm.value.installationDate); } catch { }

      if (this.id) {
        finalData.id = Number(this.id)
        this.assetService.updateAsset(finalData).subscribe(res => {
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
            return sucess;
            // this.router.navigate(['/assets/assets']);
          } else {
            this.messageText = message;
            this.isDispalyMassege = "true";
            setInterval(() => {
              this.isDispalyMassege = "false";
            }, 5000);

            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: message,
              life: 3000,
            });
            return sucess;
          }

        });
      } else {
        this.assetService.saveAsset(finalData).subscribe(res => {
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
            this.resetAllForms();
            return sucess;
            // this.router.navigate(['/assets/assets']);
          } else {
            this.messageText = message;
            this.isDispalyMassege = "true";
            /* setInterval(() => {
              this.isDispalyMassege = "false";
            }, 5000); */

            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: message,
              life: 4000,
            });
            return sucess;
          }

        });
      }
    }
  }

  calcNBV() {
    var price = this.economicdataForm.value.purchasingPrice == null ? 0 : this.economicdataForm.value.purchasingPrice;
    this.economicdataForm.controls["nbv"].setValue((price - ((price / 10) * this.lifeSpan)) < 0 ? 0 : (price - ((price / 10) * this.lifeSpan)));
  }

  calcNBVEvent(value: any) {
    var price = value == null ? 0 : value;
    this.economicdataForm.controls["nbv"].setValue((price - ((price / 10) * this.lifeSpan)) < 0 ? 0 : (price - ((price / 10) * this.lifeSpan)));
  }

  calcNBVAJAJI(liftSpan: any = 0) {
    if (this.economicdataForm.value.purchasingPrice && this.installationForm.value.installationDate) {
      var price = this.economicdataForm.value.purchasingPrice;
      var installationDate = new Date(this.installationForm.value.installationDate);
      var currentDate = new Date();
      var countDay = (Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(installationDate.getFullYear(), installationDate.getMonth(), installationDate.getDate())) / (1000 * 60 * 60 * 24) + 1;
      if ((countDay / 30) > (liftSpan * 12)) {
        var acc = (price / (liftSpan * 12)) * (liftSpan * 12)
        this.economicdataForm.controls["nbv"].setValue(Math.floor(price - acc));
      }
      else {
        var acc = (price / (liftSpan * 12)) * (countDay / 30)
        this.economicdataForm.controls["nbv"].setValue(Math.floor(price - acc));
      }

    }
  }

  attachmentReady(event: any) {
    (this.attachmentAssetForm.get('attachments') as FormArray).push(
      this.formbuilder.group({
        attachmentName: event[0],
        attachmentURL: [''],
        id: 0,
      })
    );

  }

  uploadFile($event: any) {
    this.fileService.uploadFile($event)?.subscribe((a: any) => {
      if (a instanceof HttpResponse) {
        if (a.status == 200) {
          const body = <any>a.body;
          if (body.data.length > 0) {
            this.assetInfoForm.controls["assetPhoto"].setValue(body.data[0]);
            this.downloadImage(body.data);
          }
        }
      }
    }
    );
  }

  downloadImage(imageName: any) {
    this.fileService.downloadImage(imageName).subscribe(res => {
      var a = imageName[0].split(".")
      this.imageSource = this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/${a[1]};base64, ${res}`);
    })
  }

  removeImage() {
    this.imageSource = '';
    this.assetInfoForm.controls["assetPhoto"].setValue('');
  }

  setEndWarrentyDate() {
    let dto = {
      endUserAcceptanceDate: this.installationForm.value.endUserAcceptanceDate,
      siteWarrantyMonthNo: this.warrantyForm.value.siteWarrantyMonthNo,
      extendedWarrantyMonthNo: this.warrantyForm.value.extendedWarrantyMonthNo,

    }
    this.assetService.GetWarrentyEnd(dto).subscribe(res => {
      if (res.data) {
        this.warrantyForm.controls["warrantyEndDateDisplay"].setValue(new Date(res.data));
      }
      else {
        this.warrantyForm.controls["warrantyEndDateDisplay"].setValue(null);
      }

    })

  }


  resetAllForms() {
    this.assetForm.reset();
    this.assetInfoForm.reset();
    this.Location_Category.reset();
    this.economicdataForm.reset();
    this.installationForm.reset();
    this.warrantyForm.reset();
    this.libraryForm.reset();
    this.assetInstructionForm.reset();
  }
}
