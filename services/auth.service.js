import axios from "axios";
import Config from 'react-native-config';

class AuthService {
  async LogIn({ Email, Password }) {
    try {
      const response = await axios.post(`${Config.API_URL}/auth/login`, {
            Email, Password
        });
      return response.data;
    } catch (error) {
      const errMsg = error?.response?.data || error.message;
      console.error("Error in Login:", errMsg);
      throw new Error(errMsg);
    }
  }
}

export default AuthService;
