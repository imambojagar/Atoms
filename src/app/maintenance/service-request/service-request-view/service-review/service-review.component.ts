import { Component } from '@angular/core';
import { ServiceRequestFormService } from '../../service-request-form.service';
import { Router } from '@angular/router';
/* import { SharedTable } from 'src/app/shared/component/table/table';
import { ServicerequestService } from 'src/app/data/service/servicerequest.service';
import { CallRequestChildTypes } from 'src/app/data/Enum/call-request-child-types'; */
import { PrimengModule } from '../../../../shared/primeng.module';
import { CallInfoComponent } from '../call-info/call-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedTable } from '../../../../shared/components/table/table';
import { ServicerequestService } from '../../../../services/servicerequest.service';
import { CallRequestChildTypes } from '../../../../shared/enums/call-request-child-types';
import { TableComponent } from '../../../../shared/components/table/table.component';

@Component({
  standalone: true,
  selector: 'app-service-review',
  imports: [PrimengModule, CallInfoComponent, FormsModule, ReactiveFormsModule, TableComponent],
  templateUrl: './service-review.component.html',
  styleUrls: ['./service-review.component.scss'],
  providers: [ServiceRequestFormService]
})
export class ServiceReviewComponent {
  tableConfig = new SharedTable();
  constructor(
    public serviceRequestFormService: ServiceRequestFormService,
    private serviceRequestService: ServicerequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tableConfig.tableHeaders = [
      'Transaction Name',
      'Id',
    ];

    this.tableConfig.deleteRow = false;
    this.tableConfig.editRow = false;
    this.tableConfig.addRow = false;
    this.tableConfig.exportRow = false;
    this.tableConfig.idHeader = 'Id';
    this.tableConfig.tableName = 'Transaction List';

    this.tableConfig.clickableLinks = [{ header: 'Id' }];

    this.serviceRequestService
      .getServiceRequestAllTransactionById(this.serviceRequestFormService.id)
      .subscribe((res) => {
        //this.tableConfig.pageFilter.totalItems = data['totalRows'];
        let tableData: any = [];
        res.data.forEach((e: any) => {
          tableData.push({
            "Transaction Type Id": e.transactionTypeId,
            "Transaction Name": e.transactionTypeName,
            "Id": e.transactionId,
            "ParentId": e.transactionParentId,
            "WO Id":e.transactionWOId,
            "Parent WO Id": e.transactionParentWOId,
            "PO No":e.transactionPONo,
            "isPR":e.isPR
          })
        })
        this.tableConfig.tableData = tableData;
      });
  }

  route(e: any) {
    if (
      e.header == 'Id' &&
      e.rowData["Transaction Type Id"] == CallRequestChildTypes.WorkOrders
    )
      if (
        e.rowData.parentTransactionId == undefined ||
        e.rowData.parentTransactionId == null
      ) {
        this.router.navigate(['/maintenance/work-orders/view-control'], {
          queryParams: {
            id: e.rowData.Id,
            callId: this.serviceRequestFormService.id,
          },
        });
      } else {
        this.router.navigate(['/maintenance/work-orders/view-control'], {
          queryParams: {
            id: e.rowData.I,
            ParentWOId: e.rowData.ParentId,
            callId: this.serviceRequestFormService.id,
          },
        });
      }
    else if (
      e.header == 'Id' &&
      e.rowData["Transaction Type Id"] == CallRequestChildTypes.Quotation
    )
      this.router.navigate(['/maintenance/quotations/view-control'], {
        queryParams: {
          id: e.rowData.transactionId,
          workerorderId: e.rowData.ParentId,
          ParentWOId: e.rowData["Parent WO Id"],
        },
      });
    else if (
      e.header == 'Id' &&
      e.rowData["Transaction Type Id"] == CallRequestChildTypes.PurchaseOrder
    ) {
      if (e.rowData.isPR) {
        this.router.navigate(['/maintenance/purchase-order/view-control'], {
          queryParams: {
            id: e.rowData.Id,
            quotationId: e.rowData.ParentId,
            ParentWOId: e.rowData["Parent WO Id"],
            isPR: 'PR',
          },
        });
      } else
        this.router.navigate(['/maintenance/purchase-order/view-control'], {
          queryParams: {
            id: e.rowData.Id,
            quotationId: e.rowData.ParentId,
            ParentWOId: e.rowData["Parent WO Id"],
            isPR: 'PO',
          },
        });
    } else if (
      e.header == 'Id' &&
      e.rowData["Transaction Type Id"] == CallRequestChildTypes.PartDelivery
    ) {
      if (e.rowData["WO Id"] == undefined || e.rowData["WO Id"] == null) {
        this.router.navigate(['/store/partDelivery/edit-control'], {
          queryParams: {
            data: e.rowData.Id,
            index: 0,
            poId: e.rowData["PO No"],
            ParentWOId: e.rowData["Parent WO Id"],
          },
        });
      } else {
        this.router.navigate(['/store/partDelivery/edit-control'], {
          queryParams: {
            data: e.rowData.Id,
            index: 0,
            workOrderId:e.rowData["WO Id"],
            ParentWOId: e.rowData["Parent WO Id"],
          },
        });
      }
    }
  }
}
