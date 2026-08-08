'use client';

import { type ComponentProps } from 'react';
import { AnimatePresence } from 'motion/react';
import { type AgentState, type ReceivedMessage } from '@livekit/components-react';
import { AgentChatIndicator } from '@/components/agents-ui/agent-chat-indicator';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';

export interface AgentChatTranscriptProps extends ComponentProps<'div'> {
  agentState?: AgentState;
  messages?: ReceivedMessage[];
  className?: string;
}

export function AgentChatTranscript({
  agentState,
  messages = [],
  className,
  ...props
}: AgentChatTranscriptProps) {
  return (
    <Conversation className={className} {...props}>
      <ConversationContent>
        {messages.map((receivedMessage) => {
          const { id, timestamp, from, message } = receivedMessage;
          const locale =
            typeof navigator !== 'undefined' ? (navigator?.language ?? 'en-US') : 'en-US';
          const messageOrigin = from?.isLocal ? 'user' : 'assistant';
          const speakerLabel = from?.isLocal ? 'तुम्ही' : 'स्वास्थ साथी';
          const time = new Date(timestamp);
          const title = time.toLocaleTimeString(locale, { timeStyle: 'short' });

          return (
            <Message key={id} title={title} from={messageOrigin}>
              <div
                className={`mb-1 text-[11px] font-semibold tracking-wide ${
                  from?.isLocal
                    ? 'text-right text-emerald-700 dark:text-emerald-400'
                    : 'text-left text-teal-700 dark:text-teal-400'
                }`}
              >
                {speakerLabel}
              </div>
              <MessageContent>
                <MessageResponse>{message}</MessageResponse>
              </MessageContent>
            </Message>
          );
        })}
        <AnimatePresence>
          {agentState === 'thinking' && (
            <div className="flex items-center gap-2 py-2 text-xs text-amber-600 dark:text-amber-400">
              <AgentChatIndicator size="sm" />
              <span>स्वास्थ साथी विचार करत आहे...</span>
            </div>
          )}
        </AnimatePresence>
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
