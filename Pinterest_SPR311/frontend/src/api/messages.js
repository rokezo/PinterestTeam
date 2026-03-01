import api from "./auth";
import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

export const messagesService = {
  getDialogs: async () => {
    const response = await api.get("/messages/dialogs");
    return response.data;
  },

  getConversation: async (userId) => {
    const response = await api.get(`/messages/with/${userId}`);
    return response.data;
  },

  sendMessage: async (recipientId, content) => {
    const response = await api.post("/messages", { recipientId, content });
    return response.data;
  },

  sendMessageWithAttachment: async (recipientId, content, file) => {
    const formData = new FormData();
    formData.append("recipientId", recipientId);
    if (content && content.trim()) {
      formData.append("content", content.trim());
    }
    if (file) {
      formData.append("file", file);
    }

    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_BASE_URL}/messages/with-attachment`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    return response.data;
  },
};

