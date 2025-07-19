import axios from "axios";

class PiecesService {
  async LogIn({ Email, Password }) {
    try {
      const response = await axios.post('http://10.0.2.2:8080/auth/login', {
            Email, Password
        });
      return response.data;
    } catch (error) {
      const errMsg = error?.response?.data || error.message;
      console.error("Error in Login:", errMsg);
      throw new Error(errMsg);
    }
  }

  async LogIn({ Email, Password }) {
    try {
      const response = await axios.post('http://10.0.2.2:8080/auth/login', {
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

export default PiecesService;
