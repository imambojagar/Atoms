export class AssistantEmployeesModel {
    id: number = 0;
    userId: string = '';
    userName: string=''
  }

  export class SparePartModel{
    id:number =0;
    partId:number=0;
    partNo:string='';
    description:string='';
    qty:number=0;
  }

  export class StatusModel {
    id: number = 0;
    name: string=''
  }

  export class WorkOrderfilter {
    callId:string='';
    assetSerialNo:string='';
    workOrderNo:string='';
    site:string='';
    callslastSituationWO:any;
    groupLeaderReview:any;
    visitDateSymbol:any;
    visitDateFrom:any;
    visitDateTo:any;
    endDateSymbol:any;
    endDateFrom:any;
    endDateTo:any;
    assignedEmployees:any[]=[];
    statusWO:any[]=[];
    assetNumber:any;
    pageSize: number;
    pageNumber: number;
    assetGroup!: number;
    constructor() {
         this.pageSize=10
         this.pageNumber=1
    }
 }

 export class Attachments{
  id:number=0;
  name:string|null=null;

}
