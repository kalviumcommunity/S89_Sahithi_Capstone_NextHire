import { useCallback, useRef } from 'react';

const useSoundEffects = () => {
  const audioContextRef = useRef(null);

  // Initialize audio context
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Create different types of sounds using Web Audio API
  const playSound = useCallback((type, options = {}) => {
    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configure sound based on type
      switch (type) {
        case 'click':
          // Soft click sound for option selection
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          oscillator.type = 'sine';
          break;

        case 'correct':
          // Success sound - ascending notes
          oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
          oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
          oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
          oscillator.type = 'triangle';
          break;

        case 'wrong':
          // Error sound - descending buzz
          oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.3);
          gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator.type = 'sawtooth';
          break;

        case 'navigation':
          // Subtle navigation sound
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.05);
          gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
          oscillator.type = 'sine';
          break;

        case 'completion':
          // Celebration sound - multiple notes
          const frequencies = [523, 659, 784, 1047]; // C5, E5, G5, C6
          frequencies.forEach((freq, index) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(audioContext.destination);
            
            osc.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.1);
            gain.gain.setValueAtTime(0.1, audioContext.currentTime + index * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.3);
            
            osc.type = 'triangle';
            osc.start(audioContext.currentTime + index * 0.1);
            osc.stop(audioContext.currentTime + index * 0.1 + 0.3);
          });
          return; // Early return since we handle multiple oscillators

        case 'hover':
          // Very subtle hover sound
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.02);
          oscillator.type = 'sine';
          break;

        default:
          return;
      }

      const duration = options.duration || 0.1;
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);

    } catch (error) {
      console.warn('Sound effect failed:', error);
    }
  }, [getAudioContext]);

  // Play different sound effects
  const sounds = {
    click: () => playSound('click'),
    correct: () => playSound('correct', { duration: 0.4 }),
    wrong: () => playSound('wrong', { duration: 0.3 }),
    navigation: () => playSound('navigation', { duration: 0.05 }),
    completion: () => playSound('completion'),
    hover: () => playSound('hover', { duration: 0.02 })
  };

  return sounds;
};

export default useSoundEffects;
