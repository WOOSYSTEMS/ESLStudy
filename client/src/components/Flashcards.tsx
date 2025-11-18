import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface FlashcardsProps {
  language: 'en' | 'ko';
}

interface Card {
  word: string;
  translation: string;
  example: string;
}

const Flashcards: React.FC<FlashcardsProps> = ({ language }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mastered, setMastered] = useState<number[]>([]);

  const translations = {
    en: {
      title: 'Flashcards Practice',
      flip: 'Flip Card',
      next: 'Next Card',
      previous: 'Previous Card',
      mastered: 'Mark as Mastered',
      unmastered: 'Unmark',
      progress: 'Progress',
      loading: 'Loading flashcards...',
      noCards: 'No flashcards available'
    },
    ko: {
      title: '플래시카드 연습',
      flip: '카드 뒤집기',
      next: '다음 카드',
      previous: '이전 카드',
      mastered: '습득으로 표시',
      unmastered: '표시 해제',
      progress: '진행',
      loading: '플래시카드 로딩 중...',
      noCards: '사용 가능한 플래시카드 없음'
    }
  };

  const t = translations[language];

  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/lessons');
      const allVocab: Card[] = [];

      response.data.forEach((lesson: any) => {
        lesson.vocabulary.forEach((vocab: any) => {
          allVocab.push({
            word: vocab.word,
            translation: vocab.translation,
            example: vocab.example
          });
        });
      });

      setCards(allVocab);
    } catch (error) {
      console.error('Error loading flashcards:', error);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
    }
  };

  const toggleMastered = () => {
    if (mastered.includes(currentIndex)) {
      setMastered(mastered.filter(i => i !== currentIndex));
    } else {
      setMastered([...mastered, currentIndex]);
    }
  };

  if (cards.length === 0) {
    return <div className="flashcards"><p>{t.loading}</p></div>;
  }

  const currentCard = cards[currentIndex];
  const isMastered = mastered.includes(currentIndex);

  return (
    <div className="flashcards">
      <h2>{t.title}</h2>

      <div className="progress-bar">
        <p>{t.progress}: {mastered.length} / {cards.length}</p>
        <div className="progress-fill" style={{ width: `${(mastered.length / cards.length) * 100}%` }} />
      </div>

      <div className={`flashcard ${flipped ? 'flipped' : ''} ${isMastered ? 'mastered' : ''}`}>
        <div className="flashcard-inner" onClick={() => setFlipped(!flipped)}>
          <div className="flashcard-front">
            <h1>{currentCard.word}</h1>
            <p className="hint">{t.flip}</p>
          </div>
          <div className="flashcard-back">
            <h2>{currentCard.translation}</h2>
            <p className="example">{currentCard.example}</p>
          </div>
        </div>
      </div>

      <div className="flashcard-controls">
        <button onClick={handlePrevious} disabled={currentIndex === 0}>
          {t.previous}
        </button>
        <button onClick={toggleMastered} className={isMastered ? 'unmaster-btn' : 'master-btn'}>
          {isMastered ? t.unmastered : t.mastered}
        </button>
        <button onClick={handleNext} disabled={currentIndex === cards.length - 1}>
          {t.next}
        </button>
      </div>

      <p className="card-counter">
        {currentIndex + 1} / {cards.length}
      </p>
    </div>
  );
};

export default Flashcards;
