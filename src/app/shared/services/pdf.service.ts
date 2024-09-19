import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EventService } from './event.service';
import { environment } from '../../../../environment';

const BASE_URL = environment.apiUrl + '/pdf';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  
  
  private httpClient   = inject(HttpClient);
  private eventService = inject(EventService);

  constructor() { }

  convertHtmlToPdf(htmlContent: string) {
    const data = { htmlContent: htmlContent };
    this.httpClient.post(`${BASE_URL}/generate`, data, { responseType: 'blob' })
        .subscribe((response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

}
