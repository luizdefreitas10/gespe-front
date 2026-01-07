"use client";

import { destroyCookie, parseCookies, setCookie } from "nookies";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { decodeToken } from "@/services/jwt-decode/decode";
import { api } from "@/services/api";

type AuthContextType = {
  handleAuthWithToken: (accessToken: string) => void;
  handleSignOut: () => void;
  isAuthenticated?: boolean;
  setIsAuthenticaded: React.Dispatch<React.SetStateAction<boolean>>;
  loggedUser?: { id: string; role: string, token: string } | undefined;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  //   const { push, replace } = useRouter();
  const [loggedUser, setLoggedUser] = useState<
    { id: string; role: string, token: string } | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticaded] = useState(false);

  const checkAuthStatus = () => {
    setIsLoading(true);
    const { "gespe:x-token": sessionKey } = parseCookies();
    
    if (sessionKey) {
      const decoded = decodeToken(sessionKey);
      
      if (decoded?.sub && decoded.role) {
        setIsAuthenticaded(true);
        setLoggedUser({
          id: decoded.sub,
          role: decoded.role,
          token: sessionKey,
        });
      } else {
        setIsAuthenticaded(false);
        setLoggedUser(undefined);
      }
    } else {
      setIsAuthenticaded(false);
      setLoggedUser(undefined);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Verifica o status de autenticação na montagem
    checkAuthStatus();

    // Verifica quando a página recebe foco (útil se login foi feito em outra aba)
    const handleFocus = () => {
      checkAuthStatus();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  function handleAuthWithToken(acessToken: string) {
    console.log("handleauthToken executado");
    setCookie(undefined, "gespe:x-token", acessToken, {
      maxAge: 60 * 60 * 168, // 1 week
    });

    const decode = decodeToken(acessToken);

    console.log(decode?.role);
    console.log(decode?.sub);

    // Atualiza o estado imediatamente antes de redirecionar
    if (decode?.sub && decode.role) {
      setIsAuthenticaded(true);
      setLoggedUser({
        id: decode.sub,
        role: decode.role,
        token: acessToken,
      });
    }

    if (decode?.role) {
      if (
        decode?.role?.startsWith("GESTOR") ||
        decode.role.startsWith("ADMIN")
      ) {
        window.location.href = "/gestor";
      } else if (decode?.role?.startsWith("USER")) {
        window.location.href = "/user";
      }
    }
  }

  async function handleSignOut() {
    destroyCookie(undefined, "gespe:x-token");
    delete api.defaults.headers.common.Authorization;
    window.location.href = "/";
  }

  const contextValue: AuthContextType = {
    handleAuthWithToken,
    handleSignOut,
    isAuthenticated,
    setIsAuthenticaded,
    loggedUser,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext deve ser usado dentro de um AuthProvider");
  }
  return context;
};
