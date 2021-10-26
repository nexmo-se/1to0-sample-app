import { useState } from 'react';
import { startRecording, stopRecording } from '../../api/fetchRecording';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { IconButton } from '@material-ui/core';
import styles from './styles';
import Tooltip from '@material-ui/core/Tooltip';

export default function RecordingButton({ classes, session }) {
  const [isRecording, setRecording] = useState(false);
  const [archiveId, setArchiveId] = useState(null);
  const localClasses = styles();

  const handleRecordingStart = async (sessionId) => {
    try {
      const data = await startRecording(sessionId);
      if (data.status === 200 && data.data) {
        const { archiveId } = data.data;
        setArchiveId(archiveId);
        setRecording(true);
      }
    } catch (e) {
      setRecording(false);
    }
  };

  const handleRecordingStop = async (archiveId) => {
    try {
      if (isRecording) {
        const data = await stopRecording(archiveId);
        if (data.status === 200 && data.data) {
          const { status } = data.data;
          setRecording(false);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleRecordingAction = () => {
    if (session) {
      const sessionId = session.sessionId;
      isRecording
        ? handleRecordingStop(archiveId)
        : handleRecordingStart(sessionId);
    }
  };

  const title = isRecording ? 'Stop Recording' : 'Start Recording';

  return (
    <Tooltip title={title} aria-label="add">
      <IconButton
        edge="start"
        color="inherit"
        aria-label="mic"
        onClick={handleRecordingAction}
        className={classes.toolbarButtons}
      >
        {isRecording ? (
          <FiberManualRecordIcon
            fontSize="inherit"
            className={localClasses.activeRecordingIcon}
            style={{ color: '#D50F2C' }}
          />
        ) : (
          <FiberManualRecordIcon fontSize="large" />
        )}
      </IconButton>
    </Tooltip>
  );
}
