import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AssetGroupService } from '../../../services/asset-group.service';
import { PrimengModule } from '../../../shared/primeng.module';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rotadialog',
  standalone: true,
  imports: [PrimengModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './rotadialog.component.html',
  styleUrl: './rotadialog.component.scss',
})
export class RotadialogComponent implements OnChanges {
  searchFilter: any = {};
  Sites: any[] = [];
  shifts: any[] = [];
  employees: any[] = [];
  AssetGroups: any[] = [];
  showFilterModal: boolean = false;
  searchForm!: FormGroup;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private assetGroupService: AssetGroupService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.Init();
  }

  Init() {
    this.getAssetGroups();
    // let empName=this.config.data.data.event._def.title.toString().split('-')[0].trim()
    this.searchFilter.shiftDate =
      this.config.data.data.event._instance.range.start;
    this.searchFilter.site = this.config.data.filters.site;
    this.searchFilter.assetGroup = this.config.data.filters.assetGroup;
    this.employees = this.config.data.employees;
    this.searchFilter.employee = this.employees.filter(
      (e) => e.userId == this.config.data.data.event.id
    )[0];

    this.shifts = this.config.data.shifts;
    let a = this.config.data.data.event._def.title
      .toString()
      .split('-')[1]
      .trim();
    console.log(this.shifts.filter((s) => s.shiftName === a));

    this.searchFilter.defaultShift = this.shifts.filter(
      (s) => s.shiftName === a
    )[0];
  }

  selectProduct(product: any) {
    this.ref.close(product);
  }
  getAssetGroups() {
    this.assetGroupService.searchAssetGroups({}).subscribe((res: any) => {
      this.AssetGroups = res.data;
    });
  }

  close_filter_modal() {
    this.searchForm.reset();
    this.showFilterModal = false;
  }
}
