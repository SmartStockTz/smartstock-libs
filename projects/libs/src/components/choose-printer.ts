import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { PrintService } from "../public-api";

@Component({
    selector: 'choose-printer-dialog',
    template: `
    <div >Select default printer</div>
    <div mat-dialog-content>
        <mat-nav-list role="list">
            <p *ngIf="printers.length===0">No printer found make sure your system has printers and their drivers installed propery</p>
            <mat-list-item (click)="select(printer)" 
            *ngFor="let printer of printers" role="listitem">{{printer}}</mat-list-item>
        </mat-nav-list>
    </div>
    `,
    styleUrls: []
})

export class ChoosePrinterDialog implements OnInit {
    printers;
    constructor(private readonly printer: PrintService,
        private readonly dialogRef: MatDialogRef<ChoosePrinterDialog>) { }
    async ngOnInit(): Promise<void> {
        this.printers = await this.printer.printers()
    }
    select(p: string){
        this.dialogRef.close(p);
    }
}