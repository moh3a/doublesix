import { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { mediaDevices, RTCView, MediaStream } from "react-native-webrtc";

const Video = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const start = async () => {
    if (!localStream) {
      let mediaConstraints = {
        audio: true,
        video: {
          frameRate: 30,
          facingMode: "user",
        },
      };
      let isVoiceOnly = false;
      try {
        const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);
        if (isVoiceOnly) {
          let videoTrack = mediaStream.getVideoTracks()[0];
          videoTrack.enabled = false;
        }
        setLocalStream(mediaStream);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stop = () => {
    if (localStream) {
      localStream.release();
      setLocalStream(null);
    }
  };

  return (
    <View>
      {localStream && (
        <RTCView streamURL={localStream.toURL()} style={styles.stream} />
      )}
      <View style={styles.footer}>
        <Button title="Start" onPress={start} />
        <Button title="Stop" onPress={stop} />
      </View>
    </View>
  );
};

export default Video;

const styles = StyleSheet.create({
  stream: {
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
