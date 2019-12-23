import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
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
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import * as moment from "moment";
import {
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE,
  MatStepper
} from "@angular/material";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { BindingService } from "src/app/services/binding.service";
import { ToastrService } from "ngx-toastr";

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
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
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
  @ViewChild("stepper", { static: false }) stepper: MatStepper;
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
  dtosTIP;
  lstIndicadores = null;
  date = new Date;

  transportadora = "";
  estado = "";

  public formGroup: FormGroup;

  constructor(
    private dataService: DataService,
    private bindingService: BindingService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {
    this.bindingDataLabels();
    this.buildForm();
  }

  ngOnInit() {

    

    // llenar indicadores
    this.getIndicadores();

    // Inicializar fecha inicial
    this.formGroup
      .get("fechaInicioControl")
      .setValue(moment().subtract(1, "day"));

    // nicializar fecha final
    this.formGroup.get("fechaFinControl")
      .setValue(moment().add(1, "day"));

    this.consultar();
    this.consultaDetalle();
    this.consultaDatosTIP();
  }

  // Construccion de formulario Reactivo para las fechas del filtro principal
  private buildForm() {
    this.formGroup = this.formBuilder.group({
      fechaInicioControl: [Validators.required],
      fechaFinControl: [Validators.required]
    });
  }

  // consulta y mapeo de indicadores superiores
  getIndicadores() {

    this.dataService.getIndicadores("TIP2INDIC")
      .subscribe(data => {
        if (data["Estado"]) {
          debugger;
          this.lstIndicadores = {
            // OTIF
            VALOR_OTIF: data["Value"][0]["VALOR"],
            COLOR_OTIF: data["Value"][0]["COLOR"],
            TITULO_OTIF: data["Value"][0]["TITULO"],
            FECHA_ACTUALIZACION: data["Value"][0]["FECHA_ACTUALIZACION"],
            TENDENCIA_OTIF: data["Value"][0]["TENDENCIA"],
            // Notas * Metros3
            VALOR_NXM: data["Value"][1]["VALOR"],
            COLOR_NXM: data["Value"][1]["COLOR"],
            TITULO_NXM: data["Value"][1]["TITULO"],
            TENDENCIA_NXM: data["Value"][1]["TENDENCIA"],
            // Notas * Día
            VALOR_NXD: data["Value"][2]["VALOR"],
            COLOR_NXD: data["Value"][2]["COLOR"],
            TITULO_NXD: data["Value"][2]["TITULO"],
            TENDENCIA_NXD: data["Value"][2]["TENDENCIA"]
          };
        } else {

        }
      });
  }

  // Consulta inicial de Transportadoras
  consultar() {
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
    this.secondStep = false;
    this.details = null;
    this.thirdStep = false;
    this.dtosTIP = null;
    // captura fecha inicial con moment
    this.fechaIni = moment(this.formGroup.get("fechaInicioControl").value)
      .format("DD/MM/YYYY")
      .toString();
    // captura feha final con moment
    this.fechaFin = moment(this.formGroup.get("fechaFinControl").value)
      .format("DD/MM/YYYY")
      .toString();
    // construccion de primera consulta
    const query = {
      Tag: "GETTIPTRAN",
      Parametros: "#" + this.fechaIni + "#" + this.fechaFin,
      Separador: "#"
    };

    this.getTransportadoras(query);

    /* Mok de datos primera consulta */
    setTimeout(() => {
      this.mokDataPrincipal();
    }, 1000);
  }

  getTransportadoras(query: any) {
    // Consulta de primera tab Transportadoras
    this.dataService.getTransportadoras(query).subscribe((data: any) => {
      // Validacion de respuesta de la consulta
      if (data["Estado"]) {
        // Mapeo de estructura de datos
        this.lstTransportadoras = Array.from(
          new Set(data["Value"].map(x => x.ID_TRANSPORTADORA))
        ).map(x => {
          return {
            transportadoraID: x,
            transportadora: data["Value"].find(a => a.ID_TRANSPORTADORA === x)
              .TRANSPORTADORA,
            CANTIDAD: data["Value"]
              .filter(q => q.ID_TRANSPORTADORA === x)
              .map(w => w.CANTIDAD)
              .reduce((a, b) => a + b, 0),
            ENVIADAS: data["Value"]
              .filter(q => q.ID_TRANSPORTADORA === x)
              .map(w => w.ENVIADAS)[0],
            ESTADOS: data["Value"]
              .filter(e => e.ID_TRANSPORTADORA === x)
              .map(r => {
                return {
                  Color: r.COLOR_FONDO,
                  IdEstado: r.ID_ESTADO,
                  Estado: r.ESTADO,
                  Cantidad: r.CANTIDAD
                };
              })
          };
        });

        // Activar primer tab
        this.firstStep = true;
        // Activar rendeo de contenido
        this.renderContent = true;
      } else {
        // si la consulta principal no trae datos se rendea una carta de no contenido
        this.renderNotFound = true;
      }
      // quitar pantalla de loading
      this.isLoading = false;
    });
  }

  // consultar detalle Transportadora
  consultaDetalle() {
    this.bindingService.secondStep.subscribe(data => {
      // console.log(data);

      if (data) {
        this.isLoading = true;
        this.secondStep = false;
        this.details = null;
        this.thirdStep = false;
        this.dtosTIP = null;
        const query = {
          Tag: "TIPDAEST",
          Parametros:
            "#" +
            this.bindingService.shipping.value +
            "#" +
            this.bindingService.state.value +
            "#" +
            this.fechaIni +
            "#" +
            this.fechaFin,
          Separador: "#"
        };

        this.dataService.getDetalleEstado(query).subscribe((data: any) => {
          if (data["Estado"]) {
            this.details = data["Value"];
            this.stepper.selectedIndex = 1;
            this.isLoading = false;
          } else {
            this.toastr.info("La consulta no retorno datos");
          }
        });
      }
    });
  }

  // consulta datos TIP segun datos seleccionados
  consultaDatosTIP() {
    this.bindingService.thirdStep.subscribe(data => {
      // console.log(data);

      if (data) {
        this.isLoading = true;
        this.thirdStep = false;
        let estados = this.bindingService.selectedStates.value;
        estados = JSON.stringify(estados.map(x => x.ESTADO_MONITOREO))
          .replace("[", "")
          .replace("]", "");
        // console.log(estados);

        const query = {
          Tag: "TIPDTOSDTL",
          Parametros:
            "#" +
            estados +
            "#" +
            this.fechaIni +
            "#" +
            this.fechaFin +
            "#" +
            this.bindingService.shipping.value +
            "#" +
            this.bindingService.state.value,
          Separador: "#"
        };

        this.dataService.getDatosTIP(query).subscribe((data: any) => {
          if (data["Estado"]) {
            console.log(data["Value"]);
            this.dtosTIP = data["Value"];
            this.stepper.selectedIndex = 2;
            this.isLoading = false;
          } else {
            this.toastr.info("La consulta no retorno datos");
            this.isLoading = false;
          }
        });
      }
    });
  }

  mokDataPrincipal() {
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

  bindingDataLabels() {
    this.bindingService.transport
      .subscribe(data => {
        this.transportadora = data
      });

    this.bindingService.selectedState
      .subscribe(data => {
        this.estado = data
      });
  }
}
