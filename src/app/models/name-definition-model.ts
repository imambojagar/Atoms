export class NameDefinitionModel{
    id:number=0;
    assetname:string='';
    altassetname:string| null = null;
    umdns:string| null = null;
    umdnsId:number| null = null;
    assetrisk:number| null = null;
    complex:number| null = null;
    classfication:number| null = null;
    category:number| null = null;
    business:number | null = null;
    modility:number | null = null;
    submodility:string | null = null;
    functionclass:number| null = null;
    typeasset:number| null = null;
    lifespan:number| null = null;
    assetndcode:string| null = null;
    functionclassId:number| null = null;
    classficationId:number| null = null;
    assetriskId:number| null = null;
    businessId:number| null = null;
    categoryId:number| null = null;
    typeassetId:number| null = null;
    modilityId:number| null = null;
    submodilityId:number| null = null;
    createdOn:Date| null = null;
    modifiedOn:Date| null = null;
    oracleCodes:oracleCodes[]=[];
    oraclename:string| null = null;
    essentialEquipement:boolean|null=null;
}

export class oracleCodes {
    id: number = 0;
    assetNDId: number = 0;
    codeTypeId: number | null = null;
    codeValue: string | null = null;
  }