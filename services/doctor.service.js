import { axios } from '../utils/axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

class DoctorService {
  async find() {
    try {
      const response = await axios.get(`${API_URL}/api/doctor/`);
      return response.data;
    } catch (error) {
      console.error("Error in find:", error.response ? error.response.data : error.message);
      throw error;
    }
  }
}

export default DoctorService;
