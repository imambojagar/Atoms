
export class SharedTable {
    //---------------------------------
    public tableData: any[]; //   the table data
    public tableHeaders: any[]; //   the headers of the table must be compatible with the table data
    public idHeader: string;// which header will be used as a unique value
    public pageFilter: any = {
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: null
    };
    public cellClickHeaders: string[]; // if cellClick == true
    public actionButtonsText: any = {
        add: {
            Text: "Add New",
            icon: 'fa fa-plus'
        },
        delete: {
            Text: "Delete",
            icon: 'fa fa-trash'
        },
        edit: {
            Text: "Edit",
            icon: 'fa fa-pencil'
        },
        more: {
            Text: "More",
            icon: 'fa fa-info-circle'
        },
        other: {
            Text: "Other",
            icon: 'fa fa-file'
        },
        extraDetails: {
            Text: "Other",
            icon: 'fa fa-file'
        },
    }
    //--------------------------------- Action privileges
    public deleteRow: boolean;
    public editRow: boolean;
    public showDetails: boolean;
    public addRow: boolean;
    public otherButton: boolean;
    public extraDetails: boolean;
    public cellClick: boolean;
    //--------------------------------- Config
    public tableName: string;
    public pagination: boolean;
    public page: number = 1;
    public itemsPerPage: number = 10;
    public currentPage: number = 1;
    public filter;
    public noDataText: string = "No Data Found";
    public tdStyles: any = {

    };
  openChart: boolean = false;
  viewRow: boolean = false;
  clickableLinks!: { header: any  }[];
  Tags!: { header: string[] }[];
  print!: boolean;
  exportRow!: boolean;
  selectedItems: any;

    constructor(
        tableData = [],
        tableHeaders = [],
        cellClickHeaders = [],
        idHeader: string = '',
        deleteRow = false,
        editRow = false,
        showDetails = false,
        addRow = false,
        extraDetails = false,
        cellClick = false,
        tableName = '',
        pagination = true,
        filter = true,
        actionButtonsText: any = null,
        otherButton = false

    ) {
        this.tableData = tableData;
        this.tableHeaders = tableHeaders;
        this.cellClickHeaders = cellClickHeaders;
        this.idHeader = idHeader;
        this.deleteRow = deleteRow;
        this.editRow = editRow;
        this.showDetails = showDetails;
        this.addRow = addRow;
        this.cellClick = cellClick;
        this.tableName = tableName;
        this.pagination = pagination;
        this.filter = filter;
        this.actionButtonsText = actionButtonsText ? actionButtonsText : this.actionButtonsText
        this.otherButton = otherButton
        this.extraDetails = extraDetails;
    }




}
