import {
  User,
  Sparkles,
  FileText,
} from "lucide-react";


function ChatMessage({ message }) {

  const isUser = message.role === "user";


  return (
    <div className={`mb-7 flex gap-3 ${isUser ? "justify-end" : ""}`}>

      {!isUser && (

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">

          <Sparkles size={15} />

        </div>

      )}


      <div
        className={`max-w-[85%] ${
          isUser
            ? "rounded-2xl rounded-tr-sm bg-slate-900 px-4 py-3 text-white"
            : "flex-1"
        }`}
      >

        <div className="flex items-start gap-2">

          {isUser && (
            <User
              size={15}
              className="mt-0.5 shrink-0 text-slate-400"
            />
          )}

          <p className="whitespace-pre-wrap text-sm leading-7">
            {message.content}
          </p>

        </div>


        {!isUser &&
          message.sources?.length > 0 && (

            <div className="mt-5">

              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Sources
              </p>

              <div className="grid gap-2 sm:grid-cols-2">

                {message.sources.map((source) => (

                  <div
                    key={source.id}
                    className="rounded-xl border border-slate-200 bg-white p-3"
                  >

                    <div className="flex items-start gap-2">

                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100">

                        <FileText size={14} />

                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-xs font-medium text-slate-700">
                          {source.document_name}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400">
                          Page {source.page_number}
                          {" · "}
                          {Math.round(
                            source.similarity * 100
                          )}% relevance
                        </p>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          )}

      </div>

    </div>
  );
}


export default ChatMessage;