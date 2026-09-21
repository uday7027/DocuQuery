# DocuQuery --- AI Document Q&A System

DocuQuery is a full-stack **Retrieval-Augmented Generation (RAG)**
application that allows users to upload PDF documents and ask
natural-language questions about their content.

Instead of sending the entire document directly to an LLM, DocuQuery
extracts the document text, splits it into smaller chunks, generates
vector embeddings, stores those embeddings in PostgreSQL using
**pgvector**, retrieves the most relevant chunks for a user's question,
and provides the retrieved context to an LLM to generate a grounded
answer.

## Features

-   Upload PDF documents
-   Extract PDF text page by page
-   Split documents into overlapping chunks
-   Generate embeddings using OpenAI
-   Store embeddings using PostgreSQL + pgvector
-   Perform cosine-similarity vector search
-   Ask natural-language questions about uploaded documents
-   Retrieve the most relevant document chunks
-   Generate context-grounded AI answers
-   Display source document and page information
-   Filter retrieval by a selected document
-   List uploaded documents
-   Delete documents
-   Responsive React-based interface
-   FastAPI Swagger/OpenAPI documentation

## Tech Stack

### Frontend

-   **React** --- Builds the interactive user interface
-   **Tailwind CSS** --- Styling and responsive UI
-   **Axios** --- HTTP communication with the FastAPI backend
-   **Lucide React** --- UI icons
-   **Vite** --- Frontend development and build tooling

### Backend

-   **Python** --- Backend and RAG implementation
-   **FastAPI** --- REST API framework
-   **Uvicorn** --- ASGI server
-   **Pydantic** --- Request validation

### Document Processing

-   **PyPDF** --- Extracts text from PDF files
-   **LangChain Text Splitters** --- Splits extracted text into
    overlapping chunks

### AI / RAG

-   **OpenAI `text-embedding-3-small`** --- Generates 1536-dimensional
    text embeddings
-   **OpenAI `gpt-4o-mini`** --- Generates answers from retrieved
    document context
-   **RAG** --- Combines vector retrieval with LLM generation

### Database

-   **PostgreSQL** --- Stores documents, chunks, metadata, and
    embeddings
-   **pgvector** --- Adds vector storage and similarity search
    capabilities to PostgreSQL
-   **SQLAlchemy** --- ORM for database models and queries

### Infrastructure

-   **Docker** --- Runs PostgreSQL with pgvector
-   **Docker Compose** --- Defines the local database environment

## Architecture

``` text
                         DOCUQUERY
                            |
             +--------------+--------------+
             |                             |
          FRONTEND                       BACKEND
             |                             |
     React + Tailwind                   FastAPI
             |                             |
           Axios                           |
             |                             |
             +---------- HTTP -------------+
                                           |
                              +------------+------------+
                              |                         |
                       DOCUMENT FLOW                CHAT FLOW
                              |                         |
                            PyPDF                    Question
                              |                         |
                     Text Extraction               Embedding
                              |                         |
                     LangChain Splitter                |
                              |                         |
                           Chunks                       |
                              |                         |
                     OpenAI Embeddings          pgvector Search
                              |                         |
                              +------------+------------+
                                           |
                                    Relevant Chunks
                                           |
                                           v
                                     OpenAI LLM
                                           |
                                           v
                                      Final Answer
                                           |
                                           v
                                         React
```

## RAG Pipeline

### 1. Document Ingestion

``` text
PDF
 ↓
FastAPI Upload API
 ↓
PyPDF
 ↓
Page-level text extraction
 ↓
LangChain RecursiveCharacterTextSplitter
 ↓
Text chunks
```

### 2. Embedding and Storage

``` text
Text Chunks
 ↓
OpenAI text-embedding-3-small
 ↓
1536-dimensional embeddings
 ↓
PostgreSQL + pgvector
```

### 3. Question Answering

``` text
User Question
 ↓
OpenAI Embedding
 ↓
Query Vector
 ↓
pgvector cosine-similarity search
 ↓
Top relevant chunks
 ↓
Context construction
 ↓
OpenAI GPT model
 ↓
Grounded Answer + Sources
```

## Why PostgreSQL + pgvector?

DocuQuery uses PostgreSQL with the pgvector extension instead of
introducing a separate vector database such as Pinecone.

This allows the application to store:

-   Document metadata
-   Document relationships
-   Page numbers
-   Text chunks
-   Embeddings

inside the same database.

pgvector also supports similarity search over the stored embeddings.

This keeps the architecture simple while still providing the
vector-search functionality required by the RAG pipeline.

## Project Structure

``` text
docuquery/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat_controller.py
│   │   │   ├── document_controller.py
│   │   │   └── search_controller.py
│   │   │
│   │   ├── models/
│   │   │   ├── document.py
│   │   │   └── document_entity.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── chat.py
│   │   │   └── search.py
│   │   │
│   │   ├── services/
│   │   │   ├── chat_service.py
│   │   │   ├── document_service.py
│   │   │   ├── embedding_service.py
│   │   │   └── retrieval_service.py
│   │   │
│   │   ├── database.py
│   │   └── main.py
│   │
│   ├── .env
│   ├── .gitignore
│   ├── requirements.txt
│   └── venv/
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInput.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── DocumentList.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
└── README.md
```

## Database Schema

### `documents`

  Column          Type       Description
  --------------- ---------- ---------------------------
  `id`            Integer    Primary key
  `filename`      String     Uploaded PDF filename
  `total_pages`   Integer    Number of extracted pages
  `created_at`    DateTime   Upload timestamp

### `document_chunks`

  Column          Type           Description
  --------------- -------------- ----------------------------
  `id`            Integer        Primary key
  `document_id`   Integer        Foreign key to `documents`
  `page_number`   Integer        Original PDF page number
  `content`       Text           Chunked document text
  `embedding`     Vector(1536)   OpenAI embedding

Relationship:

``` text
documents
    |
    | 1
    |
    | N
document_chunks
```

Deleting a document also deletes its associated chunks.

## API Endpoints

### Health Check

``` http
GET /health
```

Response:

``` json
{
  "status": "UP"
}
```

### Upload Document

``` http
POST /api/documents/upload
```

Accepts a PDF file using multipart form data.

Example response:

``` json
{
  "message": "Document processed successfully",
  "document_id": 1,
  "filename": "example.pdf",
  "total_pages": 10,
  "total_chunks": 25
}
```

### List Documents

``` http
GET /api/documents
```

Returns uploaded documents.

### Delete Document

``` http
DELETE /api/documents/{document_id}
```

Deletes the document and its associated chunks.

### Vector Search

``` http
POST /api/search
```

Example request:

``` json
{
  "query": "What technologies are mentioned?",
  "top_k": 5,
  "document_id": 1
}
```

### Chat

``` http
POST /api/chat
```

Example request:

``` json
{
  "question": "What are the main technologies used?",
  "top_k": 5,
  "document_id": 1
}
```

Example response structure:

``` json
{
  "answer": "The document mentions Java, Spring Boot, PostgreSQL...",
  "sources": [
    {
      "id": 12,
      "document_id": 1,
      "document_name": "resume.pdf",
      "page_number": 2,
      "similarity": 0.82
    }
  ]
}
```

## Getting Started

### Prerequisites

Install the following:

-   Python 3.12+
-   Node.js 18+
-   Docker Desktop
-   Git
-   OpenAI API key

### 1. Clone the Repository

``` bash
git clone <your-github-repository-url>
cd docuquery
```

### 2. Start PostgreSQL + pgvector

From the project root:

``` bash
docker compose up -d
```

Check the running container:

``` bash
docker ps
```

The PostgreSQL database is exposed on:

``` text
localhost:5432
```

### 3. Configure Backend

Go to the backend:

``` bash
cd backend
```

Create and activate a virtual environment:

#### Windows

``` bash
python -m venv venv
venv\Scripts\activate
```

#### macOS / Linux

``` bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

``` bash
pip install -r requirements.txt
```

Create a `.env` file:

``` env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/docuquery
OPENAI_API_KEY=your_openai_api_key
```

Do not commit `.env` to GitHub.

### 4. Enable pgvector

Connect to the PostgreSQL container:

``` bash
docker exec -it docuquery-postgres psql -U postgres -d docuquery
```

Then run:

``` sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Exit:

``` sql
\q
```

### 5. Run the Backend

From the `backend` directory:

``` bash
uvicorn app.main:app --reload
```

Backend:

``` text
http://localhost:8000
```

Swagger API documentation:

``` text
http://localhost:8000/docs
```

### 6. Run the Frontend

Open another terminal:

``` bash
cd frontend
npm install
npm run dev
```

Vite will provide the frontend URL, normally:

``` text
http://localhost:5173
```

## Environment Variables

Backend `.env`:

``` env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/docuquery
OPENAI_API_KEY=your_openai_api_key
```

Never expose API keys in the React frontend or commit them to source
control.

## Example Usage

### Upload a document

Upload a PDF through the DocuQuery interface.

The backend performs:

``` text
PDF
 ↓
Text extraction
 ↓
Chunking
 ↓
Embedding generation
 ↓
Vector storage
```

### Ask a question

For example:

``` text
"What are the main technologies used in this project?"
```

DocuQuery performs:

``` text
Question
 ↓
Embedding
 ↓
Vector similarity search
 ↓
Relevant chunks
 ↓
LLM context
 ↓
Answer
```

The response also includes source information such as:

``` text
Document: resume.pdf
Page: 2
Relevance: 82%
```

## Key Design Decisions

### Why RAG?

A standard LLM does not automatically know the contents of a user's
uploaded documents.

RAG allows DocuQuery to retrieve relevant information from the user's
documents and provide that information to the LLM as context.

### Why chunk documents?

Large documents are divided into smaller pieces so that the retrieval
system can identify the most relevant sections instead of passing the
entire document to the LLM.

### Why overlapping chunks?

Chunk overlap helps preserve context when important information spans
the boundary between two chunks.

### Why embeddings?

Embeddings convert text into numerical vectors that capture semantic
relationships, allowing the system to find content that is conceptually
similar to a user's question.

### Why pgvector?

pgvector allows PostgreSQL to store and search embeddings without
introducing a separate vector database for this project.

### Why FastAPI?

FastAPI provides a lightweight Python framework for building the REST
APIs required by the React frontend and integrates naturally with the
Python AI/RAG ecosystem.

## Future Improvements

-   Streaming AI responses
-   Drag-and-drop PDF upload
-   Upload progress indicators
-   Chat history and conversation persistence
-   Multiple document selection
-   Improved source previews
-   Authentication and user-specific document storage
-   Hybrid keyword + vector search
-   Reranking retrieved chunks
-   Background document processing
-   Better PDF parsing for scanned documents using OCR
-   Automated database migrations
-   Dockerize the complete frontend and backend
-   Production deployment
-   Evaluation of RAG retrieval and answer quality

## Learning Outcomes

This project demonstrates practical experience with:

-   Retrieval-Augmented Generation
-   Vector embeddings
-   Semantic search
-   Vector databases / vector storage
-   PostgreSQL and pgvector
-   REST API development
-   FastAPI
-   React
-   LangChain text splitting
-   LLM integration
-   PDF processing
-   SQLAlchemy ORM
-   Docker
-   Full-stack application architecture

## License

This project is intended for educational and portfolio purposes.
