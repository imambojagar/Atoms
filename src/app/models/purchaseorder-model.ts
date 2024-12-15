    export class PurchaseOrderModel
    {
      id: number  = 0;
      purchaseOrderNo: string | null = null;
      purchaseOrderYear: number  = 0;
      purchaseOrderSequennce: number  = 0;
      callRequestId: number  = 0;
      callNo: string | null = null;
      assetId: number  = 0;
      assetNo: string | null = null;
      quotationId: number  = 0;
      quotationNo: string | null = null;
      purchaseOrderDate: Date | null = null;
      importCodeNo: string | null = null;
      callLastSituationId: number  = 0;
      callLastSituationName: string | null = null;
      assetStatutId: number  = 0;
      assetStatutName: string | null = null;
      deadlineDate: Date | null = null;
      externalPONo: string | null = null;
      dismissalNoticeDate: Date | null = null;
      statusId: number  = 0;
      statusName: string | null = null;
      purchaseOrderSpareParts: PurchaseOrderSparePartModel[] = [];
      createdOn: Date | null = null;
      modifiedOn: Date | null = null;
      // Maintinance Info
      reasonId: number  = 0;
      reasonName: string | null = null;
      workPerformed: string | null = null;
      componentToBeFixedId: number  = 0;
      componentToBeFixedName: string | null = null;
      sparePartsNeeded: string | null = null;
      endOfWorkDate: Date | null = null;
      endOfWorkTime: Date | null = null;
      comment: string | null = null;
      attachments: PurchaseOrderAttachmentModel[] = [];;
    }

    export class PurchaseOrderSparePartModel {
     id: string | null = null;
      partNo: string | null = null;
      description: string | null = null;
     quantityRequested:  number  = 0;
     quantityRecieved:  number  = 0;
     unitPrice:  number  = 0;
     discount:  number  = 0;
     currencyId:  number  = 0;
      currencyName: string | null = null;
     partStatusId:  number  = 0;
      partStatusName: string | null = null;
     purchaseOrderId:  number  = 0;
    }
    
    export class PurchaseOrderAttachmentModel {
      id: number = 0;
      attachmentName : string | null = null;
      purchaseOrderId : number = 0;
    }

