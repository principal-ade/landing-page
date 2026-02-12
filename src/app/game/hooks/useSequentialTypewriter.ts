"use client";

import { useState, useEffect, useRef } from 'react';
import { TypewriterResult, SequentialTypewriterResult, ContentLine } from '../types';

/**
 * Hook for sequential typewriter effect across multiple lines
 * Each line starts after the previous completes
 */
export function useSequentialTypewriter(
  enabled: boolean,
  lines: ContentLine[],
  delayBetweenLines: number = 200
): SequentialTypewriterResult {
  const [lineResults, setLineResults] = useState<TypewriterResult[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [allComplete, setAllComplete] = useState(false);

  // Use ref to store lines to prevent effect restart on reference changes
  const linesRef = useRef<ContentLine[]>(lines);
  const delayRef = useRef(delayBetweenLines);

  // Update refs when values change, but don't trigger effect
  useEffect(() => {
    linesRef.current = lines;
    delayRef.current = delayBetweenLines;
  }, [lines, delayBetweenLines]);

  useEffect(() => {
    if (!enabled) {
      setLineResults([]);
      setCurrentLineIndex(0);
      setAllComplete(false);
      return;
    }

    // Initialize results for all lines
    const initialResults = linesRef.current.map(() => ({
      displayedText: '',
      isComplete: false,
    }));
    setLineResults(initialResults);
    setCurrentLineIndex(0);
    setAllComplete(false);

    let currentIndex = 0;
    let charIndex = 0;
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    const typeNextChar = () => {
      if (currentIndex >= linesRef.current.length) {
        setAllComplete(true);
        return;
      }

      const currentLine = linesRef.current[currentIndex];
      const text = currentLine.text;

      if (charIndex < text.length) {
        // Type next character - capture values before they change
        const indexToUpdate = currentIndex;
        const nextCharIndex = charIndex + 1;
        const textToShow = text.substring(0, nextCharIndex);

        setLineResults(prev => {
          const updated = [...prev];
          updated[indexToUpdate] = {
            displayedText: textToShow,
            isComplete: false,
          };
          return updated;
        });
        charIndex++;
        interval = setTimeout(typeNextChar, currentLine.speed);
      } else {
        // Line complete - capture values BEFORE incrementing
        const indexToComplete = currentIndex;
        const completedText = text;

        setLineResults(prev => {
          const updated = [...prev];
          updated[indexToComplete] = {
            displayedText: completedText,
            isComplete: true,
          };
          return updated;
        });

        // Move to next line after delay
        currentIndex++;
        setCurrentLineIndex(currentIndex);
        charIndex = 0;

        if (currentIndex < linesRef.current.length) {
          timeout = setTimeout(typeNextChar, delayRef.current);
        } else {
          setAllComplete(true);
        }
      }
    };

    typeNextChar();

    return () => {
      if (interval) clearTimeout(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [enabled]); // Only depend on enabled

  return {
    lines: lineResults,
    allComplete,
    currentLineIndex,
  };
}
