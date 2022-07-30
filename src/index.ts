import './style/app.scss';
const root = document.getElementById('root')! as HTMLDivElement;
const appSelectionContainer = document.getElementById(
    'app-selection-container'
)! as HTMLDivElement;
const selection = document.querySelectorAll(
    '._btn-selection'
)! as NodeListOf<HTMLButtonElement>;

const containerForErrorMessage: HTMLDivElement = document.createElement('div');

const errorContainer: HTMLElement[] = [];

interface MediaConstraints {
    video: boolean;
    audio: boolean;
}

let mediaConstraints: MediaConstraints = {
    video: false,
    audio: false,
};

let captureStream: MediaStream;
let mediaStream: MediaStream;
let recorder: MediaRecorder;

let video: HTMLVideoElement;

let chucks: Blob[] = [];

selection.forEach((item: HTMLButtonElement) => {
    switch (item.dataset.value) {
        case 'screen':
            item.onclick = (_) => _recordScreen('screen');
            break;

        case 'mute':
            item.onclick = (_) => _recordScreen('mute');
            break;
        case 'microphone':
            item.onclick = (_) => _recordScreen('microphone');
            break;

        case 'startRecoding':
            item.onclick = (_) => _recordScreen('startRecoding');
            break;

        default:
            break;
    }
});

const _recordScreen = (selected: string) => {
    if (selected === 'screen') {
        mediaConstraints = {
            ...mediaConstraints,
            video: false,
        };
    }
    if (selected === 'mute') {
        mediaConstraints = {
            ...mediaConstraints,
            audio: false,
        };
    }

    if (selected === 'microphone') {
        mediaConstraints = {
            ...mediaConstraints,
            audio: true,
        };
    }

    if (selected === 'startRecoding') {
        startRecording(mediaConstraints);
    }
};

const startRecording = async (mediaConstraints: {
    video: boolean;
    audio: boolean;
}) => {
    try {
        captureStream = await navigator.mediaDevices.getDisplayMedia(
            mediaConstraints
        );
        video = document.createElement('video');
        video.srcObject = captureStream;
        video.autoplay = true;
        video.controls = false;

        Object.assign(video.style, {
            width: '100%',
            height: '100%',
        });
        document.body.appendChild(video);
        startTheRecording();
    } catch (error) {
        console.error('Error', error);
    }
};

const startTheRecording = async () => {
    mediaStream = new MediaStream([...captureStream.getTracks()]);
    recorder = new MediaRecorder(mediaStream);
    recorder.ondataavailable = ondataavailable;
    recorder.start();
    // recorder.stop = onStopRecording;
};

const ondataavailable = (event: BlobEvent) => {
    chucks.push(event.data);
    onStopRecording();
    // document.body.appendChild(video);
};

const onStopRecording = () => {
    const blod = new Blob(chucks, { type: 'video/wav' });
    const url = URL.createObjectURL(blod);
    video.autoplay = false;
    video.controls = true;

    const stream = video.srcObject as MediaStream;
    stream.getTracks().forEach((track) => {
        track.stop();
    });
    video.srcObject = null;
    video.src = url;

    // video.autoplay = true;
    // video.controls = true;
    // Object.assign(video.style, {
    //     width: '100%',
    //     height: '100%',
    // });
    // video.src = url;
    // video.controls = true;
    // video.autoplay = true;

    // document.body.appendChild(video);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'video.webm';
    // a.click();
    // URL.revokeObjectURL(url);
    chucks = [];
};
