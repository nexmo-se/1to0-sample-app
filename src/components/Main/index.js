import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router';

import { usePublisher } from '../../hooks/usePublisher';
import { useSession } from '../../hooks/useSession';
import React from 'react';
// import { apiKey, token, sessionId } from '../../config';
import { useScreenSharing } from '../../hooks/useScreenSharing';
import { getCredentials } from '../../api/fetchCreds';
import { setStreamClasses } from '../../api/setStreamClasses';
import ToolBar from '../ToolBar';

function Main() {
  const videoContainer = useRef();
  const [publishing, setIsPublishing] = useState(false);
  const [hasAudio, setHasAudio] = useState(true);
  const [hasVideo, setHasVideo] = useState(true);
  // const { startAnnotation, informAnnotation, end, hasAnnotation } =
  //   useAnnotation({ session });

  const screenContainer = useRef();
  const [screenSharing, setScreenSharing] = useState(false);
  const { session, createSession, connected, streams } = useSession({
    container: videoContainer,
  });
  const [credentials, setCredentials] = useState(null);
  const [error, setError] = useState(null);
  let { roomName } = useParams();

  const { publisher, publish, pubInitialised } = usePublisher();
  const {
    publishScreen,
    pubScreenInitialised,
    isPublishingScreen,
    destroyPublisher,
    unpublish,
  } = useScreenSharing();

  const handleAudioChange = useCallback(() => {
    if (hasAudio) {
      publisher.publishAudio(false);
      setHasAudio(false);
      try {
        navigator.mediaSession.setMicrophoneActive(false);
      } catch (e) {
        console.log(e);
      }
    } else {
      publisher.publishAudio(true);
      setHasAudio(true);
      try {
        navigator.mediaSession.setMicrophoneActive(true);
      } catch (e) {
        console.log(e);
      }
    }
  }, [hasAudio, publisher]);

  const handleVideoChange = useCallback(() => {
    if (hasVideo) {
      publisher.publishVideo(false);
      setHasVideo(false);
      try {
        navigator.mediaSession.setCameraActive(false);
      } catch (e) {
        console.log(e);
      }
    } else {
      publisher.publishVideo(true);
      setHasVideo(true);
      try {
        navigator.mediaSession.setCameraActive(true);
      } catch (e) {
        console.log(e);
      }
    }
  }, [hasVideo, publisher]);

  useEffect(() => {
    getCredentials(roomName)
      .then(({ data }) => {
        setCredentials({
          apiKey: data.apiKey,
          sessionId: data.sessionId,
          token: data.token,
        });
      })
      .catch((err) => {
        setError(err);
        console.log(err);
      });
  }, [roomName]);

  useEffect(() => {
    document.addEventListener('visibilitychange', (event) => {
      if (document.visibilityState === 'visible') {
        if (document.pictureInPictureElement) {
          document.exitPictureInPicture();
        }
      }
    });
  }, []);

  useEffect(() => {
    if (credentials) {
      const { apiKey, sessionId, token } = credentials;
      console.log(apiKey);
      createSession({ apiKey, sessionId, token });
    }
  }, [createSession, credentials]);

  useEffect(() => {
    if (publishing) {
      const actionHandlers = [
        // play
        ['togglecamera', handleVideoChange],
        ['togglemicrophone', handleAudioChange],
      ];
      if ('mediaSession' in navigator) {
        for (const [action, handler] of actionHandlers) {
          try {
            navigator.mediaSession.setActionHandler(action, handler);
          } catch (error) {
            console.log(
              `The media session action "${action}" is not supported yet.`
            );
          }
        }
      } else {
        alert(
          'media session is not supported in your browser. Please use Chrome'
        );
      }
    }
  }, [handleAudioChange, handleVideoChange, publishing]);

  //   useEffect(() => {
  //     console.log(streams);
  //     if (streams.length > 0) {
  //       setScreenSharing(true);
  //     } else setScreenSharing(false);
  //   }, [streams]);

  useEffect(() => {
    if (credentials && isPublishingScreen) {
      setStreamClasses(credentials.sessionId)
        .then((data) => {
          console.log(data);
        })
        .catch((e) => console.log(e));
    }
  }, [isPublishingScreen, credentials]);

  const handleScreen = async () => {
    if (!isPublishingScreen) {
      publishScreen({
        session: session.current,
        containerId: screenContainer.current.id,
      });
      try {
        if (document.pictureInPictureEnabled) {
          await document.querySelectorAll('video')[0].requestPictureInPicture();
        } else {
          console.log('Your browser cannot use picture-in-picture right now');
        }
        navigator.mediaSession.setMicrophoneActive(hasAudio);
        navigator.mediaSession.setCameraActive(hasVideo);
      } catch (e) {
        console.log(e);
      }
    } else {
      destroyPublisher();
    }
  };

  useEffect(() => {
    if (
      session.current &&
      connected &&
      !pubInitialised &&
      videoContainer.current
    ) {
      publish({
        session: session.current,
        containerId: videoContainer.current.id,
      });
      setIsPublishing(true);
    }
  }, [publish, session, connected, pubInitialised]);

  return (
    <>
      <div className="main">
        <div
          id="screen-container"
          //   className="screen"
          ref={screenContainer}
          className={isPublishingScreen ? 'screensharing' : 'hidden'}
        ></div>
        <div
          className={'videoSmall'}
          ref={videoContainer}
          id="video-container"
        ></div>
      </div>
      <ToolBar
        handleAudioChange={handleAudioChange}
        handleVideoChange={handleVideoChange}
        session={session.current}
        hasAudio={hasAudio}
        hasVideo={hasVideo}
        publishScreen={publishScreen}
        handleScreen={handleScreen}
        session={session.current}
      />
    </>
  );
}

export default Main;
