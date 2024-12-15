export class BaseModel {
    creationDate?: Date = new Date();
    createdBy?: number;
    lastUpdateDate?: Date = new Date();
    lastUpdateBy?: number;
    FormatedCreationDate?: Date;
    formatedLastUpdateDate?: Date;
}
