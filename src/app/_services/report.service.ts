import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private http: HttpClient) {}

  printTestReport() {  
    return this.http.get(`${environment.apiUrlRep}/generate-report`, { responseType: 'blob'});
  }

  generateDocxReport() {
    return this.http.get(`${environment.apiUrlRep}/generate-docx-report`, { responseType: 'blob' });
  }
}
