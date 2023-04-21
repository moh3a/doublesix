import { useRef, useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  SafeAreaView,
  TextInput,
  Button,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  MediaStream,
  RTCPeerConnection,
  mediaDevices,
  RTCView,
} from "react-native-webrtc";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../config/firebase.config";
import View from "../components/shared/View";

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function CallScreen() {
  const insets = useSafeAreaInsets();

  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [webcamStarted, setWebcamStarted] = useState(false);
  const [channelId, setChannelId] = useState<string | null>(null);
  const pc = useRef<RTCPeerConnection>();

  const channelDoc = doc(db, "channels", channelId);
  const offerCandidates = collection(
    db,
    "channels",
    channelId,
    "offerCandidates"
  );
  const answerCandidates = collection(
    db,
    "channels",
    channelId,
    "answerCandidates"
  );

  const startWebcam = async () => {
    pc.current = new RTCPeerConnection(servers);
    const local = await mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    // pc.current.addStream(local); // todo: check this in case of error

    const remote = new MediaStream({});

    // Push tracks from local stream to peer connection
    local.getTracks().forEach((track) => {
      pc.current.addTrack(track, local);
    });

    // Pull tracks from peer connection, add to remote video stream
    pc.current.ontrack = (event: any) => {
      event.streams[0].getTracks().forEach((track) => {
        remote.addTrack(track);
      });
    };

    pc.current.onaddstream = (event: any) => {
      setRemoteStream(event.stream);
    };

    setLocalStream(local);
    setRemoteStream(remote);
    setWebcamStarted(true);
  };

  const startCall = async () => {
    setChannelId(channelDoc.id);

    pc.current.onicecandidate = async (event: any) => {
      if (event.candidate) {
        await addDoc(offerCandidates, event.candidate.toJSON());
      }
    };

    //create offer
    const sessionConstraints = {
      mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true,
        VoiceActivityDetection: true,
      },
    };
    const offerDescription = await pc.current.createOffer(sessionConstraints);
    await pc.current.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await setDoc(channelDoc, { offer });

    // Listen for remote answer
    onSnapshot(channelDoc, (snapshot) => {
      const data = snapshot.data();
      if (!pc.current.remoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.current.setRemoteDescription(answerDescription);
      }
    });

    // When answered, add candidate to peer connection
    onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          pc.current.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };

  const joinCall = async () => {
    pc.current.onicecandidate = async (event: any) => {
      if (event.candidate) {
        await addDoc(answerCandidates, event.candidate.toJSON());
      }
    };

    const channelDocument = await getDoc(channelDoc);
    const channelData = channelDocument.data();

    const offerDescription = channelData.offer;

    await pc.current.setRemoteDescription(
      new RTCSessionDescription(offerDescription)
    );

    const answerDescription = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await updateDoc(channelDoc, { answer });

    onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          pc.current.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };

  const endCall = async () => {
    pc.current.close();
    const offerCandidatesDocs = await getDocs(offerCandidates);
    for await (const document of offerCandidatesDocs.docs) {
      await deleteDoc(doc(offerCandidates, document.id));
    }
    const answerCandidatesDocs = await getDocs(answerCandidates);
    for await (const document of answerCandidatesDocs.docs) {
      await deleteDoc(doc(answerCandidates, document.id));
    }
    await deleteDoc(channelDoc);
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        height: "100%",
        display: "flex",
        flex: 1,
        alignItems: "center",
      }}
    >
      <KeyboardAvoidingView style={styles.body} behavior="position">
        <SafeAreaView>
          {localStream && (
            <RTCView
              streamURL={localStream?.toURL()}
              style={styles.stream}
              objectFit="cover"
              mirror
            />
          )}

          {remoteStream && (
            <RTCView
              streamURL={remoteStream?.toURL()}
              style={styles.stream}
              objectFit="cover"
              mirror
            />
          )}
          <View style={styles.buttons}>
            {!webcamStarted && (
              <Button title="Start webcam" onPress={startWebcam} />
            )}
            {webcamStarted && <Button title="Start call" onPress={startCall} />}
            {webcamStarted && (
              <View style={{ flexDirection: "row" }}>
                <Button title="Join call" onPress={joinCall} />
                <TextInput
                  value={channelId}
                  placeholder="callId"
                  style={{ borderWidth: 1, padding: 5 }}
                  onChangeText={(newText) => setChannelId(newText)}
                />
              </View>
            )}
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  stream: {
    flex: 2,
    width: 200,
    height: 200,
  },
  buttons: {
    alignItems: "flex-start",
    flexDirection: "column",
  },
});
