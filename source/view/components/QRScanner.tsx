import * as React from 'react';
import jsqr from 'jsqr';
import './QRScanner.css';

type Props = {}

function scanVideo(videoEl: HTMLVideoElement) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    let timeoutId: null | number = null;
    let scanRunning = false;

    function abortScan() {
        scanRunning = false;
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    }

    function scanFrame(videoWidth: number, videoHeight: number) {
        context.drawImage(videoEl, 0, 0);
        const imageData = context.getImageData(0, 0, videoWidth, videoHeight);
        const code = jsqr(imageData.data, videoWidth, videoHeight);

        return code ? code.data : null;
    }

    function startScan() {
        scanRunning = true;
        const { videoWidth, videoHeight } = videoEl;
        canvas.width = videoWidth;
        canvas.height = videoHeight;

        async function queueScan() {
            if (scanRunning) {
                const scan = scanFrame(videoWidth, videoHeight);
                if (scan !== null) {
                    return scan;
                }
                await new Promise(r => setTimeout(r, 500));
                return queueScan();
            }
            return null;
        }

        return queueScan();
    }

    return {
        startScan,
        abortScan,
    }
}

const QRScanner: React.FunctionComponent<Props> = (props) => {
    const [qrData, setQrData] = React.useState<null | string>(null);
    const [streaming, setStreaming] = React.useState(false);
    const videoRef = React.useRef<HTMLVideoElement | null>(null);

    React.useEffect(() => {
        const videoEl = videoRef.current;
        if (videoEl) {
            navigator.getUserMedia(
                {
                    audio:false,
                    video: {
                        facingMode: 'environment',
                    },
                },
                (stream) => {
                    videoEl.srcObject = stream;
                    videoEl.addEventListener('loadeddata', () => setStreaming(true))
                    videoEl.play();
                },
                (err) => console.error(err),
            );
        }
    }, []);

    React.useEffect(() => {
        const videoEl = videoRef.current;
        if (videoEl && streaming && qrData === null) {
            const { startScan, abortScan } = scanVideo(videoEl);
            startScan().then((data) => setQrData(data));
            return abortScan;
        }
    }, [streaming, qrData]);

    return (
        <>
            <div className="video-container">
                <video ref={videoRef} />
            </div>
            <h1>qr data: <pre>{qrData}</pre></h1>
            <button onClick={() => setQrData(null)}>clear data</button>
        </>
    );
}
export default QRScanner