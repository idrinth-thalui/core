import { Component, inject, OnInit } from "@angular/core";
import { MarkdownService } from "../../services/markdown.service";
import { ActivatedRoute, RouterLink } from "@angular/router";

@Component({
	selector: "app-display",
	standalone: true,
	imports: [RouterLink],
	templateUrl: "./display.component.html",
	styleUrl: "./display.component.scss",
})
export class DisplayComponent implements OnInit {
  markdownService = inject(MarkdownService);
  route = inject(ActivatedRoute);
  content: string | null = null; // Holds markdown content
  currentPath: string | null = null; // Holds the current route path
  subFiles: string[] = []; // List of sub-files (if a directory is visited)

  ngOnInit(): void {
    // Listen to route changes
    this.route.url.subscribe((urlSegments) => {
      const path = urlSegments.map((seg) => seg.path).join('/') || '/';
      this.currentPath = path;
      this.loadContent(path);
    });
  }

  loadContent(path: string): void {
    this.markdownService.getFileStructure().subscribe({
      next: (fileStructure) => {
        const result = this.resolveContentFromJson(fileStructure, path);
        if (typeof result === 'string') {
          this.content = result; // Show markdown content
          this.subFiles = []; // Clear sub-files since it's a file, not a directory
        } else if (result) {
          this.content = null; // Clear markdown content
          this.subFiles = Object.keys(result); // List directory contents
        } else {
          this.content = 'File not found';
        }
      },
      error: (err) => {
        console.error('Error loading file structure:', err);
        this.content = 'Error loading content';
      },
    });
  }

  // Helper function to traverse nested JSON structure
  resolveContentFromJson(fileStructure: any, path: string) {
    const parts = path === '/' ? [] : path.split('/');
    let current = fileStructure;

    for (const part of parts) {
      if (current[part]) {
        current = current[part];
      } else {
        return null;
      }
    }

    // Check if it's a markdown file or a directory
    if (typeof current === 'string') {
      return current; // It's a markdown file
    } else if (typeof current === 'object') {
      return current; // It's a directory
    }
    return null;
  }
}
