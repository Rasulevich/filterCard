import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable({
    providedIn: 'root'
})
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
    constructor() {
        super();
        this.itemsPerPageLabel = 'Отображать';
        this.getRangeLabel = (page: number, pageSize: number, length: number): string => {
            if (length === 0 || pageSize === 0) {
              return `записей 0 из ${length} `;
            }
            length = Math.max(length, 0);
            const startIndex = page * pageSize;
            const endIndex = Math.min(startIndex + pageSize, length);
            return `записей ${startIndex + 1}–${endIndex} из ${length}`;
          };
      }
}
