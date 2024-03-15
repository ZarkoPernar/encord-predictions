"use client";
import { Img } from "./elements";
import { PredictionBox } from "./types";
import { SyntheticEvent, useState } from "react";

export function PredictionView({
  title,
  predictions,
  dimensions,
}: {
  title: string;
  predictions: PredictionBox[];
  dimensions: { width: number; height: number };
}) {
  const [scaleFactor, setScaleFactor] = useState<{
    width: number;
    height: number;
  }>();

  function updateScaleFactor({
    width,
    height,
  }: {
    width: number;
    height: number;
  }) {
    setScaleFactor({
      width: width / dimensions.width,
      height: height / dimensions.height,
    });
  }

  console.log(scaleFactor);

  const handleSize = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    if (!e.nativeEvent.target) return;
    const imgEl = e.nativeEvent.target as HTMLImageElement;
    updateScaleFactor({
      width: imgEl.offsetWidth,
      height: imgEl.offsetHeight,
    });
  };

  return (
    <div className="relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <Img
        className="block w-full h-full object-contain object-center"
        onLoad={handleSize}
        onResize={handleSize}
        alt={title}
        src="/orange.jpg"
      />

      {scaleFactor &&
        predictions.map((prediction, index) => {
          const scaledX = prediction.bbox.x1 * scaleFactor.width;
          const scaledY = prediction.bbox.y1 * scaleFactor.height;
          const scaledWidth =
            (prediction.bbox.x2 - prediction.bbox.x1) * scaleFactor.width;
          const scaledHeight =
            (prediction.bbox.y2 - prediction.bbox.y1) * scaleFactor.height;
          return (
            <svg
              aria-label={prediction.label + " " + prediction.score + "%"}
              key={index}
              style={{
                position: "absolute",
                left: `${scaledX}px`,
                top: `${scaledY}px`,
              }}
              width={scaledWidth}
              height={scaledHeight}
            >
              <rect
                width="100%"
                height="100%"
                fill="rgba(75, 0, 130, 0.15)"
                stroke="indigo"
                strokeWidth={2}
              />
              <text
                x={scaledWidth - 4}
                y={scaledHeight - 4}
                textAnchor="end"
                dominantBaseline="alphabetic"
                fill="indigo"
                fontSize={12}
              >
                {prediction.label} {prediction.score}%
              </text>
            </svg>
          );
        })}
    </div>
  );
}
