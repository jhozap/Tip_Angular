import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.scss']
})
export class GraphicComponent implements OnInit {

  @Input()
  transportadora: any;

  constructor() { }

  ngOnInit() {
    console.log(this.transportadora);
  }

}
