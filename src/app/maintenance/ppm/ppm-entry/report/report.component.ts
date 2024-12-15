import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { StimulsoftViewerComponent } from 'stimulsoft-viewer-angular';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {
  @ViewChild('viewer') viewer: StimulsoftViewerComponent;
  ppmId:any=0;
  constructor(private activatedRoute: ActivatedRoute){}
  ngOnInit(){
    this.activatedRoute.queryParams.subscribe(params => {
      this.ppmId = params['ppmId'];
    });
    
  }
  ngAfterViewInit()
  {
    
    let baseUrl: string = environment.BaseURL;
    this.viewer.requestUrl= baseUrl +'ReportPDF/{action}';
    this.viewer.action= 'InitppmPrint';
    this.viewer.properties = {'ppmId': this.ppmId}
    this.viewer.loadViewer();
  }

}
