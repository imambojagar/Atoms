export class QuotationModel {
    id: number = 0;
    quotationNo: string | null = null;
    callRequestId: number | null = null;
    callNo: string | null = null;
    contractStatusId: number | null = null;
    assetId: number | null = null;
    assetSerialNo: string | null = null;
    workOrderNo: string | null = null;
    workOrderId: string | null = null;
    quotationDate: Date | null = null;
    mapItemsToPrint: boolean | null = false;
    faxNo: string | null = null;
    callLastSituationId: number | null = null;
    relatedEmployeeId: number | null = null;
    statusId: number | null = null;
    siteId: number | null = null;
    siteName: string | null = null;
    presentedTo: string | null = null;
    subject: string | null = null;
    fax: string | null = null;
    conditions: string | null = null;
    endpage: string | null = null;
    total:string | null = null;
    hideDescInprint: boolean | null = false;
    travelingHours: number | null = null;
    quotationSpareParts: QuotationSparePartModel[] = [];
    quotationPrintInfoSpareParts: QuotationPrintInfoSparePartModel[] = [];
    estimatedWorkingHours: EstimatedWorkingHourModel[] = [];
    attachments : attachments [] = [];
  }

  export class QuotationSparePartModel
    {
     id: number = 0;
     partId: string | null = null;
     partNo: string | null = null;
     description : string | null = null;
     quantity : number = 0;
     unitPrice : number = 0;
     discount : number = 0;
     currencyId : number = 0;
     quotationTypeId : number = 0;
     offerTypeId : number = 0;
     quotationId : number = 0;
    } 

    export class QuotationPrintInfoSparePartModel
    {
     id: number = 0;
     description_Print: number | null = null;
     quantity_Print: number | null = null;
     returnedQuantity_Print: number | null = null;
     unitPrice_Print: number | null = null;
     discount_Print : number | null = null;      
     quotationId : number = 0;
    } 

    export class EstimatedWorkingHourModel
    {
     id: number = 0;
     AssignedEmployeeId: number | null = null;
     WorkingHours : number | null = null;
     quotationId : number = 0;
    } 

    export class QuotationAttachmentModel
    {
     id: number = 0;
     AttachmentName : string | null = null;
     quotationId : number = 0;
    } 

    export class QuotationSearch
    {
        requestId: number | null = null;
        quotationId : number | null = null;
        serialNo : string | null = null;
        assignedEmployeeId : number | null = null;
        assetSerialNo : number | null = null;
        maintenanceSituation : number | null = null;
        contractStatusId : number | null = null;
        purchaseOrderId : number | null = null;
        partNo : string | null = null;
        partName : string | null = null;
        quotationDate : Date | null = null;
        site : number | null = null;
    }

    export class attachments {
      id: number = 0;
      quotationId: number = 0;
      attachmentName: string |null = null;
    }

