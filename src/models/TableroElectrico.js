// Modelo para Tablero Eléctrico
export class TableroElectrico {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nombre = data.nombre || '';
    this.ubicacion = data.ubicacion || '';
    this.voltaje = data.voltaje || '';
    this.capacidad = data.capacidad || '';
    this.marca = data.marca || '';
    this.modelo = data.modelo || '';
    this.fecha_instalacion = data.fecha_instalacion || '';
  }

  // Validación básica
  isValid() {
    return this.nombre && this.ubicacion && this.voltaje;
  }

  // Convertir a objeto plano para enviar a la API
  toJSON() {
    const obj = {
      nombre: this.nombre,
      ubicacion: this.ubicacion,
      voltaje: this.voltaje,
      capacidad: this.capacidad,
      marca: this.marca,
      modelo: this.modelo,
      fecha_instalacion: this.fecha_instalacion,
    };
    
    // Solo incluir id si existe (para actualizaciones)
    if (this.id) {
      obj.id = this.id;
    }
    
    return obj;
  }
}
