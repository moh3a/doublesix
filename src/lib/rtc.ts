/*
SOURCE: react-native-webrtc github repo
*/

import {
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  mediaDevices,
} from "react-native-webrtc";

/*
This will give us a media stream for the front facing camera and input from a microphone.
As you can see if we flip the isVoiceOnly boolean over to true then we'd be disabling the video track.

If you want to start the call as voice only then you can flip the boolean but the catch is that you can enable the video track while the call is in progress, no messing around creating and adding another media stream or starting a new call.

Don't forget, you will be prompted to accept permissions for the camera and microphone.
Usually it is better to request permissions at an earlier stage to improve the user experience.
*/
export const getStream = async () => {
  let mediaConstraints = {
    audio: true,
    video: {
      frameRate: 30,
      facingMode: "user",
    },
  };

  let localMediaStream;
  let remoteMediaStream;
  let isVoiceOnly = false;

  try {
    const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);

    if (isVoiceOnly) {
      let videoTrack = await mediaStream.getVideoTracks()[0];
      videoTrack.enabled = false;
    }

    localMediaStream = mediaStream;
  } catch (err) {
    console.log(err);
  }
};

/*
Now that we've got the media stream which consists of an audio and video track we can actually start getting the peer connection created and ready to connect. Once the media stream has been added to the peer then the negotiationneeded event will fire to indicate that you can now start creating an offer.

In some instances you might find that the negotiationneeded event can fire multiple times at random and as such if you decide to run the createOffer function within that event then you need to ensure that you don't allow running createOffer multiple times, otherwise the peer will most likely get stuck in a weird state.

The iceServers below include one of Googles public STUN servers, you should also provide your own TURN server alongside a STUN server to ensure that connections can actually be established between callers.
*/
interface CreatePeerParams {
  localMediaStream: MediaStream;
  remoteMediaStream: MediaStream;
}

export const createPeer = async ({
  localMediaStream,
  remoteMediaStream,
}: CreatePeerParams) => {
  let peerConstraints = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };

  let peerConnection = new RTCPeerConnection(peerConstraints);

  peerConnection.addEventListener("connectionstatechange", (event) => {
    switch (peerConnection.connectionState) {
      case "closed":
        // You can handle the call being disconnected here.

        break;
    }
  });

  peerConnection.addEventListener("icecandidate", (event: any) => {
    // When you find a null candidate then there are no more candidates.
    // Gathering of candidates has finished.
    if (!event.candidate) {
      return;
    }

    // Send the event.candidate onto the person you're calling.
    // Keeping to Trickle ICE Standards, you should send the candidates immediately.
  });

  peerConnection.addEventListener("icecandidateerror", (event) => {
    // You can ignore some candidate errors.
    // Connections can still be made even when errors occur.
  });

  peerConnection.addEventListener("iceconnectionstatechange", (event) => {
    switch (peerConnection.iceConnectionState) {
      case "connected":
      case "completed":
        // You can handle the call being connected here.
        // Like setting the video streams to visible.

        break;
    }
  });

  peerConnection.addEventListener("negotiationneeded", (event) => {
    // start the offer stages here.
    // Be careful as this event can be called multiple times.
  });

  peerConnection.addEventListener("signalingstatechange", (event) => {
    switch (peerConnection.signalingState) {
      case "closed":
        // handle the call being disconnected here.

        break;
    }
  });

  peerConnection.addEventListener("track", (event: any) => {
    // Grab the remote track from the connected participant.
    remoteMediaStream = remoteMediaStream || new MediaStream({});
    remoteMediaStream.addTrack(event.track);
  });

  // Add our stream to the peer connection.
  localMediaStream
    .getTracks()
    .forEach((track) => peerConnection.addTrack(track, localMediaStream));
};

// =============================================================================================================
/*
Now would be a good time to officially announce the incoming call to other call participant.
Using your signalling server you will need to trigger a call start event.

Wether you trigger the event via Notifications or Web Sockets, the purpose of the event is to ensure that the call participant runs the code above ^ they will then be prepared to start the handshake process.

We can't give any sample code for the signalling stages.
But do intend to provide an example app along with signalling app in the near future.
 */
// =============================================================================================================

/*
We've added the media stream to the peer connection and got most of the basic events hooked up.
So you can now start creating an offer which then needs sending send off to the other call participant.
 */
export const createOffer = async (peerConnection: RTCPeerConnection) => {
  let sessionConstraints = {
    mandatory: {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
      VoiceActivityDetection: true,
    },
  };
  try {
    const offerDescription = await peerConnection.createOffer(
      sessionConstraints
    );
    await peerConnection.setLocalDescription(offerDescription);
    // todo: Send the offerDescription to the other participant.
  } catch (err) {
    console.log(err);
  }
};

/*
As specified in the icecandidate event above, you should send candidates as soon as they are generated.
You can trigger the following handleRemoteCandidate function to handle the received candidates on both sides.

In some circumstances candidates can't be immediately processed.
An easy solution is to hold onto some of the candidates and process them immediately after.

We will process any leftover candidates in the next step.
*/
interface RTCIceCandidateI {
  candidate?: string;
  sdpMLineIndex?: null;
  sdpMid?: null;
}

interface HandleRemoteCandidateParams {
  iceCandidate: RTCIceCandidateI;
  peerConnection: RTCPeerConnection;
  remoteCandidates: RTCIceCandidate[];
}

export const handleRemoteCandidate = ({
  iceCandidate,
  peerConnection,
  remoteCandidates,
}: HandleRemoteCandidateParams) => {
  iceCandidate;
  let iceC: RTCIceCandidate = new RTCIceCandidate(iceCandidate);
  if (peerConnection.remoteDescription == null) {
    return remoteCandidates.push(iceC);
  }
  return peerConnection.addIceCandidate(iceCandidate);
};

interface ProcessCandidatesParams {
  peerConnection: RTCPeerConnection;
  remoteCandidates: RTCIceCandidate[];
}

export const processCandidates = ({
  peerConnection,
  remoteCandidates,
}: ProcessCandidatesParams) => {
  if (remoteCandidates.length < 1) {
    return;
  }
  remoteCandidates.map((candidate) =>
    peerConnection.addIceCandidate(candidate)
  );
  remoteCandidates = [];
};
