/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

type SpeechListener = (state: {
  isSpeaking: boolean;
  isPaused: boolean;
  progressPercent: number;
  currentWord: string;
}) => void;

class SpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: Set<SpeechListener> = new Set();
  private isSpeaking = false;
  private isPaused = false;
  private speechRate = 1.0;
  private preferredVoice: SpeechSynthesisVoice | null = null;
  private words: string[] = [];
  private currentWord = '';
  private progressPercent = 0;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritize natural English voices
    const enVoices = voices.filter((v) => v.lang.startsWith('en'));
    const naturalEn = enVoices.find(
      (v) =>
        v.name.includes('Natural') ||
        v.name.includes('Google') ||
        v.name.includes('Samantha') ||
        v.name.includes('Daniel')
    );
    this.preferredVoice = naturalEn || enVoices[0] || voices[0] || null;
  }

  public subscribe(listener: SpeechListener): () => void {
    this.listeners.add(listener);
    listener({
      isSpeaking: this.isSpeaking,
      isPaused: this.isPaused,
      progressPercent: this.progressPercent,
      currentWord: this.currentWord,
    });
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) =>
      fn({
        isSpeaking: this.isSpeaking,
        isPaused: this.isPaused,
        progressPercent: this.progressPercent,
        currentWord: this.currentWord,
      })
    );
  }

  public speak(text: string, rate: number = 1.0) {
    this.stop();
    this.speechRate = rate;
    this.words = text.split(/\s+/);
    this.progressPercent = 0;
    this.currentWord = '';

    if (!this.synth) {
      // Graceful headless or unsupported browser simulation
      this.simulateSpeech(text);
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      if (this.preferredVoice) {
        utterance.voice = this.preferredVoice;
      }
      utterance.rate = Math.max(0.7, Math.min(1.5, rate));
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.isPaused = false;
        this.notify();
      };

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const charIdx = event.charIndex;
          this.progressPercent = Math.min(100, Math.round((charIdx / text.length) * 100));
          // Approximate current word
          const matched = text.substring(charIdx).match(/^\w+/);
          if (matched) {
            this.currentWord = matched[0];
          }
          this.notify();
        }
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.isPaused = false;
        this.progressPercent = 100;
        this.currentWord = '';
        this.notify();
      };

      utterance.onerror = (e) => {
        // Fall back to simulated progress if user audio gestures blocked
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          this.simulateSpeech(text);
        } else {
          this.isSpeaking = false;
          this.isPaused = false;
          this.notify();
        }
      };

      this.currentUtterance = utterance;
      this.synth.cancel(); // clear previous queue
      this.synth.speak(utterance);
    } catch {
      this.simulateSpeech(text);
    }
  }

  private simulationTimer: number | null = null;
  private simulateSpeech(text: string) {
    if (this.simulationTimer) clearInterval(this.simulationTimer);
    this.isSpeaking = true;
    this.isPaused = false;
    let wordIdx = 0;
    const words = text.split(/\s+/);

    this.simulationTimer = window.setInterval(() => {
      if (wordIdx < words.length) {
        this.currentWord = words[wordIdx];
        this.progressPercent = Math.round(((wordIdx + 1) / words.length) * 100);
        wordIdx++;
        this.notify();
      } else {
        if (this.simulationTimer) clearInterval(this.simulationTimer);
        this.isSpeaking = false;
        this.isPaused = false;
        this.progressPercent = 100;
        this.currentWord = '';
        this.notify();
      }
    }, 250);
  }

  public pause() {
    if (this.synth && this.isSpeaking && !this.isPaused) {
      try {
        this.synth.pause();
      } catch {}
      this.isPaused = true;
      this.notify();
    }
  }

  public resume() {
    if (this.synth && this.isSpeaking && this.isPaused) {
      try {
        this.synth.resume();
      } catch {}
      this.isPaused = false;
      this.notify();
    }
  }

  public stop() {
    if (this.simulationTimer) {
      clearInterval(this.simulationTimer);
      this.simulationTimer = null;
    }
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {}
    }
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentUtterance = null;
    this.currentWord = '';
    this.notify();
  }

  public toggle(text: string, rate: number = 1.0) {
    if (this.isSpeaking) {
      if (this.isPaused) {
        this.resume();
      } else {
        this.pause();
      }
    } else {
      this.speak(text, rate);
    }
  }
}

export const speech = new SpeechEngine();
