import type { UseChatHelpers } from 'ai/react';
import { isMobile } from 'src/helpers';
import { drop, tick } from 'src/sounds';

import SubmitButton from './SubmitButton';

interface Props {
  isLoading: boolean;
  onChange: UseChatHelpers['handleInputChange'];
  onSubmit: UseChatHelpers['handleSubmit'];
  value: string;
}

export default function Form(props: Props) {
  return (
    <form
      class="flex w-full space-x-2 p-6"
      onSubmit={(event) => {
        props.onSubmit(event);
        drop.play();
      }}
    >
      <input
        autocomplete="off"
        class="border-input focus-visible:ring-ring flex h-9 w-full flex-1 rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
        onInput={(event) => {
          props.onChange(event);
          if (!isMobile) {
            tick.play();
          }
        }}
        placeholder="Type your guess..."
        value={props.value}
      />

      <SubmitButton disabled={props.isLoading} />
    </form>
  );
}
