import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService, ConfirmEventType, Message, MenuItem, TreeNode } from "primeng/api";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TaxonomyModel } from '../../../models/taxonomy-model';
import { TaxonomyService } from '../../../services/taxonomy.service';
import validateForm from '../../../shared/helpers/validateForm';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TrPipe } from '../../../shared/pipes/tr.pipe';
import { PrimengModule } from '../../../shared/primeng.module';
import { SharedModule } from '../../../shared/shared.module';
import { PaginatorModule } from 'primeng/paginator';



@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, PrimengModule, ReactiveFormsModule, TranslateModule, SharedModule, PaginatorModule],
  selector: 'add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.scss'],
  providers: [MessageService, ConfirmationService, TrPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AddModelComponent {

  searchQuery: string = ''; // Bind this to the search input field
  loading: boolean = true
  @Input('showmodal') showmodal: boolean = false;
  @Input('editModelobject') editModelobject: any = null;
  @ViewChild('addmodel') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('edit_asset_id') edit_asset_id: number = 0;
  taxonomyId!: any;
  parentId!: any;
  items!: MenuItem[];
  files: any[] = [];
  tn!: TreeNode;
  nodeSelected!: any;
  taxonomiesArray: any[] = [];
  addModelForm!: FormGroup;
  editModelForm!: FormGroup;

  editChildForm!: FormGroup;
  taxonomyModel: TaxonomyModel = new TaxonomyModel();
  filter = {
    pageSize: 10,
    pageNumber: null,
    modelId: null,
    modelName: null,
    manufacturerId: null,
    manufacturerName: null,
  }
  paginatedFiles: any[] = []; // Holds nodes for the current page
  currentPage: number = 0;
  itemsPerPage: number = 5;

  childItemsPerPage: number = 3; // Set the number of child items per page
  constructor(private router: Router, private formbuilder: FormBuilder, private api: TaxonomyService, private messageService: MessageService, private confirmationService: ConfirmationService, private cdr: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.addModelForm = this.formbuilder.group({
      taxonomyName: ['', Validators.required],
      taxonomyDescription: [''],
      parentId: [''],

    })

    this.searchQuery = ''; // Reset search query on init

    if (this.editModelobject) {
      this.addModelForm.patchValue(this.editModelobject)
    }
  }

  advancedSearch() {
    const query = this.searchQuery.toLowerCase();

    // Filter the files array to get matching nodes
    const filteredNodes = this.files.filter(item =>
      item.label.toLowerCase().includes(query) ||
      item.children.some((child: any) => child.label.toLowerCase().includes(query))
    );

    // Update pagination with the filtered nodes
    this.paginatedFiles = filteredNodes.slice(
      this.currentPage * this.itemsPerPage,
      (this.currentPage + 1) * this.itemsPerPage
    );
    this.cdr.detectChanges();
  }

  taxonomyToTreeNode(taxonomyModel: TaxonomyModel): TreeNode<TaxonomyModel> {

    this.cdr.detectChanges();
    return {
      label: taxonomyModel.taxonomyName,
      data: taxonomyModel,
      children: taxonomyModel.children.map(this.taxonomyToTreeNode)
    };
  }


  getTreeNode(label: string, data: any, children: TreeNode[] = []) {

    this.cdr.detectChanges();
    return {
      label: label,
      children: children,
      data: data
    }
  }

  // getFiles() {
  //   this.api.getTaxonomy(this.filter).subscribe(res => {
  //     const data = res.data;
  //     this.loading = false
  //     let treeNodes: TreeNode[] = [];
  //     this.taxonomiesArray = data
  //     treeNodes = this.convertToTreeNodes(data);
  //     this.files = treeNodes;
  //     this.updatePagination();
  //     this.cdr.detectChanges();
  //   })

  // }
  // paginate(event: any) {
  //   this.currentPage = event.page;
  //   this.itemsPerPage = event.rows;
  //   this.updatePagination();
  // }

  // paginateChildren(event: any, item: any) {
  //   const startIndex = event.page * this.childItemsPerPage;
  //   const endIndex = startIndex + this.childItemsPerPage;
  //   item.paginatedChildren = item.children.slice(startIndex, endIndex);
  // }

  // updatePagination() {
  //   const startIndex = this.currentPage * this.itemsPerPage;
  //   const endIndex = startIndex + this.itemsPerPage;
  //   this.paginatedFiles = this.files.slice(startIndex, endIndex);

  //   this.paginatedFiles.forEach(item => {
  //     item.paginatedChildren = item.children.slice(0, this.childItemsPerPage);
  //   });
  // }

  // convertToTreeNodes(taxonomies: TaxonomyModel[]): TreeNode[] {
  //   let treeNodes: TreeNode[] = [];
  //   var parent = taxonomies.filter(x => x.parentId == null);
  //   for (let i = 0; i < parent.length; i++) {
  //     let taxonomy = parent[i];
  //     let parentName = taxonomy.taxonomyName;
  //     let children: TreeNode[] = [];
  //     let emptyChildren: TreeNode[] = [];

  //     for (let t = 0; t < taxonomy.children.length; t++) {
  //       let taxonomyChild = taxonomy.children[t];
  //       let childName = taxonomyChild.taxonomyName;
  //       children.push(this.getTreeNode(childName, taxonomyChild, emptyChildren))
  //     }
  //     treeNodes.push(this.getTreeNode(parentName, taxonomy, children))
  //     this.cdr.detectChanges();
  //   }
  //   return treeNodes;



  // // }
  // onNodeSelect(event: any) {
  //   console.log("node selected", event);
  //   // this.nodeSelected1=event.data
  //   this.taxonomyId = event.data.id;
  //   this.parentId = event.data.parentId;

  //   // Initialize the form if it's not already
  //   if (!this.editModelForm) {
  //     this.editModelForm = this.formbuilder.group({
  //       taxonomyName: ['', Validators.required],
  //       taxonomyDescription: ['']
  //     });
  //   }

  //   // Populate form fields with the selected node data
  //   this.api.getSingleTaxonomy(this.taxonomyId).subscribe(res => {
  //     const data = res.data;
  //     this.editModelForm.controls['taxonomyName'].setValue(data.taxonomyName);
  //     this.editModelForm.controls['taxonomyDescription'].setValue(data.taxonomyDescription);
  //   });
  // }

  submit() {

    if (this.addModelForm.invalid) {
      validateForm.validateAllFormFields(this.addModelForm);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Fill Required Data', life: 3000 });
    } else {
      this.taxonomyModel.taxonomyName = this.addModelForm.value.taxonomyName;
      this.taxonomyModel.taxonomyDescription = this.addModelForm.value.taxonomyDescription;
      this.taxonomyModel.parentId = this.addModelForm.value.parentId;
      console.log("taxonomy Data:", this.taxonomyModel)
      this.api.postTaxonomy(this.taxonomyModel).subscribe(res => {
        const data = res.data;
        const message = res.message;
        const success = res.isSuccess;
        if (success == true) {
          // this.getFiles();
          this.close_modal()
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: message, life: 3000 });
          this.addModelForm.reset();
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
        }
      })

    }

  }



  update() {
    this.taxonomyModel.id = this.taxonomyId;
    this.taxonomyModel.taxonomyName = this.addModelForm.value.taxonomyName;
    this.taxonomyModel.taxonomyDescription = this.addModelForm.value.taxonomyDescription;
    this.taxonomyModel.parentId = this.parentId;
    console.log("taxonomy Model", this.taxonomyModel)
    this.api.updateTaxonomy(this.taxonomyModel).subscribe(res => {
      const data = res.data;
      const message = res.message;
      const success = res.isSuccess;
      if (success == true) {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: message, life: 3000 });
        this.close_modal()
        // this.getFiles();
        this.taxonomyId = null;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
      }
    })
  }

  // deleteTaxonomy() {
  //   this.taxonomyModel.id = this.taxonomyId;
  //   this.taxonomyModel.taxonomyName = this.editModelForm.value.taxonomyName;
  //   this.confirmationService.confirm({
  //     message: 'Are you sure you want to delete this ' + this.taxonomyModel.taxonomyName + '?',
  //     header: 'Confirm',
  //     rejectButtonStyleClass: 'btn btn-danger',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.api.deleteTaxonomy(this.taxonomyModel.id).subscribe(res => {
  //         const data = res.data;
  //         const message = res.message;
  //         const success = res.isSuccess;
  //         if (success == true) {
  //           this.messageService.add({ severity: 'success', summary: 'Successful', detail: message, life: 5000 });
  //           this.editModelForm.reset();
  //           this.getFiles();
  //           this.taxonomyId = null;
  //         }
  //         else {
  //           this.messageService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
  //         }
  //       })
  //     },
  //     reject: (type: any) => {
  //       switch (type) {
  //         case ConfirmEventType.REJECT:
  //           this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
  //           break;
  //         case ConfirmEventType.CANCEL:
  //           this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
  //           break;
  //       }
  //     }

  //   });






  // }



  // updateChild() {
  //   // Update logic for child form
  //   const updatedData = { ...this.editChildForm.value, id: this.taxonomyId };
  //   this.api.updateTaxonomy(updatedData).subscribe(() => this.getFiles());
  // }



  // deleteChildTaxonomy() {
  //   this.taxonomyModel.id = this.taxonomyId;
  //   this.taxonomyModel.taxonomyName = this.editModelForm.value.taxonomyName;
  //   this.confirmationService.confirm({
  //     message: 'Are you sure you want to delete this ' + this.taxonomyModel.taxonomyName + '?',
  //     header: 'Confirm',
  //     rejectButtonStyleClass: 'btn btn-danger',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.api.deleteTaxonomy(this.taxonomyModel.id).subscribe(res => {
  //         const data = res.data;
  //         const message = res.message;
  //         const success = res.isSuccess;
  //         if (success == true) {
  //           this.messageService.add({ severity: 'success', summary: 'Successful', detail: message, life: 5000 });
  //           this.editModelForm.reset();
  //           this.getFiles();
  //           this.taxonomyId = null;
  //         }
  //         else {
  //           this.messageService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
  //         }
  //       })
  //     },
  //     reject: (type: any) => {
  //       switch (type) {
  //         case ConfirmEventType.REJECT:
  //           this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
  //           break;
  //         case ConfirmEventType.CANCEL:
  //           this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
  //           break;
  //       }
  //     }

  //   });





  // }
  close_modal() {
    // this.ngOnInit()
    this.addModelForm.reset()
    this.openModals.emit(false);
    this.showmodal = false
    // this.editModelobject = null
  }

}
