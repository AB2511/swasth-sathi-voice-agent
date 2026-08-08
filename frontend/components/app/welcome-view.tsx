'use client';

import React from 'react';
import { AlertTriangle, Loader2, Mic, PhoneCall, RefreshCw, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/shadcn/utils';

export type WelcomeViewState = 'ready' | 'connecting' | 'call-ended' | 'mic-error';

interface WelcomeViewProps {
  viewState?: WelcomeViewState;
  startButtonText?: string;
  onStartCall: () => void;
  onRetryCall?: () => void;
  errorMessage?: string;
}

function HealthcareIcon({ viewState }: { viewState: WelcomeViewState }) {
  if (viewState === 'connecting') {
    return (
      <div className="relative mb-6 flex size-24 animate-pulse items-center justify-center rounded-full border border-emerald-300 bg-emerald-100 text-emerald-600 dark:border-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400">
        <Loader2 className="size-12 animate-spin text-emerald-600 dark:text-emerald-400" />
      </div>
    );
  }

  if (viewState === 'mic-error') {
    return (
      <div className="mb-6 flex size-24 items-center justify-center rounded-full border border-amber-300 bg-amber-100 text-amber-600 dark:border-amber-700 dark:bg-amber-950/80 dark:text-amber-400">
        <AlertTriangle className="size-12" />
      </div>
    );
  }

  if (viewState === 'call-ended') {
    return (
      <div className="mb-6 flex size-24 items-center justify-center rounded-full border border-emerald-200 bg-slate-100 text-emerald-600 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-400">
        <PhoneCall className="size-12" />
      </div>
    );
  }

  // Ready State default icon
  return (
    <div className="relative mb-6 flex size-24 items-center justify-center rounded-full border-2 border-emerald-500/30 bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-500/10 dark:bg-emerald-950/60 dark:text-emerald-400">
      <Stethoscope className="size-12" />
      <span className="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full bg-emerald-600 text-xs text-white shadow">
        <Mic className="size-4" />
      </span>
    </div>
  );
}

export const WelcomeView = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & WelcomeViewProps
>(
  (
    {
      viewState = 'ready',
      startButtonText = 'बोलायला सुरुवात करा',
      onStartCall,
      onRetryCall,
      errorMessage,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('mx-auto w-full max-w-lg px-4 py-8', className)} {...props}>
        <section className="bg-card border-border/60 flex flex-col items-center justify-center rounded-3xl border p-8 text-center shadow-xl">
          <HealthcareIcon viewState={viewState} />

          {/* READY STATE */}
          {viewState === 'ready' && (
            <>
              <h2 className="text-foreground mb-2 text-2xl font-bold tracking-tight md:text-3xl">
                नमस्कार! मी स्वास्थ साथी
              </h2>
              <p className="text-muted-foreground mb-8 max-w-sm text-sm md:text-base">
                ग्रामीण महाराष्ट्रासाठी AI आरोग्य सहाय्यक
              </p>
              <Button
                size="lg"
                onClick={onStartCall}
                className="flex h-14 w-full max-w-xs items-center justify-center gap-2 rounded-full bg-emerald-600 text-lg font-medium text-white shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02] hover:bg-emerald-700 active:scale-[0.98]"
              >
                <Mic className="size-5" />
                <span>{startButtonText}</span>
              </Button>
              <p className="mt-3 text-xs font-medium text-emerald-800/80 dark:text-emerald-400/80">
                मोफत प्राथमिक आरोग्य माहिती • डॉक्टरांच्या सल्ल्याचा पर्याय नाही
              </p>
            </>
          )}

          {/* CONNECTING STATE */}
          {viewState === 'connecting' && (
            <>
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-emerald-700 md:text-3xl dark:text-emerald-400">
                जोडले जात आहे...
              </h2>
              <p className="text-muted-foreground max-w-sm text-sm md:text-base">
                कृपया थोडा वेळ थांबा.
              </p>
            </>
          )}

          {/* CALL ENDED STATE */}
          {viewState === 'call-ended' && (
            <>
              <h2 className="text-foreground mb-2 text-2xl font-bold tracking-tight md:text-3xl">
                संवाद समाप्त झाला
              </h2>
              <p className="text-muted-foreground mb-8 max-w-sm text-sm md:text-base">
                पुन्हा मदत हवी असल्यास आपण पुन्हा बोलू शकतो.
              </p>
              <Button
                size="lg"
                onClick={onStartCall}
                className="flex h-14 w-full max-w-xs items-center justify-center gap-2 rounded-full bg-emerald-600 text-lg font-medium text-white shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02] hover:bg-emerald-700 active:scale-[0.98]"
              >
                <RefreshCw className="size-5" />
                <span>पुन्हा बोलूया</span>
              </Button>
            </>
          )}

          {/* MICROPHONE PERMISSION ERROR STATE */}
          {viewState === 'mic-error' && (
            <>
              <h2 className="mb-2 text-xl font-bold tracking-tight text-amber-700 md:text-2xl dark:text-amber-400">
                मायक्रोफोनची परवानगी मिळाली नाही.
              </h2>
              <p className="text-muted-foreground mb-6 max-w-sm text-sm leading-relaxed">
                {errorMessage ||
                  'कृपया ब्राउझरच्या सेटिंग्जमध्ये मायक्रोफोनची परवानगी द्या आणि पुन्हा प्रयत्न करा.'}
              </p>
              <Button
                size="lg"
                onClick={onRetryCall || onStartCall}
                className="flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-full bg-amber-600 text-base font-medium text-white shadow-md transition-all hover:bg-amber-700"
              >
                <RefreshCw className="size-4" />
                <span>पुन्हा प्रयत्न करा</span>
              </Button>
            </>
          )}
        </section>

        {/* Footer Info */}
        <div className="text-muted-foreground mt-8 text-center text-xs">
          <p>स्वास्थ साथी — मोफत प्राथमिक आरोग्य माहिती सल्लागार</p>
        </div>
      </div>
    );
  }
);

WelcomeView.displayName = 'WelcomeView';
