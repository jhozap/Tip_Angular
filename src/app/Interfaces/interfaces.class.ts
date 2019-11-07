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

export interface DatosTIP {
  ESTADO: string;
  FECHA: string;
  FECHA_CREA: string;
  ID_OLA: string;
  ID_RUTA: string;
  NOTA_PEDIDO: string;
  ORDER_ID: number;
  SKU: string;
  STICKER: string;
  TRANSPORTADORA: string;
}