import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ModelDefinitionModel } from '../../../models/model-definition-model';
import {
  ConfirmationService,
  ConfirmEventType,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModelService } from '../../../services/model-definition.service';
import { ExportService } from '../../../shared/services/export.service';
import { ApiService } from '../../../services/name-definition.service';
import { PrimengModule } from '../../../shared/primeng.module';
import { CommonModule } from '@angular/common';
import { ModelSearchComponent } from '../model-search/model-search.component';
import { AddModelDefinitionComponent } from '../add-model-definition/add-model-definition.component';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { EditDeleteModelDefinitionComponent } from '../edit-delete-model-definition/edit-delete-model-definition.component';
import { ViewModelComponent } from '../view-model/view-model.component';

@Component({
  selector: 'app-view-model-definition',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PrimengModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModelSearchComponent,
    AddModelDefinitionComponent,
    EditDeleteModelDefinitionComponent,
    ViewModelComponent,
  ],
  templateUrl: './view-model-definition.component.html',
  styleUrl: './view-model-definition.component.scss',
})
export class ViewModelDefinitionComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  modelDefinitionModel: ModelDefinitionModel = new ModelDefinitionModel();
  loading!: boolean;
  //breadcrumb
  items!: MenuItem[];
  //search filter
  modelDefinition: ModelDefinitionModel[] = [];
  totalRows: number = 0;
  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };

  assetsList: any[] = [];
  modelsList: any[] = [];
  modelsCodesList: any[] = [];
  manufacturerList: any[] = [];
  supplierList: any[] = [];
  assetCodesList: any[] = [];
  oracleNames: any[] = [];
  oracleCodes: any[] = [];

  public addModelLoaded: boolean = false;
  public editModelLoaded: boolean = false;
  public viewModelLoaded: boolean = false;
  public filterLoaded: boolean = false;
  model_id: any = 0;
  balanceFrozen: boolean = false;

  modelSearchForm!: FormGroup;
  model_index: any;
  searchValue: string = '';
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private api: ModelService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private exporteService: ExportService,
    private assetNDAPI: ApiService
  ) { }

  ngOnInit(): void {
    this.getModels();
    this.getAssetCodes();
  }

  async openModal() {
    this.model_id = 0;
    this.addModelLoaded = !this.addModelLoaded;
  }

  async openEditModal() {
    this.editModelLoaded = !this.editModelLoaded;
  }

  async openViewModal() {
    this.viewModelLoaded = !this.viewModelLoaded;
  }

  async openFilterModal() {
    this.filterLoaded = !this.filterLoaded;
  }

  navToDetails(row: any, index: number) {
    this.modelDefinitionModel.id = row.id;
    this.model_id = row.id;
    this.model_index = index;
    this.editModelLoaded = !this.editModelLoaded;
  }

  viewDetails(row: any, index: number) {
    this.modelDefinitionModel.id = row.id;
    this.model_id = row.id;
    this.model_index = index;
    this.viewModelLoaded = !this.viewModelLoaded;
  }

  search() {
    this.api.getModelDefinitions(this.filter).subscribe((res: any) => {
      const data = res?.data;
      this.totalRows = res?.totalRows;
      console.log('all data', data);
      this.modelDefinition = data;
      this.cdr.detectChanges();
    });
  }

  getModelSearch(searchdata: any) {
    // this.filter.assetOracleCodeValue = searchdata;
    this.filter = searchdata;
    this.search();
  }
  getModels() {
    this.api.getModelDefinitions(this.filter).subscribe((res: any) => {
      const data = res?.data;
      this.totalRows = res?.totalRows;
      console.log('all data', data);
      this.modelDefinition = data;
      this.cdr.detectChanges();
    });
  }

  paginate(event: any) {
    this.loading = true;
    console.log('paginate event', event);
    this.filter.pageNumber = event.page + 1;
    setTimeout(() => {
      this.api.getModelDefinitions(this.filter).subscribe((res: any) => {
        const data = res?.data;
        this.modelDefinition = data;
        this.totalRows = res?.totalRows;
        this.loading = false;
        this.cdr.detectChanges()
      });
    }, 500);
  }

  getAssetCodes() {
    this.assetNDAPI.getLookups({ queryParams: 408 }).subscribe((res: any) => {
      this.assetCodesList = res?.data;
      this.cdr.detectChanges()
    });
  }

  modelCodeFilter(modelDefCode: any) {
    this.api
      .searchModelDefinition({ modelDefCode: modelDefCode.query })
      .subscribe((res) => {
        const data = res?.data;
        this.modelsCodesList = data;
        this.cdr.detectChanges()
      });
  }
  export() {
    console.log('this.filter', this.filter);
    this.exporteService
      .export(this.filter, 'ModelDefinition/export-model-definition')
      .subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'File should be downloaded now',
          life: 3000,
        });
        var downloadURL = URL.createObjectURL(res);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'Model-Report';
        link.click();
      });
  }

  onGlobalFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement.value;
    this.dt.filterGlobal(filterValue, 'contains');
    this.cdr.detectChanges()
  }

  deleteModel(row: any) {
    this.modelDefinitionModel.id = row.id;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + row.modelDefCode + '?',
      header: 'Confirm',
      rejectButtonStyleClass: 'btn btn-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api
          .deleteModelDefinition(this.modelDefinitionModel.id)
          .subscribe((res) => {
            const message = res?.message;
            const sucess = res?.isSuccess;
            if (sucess == true) {
              this.getModels();
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

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.modelDefinition = this.modelDefinition.filter((row: any) =>
        Object.values(row).some((val: any) =>
          String(val).toLowerCase().includes(this.searchValue)
        )
      );
    } else {
      this.resetGlobalFilter();
    }
    this.cdr.detectChanges();
  }

  resetGlobalFilter() {
    this.searchValue = ''; // Clear the search input
    this.getModels();
    this.getAssetCodes();
    this.cdr.detectChanges();
  }
}
