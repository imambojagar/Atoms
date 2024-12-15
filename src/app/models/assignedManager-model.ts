export class AssignedManagerModel {
    id: number = 0;
    apiDirectorId: string | null = null;
    apiDirectorName: string | null = null;
    assessorTeamLeaderId: string | null = null;
    assessorTeamLeaderName: string | null = null;
    sites: Sites[] = [];

}

export class Sites {
    id: number = 0;
    assignedManagerId: number = 0;
    siteId: number = 0;
    siteName: string | null = null;
    hospitalManagementId: string | null = null;
    hospitalManagementName: string | null = null;
}