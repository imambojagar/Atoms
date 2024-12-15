/* import { sparePartTransactionType } from 'src/app/shared/ENUMS/sparePartTransaction'; */

import { sparePartTransactionType } from "../../shared/enums/sparePartTransaction";

export class SparePartTransactionDetails {
  id: number | null = null;
  title: string = '';
  quantity: number = 0;
  description: string = ''
}
export class SparePartTransactionModel{
  id:number=0;
  title:string='';
  type: sparePartTransactionType = sparePartTransactionType.None;
  statusId:number= 0;
  status: string='';
  reserved:string='';
  date:string='';
  supplierId:number=0;
  receivedBy:string='';
  numOfPacking:string='';
  customerId:string='';
  invoiceNum:string='';
  recived:number=0;
  transactionDetails: SparePartTransactionDetails[] = [];
}
