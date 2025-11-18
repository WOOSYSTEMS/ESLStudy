import React, { useState, useRef, useEffect } from 'react';
import {
  PenTool,
  Type,
  Square,
  Circle,
  Eraser,
  Download,
  Trash2,
  MousePointer,
  Mic,
  Volume2,
  Languages,
  BookOpen,
  GripVertical,
  X
} from 'lucide-react';

interface DrawingTool {
  type: 'pen' | 'text' | 'rectangle' | 'circle' | 'eraser' | 'select';
  color: string;
  size: number;
}

interface VocabularyItem {
  id: string;
  english: string;
  korean: string;
  pronunciation: string;
  category: string;
}

const TeachingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTool, setCurrentTool] = useState<DrawingTool>({
    type: 'pen',
    color: '#000000',
    size: 2
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [showVocabulary, setShowVocabulary] = useState(true);
  const [showPronunciation, setShowPronunciation] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState('basics');

  // Korean-specific vocabulary for ESL
  const vocabularyLessons: Record<string, VocabularyItem[]> = {
    basics: [],
    numbers: [],
    classroom: []
  };

  // Pronunciation difficulty patterns for Korean learners
  const pronunciationPatterns = [
    { pattern: 'th', difficulty: 'high', tip: 'Place tongue between teeth' },
    { pattern: 'r/l', difficulty: 'high', tip: 'R and L are distinct in English' },
    { pattern: 'v/b', difficulty: 'medium', tip: 'V uses upper teeth on lower lip' },
    { pattern: 'f/p', difficulty: 'medium', tip: 'F uses continuous air flow' },
    { pattern: 'z/j', difficulty: 'low', tip: 'Z is voiced, J has more friction' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineWidth = currentTool.size;
      ctx.strokeStyle = currentTool.type === 'eraser' ? '#ffffff' : currentTool.color;
      ctx.lineCap = 'round';
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, item: VocabularyItem) => {
    e.dataTransfer.setData('vocabulary', JSON.stringify(item));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('vocabulary');
    if (data) {
      const item: VocabularyItem = JSON.parse(data);
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.font = '20px Inter';
          ctx.fillStyle = '#000000';
          ctx.fillText(item.english, x, y);

          ctx.font = '16px Noto Sans KR';
          ctx.fillStyle = '#666666';
          ctx.fillText(item.korean, x, y + 25);

          ctx.font = '14px Inter';
          ctx.fillStyle = '#999999';
          ctx.fillText(`[${item.pronunciation}]`, x, y + 45);
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const playPronunciation = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8; // Slower for ESL learners
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="teaching-canvas-container">
      <div className="canvas-header">
        <h2 className="text-xl font-semibold">Interactive Teaching Canvas</h2>
        <div className="flex items-center gap-4">
          <select
            className="select"
            value={selectedLesson}
            onChange={(e) => setSelectedLesson(e.target.value)}
          >
            <option value="basics">Basic Greetings</option>
            <option value="numbers">Numbers</option>
            <option value="classroom">Classroom Vocabulary</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        {/* Left Panel - Vocabulary */}
        {showVocabulary && (
          <div className="vocabulary-panel card" style={{ width: '280px' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <BookOpen size={16} />
                Vocabulary
              </h3>
              <button
                className="tool-btn"
                onClick={() => setShowVocabulary(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2">
              {vocabularyLessons[selectedLesson].map(item => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  className="vocabulary-item p-3 border rounded-md cursor-move hover:bg-surface"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{item.english}</div>
                      <div className="text-sm text-secondary korean-text">{item.korean}</div>
                      <div className="text-xs text-muted">[{item.pronunciation}]</div>
                    </div>
                    <button
                      onClick={() => playPronunciation(item.english)}
                      className="tool-btn"
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Center - Canvas */}
        <div className="flex-1">
          <div className="toolbar mb-3">
            <div className="flex items-center gap-2">
              <button
                className={`tool-btn ${currentTool.type === 'select' ? 'active' : ''}`}
                onClick={() => setCurrentTool({ ...currentTool, type: 'select' })}
              >
                <MousePointer size={18} />
              </button>
              <button
                className={`tool-btn ${currentTool.type === 'pen' ? 'active' : ''}`}
                onClick={() => setCurrentTool({ ...currentTool, type: 'pen' })}
              >
                <PenTool size={18} />
              </button>
              <button
                className={`tool-btn ${currentTool.type === 'text' ? 'active' : ''}`}
                onClick={() => setCurrentTool({ ...currentTool, type: 'text' })}
              >
                <Type size={18} />
              </button>
              <button
                className={`tool-btn ${currentTool.type === 'rectangle' ? 'active' : ''}`}
                onClick={() => setCurrentTool({ ...currentTool, type: 'rectangle' })}
              >
                <Square size={18} />
              </button>
              <button
                className={`tool-btn ${currentTool.type === 'circle' ? 'active' : ''}`}
                onClick={() => setCurrentTool({ ...currentTool, type: 'circle' })}
              >
                <Circle size={18} />
              </button>
              <button
                className={`tool-btn ${currentTool.type === 'eraser' ? 'active' : ''}`}
                onClick={() => setCurrentTool({ ...currentTool, type: 'eraser' })}
              >
                <Eraser size={18} />
              </button>

              <div className="border-l mx-2 h-6" />

              <input
                type="color"
                value={currentTool.color}
                onChange={(e) => setCurrentTool({ ...currentTool, color: e.target.value })}
                className="w-8 h-8 border rounded cursor-pointer"
              />

              <select
                className="select"
                style={{ width: '80px' }}
                value={currentTool.size}
                onChange={(e) => setCurrentTool({ ...currentTool, size: parseInt(e.target.value) })}
              >
                <option value="1">1px</option>
                <option value="2">2px</option>
                <option value="3">3px</option>
                <option value="5">5px</option>
                <option value="8">8px</option>
              </select>

              <div className="border-l mx-2 h-6" />

              <button className="tool-btn" onClick={clearCanvas}>
                <Trash2 size={18} />
              </button>
              <button className="tool-btn">
                <Download size={18} />
              </button>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="canvas-container"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{
              border: '1px solid var(--border)',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              cursor: currentTool.type === 'pen' ? 'crosshair' : 'default'
            }}
          />
        </div>

        {/* Right Panel - Pronunciation Guide */}
        {showPronunciation && (
          <div className="pronunciation-panel card" style={{ width: '280px' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Mic size={16} />
                Pronunciation Guide
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-3 border rounded-md">
                <h4 className="font-medium mb-2">Common Challenges</h4>
                <p className="text-xs text-secondary mb-3">
                  Sounds difficult for Korean speakers
                </p>
                {pronunciationPatterns.map((pattern, idx) => (
                  <div key={idx} className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-sm">{pattern.pattern}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        pattern.difficulty === 'high' ? 'bg-error text-white' :
                        pattern.difficulty === 'medium' ? 'bg-warning text-white' :
                        'bg-success text-white'
                      }`}>
                        {pattern.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-muted">{pattern.tip}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 border rounded-md">
                <h4 className="font-medium mb-2">Practice Tips</h4>
                <ul className="text-xs text-secondary space-y-1">
                  <li>• Speak slowly and clearly</li>
                  <li>• Focus on individual sounds</li>
                  <li>• Record yourself for comparison</li>
                  <li>• Practice minimal pairs</li>
                  <li>• Use mirror for mouth position</li>
                </ul>
              </div>

              <div className="p-3 border rounded-md">
                <h4 className="font-medium mb-2">IPA Symbols</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 border rounded">
                    <div className="font-mono">/θ/</div>
                    <div className="text-muted">think</div>
                  </div>
                  <div className="text-center p-2 border rounded">
                    <div className="font-mono">/ð/</div>
                    <div className="text-muted">this</div>
                  </div>
                  <div className="text-center p-2 border rounded">
                    <div className="font-mono">/ʃ/</div>
                    <div className="text-muted">she</div>
                  </div>
                  <div className="text-center p-2 border rounded">
                    <div className="font-mono">/ʒ/</div>
                    <div className="text-muted">vision</div>
                  </div>
                  <div className="text-center p-2 border rounded">
                    <div className="font-mono">/tʃ/</div>
                    <div className="text-muted">chair</div>
                  </div>
                  <div className="text-center p-2 border rounded">
                    <div className="font-mono">/dʒ/</div>
                    <div className="text-muted">judge</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Toolbar - Quick Actions */}
      <div className="mt-4 p-3 border rounded-lg bg-surface">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="btn btn-secondary">
              <Languages size={16} />
              Translation Mode
            </button>
            <button className="btn btn-secondary">
              <Mic size={16} />
              Voice Recording
            </button>
            <button className="btn btn-secondary">
              <BookOpen size={16} />
              Grammar Check
            </button>
          </div>
          <div className="text-xs text-muted">
            Drag vocabulary items onto canvas • Draw to annotate • Click speaker for pronunciation
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingCanvas;