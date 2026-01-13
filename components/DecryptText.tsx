import React, { useEffect, useState } from 'react';

interface DecryptTextProps {
  text: string;
  className?: string;
}

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+';

const DecryptText: React.FC<DecryptTextProps> = ({ text, className = '' }) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    let iteration = 0;
    let interval: any = null;
    setIsComplete(false); // Reset completion state if text changes

    // Initial delay before starting
    const startTimeout = setTimeout(() => {
        interval = setInterval(() => {
        setDisplayText(prev => 
            text
            .split('')
            .map((letter, index) => {
                if (index < iteration) {
                return text[index];
                }
                return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
            })
            .join('')
        );

        if (iteration >= text.length) {
            clearInterval(interval);
            setIsComplete(true);
        }

        iteration += 1 / 2; // Speed of decoding
        }, 30);
    }, 200);

    return () => {
        clearInterval(interval);
        clearTimeout(startTimeout);
    };
  }, [text]);

  return (
    <span className={`${className} ${isComplete ? 'animate-text-flash' : ''}`}>
        {displayText}
    </span>
  );
};

export default DecryptText;