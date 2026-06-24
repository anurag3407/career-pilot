import { motion } from 'framer-motion';
import { Mic, XCircle, Loader2, FileText } from 'lucide-react';
import Button from '../../../components/Button';
import AvatarInterviewer from '../../../components/interview/AvatarInterviewer';
import ConfidenceMeter from '../../../components/ConfidenceMeter';
import BodyLanguageTips from '../../../components/BodyLanguageTips';

export default function QuestionCard({
  currentQuestion,
  currentQuestionIndex,
  isSpeaking,
  amplitude,
  isRecording,
  faceConfidence,
  visualizerCanvasRef,
  error,
  useTextInput,
  setUseTextInput,
  textAnswer,
  setTextAnswer,
  loading,
  submitTextAnswer,
  startRecording,
  stopRecording
}) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="p-4 rounded-2xl bg-background/50 border border-border">
        <AvatarInterviewer isSpeaking={isSpeaking} amplitude={amplitude} />
      </div>

      <div className="p-6 rounded-2xl bg-background/50 border border-border">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
            <span className="text-primary font-bold">{currentQuestionIndex + 1}</span>
          </div>
          <div className="flex-1">
            <span className="text-xs font-medium text-primary uppercase tracking-wide">
              {currentQuestion?.type} • {currentQuestion?.difficulty}
            </span>
            <h3 className="text-xl font-semibold text-foreground mt-1">{currentQuestion?.question}</h3>
          </div>
        </div>

        {isRecording && (
          <>
            <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Mic className="w-5 h-5 text-primary" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                </div>
                <div>
                  <p className="text-foreground font-medium">Recording in progress</p>
                  <p className="text-muted-foreground text-sm">Speak clearly into your microphone</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <ConfidenceMeter confidence={faceConfidence} />
            </div>
            <div className="mt-4 rounded-xl overflow-hidden border border-border/60 bg-slate-950 p-1 flex items-center justify-center">
              <canvas
                ref={visualizerCanvasRef}
                className="w-full h-24 bg-slate-900 rounded-lg shadow-inner"
              />
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <BodyLanguageTips currentQuestionIndex={currentQuestionIndex} />

      <div className="flex gap-3 w-full">
        {useTextInput ? (
          <div className="flex flex-col w-full gap-3">
            <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full min-h-[120px] p-4 rounded-xl bg-muted/50 border border-border text-foreground focus:ring-2 focus:ring-primary resize-y"
              disabled={loading}
            />
            <div className="flex gap-3">
              <Button onClick={() => setUseTextInput(false)} disabled={loading} variant="outline" className="flex-1 !py-4 !rounded-xl flex items-center justify-center gap-2">
                <Mic className="w-4 h-4" /> Use Microphone
              </Button>
              <Button onClick={submitTextAnswer} disabled={loading || !textAnswer.trim()} variant="primary" className="flex-[2] !py-4 !rounded-xl flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Submitting...' : 'Submit Answer'}
              </Button>
            </div>
          </div>
        ) : !isRecording ? (
          <div className="flex w-full gap-3">
            <Button onClick={() => setUseTextInput(true)} disabled={loading || isSpeaking} variant="outline" className="flex-1 !py-4 !rounded-xl flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" /> Type Answer
            </Button>
            <Button onClick={startRecording} disabled={loading || isSpeaking} variant="primary" className="flex-[2] !py-4 !rounded-xl flex items-center justify-center gap-2">
              <Mic className="w-5 h-5" />
              {isSpeaking ? 'Wait for question...' : 'Start Recording'}
            </Button>
          </div>
        ) : (
          <button onClick={stopRecording} disabled={loading} className="flex-1 w-full py-4 rounded-xl bg-red-500 hover:bg-red-600 text-foreground font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50">
            <XCircle className="w-5 h-5" />
            {loading ? 'Submitting...' : 'Stop & Submit'}
          </button>
        )}
      </div>

      <div className="p-4 rounded-xl bg-muted/30 border border-border">
        <p className="text-xs text-muted-foreground text-center">
          Complete all questions to see your feedback • No scores shown during interview
        </p>
      </div>
    </motion.div>
  );
}
