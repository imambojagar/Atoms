import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../../shared/primeng.module';
import { SharedTable } from '../../shared/components/table/table';
import { AssetGroup } from '../../models/asset-groups';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { AssetGroupService } from '../../services/asset-group.service';
import { Router } from '@angular/router';
import { AssetGroupManagmentComponent } from './asset-group-managment/asset-group-managment.component';

@Component({
  selector: 'app-asset-group',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, PrimengModule, AssetGroupManagmentComponent],
  templateUrl: './asset-group.component.html',
  styleUrl: './asset-group.component.scss'
})
export class AssetGroupComponent implements OnInit {
  searchFilter = new AssetGroup();
  searchForm!: FormGroup;
  items = [
    { label: 'Home', routerLink: ['/'] },
    { label: 'search Asset Group'},
  ];
  tableConfig = new SharedTable();
  pageSize: number = 10;
  pageIndex: number = 1;
  assetGroups: any[]=[];
  assetgroupsdata: any[]=[];
  selectedNames!: any[] | null;
  totalRows: number = 0;
  asset_group_id: number = 0;
  addTransferLoaded: boolean = false;
  filterLoaded: boolean = false;
  assets_group_index: number = 0;
  constructor(private fb: FormBuilder,private datePipe: DatePipe,
    private messageService: MessageService, private confirmationService: ConfirmationService,
    private router: Router, private assetGroupService: AssetGroupService) {

  }

  async openModal() {
    this.asset_group_id = 0;
    this.addTransferLoaded = !this.addTransferLoaded;
  }

  async openFilterModal() {
    this.filterLoaded = !this.filterLoaded;
  }

  clearValue(event: any) {
    event.target.value = '';
  }

  navToDetails(row: any, index: number) {
    /* this.nameDefinitionModel.id = row.id; */
    console.log("edit asset", row.id);
    this.asset_group_id = row.id;
    this.assets_group_index = index;
    this.addTransferLoaded = !this.addTransferLoaded;
  }



  ngOnInit(): void {
    this.searchForm = this.fb.group({
      name: [null],
    })
    this.tableConfig.tableHeaders = [
      "Id","Name", "Code"
    ];
    this.tableConfig.deleteRow = true;
    this.tableConfig.editRow = true;
    this.tableConfig.idHeader = 'Id';
    this.tableConfig.exportRow=false;
    this.tableConfig.tableName = "Asset Groups List"


    this.tableConfig.clickableLinks = [{ header: "Id" }]
    this.searchAssetGroups()


  }

  searchAssetGroups() {
      this.assetGroupService.searchAssetGroups(this.searchFilter).subscribe(data => {
        this.tableConfig.pageFilter.totalItems = data['totalRows'];
        let tableData: any = [];
        data['data']?.forEach((e: any) => {
          tableData.push({
            "Id":e.id,
            "Name":e.name,
            "Code":e.code
          })

        });

        this.assetgroupsdata =  tableData;
        this.totalRows= data.totalRows;
        this.tableConfig.tableData = tableData;
        this.tableConfig.pageFilter.totalRows = data.totalRows;
      })
    }

    editAssetGroup(e: any) {
      this.router.navigate(['systemsettings/asset-groups/edit-control'], { queryParams: { id: e } });
    }
    veiwAssetGroup(e: any) {
      this.router.navigate(['systemsettings/asset-groups/view-control'], { queryParams: { id: e } });
    }

    deleteAssetGroup(assetGroup: any) {


      this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + assetGroup.Name + '?',
        header: 'Confirm',
        rejectButtonStyleClass: 'btn btn-danger',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.assetGroupService.deleteAssetGroup(assetGroup.Id).subscribe((res: any) => {
            this.searchAssetGroups()
          });
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Customer Deleted',
            life: 3000,
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
    paginate(e: any) {

      this.searchFilter.pageNumber = e;
      this.tableConfig.pageFilter.pageNumber = e
      this.searchAssetGroups()
    }

    add() {
      this.router.navigate(['systemsettings/asset-groups/add-control']);
    }

    selectAssetGroupAuto(event: any) {
      this.getAssetGroupsAuto(event.query);
      this.searchFilter.name = event.query
    }
    getAssetGroupsAuto(searchText: any = '') {
      this.assetGroupService.GetAssetGroupsAutoComplete(searchText).subscribe((res) => {
        this.assetGroups = res.data
      });
    }

    bindAssetGroup(event: any) {
      this.searchFilter.name = event.assetGroupName
    }
    assetGroupClear() {
      this.searchFilter.name = ""
    }

}
