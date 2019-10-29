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

@Component({
  selector: "app-dash",
  templateUrl: "./dash.component.html",
  styleUrls: ["./dash.component.scss"],
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

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.isLoading = true;
    this.dataService.getTransportadoras().subscribe((data: any) => {


const transportadoras = Array.from(new Set(data["Value"].map(x => x.ID_TRANSPORTADORA))).map(
  x => {
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
  }
);

      console.log(data['Value'].map(x => x.TRANSPORTADORA));
      console.log(data);   
      console.log(JSON.stringify(data));   
      this.isLoading = false;
    });
  }

  event(e) {
    console.log(e.value);
  }

  prba(e) {
    console.log(e);
  }
}
