import {
  Sparkles,
  FileText,
  Search,
  BookOpen,
} from "lucide-react";


function EmptyState({
  selectedDocument,
  onAsk,
}) {

  const suggestions = [
    "Summarize this document",
    "What are the key concepts?",
    "Explain the main topic",
  ];


  return (
    <div className="flex min-h-full items-center justify-center px-5 py-16">

      <div className="w-full max-w-2xl text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">

          <Sparkles size={27} />

        </div>


        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">

          {selectedDocument
            ? "Ask anything about your document"
            : "Chat with your documents"}

        </h1>


        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">

          {selectedDocument
            ? `Ask questions and get answers grounded in ${selectedDocument.filename}.`
            : "Upload a PDF and use AI to find, understand, and explore information inside it."}

        </p>


        {!selectedDocument && (

          <div className="mt-10 grid gap-3 text-left sm:grid-cols-3">

            <Feature
              icon={<FileText size={17} />}
              title="Upload"
              description="Add your PDF documents"
            />

            <Feature
              icon={<Search size={17} />}
              title="Search"
              description="Find relevant information"
            />

            <Feature
              icon={<BookOpen size={17} />}
              title="Understand"
              description="Get grounded answers"
            />

          </div>

        )}


        {selectedDocument && (

          <div className="mt-8 flex flex-wrap justify-center gap-2">

            {suggestions.map((suggestion) => (

              <button
                key={suggestion}
                onClick={() => onAsk(suggestion)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                {suggestion}
              </button>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}


function Feature({
  icon,
  title,
  description,
}) {

  return (

    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">

        {icon}

      </div>

      <p className="text-sm font-medium">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>

  );
}


export default EmptyState;