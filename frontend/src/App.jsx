import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

import {
  getDocuments,
  uploadDocument,
  deleteDocument,
  askQuestion,
} from "./api";


function App() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState(null);


  useEffect(() => {
    loadDocuments();
  }, []);


  const loadDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      setError("Unable to load documents.");
    }
  };


  const handleUpload = async (file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await uploadDocument(file);

      await loadDocuments();

      setSelectedDocument({
        id: result.document_id,
        filename: result.filename,
        total_pages: result.total_pages,
      });

      setMessages([]);

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Failed to process the document."
      );
    } finally {
      setUploading(false);
    }
  };


  const handleDelete = async (id) => {
    try {
      await deleteDocument(id);

      if (selectedDocument?.id === id) {
        setSelectedDocument(null);
        setMessages([]);
      }

      await loadDocuments();

    } catch (err) {
      setError("Failed to delete document.");
    }
  };


  const handleAsk = async (question) => {
    if (!question.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: question,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setLoading(true);
    setError(null);

    try {
      const response = await askQuestion(
        question,
        selectedDocument?.id ?? null
      );

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: response.answer,
        sources: response.sources || [],
      };

      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ]);

    } catch (err) {

      setError(
        err.response?.data?.detail ||
        "Something went wrong."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="h-screen overflow-hidden bg-[#f8fafc] text-slate-900">

      <div className="flex h-full">

        <Sidebar
          documents={documents}
          selectedDocument={selectedDocument}
          onSelectDocument={(document) => {
            setSelectedDocument(document);
            setMessages([]);
          }}
          onUpload={handleUpload}
          onDelete={handleDelete}
          uploading={uploading}
        />

        <ChatWindow
          selectedDocument={selectedDocument}
          messages={messages}
          loading={loading}
          error={error}
          onAsk={handleAsk}
        />

      </div>

    </div>
  );
}


export default App;