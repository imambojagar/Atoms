import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StimulsoftViewerComponent } from 'stimulsoft-viewer-angular';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {
  @ViewChild('viewer') viewer!: StimulsoftViewerComponent;
  serviceRequestId:any=0;
  constructor(private activatedRoute: ActivatedRoute){}
  ngOnInit(){
    this.activatedRoute.queryParams.subscribe(params => {
      this.serviceRequestId = params['serviceRequestId'];
    });

  }
  ngAfterViewInit()
  {

    let baseUrl: string = environment.BaseURL;
    this.viewer.requestUrl= baseUrl +'ReportPDF/{action}';
    this.viewer.action= 'InitServiceRequestPrint';
    this.viewer.properties = {'serviceRequestId': this.serviceRequestId}
    this.viewer.loadViewer();
  }

}
