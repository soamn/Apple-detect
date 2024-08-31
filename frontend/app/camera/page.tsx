"use client";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const Page = () => {
  const webcamRef = useRef<Webcam>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  useEffect(() => {
    const captureVideoFrame = () => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          // Send the image to the Flask backend
          fetch("http://localhost:8080/process_image_live", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: imageSrc }),
          })
            .then((response) => response.json())
            .then((data) => {
              setProcessedImage(data.processed_image);
            });
        }
      }
    };
    const interval = setInterval(captureVideoFrame, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex justify-center items-center gap-2 h-screen flex-col lg:flex-row p-5">
      {capturing ? (
        <div>
          <Webcam
            className="rounded-xl "
            ref={webcamRef}
            screenshotQuality={1}
            screenshotFormat="image/jpeg"
            audio={false}
            videoConstraints={{ facingMode: "user" }}
            mirrored
          />
        </div>
      ) : (
        <></>
      )}

      <button
        className={` rounded-xl p-3 ${
          capturing
            ? "bg-red-500 hover:bg-red-600"
            : "bg-yellow-500 hover:bg-yellow-600"
        }`}
        onClick={() => {
          setCapturing(!capturing);
        }}
      >
        {capturing ? "Stop Capturing" : "Start Capturing"}
      </button>

      {processedImage && capturing ? (
        <div>
          <h3 className=" font-semibold">Processed Image:</h3>
          <img src={processedImage} alt="Processed" className="rounded-xl " />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Page;
