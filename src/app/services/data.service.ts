import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class DataService {
  constructor(private http: HttpClient) {}

  protected generateBasicHeaders(): HttpHeaders {
    return new HttpHeaders({
      "Content-Type": "application/json"
    });
  }

  getTransportadoras(params: any) {
    return this.http.post<any>(
      environment.API + "/Reportes/GetReporteObjTag",
      params,
      { headers: this.generateBasicHeaders() }
    );
  }

  getDetalleEstado(params: any) {
    return this.http.post<any>(
      environment.API + "/Reportes/GetReporteObjTag",
      params,
      { headers: this.generateBasicHeaders() }
    );
  }

  getDatosTIP(params: any) {
    return this.http.post<any>(
      environment.API + "/Reportes/GetReporteObjTag",
      params,
      { headers: this.generateBasicHeaders() }
    );
  }

  getIndicadores(tag: string) {
    return this.http.get(
      environment.API + "/Reportes/GetReporteTag/" + tag,
      { headers: this.generateBasicHeaders() }
    );
  }
}
