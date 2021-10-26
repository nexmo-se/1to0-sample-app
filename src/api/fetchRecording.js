import axios from 'axios';
let API_URL = `http://localhost:5000/archive`;

const startRecording = (sessionId) => {
  return axios.post(`${API_URL}/start`, {
    session_id: sessionId,
  });
};

const stopRecording = (archiveId) => {
  return axios.get(`${API_URL}/stop/${archiveId}`);
};

export { startRecording, stopRecording };
