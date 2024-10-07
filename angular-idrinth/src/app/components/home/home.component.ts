import { Component, inject, OnInit } from '@angular/core';
import { MarkdownService } from '../../services/markdown.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  readmeContent: string = '';
  filePath: string = '/README.md';
  markdownService = inject(MarkdownService);

  ngOnInit(): void {
    this.markdownService.getMarkdownFile(this.filePath).subscribe((content) => {
      this.readmeContent = content;
    });
  }
}
