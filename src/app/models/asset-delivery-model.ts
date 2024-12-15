export class AssetDeliveryModel {
    id: number = 0;
    operatingunit: string = '';
    poNumber: string = '';
    supplier: string | null = null;
    type: string | null = null;
    status: string | null = null;
    site: string | null = null;
    paymentTerms: string | null = null;
    buyer: string | null = null;
    complete: boolean | false = false;
    purchaseOrderType: string | null = null;
    remarks: string | null = null;
    total: string | null = null;
    totalDeliveryAmount: string | null = null;
    warrantyPeriod: number | null = null;
    deliveries: DeliveryModel[] = [];
    lines: any[] = [];
}

 interface IAssetDelivery {
    id: number;
    operatingunit: string;
    poNumber: string;
    supplier: string;
    type: string;
    status: string;
    site: string ;
    paymentTerms: string;
    buyer: string ;
    complete: boolean ;
    purchaseOrderType: string ;
    remarks: string;
    total: string ;
    totalDeliveryAmount:string ;
    warrantyPeriod: number ;
    deliveries: DeliveryModel[];
    lines: LineModel[];
}

 const initAsset : IAssetDelivery = {
    id: 0,
    operatingunit: '',
    poNumber: '',
    supplier: '',
    type: '',
    status: '',
    site: '',
    paymentTerms: '',
    buyer: '',
    complete:false,
    purchaseOrderType: '',
    remarks:'',
    total:'',
    warrantyPeriod: 0,
    totalDeliveryAmount: '',
    deliveries: [],
    lines: []
}
export{initAsset,IAssetDelivery}

export class DeliveryModel {
    id: number = 0;
    assetDeliveryId: number = 0;
    number: string | null = null;
    statusId: string | null = null;
    lines: LineModel[] = [];
    registryFiles: RegisterFileModel[] = [];
    // Delivery Inspection
    inspectionDate: Date | null = null;
    inspectionBy: string | null = null;
    deliveryApprovedBy: string | null = null;
    deliveryBy: string | null = null;
    deliveryTypeId: string | null = null;
    paymentTerms: string | null = null;
    //Technical Accepteance
    acceptedBy: Date | null = null;
    verifiedBy: string | null = null;
    technicalApprovedBy1: string | null = null;
    technicalApprovedBy2: string | null = null;
    certificateNumber: string | null = null;
    //Final Accepteance
    validatedBy: Date | null = null;
    validatedDate: string | null = null;
    finalApprovedBy: string | null = null;
    approvedDate: Date | null = null;
    acceptanceDate: Date | null = null;
    // Invoice
    invoiceNumber: number | null = null;
    invoiceDate: Date | null = null;
    invoiceAmount: number | null = null;
    deliveryAmount: number | null = null;
    invoiceRemarks: string | null = null;
}

export class LineModel {
    id: number = 0;
    item: string | null = null;
    type: string | null = null;
    uom: string | null = null;
    // PO Quantity
    ordered: number = 0;
    received: number = 0;
    billed: number = 0;
    cancelled: number = 0;
    price: number = 0;
    accessory: boolean | null = false;
    requiredInspection: boolean | null = false;
    deliveryReceived: number = 0;
    remaining: number = 0;
    description: string | null = null;
    deliveryId: number = 0;
}

export class LineCostCenterModel{
    id: number = 0;
    quantity: number = 0;
    costCenter: string | null = null;
    lineId: number = 0;
}

export class DeliveryHistoryModel{
    id: number = 0;
    createdDate: string | null = null;
    createdById: string | null = null;
    statusId :number = 0;
    deliveryId: number = 0;
}

export class RegisterFileModel {
    id: number = 0;
    fileName: string | null = null;
    available: boolean | null = false;
    notAvailable: boolean | null = false;
    notRequired: boolean | null = false;
    deliveryId: number = 0;
}

export class TechnicalInspectionModel{
id: number = 0;
assetModelId: number = 0;
voltag : string | null = null;
manufacture: string | null = null;
maxCurrent : string | null = null;
freqency : string | null = null;
powerReading : string | null = null;
powerSupplyType : string | null = null;
costCenter : string | null = null;
quantityReceived : number = 0;
lineId : number = 0;
deliveryId: number = 0;
technicalInspectionItems : TechnicalInspectionItemModel[] = [];
}
export class TechnicalInspectionItemModel{
    id: number = 0;
    status  : string | null = null;
    assetNumber : string | null = null;
    serialNumber : string | null = null;
    inspectionDate : Date | null = null;
    dateOfDocIssuing : Date | null = null;
    assetFloor : string | null = null;
    assetLocation : string | null = null;
    flagPhysicalInspection : boolean | null = false;
    flagFunctionPerformance : boolean | null = false;
    flagGroundingResistance : boolean | null = false;
    flagChassisLeakage : boolean | null = false;
    flagLeadsLeakage : boolean | null = false;
    flagDeviceAlert : boolean | null = false;
    technicalInspectionId : number = 0;
}

export class AssetDeliverySearch {
    operatingunit: string | null = null;
    poNumber: string | null = null;
}

export class EndUserAcceptanceModel{
    id: number = 0;
    costCenter: string | null = null;
    Acceptancedate: Date | null = null;
    AcceptedBy: string | null = null;
    deliveryId: number = 0;
    assets : EndUserAcceptanceAssetModel[] = [];
    accessories : TechnicalInspectionItemModel[] = [];
}
export class EndUserAcceptanceAssetModel{
    id: number = 0;
    item: string | null = null;
    assetNumber: Date | null = null;
    status: string | null = null;
    rejectionReason:  string | null = null;
    description:  string | null = null;
    endUserAcceptanceId: number = 0;
}

export class EndUserAcceptanceAccessoryModel{
    id: number = 0;
    item: string | null = null;
    status: string | null = null;
    received: number = 0;
    rejected: number = 0;
    rejectionReason:  string | null = null;
    description:  string | null = null;
    endUserAcceptanceId: number = 0;
}
