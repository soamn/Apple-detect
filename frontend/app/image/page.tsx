"use client"; // Mark the file as a Client Component

import React, { useState } from "react";

const Page = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64data = reader.result;
      setLoading(true);

      try {
        const response = await fetch(
          "http://localhost:8080/process_image_upload",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: base64data }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUploadedImageUrl(data.processed_image);
      } catch (error) {
        console.error("Error uploading image:", error);
        setError("Failed to upload image. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="w-screen h-screen  p-4 ">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 "
      >
        <label
          className="block mb-2  font-medium text-gray-900 text-lg"
          htmlFor="image_file"
        >
          Upload Image File
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="image_file"
        />

        <button
          type="submit"
          disabled={loading}
          className="text-md bg-green-600 p-2 rounded-full hover:bg-green-700 active:bg-green-800 "
        >
          Process Image
        </button>
      </form>
      {loading && <p className="text-center font-semibold">Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {uploadedImageUrl && (
        <div className=" w-full flex flex-col items-center p-5 ">
          <h3 className="text-lg p-2 font-semibold ">Processed Image:</h3>
          <img src={uploadedImageUrl} className="rounded-lg " />
        </div>
      )}
    </div>
  );
};

export default Page;
