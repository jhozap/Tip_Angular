import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { DatosTIP } from 'src/app/Interfaces/interfaces.class';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: "app-table-tip",
  templateUrl: "./table-tip.component.html",
  styleUrls: ["./table-tip.component.scss"]
})
export class TableTipComponent implements OnInit {
  @Input()
  dtosTIP: DatosTIP[];

  displayedColumns: string[] = [
    "ESTADO",
    "FECHA",
    "FECHA_CREA",
    "ID_OLA",
    "ID_RUTA",
    "NOTA_PEDIDO",
    "ORDER_ID",
    "SKU",
    "STICKER",
    "TRANSPORTADORA"
  ];

  @ViewChild("table", { static: true }) table: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource;
  selection;

  constructor() {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<DatosTIP>(this.dtosTIP);
    // asignar modelo de seleccion
    this.selection = new SelectionModel<DatosTIP>(true, []);
    // asignacion de paginador
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }, 0);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  ngOnDestroy() {
    // console.log("se destruye");
  }

  checkboxLabel(row?: DatosTIP): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${row[
      "DetalleTIP"
    ] + 1}`;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
