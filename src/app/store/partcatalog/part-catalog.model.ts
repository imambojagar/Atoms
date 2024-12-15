export class PartCatalogModel{
    id:number=0;
    partNumber:string='';
    partName:string| null = null;
    oracleCode:string| null = null;
    PartType:string| null = null;
    PartName2:number| null = null;
    cityId:number| null = null;
    manufacturerId: number| null = null;

    endSupport:number| null = null;
    stopProduction:number| null = null;
    endSupportText: string | null = null;
    stopProductionText: string | null = null;
    warranty:number | null = null;

    modelInfo : {
      id?: number | null,
      assetModel: number| null,
      assetModelName: string | null,
      manufact: string| null
    }[] = [{
      id : null,
      assetModel : null,
      assetModelName: null,
      manufact: null
    }]

    poNumber:number | null = null;

    inventory : any = [{
      id: '',
      clientPart: '',
      clientPartName: '',
      currentStock: '',
      store: '',
    }]

    maximumQuantity:number| null = null;
    threshold:number| null = null;
    requisitioned:number| null = null;
    requestionNumber:string| null = null;
    waitingWithOutRequestionNum:string| null = null;
    onReserve:number| null = null;
    cost:number| null = null;
    sell:number| null = null;
    unitOfMeasure:number| null = null;
    currency:number| null = null;

    grouping:number| null = null;
    class:number| null = null;
    className:string | null = null;
    stockClass:number| null = null;
    site:string| null = null;

    supplier : any = [{
      id: '',
      supplier: '',
      supplierName: '',
      supplierPrice: '',
    }]

    leadTime:string| null = null;
    modifiedOn:string| null = null;
    initials:string| null = null;
    createdOn: string | null = null;
}
