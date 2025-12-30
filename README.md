# 🤖 AI Chatbot

A full-stack AI chatbot inspired by ChatGPT, built using **React and FastAPI**, featuring real-time streaming responses, file uploads, syntax highlighting, and a premium dark-mode UI.

---

## 🚀 Features

- 🔴 Real-time token-by-token AI response streaming
- ⌨️ Typing cursor & animated thinking indicator
- 📄 File upload support (PDF, resume, documents)
- 🧠 Context-aware AI responses
- 🧾 Markdown rendering with syntax-highlighted code blocks
- 🌙 Premium dark-mode UI (ChatGPT-style)
- ⚡ FastAPI backend with StreamingResponse
- 🔗 REST API integration

---

## 🛠 Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Framer Motion
- React Markdown + Remark GFM
- Prism Syntax Highlighter
- Lucide Icons

**Backend**
- FastAPI
- Python
- StreamingResponse
- LLM API integration
- CORS Middleware

---

## 📂 Project Structure

```

Ai-chatbot/
├── frontend/
│   └── src/
│       └── App.jsx
├── backend/
│   ├── main.py
│   ├── ai.py
│   └── requirements.txt
    └──.env
     

````
Get your own api key here : https://aistudio.google.com/app/apikey
---

## ▶️ Run Locally

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
````

### Frontend

```bash
cd frontend
npm install
npm run dev
```


---

## 👤 Author

**Gangavarapu Manikanta Reddy**
GitHub: [https://github.com/manikanta13922/AI-chatbot.git]

