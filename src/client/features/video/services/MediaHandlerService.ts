/* eslint-disable */
type MediaStreamConfig = { video: boolean; audio: boolean };

type CameraConfig = {
  cameraId: string;
  minWidth: number;
  minHeight: number;
};

type MediaType = "audiooutput" | "audiooutput" | "audioinput" | "videoinput";

const config = { video: true, audio: true };

class MediaHandlerService {
  video: boolean;
  audio: boolean;

  constructor({ video, audio }: MediaStreamConfig) {
    this.video = video;
    this.audio = audio;
  }

  openMediaDevices = async (constraints: MediaStreamConfig) => {
    return await navigator.mediaDevices.getUserMedia(constraints);
  };

  getConnectedDevices = async (type: MediaType) => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === type);
  };

  getMediaStream = async () => {
    try {
      const stream = await this.openMediaDevices({
        video: this.video,
        audio: this.audio,
      });
      console.log("Got MediaStream:", stream);
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  // Open camera with at least minWidth and minHeight capabilities
  openCamera = async ({ cameraId, minWidth, minHeight }: CameraConfig) => {
    const constraints = {
      audio: { echoCancellation: true },
      video: {
        deviceId: cameraId,
        width: { min: minWidth },
        height: { min: minHeight },
      },
    };

    return await navigator.mediaDevices.getUserMedia(constraints);
  };

  getStream = async (cb: (arg: MediaStream) => void) => {
    const cameras = await this.getConnectedDevices("videoinput");
    if (cameras && cameras.length > 0) {
      // Open first available video camera with a resolution of 1280x720 pixels
      const stream = await this.openCamera({
        cameraId: cameras[0].deviceId,
        minWidth: 400,
        minHeight: 720,
      });
      cb(stream);
    }
  };
}