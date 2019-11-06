import { Component, OnInit } from "@angular/core";
import {
  animate,
  state,
  style,
  transition,
  trigger,
  query,
  stagger,
  animateChild
} from "@angular/animations";
import { DataService } from "src/app/services/data.service";
import { from, of, zip } from "rxjs";
import { Transportadoras } from "src/app/Interfaces/interfaces.class";
import { groupBy, mergeMap, toArray, distinct } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import * as moment from "moment";
import {
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE
} from "@angular/material";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { BindingService } from 'src/app/services/binding.service';
import { ToastrService } from 'ngx-toastr';

export const MY_FORMATS = {
  parse: {
    dateInput: "LL"
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "YYYY"
  }
};

@Component({
  selector: "app-dash",
  templateUrl: "./dash.component.html",
  styleUrls: ["./dash.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
  animations: [
    trigger("entering", [
      transition("* <=> *", [
        // each time the binding value changes
        query(
          ":leave",
          [
            stagger(100, [
              animate(
                "0.5s",
                style({ opacity: 0, transform: "translateY(-100px)" })
              )
            ]),
            query("@child", [animateChild()], { optional: true })
          ],
          { optional: true }
        ),
        query(
          ":enter",
          [
            style({ opacity: 0, transform: "translateY(100px)" }),
            stagger(50, [
              animate("0.5s", style({ opacity: 1, transform: "translateY(0)" }))
            ]),
            query("@child", [animateChild()], { optional: true })
          ],
          { optional: true }
        )
      ])
    ]),
    trigger("child", [
      state(
        "true",
        style({ transform: "translateX(0)", opacity: 1, height: "*" })
      ),
      state(
        "false",
        style({ transform: "translateX(200px)", opacity: 0, height: 0 })
      ),
      transition("0 => 1", animate(".5s ease-out")),
      transition("1 => 0", animate(".5s ease-out"))
    ]),
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ]),
    trigger("fade", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate(".2s ease-out", style({ opacity: 1 }))
      ])
    ]),
    trigger("listAnimation", [
      transition("* => *", [
        // each time the binding value changes
        query(
          ":leave",
          [stagger(100, [animate("0.5s", style({ opacity: 0 }))])],
          { optional: true }
        ),
        query(
          ":enter",
          [
            style({ opacity: 0 }),
            stagger(100, [animate("0.5s", style({ opacity: 1 }))])
          ],
          { optional: true }
        )
      ])
    ])
  ]
})
export class DashComponent implements OnInit {
  render = false;
  renderNotFound = false;
  renderContent = false;
  isLoading = false;
  errorMessage = "";
  proveedor = "";
  lstTransportadoras = [];
  firstStep = false;
  secondStep = false;
  thirdStep = false;
  fechaIni;
  fechaFin;
  details;
  public formGroup: FormGroup;

  constructor(
    private dataService: DataService,
    private bindingService: BindingService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.buildForm();
    this.consultaDetalle();
  }

  // Construccion de formulario Reactivo para las fechas del filtro principal
  private buildForm() {
    this.formGroup = this.formBuilder.group({
      fechaInicioControl: new FormControl([
        {
          value: moment()
            .subtract(1, "year")
            .format("DD/MM/YYYY")
        },
        [Validators.required]
      ]),
      fechaFinControl: new FormControl([
        moment().format("DD/MM/YYYY"),
        [Validators.required]
      ])
    });
  }

  // Consulta inicial de Transportadoras
  consultar() {
    debugger;
    // habilitar pantalla de loading
    this.isLoading = true;
    // no renderizar contenido
    this.renderContent = false;
    // no renderizar pantalla de no contenido
    this.renderNotFound = false;
    // resetear valores de transportadora y estado segunda consulta a null
    this.bindingService.shipping.next(null);
    this.bindingService.state.next(null);
    // resetear pasos 2 y 3
    this.bindingService.secondStep.next(false);  
    // captura fecha inicial con moment
    this.fechaIni = moment(this.formGroup.get("fechaInicioControl").value)
      .format("YYYYMMDD")
      .toString();
    // captura feha final con moment
    this.fechaFin = moment(this.formGroup.get("fechaFinControl").value)
      .format("YYYYMMDD")
      .toString();
    // construccion de primera consulta
    const query = {
      Tag: "GETTIPTRAN",
      Parametros: "#" + this.fechaIni + "#" + this.fechaFin,
      Separador: "#"
    };
 
    // Consulta de primera tab Transportadoras
    // this.dataService.getTransportadoras(query).subscribe((data: any) => {
      
    //   // Validacion de respuesta de la consulta
    //   if (data["Estado"]) {
    //     // Mapeo de estructura de datos
    //     this.lstTransportadoras = Array.from(
    //       new Set(data["Value"].map(x => x.ID_TRANSPORTADORA))
    //     ).map(x => {
    //       return {
    //         transportadoraID: x,
    //         transportadora: data["Value"].find(a => a.ID_TRANSPORTADORA === x)
    //           .TRANSPORTADORA,
    //         CANTIDAD: data["Value"]
    //           .filter(q => q.ID_TRANSPORTADORA === x)
    //           .map(w => w.CANTIDAD)
    //           .reduce((a, b) => a + b, 0),
    //         ENVIADAS: data["Value"]
    //           .filter(q => q.ID_TRANSPORTADORA === x)
    //           .map(w => w.ENVIADAS)[0],
    //         ESTADOS: data["Value"]
    //           .filter(e => e.ID_TRANSPORTADORA === x)
    //           .map(r => {
    //             return {
    //               Color: r.COLOR_FONDO,
    //               IdEstado: r.ID_ESTADO,
    //               Estado: r.ESTADO,
    //               Cantidad: r.CANTIDAD
    //             };
    //           })
    //       };
    //     });
    //     // console.log(JSON.stringify(this.lstTransportadoras));
    //     // Activar primer tab
    //     this.firstStep = true;
    //     // Activar rendeo de contenido
    //     this.renderContent = true;
    //   } else {
    //     // si la consulta principal no trae datos se rendea una carta de no contenido
    //     this.renderNotFound = true;
    //   }
    //   // quitar pantalla de loading
    //   this.isLoading = false;
    // });

    /* Mok de datos primera consulta */
    this.lstTransportadoras = [
      {
        transportadoraID: 2,
        transportadora: "EGA KAT",
        CANTIDAD: 2324,
        ENVIADAS: 30,
        ESTADOS: [
          { Color: "#000000", IdEstado: 7, Estado: "Anulado", Cantidad: 934 },
          { Color: "#777777", IdEstado: 1, Estado: "No Revisado", Cantidad: 1 },
          {
            Color: "#B6BD0A",
            IdEstado: 6,
            Estado: "Valido Con Alerta",
            Cantidad: 28
          },
          {
            Color: "#D8D98E",
            IdEstado: 4,
            Estado: "Valido No Revisado",
            Cantidad: 399
          },
          { Color: "#085208", IdEstado: 5, Estado: "Valido", Cantidad: 962 }
        ]
      },
      {
        transportadoraID: 3,
        transportadora: "ENVIA",
        CANTIDAD: 3582,
        ENVIADAS: 30,
        ESTADOS: [
          {
            Color: "#D8D98E",
            IdEstado: 4,
            Estado: "Valido No Revisado",
            Cantidad: 796
          },
          { Color: "#000000", IdEstado: 7, Estado: "Anulado", Cantidad: 1265 },
          {
            Color: "#B6BD0A",
            IdEstado: 6,
            Estado: "Valido Con Alerta",
            Cantidad: 54
          },
          {
            Color: "#777777",
            IdEstado: 1,
            Estado: "No Revisado",
            Cantidad: 148
          },
          { Color: "#085208", IdEstado: 5, Estado: "Valido", Cantidad: 1319 }
        ]
      },
      {
        transportadoraID: 1,
        transportadora: "LYT",
        CANTIDAD: 3813,
        ENVIADAS: 30,
        ESTADOS: [
          {
            Color: "#D8D98E",
            IdEstado: 4,
            Estado: "Valido No Revisado",
            Cantidad: 971
          },
          { Color: "#085208", IdEstado: 5, Estado: "Valido", Cantidad: 1421 },
          { Color: "#000000", IdEstado: 7, Estado: "Anulado", Cantidad: 1361 },
          {
            Color: "#B6BD0A",
            IdEstado: 6,
            Estado: "Valido Con Alerta",
            Cantidad: 60
          }
        ]
      }
    ];
    this.firstStep = true;
    this.renderContent = true;
    this.isLoading = false;
  }

  // consultar detalle Transportadora
  consultaDetalle() {
    this.bindingService.secondStep.subscribe(data => {
      console.log(data);
      // debugger;
      if (data) {
        this.isLoading = true;
        this.secondStep = false;
        const query = {
          Tag: "TIPDAEST",
          Parametros:
            "#" +
            this.bindingService.shipping.value +
            "#" +
            this.bindingService.state.value,
          Separador: "#"
        };

        this.dataService.getDetalleEstado(query).subscribe((data: any) => {
          if (data["Estado"]) {
            this.details = data["Value"];
            this.secondStep = true;
            this.isLoading = false;
          } else {
            this.toastr.info("La consulta no retorno datos");
          }
        });
      }
    });

    //
  }
}
