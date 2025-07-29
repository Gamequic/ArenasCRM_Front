import { axios } from '../utils/axios';
import Config from 'react-native-config';

class PiecesService {
  // Crear nueva pieza
  async create(body) {
    try {
      const response = await axios.post(`${Config.API_URL}/api/pieces/`, body);
      return response.data;
    } catch (error) {
      const errMsg = error?.response?.data || error.message;
      console.error("Error in create:", errMsg);
      throw new Error(errMsg);
    }
  }

  async update(id, body) {
    try {
      const response = await axios.put(`${Config.API_URL}/api/pieces/${id}`, body);
      return response.data;
    } catch (error) {
      console.log(error)
      const errMsg = error?.response?.data || error.message;
      console.error("Error in update:", errMsg);
      throw new Error(errMsg);
    }
  }

  // Buscar piezas por filtros
  async find(filters) {
    try {
      const query = Object.entries(filters)
        .filter(([_, value]) => value !== undefined && value !== "")
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");
      
      const response = await axios.get(`${Config.API_URL}/api/pieces/search?${query}`);
      return response.data;
    } catch (error) {
      console.error("Error in find:", error.response ? error.response.data : error.message);
      throw error;
    }
  }

  async findOne(id) {
    try {
      const response = await axios.get(`${Config.API_URL}/api/pieces/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error in find:", error.response ? error.response.data : error.message);
      throw error;
    }
  }
}

export default PiecesService;
