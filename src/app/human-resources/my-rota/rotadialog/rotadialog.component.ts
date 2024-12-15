import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AssetGroupService } from '../../../services/asset-group.service';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-rotadialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  /* standalone: true,
  imports: [PrimengModule, FormsModule, ReactiveFormsModule, CommonModule], */
  templateUrl: './rotadialog.component.html',
  styleUrl: './rotadialog.component.scss',
  providers: [DatePipe, TranslatePipe]
})
export class RotadialogComponent implements AfterViewInit {
  // @Input('showmodal') showModal: boolean = false;
  // @ViewChild('drawer') public modalComponent: any;
  // @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  // @Input('data') data: any;

  searchFilter: any = {};
  Sites: any[] = [];
  shifts: any[] = [];
  employees: any[] = [];
  AssetGroups: any[] = [];
  showFilterModal: boolean = false;
  searchForm!: FormGroup;
  constructor(
    private cdr: ChangeDetectorRef,
    public ref: DynamicDialogRef,
    // public config: DynamicDialogConfig,
    private assetGroupService: AssetGroupService,
    @Inject(DynamicDialogConfig) public config: DynamicDialogConfig
  ) {}
  ngAfterViewInit(): void {
    this.Init();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.Init();
  }

  Init() {
    console.log("config", this.config);
    this.getAssetGroups();
    // let empName=this.config.data.data.event._def.title.toString().split('-')[0].trim()
    this.searchFilter.shiftDate =
      this.config?.data?.data._instance.range.start;
      console.log("config data", this.config?.data?.data.event);

    this.searchFilter.site = this.config.data.filters.site;
    this.searchFilter.assetGroup = this.config.data.filters.assetGroup;
    this.employees = this.config.data.employees;
    this.searchFilter.employee = this.employees.filter(
      (e) => e.userId == this.config.data.data.id
    )[0];

    this.shifts = this.config.data.shifts;
    let a = this.config.data.data._def.title
      .toString()
      .split('-')[1]
      .trim();
    console.log("this.shifts.filter((s)",this.shifts.filter((s) => s.shiftName === a));

    this.searchFilter.defaultShift = this.shifts.filter(
      (s) => s.shiftName === a
    )[0];
  }

  selectProduct(product: any) {
    this.ref.close(product);
  }
  getAssetGroups() {
    this.assetGroupService.searchAssetGroups({}).subscribe((res: any) => {
      console.log("Asset group data", res);
      this.AssetGroups = res.data;
      this.cdr.detectChanges();
    });
  }

  close_filter_modal() {
    this.searchForm.reset();
    this.showFilterModal = false;
  }
}
