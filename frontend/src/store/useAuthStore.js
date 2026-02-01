import {create} from "zustand"
import axiosInstance  from "../lib/axios.js"
import toast from "react-hot-toast";
export const useAuthStore=create((set)=>({
    authUser:null,
    isCheckingAuth:false,
    isSigningUp:false,
    isLoggingIn:false,
    onlineUsers: [],

    checkAuth :async()=>{
        try {
            const res =await axiosInstance.get("/auth/check")
            set({authUser:res.data})
        } catch (error) {
            console.log("Error in authCheck", error);
            set({authUser:null})

            
        }
        finally{
            set({isCheckingAuth:false})
        }
    },
      signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });

      toast.success("Account created successfully!");
    
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
   login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });

      toast.success("Logged in  successfully!");
    
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async()=>{
    try {
      await axiosInstance.post("/auth/logout")
      set({authUser:null});
      toast.success("Logged out successfully")
    } catch (error) {

      toast.error("Error logging out ");
      console.log("LogOut error :", error)
    }
  },
  updateProfile: async (data) => {
  try {
    const formData = new FormData();

    // text fields
    formData.append("name", data.name);
    formData.append("bio", data.bio);

    // file field (IMPORTANT)
    if (data.profilePic) {
      formData.append("profilePic", data.profilePic);
    }

    const res = await axiosInstance.put(
      "/auth/profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    set({ authUser: res.data });
    toast.success("Profile updated successfully");
  } catch (error) {
    console.log("Error in update profile:", error);
    toast.error(error?.response?.data?.message || "Update failed");
  }
},


}))

