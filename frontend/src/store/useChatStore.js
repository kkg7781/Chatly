import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  /* ===================== STATE ===================== */
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,

  isUsersLoading: false,
  isMessagesLoading: false,

  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  /* ===================== UI HELPERS ===================== */
  toggleSound: () => {
    const next = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", JSON.stringify(next));
    set({ isSoundEnabled: next });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  /* ===================== API CALLS ===================== */
  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load chats");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  /* ===================== SEND MESSAGE ===================== */
  sendMessage: async ({ text, image }) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    if (!selectedUser) return;

    const tempId = `temp-${Date.now()}`;

    // ✅ optimistic preview only if image is File
    const previewUrl =
      image instanceof File ? URL.createObjectURL(image) : null;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: text || "",
      image: previewUrl,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    set({ messages: [...messages, optimisticMessage] });

    try {
      const formData = new FormData();
      if (text) formData.append("text", text);
      if (image instanceof File) formData.append("image", image);

      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );

      // remove optimistic + add real message
      set({
        messages: get().messages
          .filter((m) => m._id !== tempId)
          .concat(res.data),
      });

      // cleanup preview URL
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    } catch (err) {
      // rollback optimistic update
      set({ messages });

      if (previewUrl) URL.revokeObjectURL(previewUrl);

      toast.error(err.response?.data?.message || "Message failed to send");
    }
  },

  /* ===================== SOCKET ===================== */
  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    const { selectedUser, isSoundEnabled } = get();

    if (!socket || !selectedUser) return;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;

      set({ messages: [...get().messages, newMessage] });

      if (isSoundEnabled) {
        const sound = new Audio("/sounds/notification.mp3");
        sound.currentTime = 0;
        sound.play().catch(() => {});
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off("newMessage");
  },
}));
