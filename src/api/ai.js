import api from "./axios";

export const sendAiMessage = async (message) => {
  const res = await api.post("/api/ai/chat", {
    message
  });
  return res.data.reply;
};
