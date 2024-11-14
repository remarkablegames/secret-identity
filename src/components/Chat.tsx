import { useChat } from 'ai/react';
import { API_URL, DEV } from 'src/constants';

import ChatError from './ChatError';
import Form from './Form';
import Header from './Header';
import Messages from './Messages';

export default function Chat() {
  // https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot
  // https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat
  const {
    error,
    handleInputChange,
    handleSubmit,
    input,
    isLoading,
    messages,
    reload,
  } = useChat({
    api: `${API_URL}/api/chat`,
    streamProtocol: 'text',

    initialMessages: [
      {
        role: 'assistant',
        content: 'How may I help you?',
        id: '1',
      },
    ],

    onError(error) {
      if (DEV) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
  });

  return (
    <section class="flex h-screen flex-col rounded-xl sm:h-[70vh] sm:border sm:shadow">
      <Header />
      <ChatError error={error} reload={reload} />
      <Messages messages={messages} />
      <Form
        isLoading={isLoading}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        value={input}
      />
    </section>
  );
}
