import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Check,
  X,
  TrendingUp,
  AlertCircle,
  BookOpen,
  Target
} from 'lucide-react';

interface PronunciationExercise {
  id: string;
  phrase: string;
  ipa: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tips: string[];
  commonMistakes: string[];
}

const PronunciationLab: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPracticing, setIsPracticing] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<PronunciationExercise | null>(null);
  const [transcript, setTranscript] = useState('');
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [recognition, setRecognition] = useState<any>(null);

  const waveformRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number | null>(null);

  // Korean-specific pronunciation challenges
  const exercises: PronunciationExercise[] = [];

  const progressData = {
    overallAccuracy: 0,
    sessionsCompleted: 0,
    totalPracticeTime: '0h 0m',
    improvement: '+0%',
    strongAreas: [],
    needsWork: []
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const last = event.results.length - 1;
        const speechResult = event.results[last][0].transcript;
        setTranscript(speechResult);

        if (event.results[last].isFinal && selectedExercise) {
          checkAccuracy(speechResult, selectedExercise.phrase);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }

    // Setup audio visualization
    setupAudioVisualization();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const setupAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
    } catch (err) {
      console.error('Error setting up audio visualization:', err);
    }
  };

  const drawWaveform = () => {
    if (!waveformRef.current || !analyserRef.current) return;

    const canvas = waveformRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyserRef.current!.getByteTimeDomainData(dataArray);

      ctx.fillStyle = 'var(--surface)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = isRecording ? 'var(--accent)' : 'var(--border)';
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  };

  const startRecording = () => {
    if (recognition) {
      setTranscript('');
      setAccuracy(null);
      setFeedback([]);
      recognition.start();
      setIsRecording(true);
      drawWaveform();
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  };

  const checkAccuracy = (spoken: string, target: string) => {
    const spokenClean = spoken.toLowerCase().replace(/[^\w\s]/g, '');
    const targetClean = target.toLowerCase().replace(/[^\w\s]/g, '');

    const spokenWords = spokenClean.split(' ');
    const targetWords = targetClean.split(' ');

    let matches = 0;
    targetWords.forEach((word, index) => {
      if (spokenWords[index] === word) matches++;
    });

    const accuracyScore = Math.round((matches / targetWords.length) * 100);
    setAccuracy(accuracyScore);

    // Generate feedback
    const newFeedback: string[] = [];
    if (accuracyScore === 100) {
      newFeedback.push('Perfect pronunciation!');
    } else if (accuracyScore >= 80) {
      newFeedback.push('Great job! Minor improvements needed.');
    } else if (accuracyScore >= 60) {
      newFeedback.push('Good effort! Focus on problem sounds.');
    } else {
      newFeedback.push('Keep practicing! Try speaking more slowly.');
    }

    // Add specific feedback based on exercise
    if (selectedExercise) {
      if (accuracyScore < 100) {
        newFeedback.push(...selectedExercise.tips.slice(0, 2));
      }
    }

    setFeedback(newFeedback);
  };

  const playExample = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="pronunciation-lab">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Pronunciation Lab</h1>
        <p className="text-secondary">Practice and improve your English pronunciation</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Exercise Selection */}
        <div>
          <div className="card">
            <h2 className="font-semibold mb-4">Exercises</h2>
            <div className="space-y-2">
              {exercises.map(exercise => (
                <button
                  key={exercise.id}
                  onClick={() => {
                    setSelectedExercise(exercise);
                    setIsPracticing(true);
                    setTranscript('');
                    setAccuracy(null);
                    setFeedback([]);
                  }}
                  className={`w-full text-left p-3 border rounded-lg hover:bg-surface ${
                    selectedExercise?.id === exercise.id ? 'bg-surface border-primary' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{exercise.phrase}</p>
                      <p className="text-xs text-muted mt-1">{exercise.ipa}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-secondary">{exercise.category}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          exercise.difficulty === 'easy' ? 'bg-success text-white' :
                          exercise.difficulty === 'medium' ? 'bg-warning text-white' :
                          'bg-error text-white'
                        }`}>
                          {exercise.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Progress Overview */}
          <div className="card mt-6">
            <h3 className="font-semibold mb-4">Your Progress</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-secondary">Overall Accuracy</span>
                  <span className="text-sm font-medium">{progressData.overallAccuracy}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progressData.overallAccuracy}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted text-xs">Sessions</p>
                  <p className="font-medium">{progressData.sessionsCompleted}</p>
                </div>
                <div>
                  <p className="text-muted text-xs">Practice Time</p>
                  <p className="font-medium">{progressData.totalPracticeTime}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary">Improvement</span>
                <span className="text-sm text-success flex items-center gap-1">
                  <TrendingUp size={14} />
                  {progressData.improvement}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Area */}
        <div className="col-span-2">
          {isPracticing && selectedExercise ? (
            <div className="card">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{selectedExercise.phrase}</h2>
                <p className="text-sm text-secondary">IPA: {selectedExercise.ipa}</p>
                <span className="inline-block mt-2 text-xs px-2 py-1 bg-surface border rounded">
                  {selectedExercise.category}
                </span>
              </div>

              {/* Audio Waveform */}
              <div className="mb-6">
                <canvas
                  ref={waveformRef}
                  width={600}
                  height={100}
                  className="w-full h-24 border rounded-lg bg-surface"
                />
              </div>

              {/* Recording Controls */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={() => playExample(selectedExercise.phrase)}
                  className="btn btn-secondary"
                >
                  <Volume2 size={16} />
                  Listen to Example
                </button>
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="btn btn-primary"
                  >
                    <Mic size={16} />
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="btn btn-danger"
                  >
                    <MicOff size={16} />
                    Stop Recording
                  </button>
                )}
                <button
                  onClick={() => {
                    setTranscript('');
                    setAccuracy(null);
                    setFeedback([]);
                  }}
                  className="btn btn-secondary"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>

              {/* Transcript and Accuracy */}
              {transcript && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">You said:</h3>
                  <div className="p-4 bg-surface rounded-lg">
                    <p className="text-lg">{transcript}</p>
                  </div>
                  {accuracy !== null && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-secondary">Accuracy Score</span>
                        <span className={`text-lg font-semibold ${
                          accuracy >= 80 ? 'text-success' :
                          accuracy >= 60 ? 'text-warning' :
                          'text-error'
                        }`}>
                          {accuracy}%
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className={`progress-fill ${
                            accuracy >= 80 ? 'bg-success' :
                            accuracy >= 60 ? 'bg-warning' :
                            'bg-error'
                          }`}
                          style={{ width: `${accuracy}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Feedback */}
              {feedback.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Feedback</h3>
                  <div className="space-y-2">
                    {feedback.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check size={16} className="text-success mt-0.5" />
                        <p className="text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips and Common Mistakes */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Target size={16} />
                    Tips for Success
                  </h3>
                  <ul className="space-y-2">
                    {selectedExercise.tips.map((tip, idx) => (
                      <li key={idx} className="text-sm text-secondary flex items-start gap-2">
                        <span className="text-accent">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle size={16} />
                    Common Mistakes
                  </h3>
                  <ul className="space-y-2">
                    {selectedExercise.commonMistakes.map((mistake, idx) => (
                      <li key={idx} className="text-sm text-secondary flex items-start gap-2">
                        <span className="text-error">•</span>
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center">
              <div className="text-center">
                <Mic size={48} className="text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select an Exercise</h3>
                <p className="text-secondary">Choose a pronunciation exercise from the list to begin practicing</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PronunciationLab;