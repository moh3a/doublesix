import { useState } from "react";
import { mediaDevices, RTCView, MediaStream } from "react-native-webrtc";

import Text from "../shared/Text";
import Button from "../shared/Button";
import Colors from "../../constants/Colors";
import Icon from "../shared/Icon";
import View from "../shared/View";

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
    <View style={{ width: "100%", height: "100%" }}>
      {localStream && <RTCView streamURL={localStream.toURL()} />}

      <Text style={{ textAlign: "center" }}>Hi!!!</Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          bottom: 15,
          right: 0,
          left: 0,
        }}
      >
        <View style={{ marginHorizontal: 10 }}>
          <Button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Colors.green,
              width: 50,
              height: 50,
              borderRadius: 5,
              paddingHorizontal: 6,
              paddingVertical: 2,
            }}
            onPress={start}
          >
            <Icon color="white" name="phone" size={50} />
          </Button>
        </View>
        <View style={{ marginHorizontal: 10 }}>
          <Button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Colors.red,
              width: 50,
              height: 50,
              borderRadius: 5,
              paddingHorizontal: 6,
              paddingVertical: 2,
            }}
            onPress={stop}
          >
            <Icon color="white" name="ban" size={50} />
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Video;
