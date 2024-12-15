import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { sparePartTransaction } from '../sparePart/sparePartTransaction.service';
import { PartCatalogService } from '../partcatalog/part-catalog.service';

@Component({
  selector: 'app-sparePartsQuantityLookup',
  templateUrl: './sparePartsQuantityLookup.component.html',
  styleUrls: ['./sparePartsQuantityLookup.component.scss']
})
export class SparePartsQuantityLookupComponent implements OnInit {

  frm: FormGroup = null as any;

  partCatalogs: any[] = [];

  data: any[] = [];

  constructor(private fb:FormBuilder,
    private partCatalogService: PartCatalogService,
    private spt: sparePartTransaction) { }

  ngOnInit() {
    this.frm = this.fb.group({
      partNo: new FormControl(''),
      partName: new FormControl(''),
    });
  }
  searchForQuantities() {
    let filter = this.frm.getRawValue();
    this.spt.filterQuantities(filter).subscribe(x => {
      this.data = x;
    })
  }

  getPartCatalogs($event: any) {
    return this.partCatalogService.getAutoComplete({ partName: $event.query }).subscribe(d => {
      this.partCatalogs = d;
    })
  }

}
