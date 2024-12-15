export class AssetInventory{
    id: number=0;
    surveyNo:number|null= null;
    surveyCode: string|null= null;
    surveyDate: Date|null=null;
    siteId: number|null= null;
    siteName: string|null= null;
    buildingId: number|null= null;
    buildingName: string|null= null;
    floorId: number|null= null;
    floorName: string|null= null;
    departmentId: number|null= null;
    departmentName: string|null= null;
    roomId: number|null= null;
    roomName: string|null= null;
    details:details[]=[];
}

export class details{
    id: number=0;
    assetSurveyId: number|null=null ;
    assetId: number|null=null ;
    assetSerialNo: string |null=null;
    assetNumber: string |null=null;
    assetName: string |null=null;
    tagCode: string |null=null;
    statusId: number|null=null ;
    statusName: string |null=null;
}