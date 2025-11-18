import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Vocabulary {
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
}

interface Phrase {
  english: string;
  korean: string;
  pronunciation: string;
}

interface Lesson {
  id: string;
  title: string;
  titleKo: string;
  level: string;
  vocabulary: Vocabulary[];
  phrases: Phrase[];
}

interface LessonViewProps {
  language: 'en' | 'ko';
  student: any;
}

const LessonView: React.FC<LessonViewProps> = ({ language, student }) => {
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const translations = {
    en: {
      vocabulary: 'Vocabulary',
      phrases: 'Common Phrases',
      translation: 'Translation',
      pronunciation: 'Pronunciation',
      example: 'Example',
      next: 'Next',
      previous: 'Previous',
      showAnswer: 'Show Answer',
      hideAnswer: 'Hide Answer',
      completeLesson: 'Complete Lesson',
      lessonCompleted: 'Lesson Completed!'
    },
    ko: {
      vocabulary: '어휘',
      phrases: '일반 문구',
      translation: '번역',
      pronunciation: '발음',
      example: '예시',
      next: '다음',
      previous: '이전',
      showAnswer: '답 보기',
      hideAnswer: '답 숨기기',
      completeLesson: '수업 완료',
      lessonCompleted: '수업 완료!'
    }
  };

  const t = translations[language];

  useEffect(() => {
    fetchLesson();
  }, [id]);

  const fetchLesson = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/lessons/${id}`);
      setLesson(response.data);
    } catch (error) {
      console.error('Error fetching lesson:', error);
    }
  };

  const handleComplete = async () => {
    if (!student) {
      alert('Please register first!');
      return;
    }

    const finalScore = Math.round((score / (lesson?.vocabulary.length || 1)) * 100);

    try {
      await axios.post(`http://localhost:5001/api/students/${student.id}/progress`, {
        lessonId: id,
        score: finalScore
      });
      alert(`${t.lessonCompleted} Score: ${finalScore}%`);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  if (!lesson) {
    return <div>Loading...</div>;
  }

  const currentVocab = lesson.vocabulary[currentIndex];

  return (
    <div className="lesson-view">
      <h2>{language === 'en' ? lesson.title : lesson.titleKo}</h2>

      <div className="lesson-content">
        <section className="vocabulary-section">
          <h3>{t.vocabulary}</h3>
          <div className="vocab-card">
            <div className="word-display">
              <h1>{currentVocab.word}</h1>
              <p className="pronunciation">[{currentVocab.pronunciation}]</p>
            </div>

            {showAnswer && (
              <div className="vocab-details">
                <p><strong>{t.translation}:</strong> {currentVocab.translation}</p>
                <p><strong>{t.example}:</strong> {currentVocab.example}</p>
              </div>
            )}

            <div className="vocab-controls">
              <button onClick={() => setShowAnswer(!showAnswer)}>
                {showAnswer ? t.hideAnswer : t.showAnswer}
              </button>
              <button
                onClick={() => {
                  if (currentIndex > 0) {
                    setCurrentIndex(currentIndex - 1);
                    setShowAnswer(false);
                  }
                }}
                disabled={currentIndex === 0}
              >
                {t.previous}
              </button>
              <button
                onClick={() => {
                  if (currentIndex < lesson.vocabulary.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                    setShowAnswer(false);
                    if (showAnswer) setScore(score + 1);
                  }
                }}
                disabled={currentIndex === lesson.vocabulary.length - 1}
              >
                {t.next}
              </button>
            </div>

            <p className="progress-indicator">
              {currentIndex + 1} / {lesson.vocabulary.length}
            </p>
          </div>
        </section>

        <section className="phrases-section">
          <h3>{t.phrases}</h3>
          <div className="phrases-list">
            {lesson.phrases.map((phrase, index) => (
              <div key={index} className="phrase-card">
                <p className="phrase-english">{phrase.english}</p>
                <p className="phrase-korean">{phrase.korean}</p>
                <p className="phrase-pronunciation">[{phrase.pronunciation}]</p>
              </div>
            ))}
          </div>
        </section>

        <button className="complete-btn" onClick={handleComplete}>
          {t.completeLesson}
        </button>
      </div>
    </div>
  );
};

export default LessonView;
