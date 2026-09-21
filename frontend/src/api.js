import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const uploadDocument = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/documents/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getDocuments = async () => {
  const response = await api.get("/documents");

  return response.data;
};

export const deleteDocument = async (id) => {
  const response = await api.delete(
    `/documents/${id}`
  );

  return response.data;
};

export const askQuestion = async (
  question,
  documentId = null
) => {

  const response = await api.post(
    "/chat",
    {
      question,
      top_k: 5,
      document_id: documentId,
    }
  );

  return response.data;
};