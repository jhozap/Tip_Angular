import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
      "http://10.23.14.164:9000/Servicios/AccesoDatos_1.0.0/api/Reportes/GetReporteObjTag",
      params,
      { headers: this.generateBasicHeaders() }
    );
  }

  getDetalleEstado(params: any) {
    return this.http.post<any>(
      "http://10.23.14.164:9000/Servicios/AccesoDatos_1.0.0/api/Reportes/GetReporteObjTag",
      params,
      { headers: this.generateBasicHeaders() }
    );
  }

  getDatosTIP(params: any) {
    return this.http.post<any>(
      "http://10.23.14.164:9000/Servicios/AccesoDatos_1.0.0/api/Reportes/GetReporteObjTag",
      params,
      { headers: this.generateBasicHeaders() }
    );
  }
}
