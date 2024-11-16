import { useChat } from 'ai/react';
import { API_URL, DEV } from 'src/constants';
import { incrementGuesses, overMaxGuesses } from 'src/helpers';

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
        content: "I'm a superhero. Can you guess my secret identity?",
        id: '1',
      },
    ],

    onFinish() {
      incrementGuesses();
      if (overMaxGuesses()) {
        setTimeout(() => location.reload(), 3000);
      }
    },

    onError(error) {
      if (DEV) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
  });

  return (
    <>
      <Header />
      <ChatError error={error} reload={reload} />
      <Messages messages={messages} />
      <Form
        isLoading={isLoading}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        value={input}
      />
    </>
  );
}
