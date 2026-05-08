import { useRef, useState } from "react";

export function useSpeechRecognition() {
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [speechError, setSpeechError] = useState("");

  const getRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError("Seu navegador não suporta reconhecimento de voz.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => {
      setListening(true);
      setSpeechError("");
    };

    recognition.onresult = (event) => {
      let interim = "";
      let finalChunk = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const text = event.results[index][0].transcript;

        if (event.results[index].isFinal) {
          finalChunk += `${text} `;
        } else {
          interim += text;
        }
      }

      if (finalChunk) {
        finalTranscriptRef.current = `${finalTranscriptRef.current}${finalChunk}`;
        setFinalTranscript(finalTranscriptRef.current.trim());
      }

      setTranscript(interim);
    };

    recognition.onerror = (event) => {
      setSpeechError(event.error || "Erro no reconhecimento de voz.");
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      setTranscript("");
    };

    return recognition;
  };

  const startListening = () => {
    if (listening) return;

    const recognition = getRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  const resetTranscript = () => {
    finalTranscriptRef.current = "";
    setTranscript("");
    setFinalTranscript("");
    setSpeechError("");
  };

  return {
    listening,
    transcript,
    finalTranscript,
    speechError,
    startListening,
    stopListening,
    resetTranscript,
  };
}
