
export class TaxonomyModel{
    id:number=0;
    taxonomyName:string='';
    taxonomyDescription:string='';
    parentId:string | null = null;
    children:TaxonomyModel[]=[];
   
}
export class Children{
    id:number=0;
    taxonomyName:string='';
    taxonomyDescription:string='';
    parentId:string | null = null;
    children:TaxonomyModel[]=[];
}

