/* eslint-disable */
interface IMediaHandlerService {
  media: {
    video: boolean;
    audio: boolean;
  };
}

type MediaStreamConfig = {
  video: boolean;
  audio: boolean;
};

type CameraConfig = {
  cameraId: string;
  minWidth: number;
  minHeight: number;
};

type MediaType = "audiooutput" | "audiooutput" | "audioinput" | "videoinput";

const config = { video: true, audio: true };

export class MediaHandlerService {
  video: boolean;
  audio: boolean;
  remoteContainer: HTMLVideoElement | null;
  localContainer: HTMLVideoElement | null;

  constructor({ media: { video, audio } }: IMediaHandlerService) {
    this.video = video;
    this.audio = audio;
    this.remoteContainer = null;
    this.localContainer = null;
  }

  get outputs() {
    return {
      remoteContainer: this.remoteContainer,
      localContainer: this.localContainer,
    };
  }

  initOutput({ local, remote }: any) {
    this.remoteContainer = remote;
    this.localContainer = local;
  }

  openMediaDevices = async (constraints: MediaStreamConfig) => {
    try {
      const x = await navigator.mediaDevices.getUserMedia(constraints);
      return x;
    } catch (e: any) {
      throw new Error("Media stream get error, check permissions", e);
    }
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
      return stream;
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  // Open camera with at least minWidth and minHeight capabilities
  openCamera = async ({ cameraId, minWidth, minHeight }: CameraConfig) => {
    const constraints = {
      audio: { echoCancellation: true },
      video: {
        mandatory: {
          maxWidth: "800",
          maxHeight: "600",
        },
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
