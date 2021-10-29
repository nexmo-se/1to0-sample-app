import axios from 'axios';

let API_URL = process.env.REACT_APP_API_URL_DEVELOPMENT;

const startRecording = (sessionId) => {
  return axios.post(`${API_URL}/archive/start`, {
    session_id: sessionId,
  });
};

const stopRecording = (archiveId) => {
  return axios.get(`${API_URL}/archive/stop/${archiveId}`);
};

export { startRecording, stopRecording };
