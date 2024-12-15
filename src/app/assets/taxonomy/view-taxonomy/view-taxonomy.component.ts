import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TaxonomyService } from '../../../services/taxonomy.service';
import { ExportService } from '../../../shared/services/export.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PrimengModule } from '../../../shared/primeng.module';
import { TrPipe } from '../../../shared/pipes/tr.pipe';
import { SearchTaxonomyComponent } from '../search-taxonomy/search-taxonomy.component';
import { AddModelComponent } from '../add-model/add-model.component';
import { MunfactrerModelMangementComponent } from '../search-taxonomy/munfactrer-model-mangement/munfactrer-model-mangement.component';
// import { SearchComponentComponent } from '../../../shared/components/search-component/search-component.component';


@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, PrimengModule, ReactiveFormsModule, TranslateModule, SearchTaxonomyComponent, AddModelComponent, MunfactrerModelMangementComponent],
  selector: 'app-view-taxonomy',
  templateUrl: './view-taxonomy.component.html',
  styleUrls: ['./view-taxonomy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService, ConfirmationService, TrPipe]
})
export class ViewTaxonomyComponent {

  filterLoaded: boolean = false;
  childLoaded: boolean = false;
  addTaxonomyLoaded: boolean = false;
  items!: MenuItem[];
  models: any[] = [];
  // childrenModels: [] = [];
  totalRows!: number;
  totalRowsModels!: number;
  loading!: boolean;
  manufatureresList: [] = [];
  modelsList: [] = [];
  showDialog!: boolean;
  parentId: any;
  filter: any = {
    pageSize: 10,
    pageNumber: 1
  };
  child: any
  editModelobject: any
  searchValue: any;
  constructor(private api: TaxonomyService, private formbuilder: FormBuilder,
    private router: Router, private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private exporteService: ExportService, private cdr: ChangeDetectorRef,) { }
  ngOnInit(): void {


    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Manufacturer/Model List' },
    ];
    this.getAll()
  }

  export() {

    this.exporteService
      .export(this.filter, 'Taxonomy/exportTaxonomy')
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
        link.download = 'Taxonomy-Report';
        link.click();
      });
  }







  getAll() {
    console.log("this.filter", this.filter)
    this.api.getTaxonomies(this.filter).subscribe(res => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.models = data;
        this.totalRows = res.totalRows;
        this.cdr.detectChanges();

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

  paginate(event: any) {
    this.loading = true;
    this.filter.pageNumber = event.page + 1;
    this.getAll();
    this.cdr.detectChanges()
    this.loading = false;
  }




  delete(id: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this ?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteTaxonomy(id).subscribe(res => {
          console.log("delete res", res)
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            this.getAll();
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
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });

  }

  searchManufacturerName($event: any) {
    console.log("manufacturer $event", $event)

    this.api.searchManufacturerByName({ name: $event.query }).subscribe((res) => {
      this.manufatureresList = res.data;

    });
  }
  searchManufacturerID($event: any) {
    console.log("manufacturer $event", $event)

    this.api.GetManufacturerOrModelAutoComplete3(true, $event.query, $event.query).subscribe((res) => {
      this.manufatureresList = res.data;

    });
  }

  searchModel($event: any) {
    console.log("Model $event", $event)
    this.api.searchTaxonomy({ name: $event.query }).subscribe((res) => {
      this.modelsList = res.data;
    });
  }

  async openFilterModal() {
    this.filterLoaded = true;

  }
  async closeFilterModal() {
    this.filterLoaded = false;
    this.getAll()

  }
  async openChildModals(child: any) {
    this.child = child
    this.childLoaded = true;
    this.cdr.detectChanges()
  }
  closchild() { this.childLoaded = false; }
  async openModal() {
    this.addTaxonomyLoaded = true;
  }
  async closeModal() {
    this.addTaxonomyLoaded = false;
    this.editModelobject = null
    this.cdr.detectChanges()
    this.getAll()
  }
  getTaxonomySearch(event: any) {
    console.log(event);

    this.filter = event;
    this.getAll();
    this.filterLoaded = false
  }
  // async openaddmodel() {
  //   this.closeModal()
  //   this.getAll()

  // }
  openeditModal(id: number) {
    this.api.getSingleTaxonomy(id).subscribe(res => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.editModelobject = data
        console.log(this.editModelobject);

        this.addTaxonomyLoaded = true;
        this.cdr.detectChanges()
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

  // Global search and filter logic
  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.models = this.models.filter((row: any) =>
        Object.values(row).some((val: any) => String(val).toLowerCase().includes(this.searchValue))
      );
    }
    else {
      this.resetGlobalFilter()
    }
    this.cdr.detectChanges();
  }

  resetGlobalFilter() {
    this.searchValue = ''; // Clear the search input
    this.getAll()
    this.cdr.detectChanges();
  }
}
