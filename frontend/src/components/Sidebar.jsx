import {
  FileText,
  Upload,
  Trash2,
  Plus,
  Sparkles,
} from "lucide-react";

import { useRef } from "react";


function Sidebar({
  documents,
  selectedDocument,
  onSelectDocument,
  onUpload,
  onDelete,
  uploading,
}) {

  const fileInputRef = useRef(null);


  const handleFile = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      onUpload(file);
    }

    event.target.value = "";
  };


  return (
    <aside className="hidden md:flex w-[280px] flex-col bg-[#0f172a] text-white">

      {/* Brand */}

      <div className="px-5 py-5 border-b border-white/10">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-900">

            <Sparkles size={19} />

          </div>

          <div>

            <h1 className="font-semibold tracking-tight">
              DocuQuery
            </h1>

            <p className="text-xs text-slate-400">
              AI document assistant
            </p>

          </div>

        </div>

      </div>


      {/* Upload */}

      <div className="p-4">

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFile}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100 disabled:opacity-50"
        >

          {uploading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
              Processing PDF...
            </>
          ) : (
            <>
              <Plus size={17} />
              Upload document
            </>
          )}

        </button>

      </div>


      {/* Documents */}

      <div className="flex-1 overflow-y-auto px-3">

        <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Your documents
        </p>


        {documents.length === 0 ? (

          <div className="px-3 py-8 text-center">

            <FileText
              size={28}
              className="mx-auto text-slate-600"
            />

            <p className="mt-3 text-sm text-slate-400">
              No documents yet
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Upload a PDF to get started
            </p>

          </div>

        ) : (

          <div className="space-y-1">

            {documents.map((document) => {

              const selected =
                selectedDocument?.id === document.id;

              return (

                <div
                  key={document.id}
                  onClick={() =>
                    onSelectDocument(document)
                  }
                  className={`group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition ${
                    selected
                      ? "bg-white/10"
                      : "hover:bg-white/5"
                  }`}
                >

                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      selected
                        ? "bg-white text-slate-900"
                        : "bg-white/10 text-slate-400"
                    }`}
                  >

                    <FileText size={17} />

                  </div>


                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-medium">
                      {document.filename}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {document.total_pages} pages
                    </p>

                  </div>


                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(document.id);
                    }}
                    className="hidden rounded-lg p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400 group-hover:block"
                  >

                    <Trash2 size={15} />

                  </button>

                </div>

              );
            })}

          </div>

        )}

      </div>


      {/* Footer */}

      <div className="border-t border-white/10 p-4">

        <div className="flex items-center gap-2 text-xs text-slate-500">

          <Upload size={13} />

          <span>PDF documents only</span>

        </div>

      </div>

    </aside>
  );
}


export default Sidebar;