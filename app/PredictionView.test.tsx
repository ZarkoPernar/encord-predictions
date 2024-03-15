import { act, render } from "@testing-library/react";
import { PredictionView } from "./PredictionView";
import "@testing-library/jest-dom";
import { ImgHTMLAttributes } from "react";

let _onLoad: any;

jest.mock("./elements", () => {
  const originalModule = jest.requireActual("./elements");
  return {
    ...originalModule,
    Img: ({ onLoad, ...props }: ImgHTMLAttributes<HTMLImageElement>) => {
      _onLoad = onLoad;
      return <img {...props} />;
    },
  };
});

const defaultProps = {
  title: "Test Image",
  predictions: [
    {
      id: "1",
      label: "Apple",
      score: "98",
      bbox: { x1: 10, y1: 20, x2: 110, y2: 220 },
    },
    {
      id: "2",
      label: "Banana",
      score: "89",
      bbox: { x1: 60, y1: 80, x2: 160, y2: 280 },
    },
  ],
  dimensions: { width: 200, height: 300 },
};

test("renders PredictionView with correct image and predictions", async () => {
  const { getByAltText, queryByLabelText, getByLabelText } = render(
    <PredictionView
      title={defaultProps.title}
      predictions={defaultProps.predictions}
      dimensions={defaultProps.dimensions}
    />
  );

  const image = getByAltText(defaultProps.title);
  expect(image).toBeInTheDocument();

  // Initially, no predictions are rendered until the image is loaded and scale factor is set
  expect(queryByLabelText(/Apple/i)).not.toBeInTheDocument();

  // Simulate image load to trigger scale factor calculation and rendering of predictions
  act(() => {
    _onLoad({
      nativeEvent: { target: { offsetWidth: 400, offsetHeight: 600 } },
    });
  });

  const applePrediction = getByLabelText(/Apple 98%/i);
  const bananaPrediction = getByLabelText(/Banana 89%/i);

  expect(applePrediction).toBeInTheDocument();
  expect(bananaPrediction).toBeInTheDocument();
  // Verify scaled position and size of the first prediction
  expect(applePrediction).toHaveStyle("left: 20px; top: 40px;");
  expect(applePrediction.getAttribute("width")).toBe("200");
  expect(applePrediction.getAttribute("height")).toBe("400");
});
