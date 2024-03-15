import { render, fireEvent, screen } from "@testing-library/react";
import { InputHTMLAttributes } from "react";
import "@testing-library/jest-dom";
import Home from "./page";

jest.mock("./ImageSelector", () => ({
  ImageSelector(props: InputHTMLAttributes<HTMLInputElement>) {
    return <input type="file" aria-label="select images" {...props} />;
  },
}));

jest.mock("./PredictionForm", () => ({
  PredictionForm({ onSuccess }: { onSuccess: (data: any) => void }) {
    return (
      <button
        onClick={() => {
          onSuccess({
            title: "chuck prediction",
            description: "lorem ipsum",
            predictions: [
              {
                bbox: { x1: 0, y1: 0, x2: 100, y2: 100 },
                label: "first",
                score: 100,
              },
            ],
          });
        }}
      >
        Save changes
      </button>
    );
  },
}));

jest.mock("./utils", () => ({
  getImageDimensions: async () => ({ width: 100, height: 100 }),
  formatFileSize: () => "100kb",
}));

test("renders component correctly", () => {
  render(<Home />);
  expect(
    screen.getByRole("heading", {
      name: /Encord Image Predictions/i,
    })
  ).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: /Images/i })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: /Predictions/i })).toBeInTheDocument();
});

test("switches tabs correctly", async () => {
  const { findByText, getByText, queryByText } = render(<Home />);

  expect(getByText(/A list of your uploaded images./i)).toBeInTheDocument();

  fireEvent.mouseDown(screen.getByRole("tab", { name: /Predictions/i }));

  await findByText(/A list of predictions on your images/i);

  expect(queryByText(/A list of your uploaded images./i)).toBeNull();
});

test("updates image list after uploading an image", async () => {
  const { getByLabelText, findByText } = render(<Home />);
  const file = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" });
  const input = getByLabelText(/select images/i);
  fireEvent.change(input, { target: { files: [file] } });

  expect(await findByText(/chucknorris.png/i)).toBeInTheDocument();
});

test("opens prediction dialog and displays form", async () => {
  const { findByText, getByText, getByLabelText } = render(<Home />);

  const file = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" });
  const input = getByLabelText(/select images/i);
  fireEvent.change(input, { target: { files: [file] } });

  expect(await findByText(/chucknorris.png/i)).toBeInTheDocument();

  fireEvent.click(getByText("PREDICT"));

  expect(await findByText(/Create Predictions/i)).toBeInTheDocument();
});

test("calls predict endpoint and displays the prediction", async () => {
  const { findByText, getByText, getByLabelText, queryByText } = render(
    <Home />
  );

  const file = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" });
  const input = getByLabelText(/select images/i);
  fireEvent.change(input, { target: { files: [file] } });

  expect(await findByText(/chucknorris.png/i)).toBeInTheDocument();

  fireEvent.click(getByText("PREDICT"));

  expect(await findByText(/Create Predictions/i)).toBeInTheDocument();

  fireEvent.click(getByText("Save changes"));

  expect(
    await findByText(/A list of predictions on your images./i)
  ).toBeInTheDocument();

  expect(await findByText(/chuck prediction/i)).toBeInTheDocument();
});
