import React, { useState, useEffect } from 'react';

interface PronunciationPracticeProps {
  language: 'en' | 'ko';
}

const PronunciationPractice: React.FC<PronunciationPracticeProps> = ({ language }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [targetPhrase, setTargetPhrase] = useState('');
  const [feedback, setFeedback] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  const phrases = [
    { text: 'Hello, how are you?', difficulty: 'easy' },
    { text: 'Nice to meet you', difficulty: 'easy' },
    { text: 'Thank you very much', difficulty: 'easy' },
    { text: 'Could you please help me?', difficulty: 'medium' },
    { text: 'I would like to order coffee', difficulty: 'medium' },
    { text: 'What time does the store close?', difficulty: 'medium' },
    { text: 'I have been studying English for two years', difficulty: 'hard' },
    { text: 'The weather is beautiful today', difficulty: 'hard' }
  ];

  const translations = {
    en: {
      title: 'Pronunciation Practice',
      subtitle: 'Practice speaking English phrases',
      targetPhrase: 'Try saying',
      startRecording: 'Start Recording',
      stopRecording: 'Stop Recording',
      youSaid: 'You said',
      selectPhrase: 'Select a new phrase',
      accuracy: 'Accuracy',
      tryAgain: 'Try Again',
      excellent: 'Excellent!',
      good: 'Good job!',
      needsPractice: 'Keep practicing!',
      browserNotSupported: 'Speech recognition is not supported in your browser'
    },
    ko: {
      title: '발음 연습',
      subtitle: '영어 문구 말하기 연습',
      targetPhrase: '말해보세요',
      startRecording: '녹음 시작',
      stopRecording: '녹음 중지',
      youSaid: '당신이 말했습니다',
      selectPhrase: '새 문구 선택',
      accuracy: '정확도',
      tryAgain: '다시 시도',
      excellent: '훌륭합니다!',
      good: '잘했어요!',
      needsPractice: '계속 연습하세요!',
      browserNotSupported: '브라우저에서 음성 인식이 지원되지 않습니다'
    }
  };

  const t = translations[language];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        checkAccuracy(speechResult);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
      setTargetPhrase(phrases[0].text);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setTranscript('');
      setFeedback('');
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const checkAccuracy = (spoken: string) => {
    const target = targetPhrase.toLowerCase().replace(/[^\w\s]/g, '');
    const spokenClean = spoken.toLowerCase().replace(/[^\w\s]/g, '');

    const targetWords = target.split(' ');
    const spokenWords = spokenClean.split(' ');

    let matches = 0;
    targetWords.forEach(word => {
      if (spokenWords.includes(word)) matches++;
    });

    const accuracy = Math.round((matches / targetWords.length) * 100);

    if (accuracy >= 90) {
      setFeedback(t.excellent);
    } else if (accuracy >= 70) {
      setFeedback(t.good);
    } else {
      setFeedback(t.needsPractice);
    }
  };

  const selectRandomPhrase = () => {
    const randomIndex = Math.floor(Math.random() * phrases.length);
    setTargetPhrase(phrases[randomIndex].text);
    setTranscript('');
    setFeedback('');
  };

  if (!recognition) {
    return (
      <div className="pronunciation-practice">
        <p>{t.browserNotSupported}</p>
      </div>
    );
  }

  return (
    <div className="pronunciation-practice">
      <h2>{t.title}</h2>
      <p className="subtitle">{t.subtitle}</p>

      <div className="practice-area">
        <div className="target-phrase-box">
          <p className="label">{t.targetPhrase}:</p>
          <h3 className="target-phrase">{targetPhrase}</h3>
        </div>

        <div className="recording-controls">
          {!isListening ? (
            <button className="record-btn" onClick={startListening}>
              🎤 {t.startRecording}
            </button>
          ) : (
            <button className="record-btn listening" onClick={stopListening}>
              ⏹ {t.stopRecording}
            </button>
          )}
        </div>

        {transcript && (
          <div className="transcript-box">
            <p className="label">{t.youSaid}:</p>
            <p className="transcript">{transcript}</p>
            {feedback && <p className="feedback">{feedback}</p>}
          </div>
        )}

        <button className="new-phrase-btn" onClick={selectRandomPhrase}>
          {t.selectPhrase}
        </button>
      </div>
    </div>
  );
};

export default PronunciationPractice;
