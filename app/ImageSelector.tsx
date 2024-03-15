import { Button } from "@/components/ui/button";
import React, { ChangeEventHandler, useRef } from "react";

export const ImageSelector = ({
  onChange,
}: {
  onChange: ChangeEventHandler<HTMLInputElement>;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <input
        onChange={onChange}
        ref={fileRef}
        type="file"
        className="sr-only"
        accept="image/*"
        aria-hidden
        tabIndex={-1}
      />
      <Button
        onClick={() => {
          if (!fileRef.current) return;
          fileRef.current.click();
        }}
      >
        Select Images
      </Button>
    </div>
  );
};
