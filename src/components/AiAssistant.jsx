import {
  LanguageIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import api from "../api/axios";

const languages = [
  { code: "en-US", name: "English" },
  { code: "hi-IN", name: "Hindi" },
  { code: "te-IN", name: "Telugu" },
];

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I'm your CryptoVault AI Assistant. How can I help you analyze your portfolio today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0].code);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // ---- Auto scroll ----
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---- Text to speech ----
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // prevent overlap
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang;
    window.speechSynthesis.speak(utterance);
  };

  // ---- AI Logic ----

 
  // ---- Message sender (single source of truth) ----
  const sendMessage = async (message) => {
  try {
    setIsTyping(true);

    // 1️⃣ add user message immediately
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: message },
    ]);

    // 2️⃣ call backend (Axios instance already adds JWT)
    const res = await api.post("/api/ai/chat", { message });

    const reply =
      res.data?.reply || "Sorry, I couldn't understand that.";

    // 3️⃣ add AI response
    setMessages((prev) => [
      ...prev,
      { sender: "ai", text: reply },
    ]);

    // 4️⃣ speak response
    speak(reply);
  } catch (err) {
    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: "⚠ AI service is temporarily unavailable.",
      },
    ]);
  } finally {
    setIsTyping(false);
  }
};


  // ---- Form submit ----
  const handleSend = async (e) => {
  e.preventDefault();
  if (!input.trim() || isTyping) return;

  const msg = input;
  setInput("");

  await sendMessage(msg);
};


  // ---- Voice input ----
  const handleMicClick = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput("");
      sendMessage(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-pink-500/45 to-purple-600 shadow-lg shadow-sky-500/30 flex items-center justify-center text-white"
      >
        <SparklesIcon className="h-8 w-8" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-28 right-8 z-50 w-[90vw] max-w-sm h-[70vh] max-h-[600px] flex flex-col"
          >
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl h-full flex flex-col shadow-2xl">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-slate-800/50">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <SparklesIcon className="h-5 w-5 text-pink-400" />
                  AI Assistant
                </h3>
                <div className="flex items-center gap-2">
                  <LanguageIcon className="h-5 w-5 text-slate-400" />
                  <select
                    id="language-select"
                    name="language-select"
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="bg-transparent text-slate-300 text-sm focus:outline-none"
                  >
                    {languages.map((lang) => (
                      <option
                        key={lang.code}
                        value={lang.code}
                        className="bg-slate-800"
                      >
                        {lang.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        msg.sender === "user"
                          ? "bg-purple-600 text-white rounded-br-none"
                          : "bg-slate-700/50 text-slate-300 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-2xl bg-slate-700/50 text-slate-300 flex gap-2">
                      <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse" />
                      <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse delay-150" />
                      <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse delay-300" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-slate-800/50">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <input
                  id="ai-message"
                  name="ai-message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your portfolio..."
                    className="w-full px-4 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleMicClick}
                    className={`p-2 rounded-full text-white ${
                      isListening ? "bg-red-600" : "bg-gray-600"
                    }`}
                  >
                    <MicrophoneIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="submit"
                    disabled={isTyping}
                    className="p-2 bg-sky-600 text-white rounded-full disabled:opacity-50"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
