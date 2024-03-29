import React, { useCallback, useRef, useState, useEffect } from 'react';
import OT from '@opentok/client';
// import OT from '../../public/lib/dev'

export function usePublisher() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [pubInitialised, setPubInitialised] = useState(false);
  const publisherRef = useRef();

  const streamCreatedListener = React.useCallback(({ stream }) => {
    console.log(stream);
    setIsPublishing(true);
  }, []);

  const streamDestroyedListener = useCallback(({ stream }) => {
    publisherRef.current = null;
    setPubInitialised(false);
    setIsPublishing(false);
  }, []);

  const initPublisher = useCallback(
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
        width: 250,
        height: 200,
        mirror: false,

        // publishAudio: false,
        style: {
          buttonDisplayMode: 'off',
          nameDisplayMode: 'on',
        },
        insertMode: 'append',
        // name: 'Javi',
        showControls: false,
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

  const publish = useCallback(
    ({ session, containerId, publisherOptions }) => {
      if (!publisherRef.current) {
        initPublisher(containerId, publisherOptions);
      }
      if (session && publisherRef.current && !isPublishing) {
        return new Promise((resolve, reject) => {
          session.publish(publisherRef.current, (err) => {
            if (err) {
              console.log('Publisher Error', err);
              setIsPublishing(false);
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
    [initPublisher, isPublishing]
  );

  const unpublish = useCallback(
    ({ session }) => {
      if (publisherRef.current && isPublishing) {
        session.unpublish(publisherRef.current);
        setIsPublishing(false);
        publisherRef.current = null;
      }
    },
    [isPublishing, publisherRef]
  );

  return {
    publisher: publisherRef.current,
    initPublisher,
    destroyPublisher,
    publish,
    pubInitialised,
    unpublish,
  };
}
