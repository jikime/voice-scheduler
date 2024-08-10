'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CornerDownLeft, Mic, Volume2, AlertCircle, Info, User, Bot } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';

const BrowserSupportNotice: React.FC<{ isSupportedBrowser: boolean }> = ({
  isSupportedBrowser,
}) => {
  if (isSupportedBrowser) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <Info className="h-4 w-4" />
      <AlertTitle>브라우저 호환성 안내</AlertTitle>
      <AlertDescription>
        현재 브라우저에서는 음성 인식이 지원되지 않습니다. 최상의 경험을 위해 Chrome, Edge, 또는
        Safari와 같은 최신 브라우저를 사용해 주세요.
      </AlertDescription>
    </Alert>
  );
};

const VoiceTranscription: React.FC<{ transcript: string; isListening: boolean }> = ({
  transcript,
  isListening,
}) => {
  if (!isListening && !transcript) return null;

  return (
    <div className="mt-2 p-2 bg-gray-100 rounded-md text-sm text-gray-600 italic">
      {isListening ? '음성 인식 중: ' : '인식된 텍스트: '}
      {transcript || '말씀해 주세요...'}
    </div>
  );
};

const UnsafeOriginNotice: React.FC = () => (
  <Alert variant="destructive" className="mb-4">
    <Info className="h-4 w-4" />
    <AlertTitle>안전하지 않은 오리진 안내</AlertTitle>
    <AlertDescription>
      현재 안전하지 않은 오리진(HTTP)에서 실행 중입니다. Chrome에서 음성 인식을 사용하려면 다음
      단계를 따르세요:
      <ol className="list-decimal list-inside mt-2">
        <li>
          새 탭에서 <code>chrome://flags/#unsafely-treat-insecure-origin-as-secure</code>를 엽니다.
        </li>
        <li>"Insecure origins treated as secure" 플래그를 찾아 활성화합니다.</li>
        <li>이 웹사이트의 URL을 텍스트 필드에 추가합니다 (예: http://localhost:3000).</li>
        <li>Chrome을 재시작합니다.</li>
      </ol>
      <strong>주의:</strong> 이 설정은 개발 목적으로만 사용하세요. 프로덕션 환경에서는 항상 HTTPS를
      사용하세요.
    </AlertDescription>
  </Alert>
);

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => (
  <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`flex items-start ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full ${message.isUser ? 'bg-blue-500 ml-2' : 'bg-gray-300 mr-2'}`}
      >
        {message.isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-gray-600" />
        )}
      </div>
      <div
        className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
      >
        {message.text}
      </div>
    </div>
  </div>
);

export default function VoiceChat() {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSupportedBrowser, setIsSupportedBrowser] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [isUnsafeOrigin, setIsUnsafeOrigin] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const finalTranscriptRef = useRef('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isStoppingRef = useRef(false);
  const endTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const stopRecognition = useCallback(() => {
    console.log('음성 인식 중지 시도');
    isStoppingRef.current = true;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('음성 인식 중지 중 오류:', error);
      }
    }

    // 상태 업데이트 및 정리 작업
    setIsListening(false);
    setTranscript('');
    finalTranscriptRef.current = '';

    console.log('음성 인식 중지 및 정리 완료');
  }, []);

  const delayedStopRecognition = useCallback(() => {
    if (endTimeoutRef.current) {
      clearTimeout(endTimeoutRef.current);
    }
    endTimeoutRef.current = setTimeout(() => {
      stopRecognition();
    }, 1500); // 1.5초 딜레이
  }, [stopRecognition]);

  const playTextToSpeech = useCallback(
    async (text: string) => {
      try {
        console.log('Sending request to text-to-speech API');
        const response = await fetch('http://localhost:8000/text-to-speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            lang: 'ko',
          }),
        });

        console.log('Received response:', response);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`텍스트를 음성으로 변환하는 데 실패했습니다. 서버 응답: ${errorText}`);
        }

        const data = await response.json();
        console.log('Received data:', data);

        // 텍스트 처리
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: Date.now(), text: data.text, isUser: false },
        ]);

        // 음성 처리
        const audioBlob = new Blob([Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0))], {
          type: 'audio/mpeg',
        });
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('음성 재생 오류:', error);
        setError(
          '음성을 재생하는 데 실패했습니다: ' +
            (error instanceof Error ? error.message : String(error))
        );
      }
    },
    [setError, setMessages]
  );

  const handleSubmit = useCallback(
    (text: string) => {
      if (text.trim()) {
        console.log('메시지 제출:', text.trim());
        const newUserMessage: Message = { id: Date.now(), text: text.trim(), isUser: true };
        setMessages((prevMessages) => [...prevMessages, newUserMessage]);
        setInputText('');

        // 음성 인식 즉시 중지
        stopRecognition();

        // 즉시 API 호출 (지연 없음)
        playTextToSpeech(text.trim()).catch((error) => {
          console.error('TTS 재생 중 오류:', error);
          setError(
            '음성을 재생하는 데 실패했습니다: ' +
              (error instanceof Error ? error.message : String(error))
          );
        });
      }
    },
    [playTextToSpeech, setError, stopRecognition]
  );

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'ko-KR';

      recognitionRef.current.onstart = () => {
        console.log('음성 인식이 시작되었습니다.');
        setIsListening(true);
        setError(null);
        finalTranscriptRef.current = '';
        isStoppingRef.current = false;
      };

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        if (isStoppingRef.current) return; // 중지 중이면 결과 처리 안 함

        console.log('음성 인식 결과:', event.results);
        let interimTranscript = '';
        let isFinal = false;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += event.results[i][0].transcript;
            isFinal = true;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentTranscript = finalTranscriptRef.current + interimTranscript;
        console.log('현재 트랜스크립트:', currentTranscript);
        setTranscript(currentTranscript);

        if (isFinal) {
          handleSubmit(currentTranscript);
        } else {
          // 음성 입력이 있으면 종료 타이머를 리셋
          delayedStopRecognition();
        }
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('음성 인식 오류:', event.error);
        if (event.error === 'not-allowed' && location.protocol === 'http:') {
          setIsUnsafeOrigin(true);
          setError('안전하지 않은 오리진에서 음성 인식이 차단되었습니다. 아래 안내를 참고하세요.');
        } else if (event.error === 'not-allowed') {
          setError(
            '음성 인식 권한이 거부되었습니다. 브라우저 설정에서 마이크 권한을 허용해주세요.'
          );
        } else if (event.error === 'no-speech') {
          setError('음성이 감지되지 않았습니다. 다시 시도해주세요.');
        } else {
          setError(`음성 인식 오류: ${event.error}`);
        }
        stopRecognition();
      };

      recognitionRef.current.onend = () => {
        console.log('음성 인식이 종료되었습니다.');
        setIsListening(false);
        setTranscript('');
        finalTranscriptRef.current = '';
        isStoppingRef.current = false;
      };
    } else {
      console.error('이 브라우저는 음성 인식을 지원하지 않습니다.');
      setIsSupportedBrowser(false);
      setError('이 브라우저에서는 음성 인식이 지원되지 않습니다.');
    }

    return () => {
      if (endTimeoutRef.current) {
        clearTimeout(endTimeoutRef.current);
      }
      stopRecognition();
    };
  }, [handleSubmit, stopRecognition]);

  const toggleListening = useCallback(() => {
    if (recognitionRef.current) {
      if (isListening) {
        stopRecognition();
      } else {
        console.log('음성 인식 시작 시도');
        setError(null);
        setTranscript('');
        finalTranscriptRef.current = '';
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error('음성 인식 시작 오류:', error);
          setError(
            '음성 인식을 시작할 수 없습니다. HTTPS 환경인지 확인하고 마이크 권한을 허용해주세요.'
          );
        }
      }
    } else {
      console.error('음성 인식 객체가 초기화되지 않았습니다.');
      setError('음성 인식을 시작할 수 없습니다. 브라우저를 새로고침 후 다시 시도해주세요.');
    }
  }, [isListening, stopRecognition]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 p-4">
      <div className="w-full max-w-2xl h-[80vh] flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden">
        <header className="flex items-center justify-between border-b p-4 bg-gray-50">
          <h1 className="text-xl font-bold text-gray-800">AI 음성 어시스턴트</h1>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-blue-500">
                <Volume2 className="size-5" />
                <span className="sr-only">음성 입력 가이드</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p>마이크 아이콘을 클릭하여 음성 입력을 시작하세요</p>
            </TooltipContent>
          </Tooltip>
        </header>
        <main className="flex-1 flex flex-col overflow-hidden p-4">
          <BrowserSupportNotice isSupportedBrowser={isSupportedBrowser} />
          {isUnsafeOrigin && <UnsafeOriginNotice />}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>오류</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <ScrollArea className="flex-1 pr-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>
                  {isSupportedBrowser
                    ? '음성으로 말씀해주세요. 마이크 아이콘을 클릭하여 시작하세요.'
                    : '이 브라우저에서는 음성 인식이 지원되지 않습니다. 텍스트로 메시지를 입력해주세요.'}
                </p>
              </div>
            ) : (
              messages.map((message) => <ChatMessage key={message.id} message={message} />)
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
          <VoiceTranscription transcript={transcript} isListening={isListening} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(inputText);
            }}
            className="mt-4 rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
          >
            <Label htmlFor="message" className="sr-only">
              메시지
            </Label>
            <Textarea
              id="message"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isSupportedBrowser
                  ? '메시지를 입력하거나 음성으로 말씀해주세요...'
                  : '메시지를 입력하세요...'
              }
              className="min-h-[100px] resize-none border-0 p-3 shadow-none focus-visible:ring-0"
            />
            <div className="flex items-center justify-between p-3 pt-0">
              <div className="flex space-x-2">
                {isSupportedBrowser && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={`${isListening ? 'text-red-500' : 'text-blue-500'}`}
                        onClick={toggleListening}
                      >
                        <Mic className="size-4" />
                        <span className="sr-only">마이크 사용</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {isListening ? '음성 입력 중지' : '음성 입력 시작'}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <Button type="submit" size="sm" className="gap-1.5">
                메시지 전송
                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>
          </form>
        </main>
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
      </div>
    </div>
  );
}
