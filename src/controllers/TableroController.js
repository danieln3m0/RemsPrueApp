import api from '../config/api';
import { TableroElectrico } from '../models/TableroElectrico';

// Controlador para manejar las operaciones CRUD de Tableros
class TableroController {
  
  // GET /tableros/ - Obtener todos los tableros
  async getAllTableros() {
    try {
      const response = await api.get('/tableros/');
      return response.data.map(tablero => new TableroElectrico(tablero));
    } catch (error) {
      console.error('Error al obtener tableros:', error);
      throw this.handleError(error);
    }
  }

  // GET /tableros/{tablero_id} - Obtener un tablero específico
  async getTableroById(id) {
    try {
      const response = await api.get(`/tableros/${id}`);
      return new TableroElectrico(response.data);
    } catch (error) {
      console.error(`Error al obtener tablero ${id}:`, error);
      throw this.handleError(error);
    }
  }

  // POST /tableros/ - Crear un nuevo tablero
  async createTablero(tableroData) {
    try {
      // Forzar conversión de campos numéricos
      const data = {
        ...tableroData,
        ano_fabricacion: Number(tableroData.ano_fabricacion),
        ano_instalacion: Number(tableroData.ano_instalacion),
        capacidad_amperios: Number(tableroData.capacidad_amperios),
      };
      const tablero = new TableroElectrico(data);
      if (!tablero.isValid()) {
        throw new Error('Datos del tablero inválidos. Verifica los campos obligatorios.');
      }
      const response = await api.post('/tableros/', tablero.toJSON());
      return new TableroElectrico(response.data);
    } catch (error) {
      console.error('Error al crear tablero:', error);
      throw this.handleError(error);
    }
  }

  // PATCH /tableros/{tablero_id} - Actualizar un tablero (parcial)
  async updateTablero(id, tableroData) {
    try {
      // Forzar conversión de campos numéricos
      const data = {
        ...tableroData,
        ano_fabricacion: Number(tableroData.ano_fabricacion),
        ano_instalacion: Number(tableroData.ano_instalacion),
        capacidad_amperios: Number(tableroData.capacidad_amperios),
      };
      const response = await api.patch(`/tableros/${id}`, data);
      return new TableroElectrico(response.data);
    } catch (error) {
      console.error(`Error al actualizar tablero ${id}:`, error);
      throw this.handleError(error);
    }
  }

  // DELETE /tableros/{tablero_id} - Eliminar un tablero
  async deleteTablero(id) {
    try {
      console.log(`Llamando DELETE /tableros/${id}`);
      const response = await api.delete(`/tableros/${id}`);
      console.log('Respuesta DELETE:', response.status, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar tablero ${id}:`, error);
      console.error('Error completo:', error.response?.data);
      throw this.handleError(error);
    }
  }

  // Manejo centralizado de errores
  handleError(error) {
    if (error.response) {
      // Error de respuesta del servidor
      let message = '';
      if (typeof error.response.data === 'string') {
        message = error.response.data;
      } else if (error.response.data?.detail) {
        message = error.response.data.detail;
      } else if (error.response.data?.message) {
        message = error.response.data.message;
      } else if (Array.isArray(error.response.data)) {
        // Errores de validación tipo lista
        message = error.response.data.map(e => e.msg || e.message || JSON.stringify(e)).join('\n');
      } else if (typeof error.response.data === 'object') {
        // Mostrar todos los errores de validación
        message = Object.values(error.response.data).flat().join('\n');
      } else {
        message = `Error del servidor: ${error.response.status}`;
      }
      return new Error(message);
    } else if (error.request) {
      // No se recibió respuesta
      return new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
    } else {
      // Error en la configuración de la petición
      return new Error(error.message || 'Error desconocido');
    }
  }
}

export default new TableroController();
