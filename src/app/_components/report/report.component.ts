import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.less']
})
export class ReportComponent implements OnInit {

  loading = false;

  constructor(
  ) {
  }

  ngOnInit() {
      this.loading = true;
  }

}
