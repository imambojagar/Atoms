export interface GatePassModel {
  id: number;
  company?: string;
  site?: string;
  edd?: Date;
  acknowledgment?: string;
  demoRequestId: number;
  gatePassStatusId?: number;
  isConfirmed?: boolean;
  finalEddDate: Date | null;
}
