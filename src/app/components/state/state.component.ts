import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { BindingService } from 'src/app/services/binding.service';

@Component({
  selector: "app-state",
  templateUrl: "./state.component.html",
  styleUrls: ["./state.component.scss"]
})
export class StateComponent implements OnInit {

  // dato de entrada estado
  @Input()
  estado: any;

  // dato de entrada transportadora
  @Input()
  transportadora: any;

  selected = false;

  constructor(private bindingService: BindingService) {}

  ngOnInit() {}

  consultaDetalle() {

    // llenar transportadora y estado seleccionados
    this.bindingService.shipping.next(this.transportadora);
    this.bindingService.state.next(this.estado.IdEstado);


    // set labels
    this.bindingService.transport.next(this.transportadora);
    console.log(this.transportadora);
    this.bindingService.selectedState.next(this.estado.Estado);
    console.log(this.estado.Estado);

    // Activar segundo paso
    this.bindingService.secondStep.next(true);    
  }
}
