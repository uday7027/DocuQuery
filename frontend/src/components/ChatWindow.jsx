import { useEffect, useRef } from "react";

import {
  FileText,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import EmptyState from "./EmptyState";


function ChatWindow({
  selectedDocument,
  messages,
  loading,
  error,
  onAsk,
}) {

  const messagesEndRef = useRef(null);


  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages, loading]);


  return (
    <main className="flex min-w-0 flex-1 flex-col">

      {/* Header */}

      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">

            <Sparkles size={17} />

          </div>

          <div>

            <h2 className="text-sm font-semibold">
              Document Assistant
            </h2>

            {selectedDocument ? (

              <div className="flex items-center gap-1.5 text-xs text-slate-500">

                <FileText size={12} />

                <span className="max-w-[250px] truncate">
                  {selectedDocument.filename}
                </span>

              </div>

            ) : (

              <p className="text-xs text-slate-400">
                Ask questions about your documents
              </p>

            )}

          </div>

        </div>


        {selectedDocument && (

          <div className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:block">

            Document selected

          </div>

        )}

      </header>


      {/* Messages */}

      <div className="flex-1 overflow-y-auto">

        {messages.length === 0 ? (

          <EmptyState
            selectedDocument={selectedDocument}
            onAsk={onAsk}
          />

        ) : (

          <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">

            {messages.map((message) => (

              <ChatMessage
                key={message.id}
                message={message}
              />

            ))}


            {loading && (

              <div className="mt-6 flex gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">

                  <Sparkles size={15} />

                </div>

                <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">

                  <div className="flex gap-1">

                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />

                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:100ms]" />

                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:200ms]" />

                  </div>

                </div>

              </div>

            )}

            <div ref={messagesEndRef} />

          </div>

        )}

      </div>


      {/* Error */}

      {error && (

        <div className="mx-auto mb-2 flex w-full max-w-3xl items-center gap-2 px-4 text-sm text-red-600 md:px-8">

          <AlertCircle size={16} />

          {error}

        </div>

      )}


      {/* Input */}

      <ChatInput
        onSend={onAsk}
        disabled={loading}
        selectedDocument={selectedDocument}
      />

    </main>
  );
}


export default ChatWindow;