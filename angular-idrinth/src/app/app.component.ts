import { MediaMatcher } from "@angular/cdk/layout";
import { ChangeDetectorRef, Component, OnDestroy, inject } from "@angular/core";
import { ActivatedRoute, RouterLink, RouterOutlet } from "@angular/router";
import { MarkdownService } from "./services/markdown.service";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [
		RouterLink,
		RouterOutlet,
		FooterComponent,
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		MatSidenavModule,
		MatListModule,
		MatIconModule,
	],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss",
})
export class AppComponent implements OnDestroy {
	title = "Idrinth Thalui";
	mobileQuery: MediaQueryList;
  content: string | null = null;
  currentPath: string | null = null;
  subFiles: string[] = [];
  route = inject(ActivatedRoute);
  markdownService = inject(MarkdownService);

	private _mobileQueryListener: () => void;

	constructor() {
		const changeDetectorRef = inject(ChangeDetectorRef);
		const media = inject(MediaMatcher);

		this.mobileQuery = media.matchMedia("(max-width: 600px)");
		this._mobileQueryListener = () => changeDetectorRef.detectChanges();
		this.mobileQuery.addListener(this._mobileQueryListener);
	}

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

	ngOnDestroy(): void {
		this.mobileQuery.removeListener(this._mobileQueryListener);
	}
}
