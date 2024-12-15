export class Asset {
    assetGroup:any
    assetSerialNumber:any
    supplyDateSymbol:any
    supplyDateFrom: any
    supplyDateTo: any
    warrantyEndDateSymbol:any
    warrantyEndDateFrom: any
    warrantyEndDateTo: any
    delieveryInspectionDateSymbol:any
    deliveryInspectionDateFrom: any
    deliveryInspectionDateTo: any
    maintenanceContract:any
    assetClassification:any
    assetStatus:any
    assetNotScraped:any
    assetNo:any
    modelDefinition:any
    modelName:any
    assetName:any
    site:any
    supplier:any
    manufacturer:any
    model:any
    department:any
    pageSize: number
    pageNumber: number
    assetGroupName:any
    assetOracleCodeValue:any
    assetOracleCodeTypeId:any
    constructor() {
        this.pageSize=10
        this.pageNumber=1
    }

}


export class Attachments{
    id:number=0;
    attachmentName:string|null=null;
    attachmentURL:string|null=null;
}
