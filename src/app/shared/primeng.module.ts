import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { FilterService, SharedModule } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { RatingModule } from 'primeng/rating';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { FieldsetModule } from 'primeng/fieldset';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenubarModule } from 'primeng/menubar';
import { ImageModule } from 'primeng/image';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { SidebarModule } from 'primeng/sidebar';
import { AccordionModule } from 'primeng/accordion';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DividerModule } from 'primeng/divider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuModule } from 'primeng/menu';
import { TreeModule } from 'primeng/tree';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SplitterModule } from 'primeng/splitter';
import { PaginatorModule } from 'primeng/paginator';
import { InputMaskModule } from 'primeng/inputmask';
import { PrimeNGConfig } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { StepsModule } from 'primeng/steps';
import { SliderModule } from 'primeng/slider';
import { SkeletonModule } from 'primeng/skeleton';
import { EditorModule } from 'primeng/editor';
import { ColorPickerModule } from 'primeng/colorpicker';


import { TimelineModule } from 'primeng/timeline';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    PasswordModule,
    DropdownModule,
    InputNumberModule,
    TableModule,
    MultiSelectModule,
    ToastModule,
    ToolbarModule,
    FileUploadModule,
    RatingModule,
    DialogModule,
    ConfirmDialogModule,
    RippleModule,
    MessagesModule,
    MessageModule,
    CheckboxModule,
    FieldsetModule,
    TabViewModule,
    PanelModule,
    TabMenuModule,
    MenubarModule,
    ImageModule,
    AvatarModule,
    AvatarGroupModule,
    BadgeModule,
    SidebarModule,
    AccordionModule,
    InputTextareaModule,
    BreadcrumbModule,
    DividerModule,
    SplitButtonModule,
    MenuModule,
    TreeModule,
    AutoCompleteModule,
    DividerModule,
    SplitterModule,
    PaginatorModule,
    InputMaskModule,
    RadioButtonModule,
    DynamicDialogModule,
    PanelMenuModule,
    TagModule,
    TooltipModule,
    StepsModule,
    SliderModule,
    SkeletonModule,
    EditorModule,
    ColorPickerModule,
    CalendarModule,
    MenuModule, TimelineModule
  ],
  exports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    PasswordModule,
    DropdownModule,
    InputNumberModule,
    TableModule,
    MultiSelectModule,
    ToastModule,
    ToolbarModule,
    FileUploadModule,
    RatingModule,
    DialogModule,
    ConfirmDialogModule,
    RippleModule,
    MessagesModule,
    MessageModule,
    CheckboxModule,
    FieldsetModule,
    TabViewModule,
    PanelModule,
    TabMenuModule,
    MenubarModule,
    ImageModule,
    AvatarModule,
    AvatarGroupModule,
    BadgeModule,
    SidebarModule,
    AccordionModule,
    InputTextareaModule,
    BreadcrumbModule,
    DividerModule,
    SplitButtonModule,
    MenuModule,
    TreeModule,
    AutoCompleteModule,
    DividerModule,
    SplitterModule,
    PaginatorModule,
    InputMaskModule,
    RadioButtonModule,
    DynamicDialogModule,
    PanelMenuModule,
    TagModule,
    TooltipModule,
    StepsModule,
    SliderModule,
    SkeletonModule,
    EditorModule,
    ColorPickerModule,
    CalendarModule,
    MenuModule, TimelineModule
  ],
  providers: [
    ConfirmationService,
    MessageService,
    FilterService,
    PrimeNGConfig,
    DialogService,
  ],
  bootstrap: [SharedModule],
})
export class PrimengModule { }
