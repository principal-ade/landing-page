import { useState, useEffect, useRef } from 'react';

interface TypewriterResult {
  displayedText: string;
  isComplete: boolean;
}

interface SequentialTypewriterLine {
  text: string;
  speed?: number;
}

interface UseSequentialTypewriterResult {
  lines: TypewriterResult[];
  allComplete: boolean;
  currentLineIndex: number;
}

/**
 * Hook for displaying multiple lines of text sequentially with typewriter effect
 *
 * @param enabled - Whether the typewriter should be active
 * @param lineConfigs - Array of line configurations with text and optional speed
 * @param delayBetweenLines - Delay in ms between completing one line and starting the next
 * @returns Object containing typewriter states for each line
 */
export function useSequentialTypewriter(
  enabled: boolean,
  lineConfigs: SequentialTypewriterLine[],
  delayBetweenLines: number = 100
): UseSequentialTypewriterResult {
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(-1);
  const [lines, setLines] = useState<TypewriterResult[]>(
    lineConfigs.map(() => ({ displayedText: '', isComplete: false }))
  );
  const lineConfigsRef = useRef(lineConfigs);

  // Update ref when lineConfigs changes
  useEffect(() => {
    lineConfigsRef.current = lineConfigs;
  }, [lineConfigs]);

  // Reset when disabled or start when enabled
  useEffect(() => {
    if (!enabled) {
      setCurrentLineIndex(-1);
      setLines(lineConfigsRef.current.map(() => ({ displayedText: '', isComplete: false })));
    } else if (currentLineIndex === -1) {
      // Start first line when enabled
      setCurrentLineIndex(0);
    }
  }, [enabled, currentLineIndex]);

  // Handle typewriter effect for current line
  useEffect(() => {
    if (!enabled || currentLineIndex < 0 || currentLineIndex >= lineConfigsRef.current.length) {
      return;
    }

    const config = lineConfigsRef.current[currentLineIndex];
    const speed = config.speed || 35;
    let charIndex = 1; // Start at 1 to show first character
    let isActive = true;

    // Set first character immediately
    setLines(prev => {
      const newLines = [...prev];
      newLines[currentLineIndex] = {
        displayedText: config.text.substring(0, 1),
        isComplete: config.text.length === 1,
      };
      return newLines;
    });

    // If text is only 1 character, schedule next line and return
    if (config.text.length === 1) {
      if (currentLineIndex < lineConfigsRef.current.length - 1) {
        setTimeout(() => {
          if (isActive) {
            setCurrentLineIndex(prev => prev + 1);
          }
        }, delayBetweenLines);
      }
      return () => {
        isActive = false;
      };
    }

    // Type remaining characters
    const interval = setInterval(() => {
      if (!isActive) {
        clearInterval(interval);
        return;
      }

      charIndex++;

      if (charIndex <= config.text.length) {
        const isLastChar = charIndex === config.text.length;

        setLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] = {
            displayedText: config.text.substring(0, charIndex),
            isComplete: isLastChar,
          };
          return newLines;
        });

        // If this was the last character, stop typing and schedule next line
        if (isLastChar) {
          clearInterval(interval);
          if (currentLineIndex < lineConfigsRef.current.length - 1) {
            setTimeout(() => {
              if (isActive) {
                setCurrentLineIndex(prev => prev + 1);
              }
            }, delayBetweenLines);
          }
        }
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [enabled, currentLineIndex, delayBetweenLines]);

  const allComplete = lines.every(line => line.isComplete);

  return {
    lines,
    allComplete,
    currentLineIndex,
  };
}
