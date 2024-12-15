export interface PermissionModelDto {
    id: number;
    url: string;
    canAdd: boolean;
    canEdit: boolean;
    canView: boolean;
    canDelete: boolean;
    atomeroleId?: string | null;
    label?: string;
}