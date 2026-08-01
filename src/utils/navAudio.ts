// All your instruction clips. Paths are relative to the /public folder.
// MP3s go in: public/audio/nav/
const CLIPS: Record<string, string> = {
  start: '/audio/nav/start.mp3',
  startDriving: '/audio/nav/start-driving.mp3',
  stop: '/audio/nav/stop.mp3',
  straight: '/audio/nav/straight.mp3',
  goForward: '/audio/nav/go-forward.mp3',
  goBack: '/audio/nav/go-back.mp3',
  turnLeft: '/audio/nav/turn-left.mp3',
  turnRight: '/audio/nav/turn-right.mp3',
  goSlightLeft: '/audio/nav/go-slight-left.mp3',
  goSlightRight: '/audio/nav/go-slight-right.mp3',
  bearRight: '/audio/nav/bear-right.mp3',
  uTurn: '/audio/nav/u-turn.mp3',
  enterRoundabout: '/audio/nav/enter-the-roundabout-move-it.mp3',
  exitRoundabout: '/audio/nav/exit-the-roundabout.mp3',
  youArrive: '/audio/nav/you-arrive.mp3',
  destinationLeft: '/audio/nav/your-destination-is-on-the-left.mp3',
  twoHundredMeters: '/audio/nav/two-hundred-meters.mp3',
  fiveHundredMeters: '/audio/nav/five-hundred-meters.mp3',
  thousandMeters: '/audio/nav/thousand-meters.mp3',
  oneAndHalfThousandMeters: '/audio/nav/one-and-a-half-thousand-meters.mp3',
  speedCamera: '/audio/nav/approaching-speed-camera-slow-down.mp3',
  heyStop: '/audio/nav/hey-stop-what-is-the-matter-with-you.mp3',
};

export type NavInstruction = keyof typeof CLIPS;

class NavAudioEngine {
  private clips: Map<string, HTMLAudioElement> = new Map();
  private queue: NavInstruction[] = [];
  private playing = false;
  private muted = false;
  private onPlayedCallback: ((instruction: NavInstruction) => void) | null = null;

  /**
   * Preload all clips so there's no lag on first play.
   * Call this once on app startup or when navigation starts.
   */  preload() {
    Object.entries(CLIPS).forEach(([key, src]) => {
      if (!this.clips.has(key)) {
        const audio = new Audio(src);
        audio.preload = 'auto';
        audio.load();
        this.clips.set(key, audio);
      }
    });
  }

  /**
   * Play a single instruction immediately.
   * Cancels anything currently playing.
   */  play(instruction: NavInstruction) {
    if (this.muted) return;
    const audio = this.clips.get(instruction);
    if (!audio) return;

    // Stop all other clips
    this.clips.forEach((clip) => {
      clip.pause();
      clip.currentTime = 0;
    });

    audio.currentTime = 0;
    audio.play().catch(() => {
      // Browser blocked autoplay — user needs to interact first
      console.warn('[navAudio] Play blocked. Call play() after a user gesture.');
    });

    this.onPlayedCallback?.(instruction);
  }

  /**
   * Queue multiple instructions to play in sequence.
   * e.g. queue(['fiveHundredMeters', 'turnRight'])
   * plays "500 meters" then "turn right" back to back.
   */  enqueue(...instructions: NavInstruction[]) {
    if (this.muted) return;
    this.queue.push(...instructions);
    if (!this.playing) this.playQueue();
  }

  private playQueue() {
    if (this.queue.length === 0) {
      this.playing = false;
      return;
    }

    this.playing = true;
    const instruction = this.queue.shift()!;
    const audio = this.clips.get(instruction);
    if (!audio || this.muted) {
      this.playQueue();
      return;
    }

    audio.currentTime = 0;
    audio.play().catch(() => {
      console.warn('[navAudio] Play blocked. Call after a user gesture.');
    });
    this.onPlayedCallback?.(instruction);

    audio.onended = () => this.playQueue();
  }

  /**
   * Clear the queue and stop current playback.
   */  cancel() {
    this.queue = [];
    this.playing = false;
    this.clips.forEach((clip) => {
      clip.pause();
      clip.currentTime = 0;
    });
  }

  /**
   * Mute/unmute. When muted, all calls are ignored.
   */  setMuted(muted: boolean) {
    this.muted = muted;
    if (muted) this.cancel();
  }

  isMuted() {
    return this.muted;
  }

  /**
   * Hook into playback for UI feedback (e.g. highlight the turn arrow).
   */  onPlayed(callback: (instruction: NavInstruction) => void) {
    this.onPlayedCallback = callback;
  }
}

// Export a singleton — one audio engine for the whole app
export const navAudio = new NavAudioEngine();


// ===================================================================
// src/hooks/useNavAudio.ts — React hook for the mute toggle
// Put this file at: src/hooks/useNavAudio.ts
// ===================================================================


// ===================================================================
// USAGE IN YOUR NAVIGATION COMPONENT
// ===================================================================
/*

import { useNavAudio } from '../hooks/useNavAudio';

function NavigationScreen() {
  const { muted, toggleMute, play, enqueue, preload } = useNavAudio();

  // Preload clips when navigation screen mounts
  useEffect(() => {
    preload();
  }, [preload]);

  // Mute button in your UI
  <button onClick={toggleMute}>
    {muted ? 'Unmute' : 'Mute'}
  </button>

  // When user starts navigation
  function handleStartNavigation() {
    play('startDriving');
  }

  // When approaching a turn in 500m
  // Plays "500 meters" then "turn right" back to back
  function handleApproachingTurn() {
    enqueue('fiveHundredMeters', 'turnRight');
  }

  // When user arrives
  function handleArrival() {
    enqueue('youArrive', 'destinationLeft');
  }

  // When approaching speed camera
  function handleSpeedCamera() {
    play('speedCamera');
  }

  // When user goes the wrong way
  function handleWrongDirection() {
    play('heyStop');
  }

  // Cancel everything when navigation stops
  function handleStopNavigation() {
    cancel();
    play('stop');
  }
}

*/