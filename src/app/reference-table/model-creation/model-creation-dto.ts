export interface ModelCreationAttachmentDto {
  id: string;
  modelCreationId: number;
  attachmentName: string;
}

export interface ModelCreationDto {
  id: number | null;
  requesterUserId: string | null;
  userName: string;
  assignOriginId: number | null;
  assignOrigin: string;
  model: string;
  manufacturer: string;
  name: string;
  supplier: string;
  remarks: string;
  requestStatus: RequestStatus;
  attachments: ModelCreationAttachmentDto[];
}
export enum RequestStatus {
  none,
  open,
  inProgress,
  modelCreated,
  cancelled,
}
