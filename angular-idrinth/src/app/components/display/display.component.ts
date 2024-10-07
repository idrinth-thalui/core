import { Component, inject, OnInit } from "@angular/core";
import { MarkdownService } from "../../services/markdown.service";

@Component({
	selector: "app-display",
	standalone: true,
	imports: [],
	templateUrl: "./display.component.html",
	styleUrl: "./display.component.scss",
})
export class DisplayComponent implements OnInit {
	markdownService = inject(MarkdownService);

	ngOnInit(): void {
		this.markdownService.getMarkdownFile().subscribe((content) => {
			console.log(content);
		});
	}
}
