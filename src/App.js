import Navbar from "./components/navbar/Navbar";
import "./common.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireTelegram from "./components/notInTelegram/RequireTelegram";
import { retrieveLaunchParams } from "@telegram-apps/sdk";
import { isTMA } from "@telegram-apps/bridge";

const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [initTgData, setInitData] = useState(null);
  const [isInTelegram, setIsInTelegram] = useState(false);

  const isInTelegramEnv = () => {
    try {
      return isTMA();
    } catch {
      return false;
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
      }

      return;
    }

    try {
      const { initDataRaw, initData } = retrieveLaunchParams();
      console.log("initDataRaw:", initDataRaw);
      console.log("initData:", initData);

      setInitData(initDataRaw);

      fetch("/api/v1/users/bake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initData: initTgData
        }),
      })
        .then((res) => {
          if (res.ok) {
            setIsAuth(true);
          } else {
            console.error("Failed to authenticate:", res.status);
          }
        })
        .catch((err) => console.error("Fetch error:", err));
    } catch (err) {
      console.error("Error retrieving Telegram launch params:", err);
    }
  }, initTgData);

  return { isAuth, initTgData, isInTelegram };
};

function App() {
  const { isAuth, initTgData, isInTelegram } = useAuth();

  if (!isInTelegram) {
    return <RequireTelegram />;
  }

  
  if (isAuth) {
    return (
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="*"
            element={
              <div className="main-container">
                <h2>App initialized successfully!</h2>
                <pre>
                  <b>initData:</b>{" "}
                  {initTgData
                    ? JSON.stringify(initTgData, null, 2).substring(0, 120) + "..."
                    : "—"}
                </pre>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    );
  }

  // 🔵 Default fallback
  return <h1>Loading...</h1>;
}

export default App;
