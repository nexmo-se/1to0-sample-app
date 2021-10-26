import ScreenShare from '@mui/icons-material/ScreenShare';
import StopScreenShare from '@mui/icons-material/StopScreenShare';
import { IconButton } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

export default function ScreenSharingButton({
  classes,
  isScreenSharing,
  handleScreen,
  // startScreenSharing,
  // stopScreenSharing
}) {
  // const handleScreenSharing = () => {
  //   isScreenSharing ? stopScreenSharing() : startScreenSharing();
  // };

  const title = isScreenSharing ? 'Stop Screensharing' : 'Start Screensharing';

  return (
    <Tooltip title={title} aria-label="add" fontSize="large">
      <IconButton
        onClick={handleScreen}
        variant="primary"
        edge="start"
        color="inherit"
        aria-label="mic"
        className={`${classes.toolbarButtons} ${
          isScreenSharing ? classes.activeButton : ''
        }`}
      >
        {isScreenSharing ? (
          <StopScreenShare fontSize="large" />
        ) : (
          <ScreenShare fontSize="large" />
        )}
      </IconButton>
    </Tooltip>
  );
}
