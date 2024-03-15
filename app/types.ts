import { z } from "zod";

export type SelectedImage = {
  file: File;
  selected: Date;
  readableSize: string;
  readableTime: string;
  dimensions: {
    width: number;
    height: number;
  };
};

const predictionBoxSchema = z.object({
  bbox: z.object({
    x1: z.number(),
    x2: z.number(),
    y1: z.number(),
    y2: z.number(),
  }),
  label: z.string(),
  score: z.string(),
});

export type PredictionBox = z.infer<typeof predictionBoxSchema>;

export const predictionsResponseSchema = z.object({
  predictions: z.array(predictionBoxSchema),
});

export type PredictionsResponse = z.infer<typeof predictionsResponseSchema>;
