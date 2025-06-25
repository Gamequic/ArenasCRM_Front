import axios from "axios";

class PiecesService {
  // Crear nueva pieza
  async create(body) {
    try {
      const response = await axios.post('http://10.0.2.2:8080/api/pieces/', body);
      return response.data;
    } catch (error) {
      console.error("Error in create:", error.response ? error.response.data : error.message);
      throw error;
    }
  }

  // Buscar piezas por filtros
  async find(filters) {
    try {
      // Limpia los filtros que estén vacíos
      const query = Object.entries(filters)
        .filter(([_, value]) => value !== undefined && value !== "")
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");

      const response = await axios.get(`http://10.0.2.2:8080/api/pieces/search?${query}`);
      return response.data;
    } catch (error) {
      console.error("Error in find:", error.response ? error.response.data : error.message);
      throw error;
    }
  }
}

export default PiecesService;
