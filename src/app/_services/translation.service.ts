import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor(private translate: TranslateService, private http: HttpClient) {}

  loadTranslations(componentName: string): void {
    this.http.get(`assets/i18n/${componentName}.json`).subscribe(translations => {
      this.translate.setTranslation(componentName, translations, true);
      this.translate.use(componentName);
    });
  }
}
