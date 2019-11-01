import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: "app-state",
  templateUrl: "./state.component.html",
  styleUrls: ["./state.component.scss"]
})
export class StateComponent implements OnInit {
  
  @Input()
  estado: any;

  constructor() {}

  ngOnInit() {}
}
