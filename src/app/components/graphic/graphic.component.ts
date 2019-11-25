import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.scss']
})
export class GraphicComponent implements OnInit {

  // dato de entrada lista de transportadoras
  @Input()
  transportadora: any;

  constructor() { }

  ngOnInit() {
    console.log("transportadora");
    console.log(this.transportadora);
  }

}
