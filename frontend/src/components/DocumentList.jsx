import {
  FileText,
  Trash2,
} from "lucide-react";


function DocumentList({
  documents,
  selectedDocument,
  onSelectDocument,
  onDelete,
}) {

  if (documents.length === 0) {
    return (
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
    );
  }


  return (
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

            {/* Document Icon */}

            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                selected
                  ? "bg-white text-slate-900"
                  : "bg-white/10 text-slate-400"
              }`}
            >

              <FileText size={17} />

            </div>


            {/* Document Information */}

            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-medium">
                {document.filename}
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                {document.total_pages} pages
              </p>

            </div>


            {/* Delete */}

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
  );
}


export default DocumentList;