import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  http = inject(HttpClient);

   getMarkdownFile(filePath: string): Observable<string> {
    return this.http.get(filePath, { responseType: 'text' });
  }
}
