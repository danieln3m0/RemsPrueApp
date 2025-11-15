// Modelo para Tablero Eléctrico
export class TableroElectrico {
  constructor(data = {}) {
    this.id = data.id || data._id || null;
    this.nombre = data.nombre || '';
    this.ubicacion = data.ubicacion || '';
    this.ano_fabricacion = data.ano_fabricacion || '';
    this.ano_instalacion = data.ano_instalacion || '';
    this.capacidad_amperios = data.capacidad_amperios || '';
    this.estado = data.estado || '';
    this.marca = data.marca || '';
  }

  // Validación básica
  isValid() {
    return (
      this.nombre &&
      this.ubicacion &&
      this.ano_fabricacion &&
      this.ano_instalacion &&
      this.capacidad_amperios &&
      this.estado &&
      this.marca
    );
  }

  // Convertir a objeto plano para enviar a la API
  toJSON() {
    const obj = {
      nombre: this.nombre,
      ubicacion: this.ubicacion,
      ano_fabricacion: Number(this.ano_fabricacion),
      ano_instalacion: Number(this.ano_instalacion),
      capacidad_amperios: Number(this.capacidad_amperios),
      estado: this.estado,
      marca: this.marca,
    };
    return obj;
  }
}
