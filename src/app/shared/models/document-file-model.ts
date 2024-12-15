import { BaseModel } from "./base-model";
export interface DocumentFileModel extends BaseModel {
    fileData: number[];
    fileName: string;
    fileType: string;
    fileSize: number;
    documentTypeId: number;
    documentTranslations: any[]
}