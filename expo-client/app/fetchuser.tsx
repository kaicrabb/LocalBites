import * as SecureStore from "expo-secure-store";
import { use, useEffect, useState } from "react";

interface User {
    _id: string;
    Username: string;
    IsAdmin: boolean;
    Email: string;
}

// need a required default export

export const fetchUserInfo = async (): Promise<User | null> => {
    try {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
            const response = await fetch("https://localbites-4m9e.onrender.com/user_info", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                console.error("Failed to fetch user info:", response.statusText);
                return null;
            }
            const data = await response.json();
            console.log("User info response:", data.user);
            return data.user;
        }
        return null;
    }
    catch (err) {
        console.error("Failed to fetch user info", err);
        return null;
    }
};

export const clearUserInfo = async () => {
    try {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("user");
    }
    catch (err) {
        console.error("Failed to clear user info", err);
    }
};

export default function useUserInfo() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
    const loadUser = async () => {
      try {
        console.log("Starting user load...");

        const userData = await SecureStore.getItemAsync("user");

        if (userData) {
          console.log("Loaded user from storage:", userData);
          setUser(JSON.parse(userData));
        } else {
          console.log("No stored user, fetching...");

          const fetchedUser = await fetchUserInfo();

          if (fetchedUser) {
            setUser(fetchedUser);
            await SecureStore.setItemAsync("user", JSON.stringify(fetchedUser));
          }
        }
      } catch (err) {
        console.error("User load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);
    return { user, loading };
};