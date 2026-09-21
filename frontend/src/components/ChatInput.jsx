import { useState } from "react";

import {
  ArrowUp,
  Paperclip,
} from "lucide-react";


function ChatInput({
  onSend,
  disabled,
  selectedDocument,
}) {

  const [value, setValue] = useState("");


  const handleSubmit = () => {

    const question = value.trim();

    if (!question || disabled) return;

    onSend(question);

    setValue("");
  };


  const handleKeyDown = (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      handleSubmit();
    }
  };


  return (
    <div className="border-t border-slate-200 bg-white px-4 py-4 md:px-8">

      <div className="mx-auto max-w-3xl">

        <div className="relative flex items-end rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm transition focus-within:border-slate-300 focus-within:bg-white focus-within:shadow-md">

          <div className="flex items-center px-2 pb-2 text-slate-400">

            <Paperclip size={18} />

          </div>


          <textarea
            value={value}
            onChange={(event) =>
              setValue(event.target.value)
            }
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={disabled}
            placeholder={
              selectedDocument
                ? "Ask a question..."
                : "Ask about your documents..."
            }
            className="max-h-32 min-h-[42px] flex-1 resize-none bg-transparent px-2 py-2.5 text-sm outline-none placeholder:text-slate-400 disabled:opacity-50"
          />


          <button
            onClick={handleSubmit}
            disabled={
              disabled ||
              !value.trim()
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
          >

            <ArrowUp size={17} />

          </button>

        </div>


        <p className="mt-2 text-center text-[10px] text-slate-400">

          AI responses are generated from your uploaded documents.

        </p>

      </div>

    </div>
  );
}


export default ChatInput;