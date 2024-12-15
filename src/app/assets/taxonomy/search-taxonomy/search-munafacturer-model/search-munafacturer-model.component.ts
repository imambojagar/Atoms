import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaxonomyService } from '../../../../services/taxonomy.service';
import { CommonModule } from '@angular/common';
import { MessageService, SharedModule } from 'primeng/api';
import { PrimengModule } from '../../../../shared/primeng.module';

@Component({
  selector: 'app-search-munafacturer-model',
  standalone: true,
  imports: [PrimengModule, CommonModule, SharedModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-munafacturer-model.component.html',
  styleUrl: './search-munafacturer-model.component.scss'
})
export class SearchMunafacturerModelComponent {
  @Input('filter') filter: any; // Initialize filter as needed
  @Input('showmodal') showmodal: boolean = false;
  @ViewChild('drawerFilter2') public drawerFilter1: any;
  @Output() openSearchModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() SearchMunafacturerModelSearch: EventEmitter<any> = new EventEmitter<any>();
  searchForm!: FormGroup;

  parentId: any;
  childrenModels: [] = [];

  modelsList: [] = [];

  totalRowsModels!: number;
  constructor(private api: TaxonomyService, private formbuilder: FormBuilder, private messageService: MessageService,) { }
  searchModelForm!: FormGroup;
  modelFilter: any = {
    pageSize: 10,
    pageNumber: 1,
    name: null,
    parentId: null
  };
  ngOnInit(): void {
    this.searchModelForm = this.formbuilder.group({
      taxonomyName: ['', Validators.required],
      taxonomyDescription: [''],
      parentId: [''],
      id: [''],
    });

  }
  search() {
    const searchCriteria = {
      ...this.filter, // Include all form values, including pageSize and pageIndex
      pageSize: this.searchForm.value.pageSize,
      pageIndex: this.searchForm.value.pageIndex
    };

    this.SearchMunafacturerModelSearch.emit(searchCriteria);
    this.showmodal = false;
  }
  close_modal() {

    this.openSearchModals.emit();
  }

  searchModels() {
    this.getAllModels();
  }
  searchModel($event: any) {
    console.log("Model $event", $event)
    this.api.searchTaxonomy({ name: $event.query }).subscribe((res) => {
      this.modelsList = res.data;
    });
  }

  ResetModel() {
    this.modelFilter = {
      pageSize: 10,
      pageNumber: 1,
      name: null,
      parentId: this.parentId
    };
    this.searchModelForm.reset();
    this.getAllModels();
  }
  getAllModels() {
    this.api.searchTaxonomy(this.modelFilter).subscribe(res => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.childrenModels = data;
        this.totalRowsModels = res.totalRows;
      }
      else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        });
      }
    });
  }
}
