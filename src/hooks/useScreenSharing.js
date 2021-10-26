import React, { useCallback, useRef, useState, useEffect } from 'react';
// import OT from '@opentok/client';
// import OT from '../../public/lib/dev'
const OT = window.OT;
export function useScreenSharing() {
  const [isPublishingScreen, setisPublishingScreenScreen] = useState(false);
  const [pubScreenInitialised, setPubInitialised] = useState(false);
  const publisherRef = useRef();

  const streamCreatedListener = React.useCallback(({ stream }) => {
    console.log(stream);
    setisPublishingScreenScreen(true);
  }, []);

  const streamDestroyedListener = useCallback(({ stream }) => {
    publisherRef.current = null;
    setPubInitialised(false);
    console.log('stopped sharing screens');
    setisPublishingScreenScreen(false);
  }, []);

  const initPublisherScreen = useCallback(
    (containerId, publisherOptions) => {
      console.log('UsePublisher - initPublisher');
      if (publisherRef.current) {
        console.log('UsePublisher - Already initiated');
        return;
      }
      if (!containerId) {
        console.log('UsePublisher - Container not available');
      }
      const finalPublisherOptions = Object.assign({}, publisherOptions, {
        width: '100%',
        height: '100%',
        videoSource: 'screen',
        // publishAudio: false,
        // style: {
        //   buttonDisplayMode: 'off',
        //   nameDisplayMode: 'on',
        // },
        insertMode: 'append',

        // name: 'Javi',
        // showControls: false,
        // fitMode: 'contain',
      });
      console.log('usePublisher finalPublisherOptions', finalPublisherOptions);
      publisherRef.current = OT.initPublisher(
        containerId,
        finalPublisherOptions,
        (err) => {
          if (err) {
            console.log('[usePublisher]', err);
            publisherRef.current = null;
          }
          console.log('Publisher Created');
        }
      );

      setPubInitialised(true);

      publisherRef.current.on('streamCreated', streamCreatedListener);
      publisherRef.current.on('streamDestroyed', streamDestroyedListener);
    },
    [streamCreatedListener, streamDestroyedListener]
  );

  const destroyPublisher = useCallback(() => {
    if (!publisherRef.current) {
      return;
    }
    publisherRef.current.on('destroyed', () => {
      console.log('publisherRef.current Destroyed');
    });
    publisherRef.current.destroy();
  }, []);

  const publishScreen = useCallback(
    ({ session, containerId, publisherOptions }) => {
      if (!publisherRef.current) {
        initPublisherScreen(containerId, publisherOptions);
      }
      if (session && publisherRef.current && !isPublishingScreen) {
        return new Promise((resolve, reject) => {
          session.publish(publisherRef.current, (err) => {
            if (err) {
              console.log('Publisher Error', err);
              setisPublishingScreenScreen(false);
              reject(err);
            }
            console.log('Published');
            resolve(publisherRef.current);
          });
        });
      } else if (publisherRef.current) {
        // nothing to do
      }
    },
    [initPublisherScreen, isPublishingScreen]
  );

  const unpublish = useCallback(
    ({ session }) => {
      if (publisherRef.current && isPublishingScreen) {
        session.unpublish(publisherRef.current);
        setisPublishingScreenScreen(false);
        publisherRef.current = null;
      }
    },
    [isPublishingScreen, publisherRef]
  );

  return {
    publisher: publisherRef.current,
    initPublisherScreen,
    isPublishingScreen,
    destroyPublisher,
    publishScreen,
    pubScreenInitialised,
    unpublish,
  };
}
