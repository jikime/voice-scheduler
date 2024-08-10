'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';


const SpeechRecognition =
  window.SpeechRecognition || (window as any).webkitSpeechRecognition;

const VoiceChat = () => {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const endTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      console.error('Speech recognition is not supported in this browser.');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'ko-KR';

    recognitionInstance.onstart = () => {
      setIsListening(true);
      resetTimer();
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
      clearTimeout(endTimeoutRef.current!);
    };

    recognitionInstance.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript);
      resetTimer(); // Reset the timer on each result
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error', event);
      clearTimeout(endTimeoutRef.current!);
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      recognitionInstance.stop();
      clearTimeout(endTimeoutRef.current!);
    };
  }, []);

  const startRecognition = () => {
    if (recognition && !isListening) {
      recognition.start();
    }
  };

  const stopRecognition = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
    }
  }, [recognition, isListening]);

  const resetTimer = () => {
    clearTimeout(endTimeoutRef.current!);
    endTimeoutRef.current = setTimeout(() => {
      stopRecognition();
      console.log('Speech recognition stopped due to inactivity.');
    }, 1500); // 1.5초 딜레이
  };

  return (
    <div>
      <button onClick={startRecognition}>Start Recognition</button>
      <button onClick={stopRecognition}>Stop Recognition</button>
      <p>{isListening ? 'Listening...' : 'Not listening'}</p>
      <p>Transcript: {transcript}</p>
    </div>
  );
};

export default VoiceChat;