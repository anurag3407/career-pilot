import { motion } from 'framer-motion';
import { Video, VideoOff, Mic, MicOff, Volume2, VolumeX, RotateCcw, UserX } from 'lucide-react';

export default function DeviceBar({
  videoRef,
  videoEnabled,
  audioEnabled,
  isRecording,
  recordingTime,
  isSpeaking,
  faceVisible,
  toggleVideo,
  toggleAudio,
  stopSpeaking,
  replayQuestion,
  formatTime
}) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-6 rounded-2xl bg-background/50 border border-border">
      <div className="relative aspect-video bg-background rounded-xl overflow-hidden mb-4">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />
        {!videoEnabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <VideoOff className="w-12 h-12 text-muted-foreground/80" />
          </div>
        )}
        {isRecording && (
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-foreground rounded-full flex items-center gap-2 animate-pulse">
            <div className="w-2 h-2 bg-card rounded-full" />
            <span className="text-sm font-medium">REC {formatTime(recordingTime)}</span>
          </div>
        )}
        {isSpeaking && (
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-primary text-foreground rounded-full flex items-center gap-2">
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium">AI Speaking...</span>
          </div>
        )}
        {isRecording && !faceVisible && (
          <div className="absolute inset-0 bg-red-950/80 flex flex-col items-center justify-center">
            <UserX className="w-16 h-16 text-red-400 mb-3" />
            <p className="text-foreground font-semibold text-lg">Face Not Visible!</p>
            <p className="text-red-300 text-sm mt-1">Please position yourself in front of the camera</p>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-xl border transition-colors cursor-pointer ${videoEnabled ? 'bg-muted border-border text-foreground hover:bg-muted/80' : 'bg-red-500/20 border-red-500/30 text-red-400'}`}
        >
          {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-xl border transition-colors cursor-pointer ${audioEnabled ? 'bg-muted border-border text-foreground hover:bg-muted/80' : 'bg-red-500/20 border-red-500/30 text-red-400'}`}
        >
          {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
        {isSpeaking ? (
          <button
            onClick={stopSpeaking}
            className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 transition-colors cursor-pointer hover:bg-amber-500/30"
          >
            <VolumeX className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={replayQuestion}
            className="p-3 rounded-xl bg-primary/20 border border-primary/30 text-primary transition-colors cursor-pointer hover:bg-primary/90/30"
            title="Replay question"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
