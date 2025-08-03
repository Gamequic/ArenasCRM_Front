import { axios } from '../utils/axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

class AuthService {
  async LogIn({ Email, Password }) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        Email, Password
      });
      return response.data;
    } catch (error) {
      const errMsg = error?.response?.data || error.message;
      console.log(error)
      console.error("Error in Login:", errMsg);
      throw new Error(errMsg);
    }
  }

  async LogOut() {
    try {
      const response = await axios.post(`${API_URL}/api/auth/logout`);
      return response.data;
    } catch (error) {
      const errMsg = error?.response?.data || error.message;
      console.error("Error in LogOut:", errMsg);
      throw new Error(errMsg);
    }
  }

  async Validate() {
    try {
      const response = await axios.get(`${API_URL}/api/auth/validate`);
      return response.data;
    } catch (error) {
      console.error("Error in Validate:", error);
      return error
    }
  }
}

export default AuthService;
