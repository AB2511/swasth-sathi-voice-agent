'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { AnimatePresence, motion } from 'motion/react';
import { ConnectionState, useAgent, useSessionContext } from '@livekit/components-react';
import type { AppConfig } from '@/app-config';
import { AgentSessionView_01 } from '@/components/agents-ui/blocks/agent-session-view-01';
import { WelcomeView, type WelcomeViewState } from '@/components/app/welcome-view';

const MotionWelcomeView = motion.create(WelcomeView);
const MotionSessionView = motion.create(AgentSessionView_01);

const VIEW_MOTION_PROPS = {
  variants: {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
  transition: { duration: 0.4, ease: 'easeInOut' },
};

interface ViewControllerProps {
  appConfig: AppConfig;
}

export function ViewController({ appConfig }: ViewControllerProps) {
  const session = useSessionContext();
  const agent = useAgent();
  const { resolvedTheme } = useTheme();

  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const hasConnectedRef = useRef(false);

  const isConnected = session.isConnected;
  const isConnecting =
    session.connectionState === ConnectionState.Connecting ||
    agent.state === 'connecting' ||
    agent.state === 'initializing';

  useEffect(() => {
    if (isConnected) {
      hasConnectedRef.current = true;
      setHasEnded(false);
    } else if (
      hasConnectedRef.current &&
      session.connectionState === ConnectionState.Disconnected
    ) {
      setHasEnded(true);
      setHasStarted(false);
    }
  }, [isConnected, session.connectionState]);

  const handleStartCall = useCallback(async () => {
    setMicError(null);
    setHasEnded(false);
    setHasStarted(true);

    try {
      if (typeof window !== 'undefined' && navigator?.mediaDevices?.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true }).catch((err) => {
          if (
            err.name === 'NotAllowedError' ||
            err.name === 'PermissionDeniedError' ||
            err.name === 'NotFoundError'
          ) {
            throw err;
          }
        });
      }
      await session.start();
    } catch (err: unknown) {
      console.error('Connection or microphone error:', err);
      setHasStarted(false);
      setHasEnded(false);
      setMicError(
        'मायक्रोफोनची परवानगी मिळाली नाही. कृपया ब्राउझरच्या सेटिंग्जमध्ये मायक्रोफोनची परवानगी द्या आणि पुन्हा प्रयत्न करा.'
      );
    }
  }, [session]);

  let viewState: WelcomeViewState = 'ready';
  if (micError) {
    viewState = 'mic-error';
  } else if (hasEnded) {
    viewState = 'call-ended';
  } else if (hasStarted || isConnecting) {
    viewState = 'connecting';
  }

  return (
    <AnimatePresence mode="wait">
      {!isConnected && (
        <MotionWelcomeView
          key={`welcome-${viewState}`}
          {...VIEW_MOTION_PROPS}
          viewState={viewState}
          startButtonText={appConfig.startButtonText}
          errorMessage={micError || undefined}
          onStartCall={handleStartCall}
          onRetryCall={handleStartCall}
        />
      )}
      {isConnected && (
        <MotionSessionView
          key="session-view"
          {...VIEW_MOTION_PROPS}
          supportsChatInput={appConfig.supportsChatInput}
          supportsVideoInput={false}
          supportsScreenShare={false}
          isPreConnectBufferEnabled={appConfig.isPreConnectBufferEnabled}
          audioVisualizerType={appConfig.audioVisualizerType}
          audioVisualizerColor={
            resolvedTheme === 'dark'
              ? appConfig.audioVisualizerColorDark
              : appConfig.audioVisualizerColor
          }
          className="fixed inset-0"
        />
      )}
    </AnimatePresence>
  );
}
