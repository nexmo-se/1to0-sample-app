import React from 'react';

// import LeaveButton from '../LeaveButton';
import ScreenSharingButton from '../ScreenSharingButton';
import MuteAudioButton from '../MuteAudioButton';
import MuteVideoButton from '../MuteVideoButton';
import RecordingButton from '../RecordingButton';

import styles from './styles';

function ToolBar({
  publishScreen,
  handleScreen,
  session,
  handleVideoChange,
  handleAudioChange,
  hasVideo,
  hasAudio,
}) {
  const classes = styles();
  return (
    <div className={classes.toolbarContainer}>
      <ScreenSharingButton handleScreen={handleScreen} classes={classes} />

      <MuteAudioButton
        classes={classes}
        handleAudioChange={handleAudioChange}
        hasAudio={hasAudio}
      />
      <MuteVideoButton
        classes={classes}
        handleVideoChange={handleVideoChange}
        hasVideo={hasVideo}
      />
      <RecordingButton classes={classes} session={session} />
    </div>
  );
}

export default ToolBar;
