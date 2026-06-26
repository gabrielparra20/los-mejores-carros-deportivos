export interface CarSpecs {
  año: number;
  motor: string;
  potencia: number;
  aceleracion: number;
  velocidadMaxima: number;
}

export interface Car {
  id: string;
  marca: string;
  modelo: string;
  pais: string;
  imagen: string;
  historia: string;
  motivacion: string;
  especificaciones: CarSpecs;
  impacto: string;
  famosoPor?: string;
  categoria?: string;
}
