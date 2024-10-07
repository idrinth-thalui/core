import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  http = inject(HttpClient);

  getFileStructure(): Observable<Object> {
    return this.http.get("/data/fileStructure.json");
  }
}
