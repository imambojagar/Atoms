export class TechnicalRetirementModel{
    id: number=0;
    assetId: number|null= 0;
    assetSerialNo: string|null=null;
    assetNumber: string|null=null;
    tRetirementParts: tRetirementParts[]=[];
    retirementDate: Date|null=null;
    reasons: string|null=null;
    committeeMembers: string|null=null;
    comments: string|null=null;
}

export class tRetirementParts{
    id:number= 0;
    technicalRetirementId: number=0;
    partCatalogItemId: number=0;
    partNumber: string|null=null;
    partName: string|null=null;
}
