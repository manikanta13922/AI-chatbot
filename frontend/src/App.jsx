// /* eslint-disable no-unused-vars */
// import { useState, useRef, useEffect } from "react";
// import { Send, Paperclip } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";

// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// export default function App() {
//   const [messages, setMessages] = useState([
//     { role: "assistant", content: "Hello! How can I help you today?" }
//   ]);
//   const [input, setInput] = useState("");
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const bottomRef = useRef(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   async function sendMessage() {
//     if (!input.trim() || loading) return;

//     const userText = input;
//     setInput("");
//     setLoading(true);

//     setMessages(prev => [...prev, { role: "user", content: userText }]);
//     setMessages(prev => [...prev, { role: "assistant", content: "Thinking…" }]);

//     const form = new FormData();
//     form.append("message", userText);
//     if (file) form.append("file", file);

//     try {
//       const res = await fetch("http://127.0.0.1:8000/chat-stream", {
//         method: "POST",
//         body: form
//       });

//       const reader = res.body.getReader();
//       let text = "";

//       while (true) {
//         const { value, done } = await reader.read();
//         if (done) break;

//         text += new TextDecoder().decode(value);

//         setMessages(prev => {
//           const updated = [...prev];
//           updated[updated.length - 1] = {
//             role: "assistant",
//             content: text
//           };
//           return updated;
//         });
//       }
//     } catch {
//       setMessages(prev => {
//         const updated = [...prev];
//         updated[updated.length - 1] = {
//           role: "assistant",
//           content: "⚠️ Backend error or timeout."
//         };
//         return updated;
//       });
//     }

//     setLoading(false);
//     setFile(null);
//   }

//   return (
//     <div className="h-screen bg-[#0b0f19] text-slate-200 flex">

//       {/* SIDEBAR */}
//       <aside className="w-72 bg-[#0e1322] border-r border-slate-800 p-4 hidden md:block">
//         <h2 className="text-xs font-semibold mb-4 uppercase tracking-wide text-slate-400">
//           Chat History
//         </h2>

//         <div className="space-y-2 text-sm overflow-y-auto h-[85%]">
//           {messages
//             .filter(m => m.role === "user")
//             .slice(-10)
//             .map((m, i) => (
//               <div
//                 key={i}
//                 className="truncate px-3 py-2 rounded-lg bg-[#141a2e] text-slate-300"
//               >
//                 {m.content}
//               </div>
//             ))}
//         </div>
//       </aside>

//       {/* MAIN */}
//       <div className="flex-1 flex flex-col">

//         {/* HEADER */}
//         <header className="p-4 border-b border-slate-800 text-sm font-semibold text-slate-300">
//           All-Rounder AI Assistant
//         </header>

//         {/* CHAT */}
//         <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
//           <AnimatePresence>
//             {messages.map((m, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 8 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className={`flex ${
//                   m.role === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`max-w-3xl text-[15px] leading-relaxed ${
//                     m.role === "user"
//                       ? "bg-[#2563eb] text-white px-4 py-3 rounded-2xl"
//                       : "text-slate-200"
//                   }`}
//                 >
//                   <ReactMarkdown
//                     remarkPlugins={[remarkGfm]}
//                     components={{
//                       p({ children }) {
//                         return <p className="mb-4 last:mb-0">{children}</p>;
//                       },
//                       code({ inline, className, children }) {
//                         const match = /language-(\w+)/.exec(className || "");

//                         if (!inline && match) {
//                           return (
//                             <SyntaxHighlighter
//                               style={vscDarkPlus}
//                               language={match[1]}
//                               PreTag="div"
//                               customStyle={{
//                                 background: "#020617",
//                                 borderRadius: "12px",
//                                 padding: "16px",
//                                 fontSize: "14px",
//                                 margin: "16px 0"
//                               }}
//                             >
//                               {String(children).replace(/\n$/, "")}
//                             </SyntaxHighlighter>
//                           );
//                         }

//                         return (
//                           <code className="px-1.5 py-0.5 rounded bg-[#1e293b] text-[#e879f9] text-sm">
//                             {children}
//                           </code>
//                         );
//                       },
//                       li({ children }) {
//                         return (
//                           <li className="ml-6 list-disc mb-2">
//                             {children}
//                           </li>
//                         );
//                       }
//                     }}
//                   >
//                     {m.content}
//                   </ReactMarkdown>
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//           <div ref={bottomRef} />
//         </div>

//         {/* INPUT */}
//         <div className="p-4 border-t border-slate-800 bg-[#0e1322] flex gap-3">
//           <input
//             type="file"
//             hidden
//             id="file"
//             onChange={e => setFile(e.target.files[0])}
//           />
//           <label
//             htmlFor="file"
//             className="p-2 rounded-lg bg-[#141a2e] hover:bg-[#1c2440] cursor-pointer"
//           >
//             <Paperclip size={18} />
//           </label>

//           <textarea
//             className="flex-1 bg-[#141a2e] rounded-xl px-4 py-3 resize-none text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-600"
//             value={input}
//             onChange={e => setInput(e.target.value)}
//             placeholder="Ask anything…"
//             rows={2}
//             onKeyDown={e => {
//               if (e.key === "Enter" && !e.shiftKey) {
//                 e.preventDefault();
//                 sendMessage();
//               }
//             }}
//           />

//           <button
//             onClick={sendMessage}
//             disabled={loading}
//             className="px-4 rounded-xl bg-[#1c2440] hover:bg-[#27326a] disabled:opacity-50"
//           >
//             <Send size={18} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }







// /* eslint-disable no-unused-vars */
// import { useState, useRef, useEffect } from "react";
// import { Send, Paperclip, Bot, User } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// export default function App() {
//   const [messages, setMessages] = useState([
//     { role: "assistant", content: "Hello! How can I help you today? 😊" }
//   ]);
//   const [input, setInput] = useState("");
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const bottomRef = useRef(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   async function sendMessage() {
//     if (!input.trim() || loading) return;

//     const userText = input;
//     setInput("");
//     setLoading(true);

//     setMessages(prev => [...prev, { role: "user", content: userText }]);
//     setMessages(prev => [...prev, { role: "assistant", content: "▌" }]); // typing cursor

//     const form = new FormData();
//     form.append("message", userText);
//     if (file) form.append("file", file);

//     try {
//       const res = await fetch("http://127.0.0.1:8000/chat-stream", {
//         method: "POST",
//         body: form
//       });

//       const reader = res.body.getReader();
//       let text = "";

//       while (true) {
//         const { value, done } = await reader.read();
//         if (done) break;

//         text += new TextDecoder().decode(value, { stream: true });

//         setMessages(prev => {
//           const updated = [...prev];
//           updated[updated.length - 1] = {
//             role: "assistant",
//             content: text || "▌"
//           };
//           return updated;
//         });
//       }

//       // Finalize typing
//       setMessages(prev => {
//         const updated = [...prev];
//         updated[updated.length - 1] = {
//           role: "assistant",
//           content: text || "..."
//         };
//         return updated;
//       });
//     } catch {
//       setMessages(prev => {
//         const updated = [...prev];
//         updated[updated.length - 1] = {
//           role: "assistant",
//           content: "⚠️ Oops! Something went wrong. Please try again."
//         };
//         return updated;
//       });
//     }

//     setLoading(false);
//     setFile(null);
//   }

//   return (
//     <div className="h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-slate-200 flex">

//       {/* SIDEBAR */}
//       <aside className="w-64 bg-gray-900/70 backdrop-blur-md border-r border-indigo-900/50 p-4 hidden md:block">
//         <h2 className="text-xs font-bold mb-4 uppercase tracking-wider text-indigo-300">
//           💬 Conversations
//         </h2>

//         <div className="space-y-2 text-sm overflow-y-auto h-[85%] scrollbar-thin scrollbar-thumb-indigo-800 scrollbar-track-transparent">
//           {messages
//             .filter(m => m.role === "user")
//             .slice(-8)
//             .map((m, i) => (
//               <motion.div
//                 key={i}
//                 whileHover={{ scale: 1.02, backgroundColor: "rgba(100,116,139,0.2)" }}
//                 className="truncate px-3 py-2 rounded-xl text-slate-300 cursor-pointer transition-all duration-200"
//               >
//                 {m.content.length > 30 ? m.content.substring(0, 28) + "..." : m.content}
//               </motion.div>
//             ))}
//         </div>
//       </aside>

//       {/* MAIN CHAT AREA */}
//       <div className="flex-1 flex flex-col">

//         {/* HEADER */}
//         <header className="p-4 border-b border-indigo-900/40 text-sm font-bold text-indigo-200 bg-gray-900/50 backdrop-blur-sm">
//           <div className="flex items-center gap-2">
//             <Bot className="text-indigo-400" size={20} />
//             All-Rounder AI Assistant
//           </div>
//         </header>

//         {/* CHAT MESSAGES */}
//         <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
//           <AnimatePresence>
//             {messages.map((m, i) => (
//               <motion.div
//                 key={i}
//                 layout
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 transition={{ type: "spring", damping: 15, stiffness: 200 }}
//                 className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
//               >
//                 <div className="flex gap-2 max-w-[85%]">
//                   {m.role === "assistant" && (
//                     <motion.div
//                       animate={{ scale: [1, 1.05, 1] }}
//                       transition={{ duration: 2, repeat: Infinity }}
//                       className="mt-1 flex-shrink-0"
//                     >
//                       <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
//                         <Bot size={14} className="text-white" />
//                       </div>
//                     </motion.div>
//                   )}

//                   <div
//                     className={`rounded-3xl px-5 py-4 relative ${
//                       m.role === "user"
//                         ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
//                         : "bg-gray-800/70 backdrop-blur-sm border border-gray-700 text-slate-100"
//                     }`}
//                   >
//                     <ReactMarkdown
//                       remarkPlugins={[remarkGfm]}
//                       components={{
//                         p({ children }) {
//                           return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>;
//                         },
//                         code({ inline, className, children }) {
//                           const match = /language-(\w+)/.exec(className || "");
//                           if (!inline && match) {
//                             return (
//                               <SyntaxHighlighter
//                                 style={vscDarkPlus}
//                                 language={match[1]}
//                                 PreTag="div"
//                                 customStyle={{
//                                   background: "#0d1117",
//                                   borderRadius: "12px",
//                                   padding: "14px",
//                                   fontSize: "13px",
//                                   margin: "12px 0"
//                                 }}
//                               >
//                                 {String(children).replace(/\n$/, "")}
//                               </SyntaxHighlighter>
//                             );
//                           }
//                           return (
//                             <code className="px-2 py-1 rounded-md bg-gray-700/50 text-pink-400 text-sm font-mono">
//                               {children}
//                             </code>
//                           );
//                         },
//                         li({ children }) {
//                           return <li className="ml-6 list-disc mb-1 text-slate-200">{children}</li>;
//                         },
//                         ul({ children }) {
//                           return <ul className="my-2">{children}</ul>;
//                         }
//                       }}
//                     >
//                       {m.content}
//                     </ReactMarkdown>

//                     {m.role === "user" && (
//                       <div className="absolute bottom-1 right-2 w-3 h-3 rounded-full bg-blue-300 opacity-60" />
//                     )}
//                   </div>

//                   {m.role === "user" && (
//                     <div className="mt-1 flex-shrink-0">
//                       <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center">
//                         <User size={14} className="text-white" />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>

//           {/* Typing Indicator */}
//           {loading && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="flex justify-start"
//             >
//               <div className="flex gap-2 max-w-[85%]">
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
//                   <Bot size={14} className="text-white" />
//                 </div>
//                 <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-3xl px-4 py-3">
//                   <div className="flex space-x-1">
//                     <motion.div
//                       animate={{ scaleY: [1, 0.5, 1] }}
//                       transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
//                       className="w-2 h-5 bg-indigo-400 rounded-full"
//                     />
//                     <motion.div
//                       animate={{ scaleY: [1, 0.5, 1] }}
//                       transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
//                       className="w-2 h-5 bg-indigo-400 rounded-full"
//                     />
//                     <motion.div
//                       animate={{ scaleY: [1, 0.5, 1] }}
//                       transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
//                       className="w-2 h-5 bg-indigo-400 rounded-full"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           <div ref={bottomRef} />
//         </div>

//         {/* INPUT BAR */}
//         <div className="p-4 border-t border-indigo-900/40 bg-gray-900/60 backdrop-blur-md">
//           <div className="flex items-end gap-3">
//             <input
//               type="file"
//               hidden
//               id="file"
//               onChange={(e) => setFile(e.target.files?.[0])}
//             />
//             <label
//               htmlFor="file"
//               className="p-2.5 rounded-full bg-gray-800/50 hover:bg-gray-700/70 cursor-pointer transition-all duration-200"
//               title="Attach file"
//             >
//               <Paperclip size={18} className="text-indigo-300" />
//             </label>

//             <textarea
//               className="flex-1 bg-gray-800/50 backdrop-blur-sm rounded-2xl px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none max-h-24"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Message All-Rounder AI…"
//               rows={1}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && !e.shiftKey) {
//                   e.preventDefault();
//                   sendMessage();
//                 }
//                 // Auto-resize (optional improvement)
//                 e.target.style.height = "auto";
//                 e.target.style.height = e.target.scrollHeight + "px";
//               }}
//             />

//             <motion.button
//               whileTap={{ scale: 0.95 }}
//               whileHover={{ scale: 1.05 }}
//               onClick={sendMessage}
//               disabled={loading || !input.trim()}
//               className={`p-3 rounded-full flex items-center justify-center transition-all ${
//                 loading || !input.trim()
//                   ? "bg-gray-700 cursor-not-allowed"
//                   : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
//               }`}
//             >
//               <Send size={18} className="text-white" />
//             </motion.button>
//           </div>

//           {file && (
//             <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
//               📎 {file.name}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }






/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! How can I help you today? 😊" }
  ]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);
  const streamTextRef = useRef(""); // ✅ SAFE mutable ref

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");
    setLoading(true);

    setMessages(prev => [...prev, { role: "user", content: userText }]);
    setMessages(prev => [...prev, { role: "assistant", content: "▌" }]);

    const form = new FormData();
    form.append("message", userText);
    if (file) form.append("file", file);

    streamTextRef.current = "";

    try {
      const res = await fetch("http://127.0.0.1:8000/chat-stream", {
        method: "POST",
        body: form
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        streamTextRef.current =
          streamTextRef.current + decoder.decode(value, { stream: true });

        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: streamTextRef.current || "▌"
          };
          return updated;
        });
      }

      // finalize
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: streamTextRef.current || "..."
        };
        return updated;
      });
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "⚠️ Backend error. Try again."
        };
        return updated;
      });
    }

    setLoading(false);
    setFile(null);
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-slate-200 flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900/70 backdrop-blur-md border-r border-indigo-900/50 p-4 hidden md:flex flex-col">
        <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
          Conversations
        </h2>

        <div className="text-sm text-slate-400 mb-4">
          <div className="font-semibold text-slate-200">Manikanta Reddy</div>
          <div className="text-xs text-slate-500">AI Chat Interface</div>
        </div>

        <div className="space-y-2 overflow-y-auto flex-1">
          {messages
            .filter(m => m.role === "user")
            .slice(-8)
            .map((m, i) => (
              <div
                key={i}
                className="truncate px-3 py-2 rounded-lg bg-slate-800/50 text-slate-300"
              >
                {m.content}
              </div>
            ))}
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="p-4 border-b border-indigo-900/40 bg-gray-900/50">
          <div className="flex items-center gap-2 font-semibold text-indigo-200">
            <Bot size={18} />
            All-Rounder AI Assistant
          </div>
        </header>

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="flex gap-2 max-w-[85%]">

                  {m.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                      <Bot size={14} className="text-white" />
                    </div>
                  )}

                  <div
                    className={`rounded-3xl px-5 py-4 ${
                      m.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-800/70 border border-gray-700"
                    }`}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ inline, className, children }) {
                          const match = /language-(\w+)/.exec(className || "");
                          if (!inline && match) {
                            return (
                              <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                customStyle={{
                                  background: "#0d1117",
                                  borderRadius: "12px",
                                  padding: "14px",
                                  fontSize: "13px",
                                  marginTop: "12px"
                                }}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            );
                          }
                          return (
                            <code className="px-2 py-1 rounded bg-gray-700/60 text-pink-400">
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>

                  {m.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                      <User size={14} className="text-white" />
                    </div>
                  )}

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="p-4 border-t border-indigo-900/40 bg-gray-900/60">
          <div className="flex gap-3 items-end">
            <input type="file" hidden id="file" onChange={e => setFile(e.target.files?.[0])} />
            <label htmlFor="file" className="p-2 bg-gray-800 rounded-full cursor-pointer">
              <Paperclip size={18} />
            </label>

            <textarea
              className="flex-1 bg-gray-800 rounded-2xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Message All-Rounder AI…"
              rows={1}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>

          {file && (
            <div className="mt-2 text-xs text-slate-400">📎 {file.name}</div>
          )}
        </div>
      </div>
    </div>
  );
}

