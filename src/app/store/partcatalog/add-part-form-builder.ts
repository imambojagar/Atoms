import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

function cloneAndChangeProp(arr:any[], act: (n: any, old:any) => any) {
  return arr.map(a => {
    let newInst = { ...a };
    return act(newInst, a);
  }).filter(a => a != null);
}

export function getPartCatalogModel(formValue:any) {
  let model = {...formValue };
  if (Object.keys(model.manufacturerId as any).length > 0)
    model.manufacturerId = model.manufacturerId.id;
  model.inventory = cloneAndChangeProp(formValue.inventory, (n, o) => {
    if (Object.keys(o.clientPart).length > 0) n.clientPart = o.clientPart.id
    if (Object.keys(o.store).length > 0) n.store = o.store.id
    if (o.id == '') n.id = null;
    return (n.clientPart == null || n.clientPart == "") ? null : n
  });
  model.supplier = cloneAndChangeProp(formValue.supplier, (n, o) => {
    if (Object.keys(o.supplier).length > 0) n.supplier = o.supplier.id
    if (o.id == '') n.id = null;
    return (n.supplier == null || n.supplier == "") ? null : n
  });
  model.modelInfo = cloneAndChangeProp(formValue.modelInfo, (n, o) => {
    if (o.id == '') n.id = null;
    n.assetModel = n.assetModel.modelId;
    return (n.assetModel == null || n.assetModel == "") ? null : n
  })
  return model;
}

export function buildModelForm(formbuilder: FormBuilder) {
  return formbuilder.group({
    id: '',
    assetModel: ['',Validators.required],
    assetModelName: [''],
    manufact: [''],
    isDelted: [''],
  })
}

export function buildStockForm(formbuilder: FormBuilder) {
  return formbuilder.group({
    id: [''],
    clientPart: ['',Validators.required],
    clientPartName: [''],
    currentStock: ['',Validators.required],
    store: ['',Validators.required],
    storeName: [''],
    unitPrice: [0],
    stockValue: [0],
    balancePrice: [0]
  });
}

export function buildSupplierForm(formbuilder: FormBuilder) {
  return formbuilder.group({
    id: [''],
    supplier: ['',Validators.required],
    supplierName: [''],
    supplierPrice: ['',Validators.required],
  });
}

export function buildForm(formbuilder: FormBuilder,
  model:FormGroup,
  inventory: FormGroup,
  supplier: FormGroup) {
  return formbuilder.group({
    id: [''],
    partNumber: ['',Validators.required],
    partName: ['',Validators.required],
    oracleCode: ['',Validators.required],
    partType: [''],
    partName2: [''],
    cityId: [''],
    manufacturerId: ['',Validators.required],
    manufacturerName: [''],

    endSupport: [''],
    stopProduction: [''],
    endSupportText: [''],
    stopProductionText: [''],

    warranty: [''],

    modelInfo: formbuilder.array([ model ]),

    poNumber: [''],

    inventory: formbuilder.array([ inventory ]),

    maximumQuantity: [''],
    threshold: [''],
    requisitioned: [''],
    onReserve: [''],


    className: [''],
    stockClass: [''],
    site: [''],

    supplier: formbuilder.array([ supplier ]),

    leadTime: [''],
    modifiedOn: [''],
    initials: ['',Validators.required],
    createdOn: [''],
    services: false
  });

}
