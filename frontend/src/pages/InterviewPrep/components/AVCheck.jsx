import { motion } from 'framer-motion';
import { AlertTriangle, Smartphone, Chrome, VideoOff, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Button from '../../../components/Button';

export default function AVCheck({
  isMobile,
  isChrome,
  avVideoRef,
  avVideoWorking,
  avAudioWorking,
  error,
  confirmAVAndStart,
  setStep,
  avCheckStream,
  setAvCheckStream
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-4">
            <AlertTriangle className="w-4 h-4" />
            Equipment Check Required
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Confirm Your Setup</h1>
          <p className="text-muted-foreground">Please verify your camera and microphone are working before starting</p>
        </motion.div>

        {isMobile && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Smartphone className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-blue-200 text-sm">
                Mobile detected — text-answer mode is recommended. You can still use voice if your keyboard is hidden.
              </p>
            </div>
          </motion.div>
        )}

        {!isChrome && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <Chrome className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-300 font-medium">Chrome Browser Recommended</p>
                <p className="text-amber-400/70 text-sm mt-1">
                  For the best experience, please use Google Chrome. Speech recognition may not work properly in other browsers.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-background/50 border border-border rounded-2xl p-6 mb-6"
        >
          <div className="relative aspect-video bg-background rounded-xl overflow-hidden mb-6">
            <video
              ref={avVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {!avVideoWorking && (
              <div className="absolute inset-0 flex items-center justify-center bg-background">
                <div className="text-center">
                  <VideoOff className="w-12 h-12 text-muted-foreground/80 mx-auto mb-2" />
                  <p className="text-muted-foreground">Camera not detected</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`p-4 rounded-xl border ${avVideoWorking ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div className="flex items-center gap-3">
                {avVideoWorking ? (
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
                <div>
                  <p className={`font-medium ${avVideoWorking ? 'text-emerald-400' : 'text-red-400'}`}>
                    Camera
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {avVideoWorking ? 'Working' : 'Not detected'}
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${avAudioWorking ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div className="flex items-center gap-3">
                {avAudioWorking ? (
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
                <div>
                  <p className={`font-medium ${avAudioWorking ? 'text-emerald-400' : 'text-red-400'}`}>
                    Microphone
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {avAudioWorking ? 'Working' : 'Not detected'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                if (avCheckStream) {
                  avCheckStream.getTracks().forEach(track => track.stop());
                  setAvCheckStream(null);
                }
                setStep('setup');
              }}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={confirmAVAndStart}
              disabled={!avVideoWorking || !avAudioWorking}
              className="flex-1"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Confirm & Start Interview
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-muted-foreground"
        >
          <p>Make sure you're in a well-lit, quiet environment for the best results.</p>
        </motion.div>
      </div>
    </div>
  );
}
