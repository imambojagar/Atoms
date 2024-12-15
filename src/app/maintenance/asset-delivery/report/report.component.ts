import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
/* import { environment } from 'src/environments/environment'; */
import { StimulsoftViewerComponent } from 'stimulsoft-viewer-angular';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  @ViewChild('viewer') viewer!: StimulsoftViewerComponent;
  deliveryId:any=0;
  endUserId:any=0;
  reportNo:any=0;
  baseUrl: string =  'http://10.201.111.121:5000/api/'; //environment.BaseURL;
  constructor(private activatedRoute: ActivatedRoute){}
  ngOnInit(){

    this.activatedRoute.queryParams.subscribe(params => {
      this.deliveryId = params['deliveryId'];
      this.reportNo= params['reportNo'];
      this.endUserId = params['endUserId'];
    });
  }

  ngAfterViewInit()
  {

    this.search();
  }

  search(){
    if (this.reportNo == 1)
    {
      let baseUrl: string = this.baseUrl;
      this.viewer.requestUrl= baseUrl +'ReportPDF/{action}';
      this.viewer.action= 'InitDeliveryInspection';
      this.viewer.properties = {'deliveryId': this.deliveryId}
      this.viewer.loadViewer();
    }
    else if (this.reportNo == 2)
    {
      let baseUrl: string = this.baseUrl;
      this.viewer.requestUrl= baseUrl +'ReportPDF/{action}';
      this.viewer.action= 'InitEndUserAcceptance';
      this.viewer.properties = {'deliveryId': this.deliveryId,'endUserId':this.endUserId}
      this.viewer.loadViewer();
    }
    else if (this.reportNo == 3)
    {
      let baseUrl: string = this.baseUrl;
      this.viewer.requestUrl= baseUrl +'ReportPDF/{action}';
      this.viewer.action= 'InitFinalCertificate';
      this.viewer.properties = {'deliveryId': this.deliveryId}
      this.viewer.loadViewer();
    }
    else if (this.reportNo == 4)
    {
      let baseUrl: string = this.baseUrl;
      this.viewer.requestUrl= baseUrl +'ReportPDF/{action}';
      this.viewer.action= 'InitTechnicalAcceptance';
      this.viewer.properties = {'deliveryId': this.deliveryId}
      this.viewer.loadViewer();
    }
    else if (this.reportNo == 5)
    {
      let baseUrl: string = this.baseUrl;
      this.viewer.requestUrl= baseUrl +'ReportPDF/{action}';
      this.viewer.action= 'InitTechnicalInspection';
      this.viewer.properties = {'deliveryId': this.deliveryId}
      this.viewer.loadViewer();
    }
}

}
