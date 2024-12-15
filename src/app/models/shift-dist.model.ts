export class DistributionShiftMaster {
    id: any
    assetGroup: any
    site: any
    shiftDate: any
    defaultShift: any
    employees: any

    distributionShiftDetail:DistributionShiftDetail []=[]
}

export class DistributionShiftDetail {

    id: any
    noOfDay: any

    distributionEmployeeDetail:DistributionEmployeeDetail []=[]


}
export class DistributionEmployeeDetail {


    id: any

    employee: any

    shift: any


}
export class DistributionShiftMasterSearch {
    assetGroup:any;
    pageSize: number
    pageNumber: number
    site: any
    constructor() {
        this.pageSize = 10
        this.pageNumber = 1
    }
}