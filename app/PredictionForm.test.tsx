import fetchMock from "jest-fetch-mock";
import { render, fireEvent, waitFor, act } from "@testing-library/react";
import { PredictionForm } from "./PredictionForm";
import { toast } from "sonner";
import { FormHTMLAttributes } from "react";
import { Toaster } from "@/components/ui/toaster";

let _action: any;

jest.mock("./elements", () => ({
  ...jest.requireActual("./elements"),
  Form: ({ action, ...props }: FormHTMLAttributes<HTMLFormElement>) => {
    _action = action;
    // @ts-ignore
    return <div {...props} />;
  },
}));

jest.mock("sonner", () => ({
  toast: jest.fn(),
}));

fetchMock.enableMocks();

const mockOnSuccess = jest.fn();

const mockResponseData = {
  predictions: [
    {
      label: "test",
      score: "0.9",
      bbox: { x1: 1, y1: 1, x2: 100, y2: 100 },
    },
  ],
};

beforeEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
});

test("submits form and calls onSuccess with correct data", async () => {
  fetchMock.mockResponseOnce(JSON.stringify(mockResponseData));

  const { getByLabelText, getByText } = render(
    <>
      <PredictionForm onSuccess={mockOnSuccess} />
      <Toaster />
    </>
  );

  fireEvent.change(getByLabelText(/Title/i), {
    target: { value: "Test Title" },
  });
  fireEvent.change(getByLabelText(/Description/i), {
    target: { value: "Test Description" },
  });
  fireEvent.click(getByText(/Save changes/i));

  const form = new Map();
  form.set("title", "Test Title");
  form.set("description", "Test Description");
  act(() => {
    _action(form);
  });

  await waitFor(() =>
    expect(mockOnSuccess).toHaveBeenCalledWith({
      title: "Test Title",
      description: "Test Description",
      predictions: mockResponseData.predictions,
    })
  );

  expect(toast).toHaveBeenCalledWith("Test Title prediction created");
});

test("shows error toast when the API call fails", async () => {
  fetchMock.mockReject(() => Promise.reject("API call failed"));

  const { getByLabelText, getByText } = render(
    <>
      <PredictionForm onSuccess={mockOnSuccess} />
      <Toaster />
    </>
  );

  fireEvent.change(getByLabelText(/Title/i), {
    target: { value: "Test Title" },
  });
  fireEvent.change(getByLabelText(/Description/i), {
    target: { value: "Test Description" },
  });
  fireEvent.click(getByText(/Save changes/i));

  const form = new Map();
  form.set("title", "Test Title");
  form.set("description", "Test Description");
  act(() => {
    _action(form);
  });
  await waitFor(() => expect(toast).toHaveBeenCalledWith("An error occurred"));
});
