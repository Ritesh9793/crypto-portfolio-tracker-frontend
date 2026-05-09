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
      text: "Hello. I can help explain portfolio activity, price trends, and risk signals.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0].code);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang;
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (message) => {
    try {
      setIsTyping(true);
      setMessages((prev) => [...prev, { sender: "user", text: message }]);

      const res = await api.post("/api/ai/chat", { message });
      const reply = res.data?.reply || "Sorry, I could not understand that.";

      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
      speak(reply);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "The AI service is temporarily unavailable.",
        },
      ]);
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async (event) => {
    event.preventDefault();
    if (!input.trim() || isTyping) return;

    const message = input;
    setInput("");
    await sendMessage(message);
  };

  const handleMicClick = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
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
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-7 right-7 z-50 flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(226,183,104,0.24)] bg-[linear-gradient(135deg,#d39b34,#915b0a)] text-white shadow-[0_18px_45px_rgba(145,91,10,0.34)]"
      >
        <SparklesIcon className="h-7 w-7" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-28 right-7 z-50 flex h-[70vh] max-h-[620px] w-[90vw] max-w-sm flex-col"
          >
            <div className="flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-[rgba(226,183,104,0.14)] bg-[rgba(24,17,11,0.98)] shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
              <div className="flex items-center justify-between border-b border-[rgba(226,183,104,0.08)] px-4 py-4">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold tracking-[0.08em] text-[#f7f2e8]">
                    <SparklesIcon className="h-5 w-5 text-[#d39b34]" />
                    AI Assistant
                  </h3>
                  <p className="mt-1 text-xs text-[#9d8c73]">
                    Explain portfolio and risk data
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <LanguageIcon className="h-5 w-5 text-[#9d8c73]" />
                  <select
                    id="language-select"
                    name="language-select"
                    value={selectedLang}
                    onChange={(event) => setSelectedLang(event.target.value)}
                    className="bg-transparent text-sm text-[#cbbca5] focus:outline-none"
                  >
                    {languages.map((language) => (
                      <option
                        key={language.code}
                        value={language.code}
                        className="bg-[#22170a]"
                      >
                        {language.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-[#9d8c73] transition hover:text-[#f7f2e8]"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-4">
                {messages.map((message, index) => (
                  <div
                    key={`${message.sender}-${index}`}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl p-3 text-sm leading-6 ${
                        message.sender === "user"
                          ? "rounded-br-sm bg-[rgba(211,155,52,0.18)] text-[#f7f2e8]"
                          : "rounded-bl-sm bg-[rgba(255,248,236,0.05)] text-[#cbbca5]"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-2 rounded-2xl rounded-bl-sm bg-[rgba(255,248,236,0.05)] p-3">
                      <span className="h-2 w-2 rounded-full bg-[#9d8c73] animate-pulse" />
                      <span className="h-2 w-2 rounded-full bg-[#9d8c73] animate-pulse" />
                      <span className="h-2 w-2 rounded-full bg-[#9d8c73] animate-pulse" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-[rgba(226,183,104,0.08)] p-4">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <input
                    id="ai-message"
                    name="ai-message"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Ask about your portfolio..."
                    className="app-input w-full px-4 py-3"
                  />
                  <button
                    type="button"
                    onClick={handleMicClick}
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-white ${
                      isListening ? "bg-[#b91c1c]" : "bg-[#6e4308]"
                    }`}
                  >
                    <MicrophoneIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="submit"
                    disabled={isTyping}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d39b34] text-[#120d08] disabled:opacity-60"
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
