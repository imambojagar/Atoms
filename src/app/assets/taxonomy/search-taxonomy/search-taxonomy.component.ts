import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaxonomyService } from '../../../services/taxonomy.service';
import { PrimengModule } from '../../../shared/primeng.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-search-taxonomy',
  standalone: true,
  imports: [PrimengModule, CommonModule, SharedModule, ReactiveFormsModule,],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-taxonomy.component.html',
  styleUrl: './search-taxonomy.component.scss',

})
export class SearchTaxonomyComponent implements OnInit {
  @Input('filter') filter: any; // Initialize filter as needed
  @Input('showmodal') showmodal: boolean = false;
  @ViewChild('drawerFilter1') public drawerFilter1: any;
  @Output() openSearchModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() TaxonomySearch: EventEmitter<any> = new EventEmitter<any>();
  searchForm!: FormGroup;

  manufatureresList: [] = [];

  displayUpdate!: boolean;
  constructor(private api: TaxonomyService, private formbuilder: FormBuilder, private cdr: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.searchForm = this.formbuilder.group({
      id: null,
      modelId: null,
      modelName: null,
      manufacturerId: null,
      manufacturerName: null,
      pageSize: this.filter?.pageSize || 10,  // Set default page size
      pageIndex: this.filter?.pageNumber || 1 // Set default page number
    });
  }

  searchManufacturerName($event: any) {
    console.log("manufacturer $event", $event);

    this.api.searchManufacturerByName({ name: $event.query }).subscribe((res) => {
      this.manufatureresList = res.data;

      this.cdr.detectChanges();
    });
  }

  searchManufacturerID($event: any) {
    console.log("manufacturer $event", $event);

    this.api.GetManufacturerOrModelAutoComplete3(true, $event.query, $event.query).subscribe((res) => {
      this.manufatureresList = res.data;

      this.cdr.detectChanges();
    });
  }

  close_modal() {
    this.showmodal = false;
    this.openSearchModals.emit();
    this.filter.manufacturerName = null
    this.filter.manufacturerId = null
    this.searchForm.reset()
  }

  search() {
    const searchCriteria = {
      ...this.filter, // Include all form values, including pageSize and pageIndex
      pageSize: this.searchForm.value.pageSize,
      pageIndex: this.searchForm.value.pageIndex
    };
    this.TaxonomySearch.emit(searchCriteria);


    this.search()
  }
}
