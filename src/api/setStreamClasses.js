import axios from 'axios';
let API_URL = `http://localhost:5000`;

const setStreamClasses = (sessionId) => {
  console.log('seeting classes');
  return axios.post(`${API_URL}/stream`, {
    session_id: sessionId,
  });
};

export { setStreamClasses };
