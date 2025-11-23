import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AccordionItem {
    title: string;
    content: string;
}

@Component({
    selector: 'app-accordion',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './accordion.html',
    styleUrls: ['./accordion.scss']
})
export class AccordionComponent {
    @Input() items: AccordionItem[] = [];
}
