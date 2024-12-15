import { SupplierPersons } from './supplierPersons';
import { AdressModel } from "./address-model";
import { Attachments } from "./attachment-model";
import { FaxModel } from "./fax-model";
import { TelephoneModel } from "./telephone-model";

export class SupplierModel{
    id:number=0;
    suppliername:string='';
    website:string='';
    name:string='';
    email:string='';
    code:string='';
    suppStatusId:number | null = null;
    suppStatusName:string|null=null;
    cityId:number| null=null;
    cityName:string|null=null;
    person:string='';
    comment:string='';
    zipcode:number=0;
    contact:string='';
    createdOn: Date |null=null;
    modifiedOn: Date| null=null;
    suppOracleCode:string='';
    addresses:AdressModel[]=[];
    faxes:FaxModel[]=[];
    telephones:TelephoneModel[]=[];
    attachments:Attachments[]=[];
    suppPersons:SupplierPersons[]=[];
    suppTCodes: suppTCodes[] = [];
   
   
}

export class suppTCodes {
    id: number = 0;
    supplierId: number = 0;
    codeTypeId: number | null = null;
    codeValue: string | null = null;
  }