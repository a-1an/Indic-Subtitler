import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

const LiveTranscribe = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [gptOptimizedTranscription, setGptOptimizedTranscription] =
    useState("");
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const [enableTranscription, setEnableTranscription] = useState(false);
  const transcriptionContainerRef = useRef();

  const toggleRecording = () => {
    if (!streamRef.current || !mediaRecorderRef.current) {
      console.log("stream or mediarecorder not defined");
      return;
    }
    if (mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    } else {
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.start();
    }
    setIsRecording(mediaRecorderRef.current.state === "recording");
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        console.log("stream set");
        streamRef.current = stream;
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  }, []);

  useEffect(() => {
    let interval = null;
    if (!enableTranscription) {
      if (interval) {
        clearInterval(interval);
        toggleRecording();
      }
      return;
    }

    toggleRecording();
    interval = setInterval(() => {
      toggleRecording();
      setTimeout(() => {
        console.log("toggling back");
        toggleRecording();
      }, 175);
    }, 3500);

    return () => {
      interval && clearInterval(interval);
      toggleRecording();
    };
  }, [enableTranscription]);

  const handleDataAvailable = async (event) => {
    const audioBlob = event.data;
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async function () {
      const base64Data = reader.result.split(",")[1];
      try {
        const response = await fetch("/api/transcribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify({ audioData: base64Data, language: "en" }),
          body: JSON.stringify({ audioData: base64Data }),
        });

        if (!response.ok) {
          throw new Error("Failed to transcribe audio");
        }

        const data = await response.json();

        setTranscription(
          (transcription) => `${transcription} ${data.transcription}`
        );
      } catch (error) {
        console.error("Error transcribing audio:", error);
      }
    };
  };

  const handleEnableTranscription = () => {
    setEnableTranscription((currState) => !currState);
  };

  const handleOptimizeWithGpt = async () => {
    const toastId = toast.info("Optimizing with LLM...");
    try {
      const response = await axios.post("/api/optimize", {
        transcription: transcription,
      });
      console.log(
        "Optimized transcription:",
        response.data.corrected_transcription
      );
      setGptOptimizedTranscription(response.data.corrected_transcription);
      toast.update(toastId, {
        render: "Optimized with LLM",
        type: "success",
        autoClose: 5000,
      });
    } catch (error) {
      console.error("Error optimizing transcription:", error);
    }
  };

  return (
    <div className="prose mx-auto pb-5 mb-5 p-2">
      <h1>Live Transcription</h1>

      <p className="text-sm text-gray-600 mb-3">
        Note: This feature is in beta and works best for English at the moment
      </p>
      <div className="h-80" ref={transcriptionContainerRef}>
        <textarea
          value={transcription}
          rows={10}
          placeholder="Enable Transcription and start speaking.Don't mind about grammar or accuracy. Let your thoughts flow freely..."
          onChange={(e) => setTranscription(e.target.value)}
          className="w-full border rounded p-4"
        />
      </div>
      <br />

      <p className="m-2">
        {isRecording ? "Recording in progress...." : "Ready"}{" "}
      </p>

      <div className="flex flex-wrap ml-0">
        <button
          className="btn btn-accent m-2"
          onClick={handleEnableTranscription}
        >
          {enableTranscription ? "Disable" : "Enable"} Transcription
        </button>

        <button
          className="btn btn-neutral m-2"
          disabled={!transcription?.length}
          onClick={handleOptimizeWithGpt}
        >
          Optimize Transcription
        </button>

        <button
          className="btn btn-outline m-2"
          disabled={!transcription?.length}
          onClick={() => setTranscription("")}
        >
          Clear Transcript
        </button>
      </div>

      {gptOptimizedTranscription && (
        <div className="mt-6 p-2 px-4 mb-4 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-bold mb-1">Optimized Transcription</h2>
          <h5 className="text-lg font-semibold">
            Transcription after processed by an LLM
          </h5>
          <p className="text-base mt-6">{gptOptimizedTranscription}</p>
        </div>
      )}
    </div>
  );
};

export default LiveTranscribe;
