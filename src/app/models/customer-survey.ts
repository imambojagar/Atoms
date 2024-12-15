export class CustomerSurvey {
    id: any
    site: any
    callRequestId: any
    firstActionConfirmation: any
    noOfCall: any
    surveyStatus: any
    typeOfSurvey: any
    dateOfConfirmation: any
    dateOfSurvey: any
    commentCS: any
    percent: any
    lookupQuestion1: any
    lookupQuestion2: any
    question3: any
    pageSize: number
    pageNumber: number


   
    constructor() {
        this.pageSize = 10
        this.pageNumber = 1
    }

}
