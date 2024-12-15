export class ServiceRequestData {
  assetId: string | number | null;
  equipmentStatusId: number;
  priorityId: number;
  problemDescriptionId: number;
  comments: string;
  voiceNote: string;
  workOrderContactPerson: WorkOrderContactPerson[];
  requestedThroughId: number;
  typeofRequestId: number;
  safetyId: number;
  workOrderAttachments: WorkOrderAttachment[];

  constructor() {
    this.assetId = null;
    this.equipmentStatusId = 0;
    this.priorityId = 0;
    this.problemDescriptionId = 0;
    this.comments = '';
    this.voiceNote = '';
    this.workOrderContactPerson = [{
      id: 0,
      name: '',
      employeeId: '',
      position: '',
      extension: '',
      email: '',
      mobilePhone: '',
      contactUserId: ''
    }];
    this.requestedThroughId = 0;
    this.typeofRequestId = 0;
    this.safetyId = 0;
    this.workOrderAttachments = [];
  }

  // Additional methods if needed
}
export interface ServiceRequestData {
  assetId: string | number | null;
  equipmentStatusId: number;
  priorityId: number;
  problemDescriptionId: number;
  comments: string;
  voiceNote: string;
  workOrderContactPerson: WorkOrderContactPerson[];
  requestedThroughId: number;
  typeofRequestId: number;
  safetyId: number;
  workOrderAttachments: WorkOrderAttachment[];
}

export interface WorkOrderContactPerson {
  id: number;
  name: string;
  employeeId: string;
  position: string;
  extension: string;
  email: string;
  mobilePhone: string;
  contactUserId: string;
}

export interface WorkOrderAttachment {
  id: number;
  name: string;
}
