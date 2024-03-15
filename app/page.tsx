"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PredictionForm } from "./PredictionForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PredictionBox, SelectedImage } from "./types";
import { PredictionView } from "./PredictionView";
import { ImageSelector } from "./ImageSelector";
import { formatFileSize, getImageDimensions } from "./utils";

type TabValues = "Images" | "Predictions";

export default function Home() {
  const [images, setImages] = useState<Array<SelectedImage>>([]);
  const [predictions, setPredictions] = useState<
    Array<{
      title: string;
      description: string;
      readableTime: string;
      predictions: PredictionBox[];
      dimensions: { width: number; height: number };
    }>
  >([]);
  const handleInputSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const [file] = Array.from(e.target.files).map((file) => ({
      file,
      selected: new Date(),
      readableSize: formatFileSize(file.size),
      readableTime: new Date().toLocaleString(),
    }));

    const dimensions = await getImageDimensions(file.file);
    setImages((prev) => [...prev, { ...file, dimensions }]);
    setTimeout(() => {
      e.target.value = "";
    }, 100);
  };

  const [activeTab, setActiveTab] = useState<TabValues>("Images");

  const handlePredictionSuccess = (
    data: {
      title: string;
      description: string;
      predictions: Array<PredictionBox>;
    },
    image: SelectedImage
  ) => {
    setPredictions((prev) => [
      ...prev,
      { ...image, ...data, readableTime: new Date().toLocaleString() },
    ]);
    setActiveTab("Predictions");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-10">
        Encord Image Predictions
      </h1>
      <Tabs
        onValueChange={(v) => setActiveTab(v as TabValues)}
        value={activeTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Images">Images</TabsTrigger>
          <TabsTrigger value="Predictions">Predictions</TabsTrigger>
        </TabsList>
        <TabsContent value="Images">
          <div className="flex flex-col gap-4 pt-10">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">Images</h2>

              <ImageSelector onChange={handleInputSelect} />
            </div>

            <Table className="w-full">
              <TableCaption>A list of your uploaded images.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Filename</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {images.map((image) => (
                  <TableRow key={image.file.name}>
                    <TableCell
                      title={image.file.name}
                      className="font-medium text-ellipsis overflow-hidden whitespace-nowrap max-w-[120px]"
                    >
                      {image.file.name}
                    </TableCell>
                    <TableCell>{image.readableSize}</TableCell>
                    <TableCell>{image.readableTime}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">PREDICT</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create Predictions</DialogTitle>
                            <DialogDescription>
                              Add a title and a description to your image and
                              start the labelling process.
                            </DialogDescription>
                          </DialogHeader>
                          <PredictionForm
                            onSuccess={(d) => handlePredictionSuccess(d, image)}
                          />
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="Predictions">
          <div className="flex flex-col gap-4 pt-10">
            <h2 className="text-2xl font-bold">Predictions</h2>

            <Table className="w-full">
              <TableCaption>A list of predictions on your images.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {predictions.map((prediction) => (
                  <TableRow key={prediction.readableTime}>
                    <TableCell className="font-medium">
                      {prediction.title}
                    </TableCell>
                    <TableCell>{prediction.description}</TableCell>
                    <TableCell>{prediction.readableTime}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">VIEW</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Image Predictions</DialogTitle>
                            <DialogDescription>
                              View the predictions made on this image.
                            </DialogDescription>
                          </DialogHeader>
                          <PredictionView
                            title={prediction.title}
                            dimensions={prediction.dimensions}
                            predictions={prediction.predictions}
                          />
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
