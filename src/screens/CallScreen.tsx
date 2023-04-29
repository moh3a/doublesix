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
  arrayUnion,
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

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const [webcamStarted, setWebcamStarted] = useState(false);
  const [channelId, setChannelId] = useState<string>(
    String(Math.round(Math.random() * 1000000))
  );

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

  const createPeerConnection = async (candidateType: "answer" | "offer") => {
    pc.current = new RTCPeerConnection(servers);

    // Push tracks from local stream to peer connection
    localStream.getTracks().forEach((track) => {
      pc.current?.addTrack(track, localStream);
    });

    // Pull tracks from peer connection, add to remote video stream
    pc.current.ontrack = (event: any) => {
      const remote = new MediaStream({});
      event.streams[0].getTracks().forEach((track) => {
        remote.addTrack(track);
      });
      setRemoteStream(remote);
    };

    pc.current.onicecandidate = async (event: any) => {
      if (event.candidate) {
        try {
          await addDoc(
            candidateType === "answer" ? answerCandidates : offerCandidates,
            event.candidate.toJSON()
          );
        } catch (error) {
          console.log(error);
        }
      }
    };
  };

  const startWebcam = async () => {
    const local = await mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setLocalStream(local);
    setWebcamStarted(true);
  };

  const startCall = async () => {
    await createPeerConnection("offer");

    if (pc.current) {
      //create offer
      const offerDescription = await pc.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pc.current.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      try {
        await setDoc(channelDoc, { offer });
      } catch (error) {
        console.log(error);
      }

      // Listen for remote answer
      onSnapshot(channelDoc, (snapshot) => {
        const data = snapshot.data();
        if (data && data.answers) {
          pc.current?.setRemoteDescription(
            new RTCSessionDescription(data.answers[data.answers.length - 1])
          );
        }
      });

      // When answered, add candidate to peer connection
      onSnapshot(answerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            pc.current?.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
    }
  };

  const joinCall = async () => {
    await createPeerConnection("answer");

    if (pc.current) {
      const channelDocument = await getDoc(channelDoc);
      const channelData = channelDocument.data();

      const offerDescription = channelData?.offer;

      await pc.current.setRemoteDescription(
        new RTCSessionDescription(offerDescription)
      );

      const answerDescription = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };

      await updateDoc(channelDoc, { answers: arrayUnion(answer) });

      onSnapshot(offerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            pc.current?.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
    }
  };

  const endCall = async () => {
    localStream?.getTracks().forEach((track) => localStream.removeTrack(track));
    setLocalStream(null);
    if (pc.current) {
      pc.current.close();
      pc.current = undefined;
    }
    // const offerCandidatesDocs = await getDocs(offerCandidates);
    // for await (const document of offerCandidatesDocs.docs) {
    //   await deleteDoc(doc(offerCandidates, document.id));
    // }
    // const answerCandidatesDocs = await getDocs(answerCandidates);
    // for await (const document of answerCandidatesDocs.docs) {
    //   await deleteDoc(doc(answerCandidates, document.id));
    // }
    // await deleteDoc(channelDoc);
    setWebcamStarted(false);
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
          <View
            style={{ display: "flex", flexDirection: "row", height: "50%" }}
          >
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
          </View>
          <View style={styles.buttons}>
            {!webcamStarted && (
              <Button title="Start webcam" onPress={startWebcam} />
            )}
            {webcamStarted && <Button title="Start call" onPress={startCall} />}
            {webcamStarted && <Button title="End call" onPress={endCall} />}
            {webcamStarted && (
              <View style={{ flexDirection: "row" }}>
                <Button title="Join call" onPress={joinCall} />
                <TextInput
                  value={channelId}
                  placeholder="callId"
                  style={{ borderWidth: 0.5, padding: 5, margin: 5 }}
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
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
});
