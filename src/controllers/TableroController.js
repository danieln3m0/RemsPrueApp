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
      const tablero = new TableroElectrico(tableroData);
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

  // PUT /tableros/{tablero_id} - Actualizar un tablero
  async updateTablero(id, tableroData) {
    try {
      const tablero = new TableroElectrico({ ...tableroData, id });
      if (!tablero.isValid()) {
        throw new Error('Datos del tablero inválidos. Verifica los campos obligatorios.');
      }
      const response = await api.put(`/tableros/${id}`, tablero.toJSON());
      return new TableroElectrico(response.data);
    } catch (error) {
      console.error(`Error al actualizar tablero ${id}:`, error);
      throw this.handleError(error);
    }
  }

  // DELETE /tableros/{tablero_id} - Eliminar un tablero
  async deleteTablero(id) {
    try {
      const response = await api.delete(`/tableros/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar tablero ${id}:`, error);
      throw this.handleError(error);
    }
  }

  // Manejo centralizado de errores
  handleError(error) {
    if (error.response) {
      // Error de respuesta del servidor
      const message = error.response.data?.detail || 
                     error.response.data?.message || 
                     `Error del servidor: ${error.response.status}`;
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
