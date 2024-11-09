import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import axios from "axios";

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

const BASE_URL = "http://localhost:8080/api"; // replace with your actual base URL

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  console.log(isLoggedIn);
  useEffect(() => {
    const checkUserStatus = async () => {
      console.log("provider auth effect \n\n");
      try {
        const response = await axios.get<User>(`${BASE_URL}/users/me`, {
          withCredentials: true,
        });
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
