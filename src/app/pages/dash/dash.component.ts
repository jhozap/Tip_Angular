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
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from "@angular/material";
import { MomentDateAdapter } from "@angular/material-moment-adapter";

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
  render = true;
  isLoading = false;
  errorMessage = "";
  proveedor = "";
  lstTransportadoras = [];
  step = 0;
  public formGroup: FormGroup;

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.buildForm();
    
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      fechaInicioControl: [
        {
          value: moment().subtract(1, "months")
        },
        [Validators.required]
      ],
      fechaFinControl: [{ value: moment() }, [Validators.required]]
    });
  }

  consultar() {

    this.isLoading = true;
    const fechaIni = moment(this.formGroup.get("fechaInicioControl").value)
      .format("YYYYMMDD")
      .toString();

    const fechaFin = moment(this.formGroup.get("fechaFinControl").value)
      .format("YYYYMMDD")
      .toString();

    const query = {
      Tag: "GETTIPTRAN",
      Parametros: "#"+fechaIni+"#"+fechaFin,
      Separador: "#"
    };

    console.log("Consulta: ", query);
    debugger;
    this.dataService.getTransportadoras(query).subscribe((data: any) => {
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
                Estado: r.ESTADO,
                Cantidad: r.CANTIDAD
              };
            })
        };
      });
      
      this.isLoading = false;
    });

    console.log(this.formGroup.value);
    console.log(
      moment(this.formGroup.get("fechaInicioControl").value).format(
        "DD/MM/YYYY"
      )
    );

    console.log(
      moment(this.formGroup.get("fechaFinControl").value).format("DD/MM/YYYY")
    );
  }

  event(e) {
    console.log(e.value);
  }

  prba(e) {
    console.log(e);
  }
}
