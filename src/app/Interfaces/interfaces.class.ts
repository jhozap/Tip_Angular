export interface Transportadoras {
  ID_ESTADO_VALIDACION;
  ESTADO;
  TRANSPORTADORA;
  CANTIDAD;
}
export interface DetalleTransportadora {
  CANTIDAD: number;
  CARTONES: number;
  ESTADO: string;
  ESTADO_MONITOREO: number;
  PORCENT: number;
}