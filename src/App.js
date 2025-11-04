import Navbar from "./components/navbar/Navbar";
import "./common.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireTelegram from "./components/notInTelegram/RequireTelegram";
import { init } from "@telegram-apps/sdk";
import { isTMA } from "@telegram-apps/bridge";

const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-700 text-lg font-medium">Authenticating...</p>
    </div>
  </div>
);

const ErrorDisplay = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Failed</h2>
      <p className="text-gray-600 mb-6">{error}</p>
      <button 
        onClick={onRetry}
        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-medium"
      >
        Retry
      </button>
    </div>
  </div>
);

const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [initTgData, setInitData] = useState(null);
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isInTelegramEnv = () => {
    try {
      return isTMA();
    } catch {
      return false;
    }
  };

  const authenticate = async (dataToSend) => {
    try {
      const res = await fetch("/api/v1/users/bake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initData: dataToSend
        }),
      });

      if (res.ok) {
        setIsAuth(true);
        setError(null);
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
    const insideTg = isInTelegramEnv();
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
    }

    try {
      const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
      const initData = window.Telegram.WebApp.initData;

      if(!initData || !initDataUnsafe){
        setIsAuth(false);
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

  return { isAuth, initTgData, isInTelegram, isLoading, error, retry };
};

function App() {
  const { isAuth, initTgData, isInTelegram, isLoading, error, retry } = useAuth();

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
        <Navbar />
        <Routes>
          <Route
            path="*"
            element={<Navbar />}             
          />
        </Routes>
      </BrowserRouter>
    );
  }

  // Fallback
  return <LoadingSpinner />;
}

export default App;