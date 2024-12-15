import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
import { TrPipe } from '../../../../shared/pipes/tr.pipe';
import { PrimengModule } from '../../../../shared/primeng.module';
import { AddModelComponent } from '../../add-model/add-model.component';
import { SearchTaxonomyComponent } from '../search-taxonomy.component';
import { TaxonomyService } from '../../../../services/taxonomy.service';
import { ExportService } from '../../../../shared/services/export.service';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { TaxonomyModel } from '../../../../models/taxonomy-model';

@Component({
  selector: 'app-munfactrer-model-mangement',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimengModule, ReactiveFormsModule, TranslateModule, SearchTaxonomyComponent, AddModelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService, ConfirmationService, TrPipe],
  templateUrl: './munfactrer-model-mangement.component.html',
  styleUrl: './munfactrer-model-mangement.component.scss'
})
export class MunfactrerModelMangementComponent {
  @ViewChild('dt') dt!: Table;
  @Input('child') child: any;
  @Input('showmodal') showmodal: boolean = false;
  @ViewChild('manuf') public manuf: any;
  @Output() openSearchModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() openChildModals: EventEmitter<any> = new EventEmitter<any>();

  // editModelForm!: FormGroup;
  modelFilter: any = {
    pageSize: 10,
    pageNumber: 1,
    name: null,
    parentId: null
  };
  modelForms: { [key: string]: FormGroup } = {};
  modelsList: [] = [];
  childrenModels: any[] = [];
  totalRowsModels!: number;
  taxonomyId!: any;
  parentId!: any;
  files: any[] = [];
  nodeSelected!: any;
  taxonomiesArray: any[] = [];
  addModelForm!: FormGroup;

  // editChildForm!: FormGroup;
  taxonomyModel: TaxonomyModel = new TaxonomyModel();
  // filter = {
  //   pageSize: 10,
  //   pageNumber: null,
  //   modelId: null,
  //   modelName: null,
  //   manufacturerId: null,
  //   manufacturerName: null,
  // };
  // paginatedFiles: any[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 5;
  childItemsPerPage: number = 3;
  loading: boolean = false;
  searchQuery: any = '';
  paginatedChildren: any;
  children: any;
  activeRow: any;
  activeRowIndex!: number;

  editChildForms: FormGroup[] = []; // Array of form groups for each child
  addChildForm!: FormGroup
  constructor(
    private api: TaxonomyService,
    private formbuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private exporteService: ExportService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // this.editModelForm = this.formbuilder.group({
    //   taxonomyName: ['', Validators.required],
    //   taxonomyDescription: [''],
    //   parentId: [''],
    //   id: [''],
    // });
    this.addChildForm = this.formbuilder.group({
      taxonomyName: ['', Validators.required],
      taxonomyDescription: ['']
    });
    this.modelFilter = {
      pageSize: 10,
      pageNumber: 1,
      name: null,
      parentId: this.child.id
    };

    this.cdr.detectChanges();
    this.getAllModels();
  }

  getAllModels() {
    this.api.searchTaxonomy(this.modelFilter).subscribe(res => {
      const data = res.data;
      const message = res.message;
      const success = res.isSuccess;
      if (success) {
        this.childrenModels = data;
        this.childrenModels.forEach((child, index) => {
          this.editChildForms.push(this.formbuilder.group({
            taxonomyName: [child.modelName || '', Validators.required],
            taxonomyDescription: [child.taxonomyDescription || '']
          }));
        });

        this.cdr.detectChanges();
        this.totalRowsModels = res.totalRows;
        // this.initializeModelForms();
        this.cdr.detectChanges();
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

  update(child: any, id: any) {
    let body = { taxonomyName: child.taxonomyName, taxonomyDescription: child.taxonomyDescription, parentId: this.child.id, id: id };
    this.api.updateTaxonomy(body).subscribe(res => {
      if (res.isSuccess) {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
        this.activeRow = null
        this.activeRowIndex = -1
        this.getAllModels()
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message, life: 3000 });
      }
    });
    this.getAllModels();
  }

  searchModels() {
    this.api.searchTaxonomy(this.modelFilter).subscribe(res => {
      const data = res.data;
      const message = res.message;
      const success = res.isSuccess;
      if (success) {
        this.childrenModels = data;
        this.totalRowsModels = res.totalRows;
        this.initializeModelForms()
        this.cdr.detectChanges();
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

  initializeModelForms() {
    this.childrenModels.forEach((model: any) => {
      this.modelForms[model.modelId] = this.formbuilder.group({
        taxonomyName: [model.taxonomyName || '', Validators.required],
        taxonomyDescription: [model.taxonomyDescription || ''],
        parentId: [model.parentId || ''],
        id: [model.id || '']
      });
    });

    this.cdr.detectChanges();
  }


  updateChild(child: any, index: number) {
    this.activeRow = child
    this.activeRowIndex = index
    this.editChildForms[index].patchValue({
      taxonomyName: child.modelName,
      taxonomyDescription: child.taxonomyDescription
    });
  }

  // getFiles() {
  //   this.api.getTaxonomy(this.filter).subscribe(res => {
  //     const data = res.data;
  //     this.loading = false;
  //     this.taxonomiesArray = data;
  //     this.files = data;
  //     this.updatePagination();
  //     this.cdr.detectChanges();
  //   });
  // }

  paginate(event: any) {
    this.modelFilter.pageNumber = event.page + 1
    this.getAllModels()
  }

  paginateChildren(event: any) {
    this.modelFilter.pageNumber = event.page
    this.getAllModels()
  }

  updatePagination() {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

  }

  deleteChildTaxonomy(child: any) {
    this.taxonomyModel.id = child.modelId;
    // this.taxonomyModel.taxonomyName = this.editModelForm.value.taxonomyName;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this ' + child.modelName + '?',
      header: 'Confirm',
      rejectButtonStyleClass: 'btn btn-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteTaxonomy(this.taxonomyModel.id).subscribe(res => {
          const data = res.data;
          const message = res.message;
          const success = res.isSuccess;
          if (success) {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: message, life: 5000 });
            // this.editModelForm.reset();
            this.getAllModels()
            this.taxonomyId = null;
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
          }
        });
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });
  }

  advancedSearch() {
    const query = this.searchQuery.toLowerCase();
    const filteredNodes = this.files.filter(item =>
      item.label.toLowerCase().includes(query) ||
      item.children.some((child: any) => child.label.toLowerCase().includes(query))
    );
    // this.paginatedFiles = filteredNodes.slice(
    //   this.currentPage * this.itemsPerPage,
    //   (this.currentPage + 1) * this.itemsPerPage
    // );
    this.cdr.detectChanges();
  }

  addChild() {
    this.taxonomyModel.taxonomyName = this.addChildForm.value.taxonomyName;
    this.taxonomyModel.taxonomyDescription = this.addChildForm.value.taxonomyDescription;
    this.taxonomyModel.parentId = this.modelFilter.parentId;
    this.api.postTaxonomy(this.taxonomyModel).subscribe(res => {
      const data = res.data;
      const message = res.message;
      const success = res.isSuccess;
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: message, life: 3000 });
        // this.editChildForm.reset();

        this.cdr.detectChanges();
        this.getAllModels();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
      }
    });
  }
  close_modal() {
    this.openChildModals.emit();

    this.showmodal = false;
    this.child = null
  }


}
