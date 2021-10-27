const OpenTok = require('opentok');
const apiKey = process.env.VIDEO_API_API_KEY;
const apiSecret = process.env.VIDEO_API_API_SECRET;
if (!apiKey || !apiSecret) {
  throw new Error(
    'Missing config values for env params OT_API_KEY and OT_API_SECRET'
  );
}
let sessionId;

const opentok = new OpenTok(apiKey, apiSecret);

const createSessionandToken = () => {
  return new Promise((resolve, reject) => {
    opentok.createSession({ mediaMode: 'routed' }, function (error, session) {
      if (error) {
        reject(error);
      } else {
        sessionId = session.sessionId;
        const token = opentok.generateToken(sessionId);
        resolve({ sessionId: sessionId, token: token });
        //console.log("Session ID: " + sessionId);
      }
    });
  });
};

const createArchive = (session) => {
  console.log('Creating archive');
  return new Promise((resolve, reject) => {
    opentok.startArchive(
      session,
      {
        layout: {
          type: 'custom',
          stylesheet:
            'stream.screensharing {position: absolute; left: 0; top:0;  height:100%; width:100%; z-index:100;} stream.videoSmall { position: absolute; right: 5%; bottom: 10%; width: 20%; height: 20%; z-index: 200}',
        },
      },

      function (error, archive) {
        if (error) {
          reject(error);
          console.log(error);
        } else {
          resolve(archive);
        }
      }
    );
  });
};

const stopArchive = (archive) => {
  return new Promise((resolve, reject) => {
    opentok.stopArchive(archive, function (error, session) {
      if (error) {
        reject(error);
      } else {
        resolve(archive);
      }
    });
  });
};

//tODO
const setLayoutClasses = async (sessionId) => {
  console.log('Setting layoutclasses');
  const emptyStreamsArray = [];
  try {
    const resp = await listStreams(sessionId);
    resp.map((e) => {
      if (e.videoType === 'camera') {
        emptyStreamsArray.push({
          id: e.id,
          layoutClassList: ['videoSmall'],
        });
      } else {
        emptyStreamsArray.push({
          id: e.id,
          layoutClassList: ['screensharing'],
        });
      }
    });

    return new Promise((res, rej) => {
      opentok.setStreamClassLists(
        sessionId,
        emptyStreamsArray,
        (err, response) => {
          if (err) rej(err);
          else res(response);
          return response;
        }
      );
    });
  } catch (e) {
    console.log('Error setting classes for streams' + e);
  }
};

const listStreams = (sessionId) => {
  return new Promise((res, rej) => {
    opentok.listStreams(sessionId, function (err, resp) {
      if (err) {
        console.log('error listing streams' + err);
        rej(err);
      }
      res(resp);
    });
  });
};

const generateToken = (sessionId) => {
  const token = opentok.generateToken(sessionId);
  return { token: token, apiKey: apiKey };
};

const initiateArchiving = async (sessionId) => {
  const archive = await createArchive(sessionId);
  return archive;
};

const stopArchiving = async (archiveId) => {
  console.log(archiveId);
  const response = await stopArchive(archiveId);
  return response;
};

const getCredentials = async (session = null) => {
  const data = await createSessionandToken(session);
  sessionId = data.sessionId;
  const token = data.token;
  return { sessionId: sessionId, token: token, apiKey: apiKey };
};
const listArchives = async (sessionId) => {
  return new Promise((resolve, reject) => {
    const options = { sessionId };
    opentok.listArchives(options, (error, archives) => {
      if (error) {
        reject(error);
      } else {
        resolve(archives);
      }
    });
  });
};

module.exports = {
  getCredentials,
  generateToken,
  initiateArchiving,
  stopArchiving,
  listArchives,
  setLayoutClasses,
};
