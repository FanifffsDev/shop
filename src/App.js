import Navbar from "./components/navbar/Navbar";
import "./common.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireTelegram from "./components/notInTelegram/RequireTelegram";
import { isTMA } from "@telegram-apps/bridge";
import { setToken } from "./utils/authUtils";

import errorStyles from "./styles/errorDisplay.module.css";
import StartScreen from "./components/StartScreen/StartScreen";
import LoadingSpinner from "./components/loadingSpinner/LoadingSpinner";

const ErrorDisplay = ({ error, onRetry }) => (
  <div className={errorStyles.container}>
    <div className={errorStyles.card}>
      <div className={errorStyles.iconCircle}>
        <svg className={errorStyles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className={errorStyles.title}>Authentication Failed</h2>
      <p className={errorStyles.message}>{error}</p>
      <button onClick={onRetry} className={errorStyles.button}>Retry</button>
    </div>
  </div>
);

const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [initTgData, setInitData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const authenticate = async (dataToSend) => {
    try {
      const res = await fetch("/api/v1/users/bake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initData: dataToSend,
          timestamp: Date.now()
        }),
      });

      if (res.ok) {
        const authHeader = res.headers.get("Authorization");
        if (authHeader && authHeader.startsWith("tma ")) {
          const token = authHeader.substring("tma ".length);
          setToken(token);
          setIsAuth(true);
        }
        else{
          setIsAuth(false);
          setError(null);
        }

      } else {
        throw new Error(`Authentication failed with status: ${res.status}`);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    /*const insideTg = isInTelegramEnv();
    setIsInTelegram(insideTg);

    if (!insideTg) {
      console.warn("App is not running inside Telegram.");

      if (process.env.NODE_ENV === "development") {
        console.log("Development mode: using mock Telegram data.");
        const mockData = {
          user: {
            id: 1,
            username: "local_dev",
            first_name: "Dev",
            last_name: "User",
          },
        };
        setInitData(mockData);
        setIsAuth(true);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }

      return;
    }*/

    try {
      const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
      const initData = window.Telegram.WebApp.initData;

      if(!initData || !initDataUnsafe){
        console.error("Error retrieving Telegram launch params: No init data found.");
        setError("Failed to retrieve Telegram launch parameters.");
        setIsLoading(false);
        return;
      }

      setInitData(initDataUnsafe);
      authenticate(initData);

    } catch (err) {
      console.error("Error retrieving Telegram launch params:", err);
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  const retry = () => {
    setError(null);
    setIsLoading(true);
    window.location.reload();
  }; 

  

  return { isAuth, initTgData, isLoading, error, retry, };
};

const isInTelegramEnv = () => {
  try {
    return isTMA();
  } catch {
    return false;
  }
}

function App() {
  const { isAuth, initTgData, isLoading, error, retry } = useAuth();

  const isInTelegram  = isInTelegramEnv();


  if (!isInTelegram) {
    return <RequireTelegram />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={retry} />;
  }

  if (isAuth) {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/home"
            element={<Navbar />}
          />
          <Route
            path="*"
            element={<StartScreen />}
          />
        </Routes>
      </BrowserRouter>
    );
  }

  return <StartScreen />;
}

export default App;