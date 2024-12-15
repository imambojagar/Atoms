import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ExportService } from '../../shared/services/export.service';
import { ModelCreationDto } from './model-creation-dto';
import { ModelCreationService } from './model-creation.service';
import { PrimengModule } from '../../shared/primeng.module';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Table } from 'primeng/table';
import { AddEditModelCreationComponent } from './add-edit-model-creation/add-edit-model-creation.component';
import { ViewModelCreationComponent } from './view-model-creation/view-model-creation.component';

@Component({
  selector: 'app-model-creation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    AddEditModelCreationComponent,
    ViewModelCreationComponent,
  ],
  templateUrl: './model-creation.component.html',
  styleUrl: './model-creation.component.scss',
})
export class ModelCreationComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  filter: any = {};
  items!: MenuItem[];
  tableData: any[] = [];
  totalRows!: number;
  loading!: boolean;
  showAddModal: boolean = false;
  showFilterModal: boolean = false;
  showEditModal: boolean = false;
  modelSearchForm!: FormGroup;
  addModelCreationLoaded: boolean = false;
  viewModelCreationLoaded: boolean = false;
  model_id: any;
  model_index: any;
  status: string = '';
  searchValue: string = '';
  balanceFrozen: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private api: ModelCreationService,
    private router: Router,
    private messageService: MessageService,
    private exporteService: ExportService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    // this.items = [
    //   { label: 'Home', routerLink: ['/'] },
    //   { label: 'Model Creation' },
    // ];
    this.modelSearchForm = this.fb.group({
      sName: [],
      sCode: [],
      orgCode: [],
      orgName: [],
      orgPost: [],
    });
    this.reset();
  }
  navToDetails(a: ModelCreationDto, tabIndex: number) {
    // this.router.navigate(
    //   ['reference-table/model-creation/edit-control/', a.id],
    //   {
    //     queryParams: { tabIndex: tabIndex },
    //   }
    // );
    this.model_id = a.id;
    this.model_index = tabIndex;
    this.status = 'edit';
    this.addModelCreationLoaded = !this.addModelCreationLoaded;
  }

  navToView(a: ModelCreationDto, tabIndex: number) {
    this.model_id = a.id;
    this.model_index = tabIndex;
    this.status = 'view';
    this.viewModelCreationLoaded = !this.viewModelCreationLoaded;
  }
  delete(item: ModelCreationDto) {
    this.api.delete(item.id as number).subscribe((res) => {
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.search();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Model Deleted',
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

  search() {
    this.api.search(this.filter).subscribe((res) => {
      this.totalRows = res.totalRows;
      this.tableData = res.data;
      this.cdr.detectChanges();
    });
    this.close_filter_modal();
  }

  reset() {
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
      name: '',
      manufacturer: '',
      model: '',
    };
    this.search();
  }
  paginate(event: any) {
    this.loading = true;
    this.filter.pageNumber = event.page + 1;
    this.search();
  }

  export() {
    this.exporteService
      .export(this.filter, 'ModelCreation/exportModelCreation')
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
        link.download = 'ModelCreation-Report';
        link.click();
      });
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.tableData = this.tableData.filter((row: any) =>
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
    this.search();
    this.cdr.detectChanges();
  }

  async toggleAdd() {
    this.addModelCreationLoaded = !this.addModelCreationLoaded;
    this.search();
  }

  toggleFilter() {
    this.showFilterModal = !this.showFilterModal;
  }

  close_add_modal() {
    // this.orgForm.reset();
    this.showAddModal = false;
  }

  close_edit_modal() {
    // this.orgForm.reset();
    this.showEditModal = false;
  }

  close_filter_modal() {
    this.modelSearchForm.reset();
    this.showFilterModal = false;
  }

  async openAddModal() {
    this.model_id = 0;
    this.model_index = 0;
    this.status = 'add';
    this.addModelCreationLoaded = !this.addModelCreationLoaded;
  }

  async openViewModal() {
    this.viewModelCreationLoaded = !this.viewModelCreationLoaded;
  }
}
