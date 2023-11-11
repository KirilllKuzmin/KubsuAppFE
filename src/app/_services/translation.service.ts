import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private jsonUrl = 'assets/i18n/labels';

  constructor(private http: HttpClient) {}

  getContent(component: string, language: string): Observable<any> {
    const url = `${this.jsonUrl}/${component}/${language}.json`;
    return this.http.get(url);
  }

  getEnum(component: string, name: string): Observable<any> {
    const url = `${this.jsonUrl}/${component}/${name}.json`;
    return this.http.get(url);
  }
}
