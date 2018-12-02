import * as React from "react";
import { withContentRect, MeasuredComponentProps } from "react-measure";
import $ from "./DurationBar.module.scss";

type ValueTypes = "dot" | "end" | "start";

interface Props extends MeasuredComponentProps {
    startOffset?: number;
    endOffset?: number;
    progress: number;
    max: number;
    onDraggingStart?: () => void;
    onDraggingEnd?: () => void;
    onChange(valueName: ValueTypes, value: number): void;
}

interface State {
    isDragging: ValueTypes | null;
}

class DurationBar extends React.Component<Props, State> {
    state: State = {
        isDragging: null,
    };

    initialX: number = 0;
    currentX: number = 0;

    componentDidMount() {
        document.body.addEventListener("mousemove", this.onMouseMove);
        document.body.addEventListener("mouseup", this.onMouseUp);
    }

    handleDotMouseDown = (valueName: ValueTypes): React.MouseEventHandler<HTMLInputElement> => (ev) => {
        if (this.props.onDraggingStart) {
            this.props.onDraggingStart();
        }
        const boundsRect = this.props.contentRect.bounds;
        if (boundsRect !== undefined) {
            const initialX = ev.clientX - boundsRect.left;
            this.currentX = initialX;
            this.initialX = initialX;
            this.setState({ isDragging: valueName });
        }
    }

    onMouseMove = (ev: MouseEvent) => {
        const boundsRect = this.props.contentRect.bounds;
        if (boundsRect !== undefined && this.state.isDragging) {
            this.currentX = ev.clientX - boundsRect.left;
            const multiplier = Math.max(
                Math.min(this.currentX / boundsRect.width, 1),
                0,
            );
            let value = multiplier * this.props.max;
            if (this.state.isDragging === "end") {
                value = this.props.max - value;
            }
            this.props.onChange(this.state.isDragging, value);
        }
    }

    onMouseUp = (ev: MouseEvent) => {
        if (this.props.onDraggingEnd) {
            this.props.onDraggingEnd();
        }
        const boundsRect = this.props.contentRect.bounds;
        if (this.state.isDragging && boundsRect !== undefined) {
            this.setState({ isDragging: null });
        }
    }

    calculateOffsetLeft = (value?: number) => {
        if (value !== undefined) {
            const { max, contentRect } = this.props;
            const boundsRect = contentRect.bounds;
            if (boundsRect) {
                const containerWidth = boundsRect.width;
                const leftOffset = Math.max(
                    Math.min(((value / max) * containerWidth), containerWidth),
                    0,
                );

                return leftOffset;
            }
            return 0;
        }
        return 0;
    }

    render() {
        const { startOffset, endOffset, progress, max } = this.props;
        const relativeStartOffset = this.calculateOffsetLeft(startOffset);
        const relativeEndOffset = this.calculateOffsetLeft(max - (endOffset || 0));
        const relativeProgressOffset = this.calculateOffsetLeft(progress);
        const barFillStyles: React.CSSProperties = {
            width: `${relativeProgressOffset}px`,
        };
        const barDotStyles = (offset: number | undefined): React.CSSProperties => ({
            left: `${offset}px`,
        });
        return (
            <div className={$.container}>
                <div
                    ref={this.props.measureRef}
                    className={$.bar}
                >
                    <div style={barFillStyles} className={$.barFill} />
                    <div
                        style={barDotStyles(relativeProgressOffset)}
                        className={$.barDot}
                        onMouseDown={this.handleDotMouseDown("dot")}
                    />
                    <div
                        style={barDotStyles(relativeStartOffset)}
                        className={$.barTrim}
                        onMouseDown={this.handleDotMouseDown("start")}
                    />
                    <div
                        style={barDotStyles(relativeEndOffset)}
                        className={$.barTrim}
                        onMouseDown={this.handleDotMouseDown("end")}
                    />
                </div>
            </div>
        );
    }
}

export default withContentRect("bounds")(DurationBar);
