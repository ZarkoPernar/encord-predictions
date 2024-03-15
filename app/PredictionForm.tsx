"use client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { z } from "zod";
import { PredictionBox, predictionsResponseSchema } from "./types";

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export async function createPrediction(form: FormData) {}

export function PredictionForm({
  onSuccess,
}: {
  onSuccess: (data: {
    title: string;
    description: string;
    predictions: Array<PredictionBox>;
  }) => void;
}) {
  return (
    <form
      action={async (form) => {
        console.log("fdsdsfsdf");
        try {
          const parsedData = formSchema.parse(
            Object.fromEntries(form.entries())
          );
          const response = await fetch("http://localhost:3001/predict/");
          const responseData = await response.json();
          const data = predictionsResponseSchema.parse(responseData);
          onSuccess({ ...parsedData, ...data });
          toast(`${parsedData.title} prediction created`);
        } catch (error) {
          toast("An error occurred");
          console.log(error);
        }
      }}
      className="grid gap-4 py-4"
    >
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title
        </Label>
        <Input required id="title" name="title" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Textarea
          required
          name="description"
          id="description"
          className="col-span-3"
        />
      </div>

      <DialogFooter>
        <Button className="self-end" type="submit">
          Save changes
        </Button>
      </DialogFooter>
    </form>
  );
}
