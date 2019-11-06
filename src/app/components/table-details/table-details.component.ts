import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from '@angular/material';
import { DetalleTransportadora } from 'src/app/Interfaces/interfaces.class';


@Component({
  selector: "app-table-details",
  templateUrl: "./table-details.component.html",
  styleUrls: ["./table-details.component.scss"]
})
export class TableDetailsComponent implements OnInit {
  @Input()
  details: DetalleTransportadora[];

  displayedColumns: string[] = [
    "select",
    "ESTADO",
    "CANTIDAD",
    "PORCENT",
    "CARTONES"
  ];

  @ViewChild("table", { static: true }) table: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource;
  selection;

  constructor() {}

  ngOnInit() {
    // llenando DataSource con datos para la tabla
    this.dataSource = new MatTableDataSource<DetalleTransportadora>(
      this.details
    );
    // asignar modelo de seleccion
    this.selection = new SelectionModel<DetalleTransportadora>(true, []);    
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

  checkboxLabel(row?: DetalleTransportadora): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${row[
      "Detalle"
    ] + 1}`;
  }
}
