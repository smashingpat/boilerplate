import * as React from "react";
import { hot } from "react-hot-loader";
import "./styles.scss";
import DurationBar from "./DurationBar";

interface Props {}

interface State {
    userInputId: number;
    videoDuration: number;
    currentTime: number;
    offsetStart: number;
    offsetEnd: number;
}

const createUserId = () => Math.ceil(Math.random() * 1e6);

const standarizeTime = (time: number) => Math.ceil(time * 1000);

class App extends React.Component<Props, State> {
    state = {
        userInputId: createUserId(),
        videoDuration: 0,
        currentTime: 0,
        offsetStart: 1,
        offsetEnd: 1,
    };
    wasPlaying: boolean = false;
    videoRef = React.createRef<HTMLVideoElement>();
    animationFrame: number | null = null;
    mounted: boolean = false;

    componentDidMount() {
        this.mounted = true;
        const video = this.videoRef.current;
        if (video) {
            const checkTime = () => {
                const { offsetEnd, offsetStart } = this.state;
                if (standarizeTime(video.currentTime) < standarizeTime(offsetStart)) {
                    video.currentTime = offsetStart;
                } else if (standarizeTime(video.currentTime) > standarizeTime(video.duration - offsetEnd)) {
                    if (video.paused === false) {
                        video.pause();
                    } else {
                        video.currentTime = (video.duration - offsetEnd);
                    }
                }
                if (this.mounted) {
                    this.animationFrame = requestAnimationFrame(checkTime);
                }
            };
            checkTime();

            video.addEventListener("timeupdate", () => {
                this.setState({
                    currentTime: video.currentTime,
                });
            });

            video.addEventListener("loadedmetadata", () => {
                this.setState({
                    videoDuration: video.duration,
                });
            });
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        if (this.animationFrame !== null) {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        const videoEl = this.videoRef.current;
        if (prevState.userInputId !== this.state.userInputId) {
            if (videoEl && prevState.currentTime !== this.state.currentTime) {
                videoEl.currentTime = this.state.currentTime;
            }
        }
    }

    onDraggingStart = () => {
        const videoEl = this.videoRef.current;
        if (videoEl) {
            this.wasPlaying = !videoEl.paused;
            if (this.wasPlaying) {
                videoEl.pause();
            }
        }
    }

    onDraggingEnd = () => {
        const videoEl = this.videoRef.current;
        if (videoEl && this.wasPlaying) {
            videoEl.play();
        }
    }

    onDurationChange = (name: "dot" | "start" | "end", value: number) => {
        const videoEl = this.videoRef.current;
        if (name === "dot") {
            this.setState({ userInputId: createUserId(), currentTime: value });
        }
        if (name === "start") {
            this.setState({ userInputId: createUserId(), offsetStart: value });
            if (videoEl) {
                videoEl.currentTime = value;
            }
        }
        if (name === "end") {
            this.setState({ userInputId: createUserId(), offsetEnd: value });
            if (videoEl) {
                videoEl.currentTime = this.state.videoDuration - value;
            }
        }
    }

    calculateProgress = () => {
        const { currentTime, videoDuration, offsetStart, offsetEnd } = this.state;

        return (
            (currentTime - offsetStart) /
            (videoDuration - (offsetStart + offsetEnd)) *
            100
        );
    }

    handlePlay = () => {
        const videoEl = this.videoRef.current;
        if (videoEl) {
            if (videoEl.paused) {
                const { offsetStart, offsetEnd, currentTime, videoDuration } = this.state;
                if (standarizeTime(currentTime) >= standarizeTime(videoDuration - offsetEnd)) {
                    videoEl.currentTime = offsetStart;
                }
                videoEl.play();
            } else {
                videoEl.pause();
            }
        }
    }

    render() {
        const { currentTime, videoDuration } = this.state;
        return (
            <>
                <button onClick={this.handlePlay}>play</button>
                <div className="video">
                    <video
                        // autoPlay={true}
                        ref={this.videoRef}
                        src="/two.mp4"
                    />
                </div>
                <DurationBar
                    progress={currentTime}
                    max={videoDuration}
                    onDraggingStart={this.onDraggingStart}
                    onDraggingEnd={this.onDraggingEnd}
                    onChange={this.onDurationChange}
                    startOffset={this.state.offsetStart}
                    endOffset={this.state.offsetEnd}
                />
            </>
        );
    }
}

export default hot(module)(App);
