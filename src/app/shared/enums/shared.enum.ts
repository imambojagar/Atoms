export enum LanguageCode {
    English = 'EN',
    Arabic = 'AR',
    French = 'FR',
    German = 'AL'
}

export enum LoginType {
    Website = 'Web',
    Mobile = 'Mobile'
}

export enum UserSettingsClaimTypes {
    UserName = 'userName',
    FullName = 'fullName',
    MobileNumber = 'mobileNumber',
    PhoneNumber = 'phoneNumber',
    NameIdentifier = 'nameid',
    UserRoles = 'userRoles',
    UserPages = 'userPages',
    EmailAddress = 'email',
    FirstName = 'firstName',
    LastName = 'lastName',
    DefaultLanguageCode = 'defaultLanguageCode',
    SessionId = 'sessionId'
}

export enum YesNo {
    N = 'N',
    Y = 'Y'
}

export enum AccessLevel {
    S = 'System',
    U = 'User'
}

export enum LanguageFileNames {
    English = 'en',
    Arabic = 'ar',
    French = 'fr',
    German = 'al'

}

export enum ModuleCode {
    SystemSettings = 'SYS',
    UsersManagement = 'UM',
    Integrations = 'INT',
    Workflow = 'WF',
    HumanResources = 'HR',
    Inventory = 'INV',
    Assets = 'AST',
    Finance = 'FIN',
    WorkOrder = 'WO',
    Contracts = 'CON',
    Purchasing = 'PUR',
    Housing = 'HOS',
    Transportations = 'TRS',
    ProjectManagement = 'PM',
    Attendance = 'ATT',
    Rostering = 'RST',
}


export enum HubMethod {
    DisplayMessage = 'DisplayMessage',
    ExpiredPassword = 'User',
    BroadcastAlert = 'BroadcastAlert'

}


export enum DocumentTypeEnum {
    Photo,
    Attachment
}

export enum FileExtensionEnum {
    pdf,
    doc,
    xls,
    ppt,
    pptx,
    txt,
    plain,
    png,
    jpg,
    jpeg
}

export enum SYSTable {
    UM_USERS_TL,
    FIN_COMPANIES_TL,
    UM_REPORTS_TL,
    UM_FUNCTION_PERMISSIONS_TL,
    UM_FUNCTIONS_TL,
    UM_COMPONENTS_TL,
    SYS_TIMEZONES_TL,
    SYS_PROVINCES_TL,
    SYS_MODULES_TL,
    SYS_MESSAGES_TL,
    SYS_LOOKUP_VALUES_TL,
    SYS_LOOKUPS_TL,
    SYS_LANGUAGES_TL,
    SYS_DOCUMENT_TYPES_TL,
    SYS_DOCUMENTS_TL,
    SYS_DB_TABLES_TL,
    SYS_DB_SEQUENCES_TL,
    SYS_DB_COLUMNS_TL,
    SYS_COUNTRIES_TL,
    SYS_CITIES_TL,
    INV_UOM_GROUPS_TL,
    INV_UNITS_OF_MEASURE_TL,
    INV_STORE_ZONES_TL,
    INV_STORES_TL,
    INV_MCP_CRITERIA_TL,
    INV_MANUFACTURERS_TL,
    INV_MAINT_COMP_PROFILES_TL,
    INV_ITEM_SYS_ATTRIBUTES_TL,
    INV_ITEM_STR_ATTRIBUTES_TL,
    INV_ITEM_STRUCTURES_TL,
    INV_ITEM_RELATIONSHIPS_TL,
    INV_ITEM_MODELS_TL,
    INV_ITEM_CROSS_REFERENCES_TL,
    INV_ITEM_CATEGORIES_TL,
    INV_ITEM_ATT_VALUES_TL,
    INV_ITEMS_TL,
    INV_CROSS_REF_TYPES_TL,
    INV_COSTING_METHODS_TL,
    INV_BIN_LOC_STR_ATTRIBUTES_TL,
    INV_BIN_LOC_STRUCTURES_TL,
    HR_ORGANIZATIONS_TL,
    HR_LOCATIONS_TL,
    HR_EMPLOYEES_TL,
    FIN_SUPPLIER_GROUPS_TL,
    FIN_SUPPLIER_CONTACTS_TL,
    FIN_SUPPLIERS_TL,
    FIN_CUSTOMER_GROUPS_TL,
    FIN_CUSTOMER_CONTACTS_TL,
    FIN_CUSTOMER_ADDRESSES_TL,
    FIN_CUSTOMERS_TL,
    FIN_CURRENCIES_TL,
    UM_ROLES_TL,
    UM_USER_UNSUCCESSFUL_LOGINS,
    UM_USER_SESSIONS,
    UM_USER_ROLES,
    UM_USER_PERMISSIONS,
    UM_USER_PASSWORD_HISTORY,
    UM_USERS,
    UM_ROLE_PERMISSIONS,
    UM_ROLES,
    UM_REPORTS,
    UM_FUNCTION_PERMISSIONS,
    UM_FUNCTIONS,
    UM_COMPONENTS,
    SYS_TIMEZONES,
    SYS_SYSTEM_PREFERENCES,
    SYS_PROVINCES,
    SYS_NUM_GLOBAL_PREFIXES,
    SYS_NUMBERING_PREFIXES,
    SYS_MODULES,
    SYS_MESSAGES,
    SYS_LOOKUP_VALUES,
    SYS_LOOKUPS,
    SYS_LANGUAGES,
    SYS_INVOICE_LINES,
    SYS_INVOICES,
    SYS_DOCUMENT_TYPES,
    SYS_DOCUMENTS,
    SYS_DB_TABLES,
    SYS_DB_SEQUENCES,
    SYS_DB_COLUMNS,
    SYS_COUNTRIES,
    SYS_CITIES,
    INV_UOM_GROUPS,
    INV_UOM_CONVERSIONS,
    INV_UNITS_OF_MEASURE,
    INV_STORE_ZONES,
    INV_STORE_ITEMS,
    INV_STORE_BIN_LOCATIONS,
    INV_STORES,
    INV_MODEL_MCPC_SCORES,
    INV_MCP_CRITERIA,
    INV_MANUFACTURERS,
    INV_MAINT_COMP_PROFILES,
    INV_ITEM_UOM,
    INV_ITEM_SYS_ATTRIBUTES,
    INV_ITEM_SUPPLIERS,
    INV_ITEM_STR_ATTRIBUTES,
    INV_ITEM_STRUCTURES,
    INV_ITEM_RELATIONSHIPS,
    INV_ITEM_MODELS,
    INV_ITEM_CROSS_REFERENCES,
    INV_ITEM_CATEGORIES,
    INV_ITEM_ATT_VALUES,
    INV_ITEM_ATT_STRUCTURES,
    INV_ITEMS,
    INV_CROSS_REF_TYPES,
    INV_COSTING_METHODS,
    INV_CAT_ITEM_SYS_ATTRIBUTES,
    INV_CAT_ITEM_STRUCTURES,
    INV_BIN_LOC_STR_ATTRIBUTES,
    INV_BIN_LOC_STRUCTURES,
    HR_ORGANIZATIONS,
    HR_LOCATIONS,
    HR_EMPLOYEES,
    FIN_SUPPLIER_GROUPS,
    FIN_SUPPLIER_CONTACTS,
    FIN_SUPPLIERS,
    FIN_CUSTOMER_GROUPS,
    FIN_CUSTOMER_CONTACTS,
    FIN_CUSTOMER_ADDRESSES,
    FIN_CUSTOMERS,
    FIN_CURRENCIES,
    FIN_CONVERSION_RATES,
    FIN_COMPANY_SUPPLIERS,
    FIN_COMPANY_CUSTOMERS,
    FIN_COMPANIES
}
