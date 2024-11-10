import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import axios from "axios";
import { BASE_URL } from "@/utils/constant";

// types/AuthTypes.ts
export interface User {
  _id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  role: "admin" | "user";
  createdAt: string;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const value = localStorage.getItem("isLoggedIn");
    return value == "yes" ? true : false;
  });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log("effect isloogedd");
    const state = isLoggedIn == true ? "yes" : "no";
    localStorage.setItem("isLoggedIn", state);
  }, [isLoggedIn]);

  console.log(isLoggedIn);
  useEffect(() => {
    const checkUserStatus = async () => {
      console.log("provider auth effect \n\n");
      try {
        const response = await axios.get<User>(`${BASE_URL}/users/me`, {
          withCredentials: true,
        });
        console.log(response, `${BASE_URL}/users/me`);
        setUser(response.data);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error fetching user:", error);
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkUserStatus();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await axios.post<User>(
        `${BASE_URL}/users/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log(response, `${BASE_URL}/users/login`);
      setUser(response.data);
      setIsLoggedIn(true);
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post(
        `${BASE_URL}/users/logout`,
        {},
        { withCredentials: true }
      );
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
