import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class BindingService {
  // loader
  isLoading = new BehaviorSubject<boolean>(false);
  // Acordeon Steps
  firstStep = new BehaviorSubject<boolean>(true);
  secondStep = new BehaviorSubject<boolean>(false);
  thirdStep = new BehaviorSubject<boolean>(false);
  // Estado y Transportadora segundo tab Acordeon
  state = new BehaviorSubject<any>(null);
  shipping = new BehaviorSubject<any>(null);
  // Estados seleccionados segundo Step
  selectedStates = new BehaviorSubject<any>(null);

  constructor() {}
}
