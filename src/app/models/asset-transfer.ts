export class AssetTransfer {
    id: number=0;
    transferNo: number |null = null;
    transferCode: string|null=null;
    assetId: number |null = null;
    destSiteId: number |null = null;
    destBuildingId: number |null = null;
    destFloorId: number |null = null;;
    destDepartmentId:number |null = null;;
    destRoom: string|null=null;
    senderSiteId: number |null = null;;
    senderDepartmentId: number |null = null;;
    senderAssignedEmployeeId: string|null=null;
    senderMachineStatusId: number |null = null;;
    senderComment: string|null=null;
    senderStartDate: Date|null=null;
    senderEndDate: Date|null=null;
    senderWorkingHours: string|null=null;
    senderTravelingHours: string|null=null;
    senderAttachmentName: string|null=null;
    receiverAssignedEmployeeId: string|null=null;
    receiverMachineStatusId: number |null = null;
    receiverComment: string|null=null;
    receiverStartDate: Date|null=null;
    receiverStartDateStr: string|null=null;
    receiverEndDate: Date|null=null;
    receiverWorkingHours: string|null=null;
    receiverTravelingHours: string|null=null;
    receiverAttachmentName: string|null=null;
    modelId:number |null = null;
    modelName:string|null=null;
    manufacturerId:number |null = null;
    manufacturerName:string|null=null;
    supplierId:number |null = null;
    supplierName:string|null=null;
    senderBuildingId:number |null = null;
    senderBuildingName:string|null=null;
    senderFloorId:number |null = null;
    senderFloorName:string|null=null;
    senderRoom:string|null=null;
}