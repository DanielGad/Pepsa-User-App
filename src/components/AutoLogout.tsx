import { useEffect, useRef, useCallback } from "react";
import { getUserId, logoutUser } from "../components/CartContext";
import { useNavigate } from "react-router-dom";
import { useSpinner } from "../components/CartContext";

const INACTIVITY_LIMIT = 0.5 * 60 * 1000;

const useAutoLogout = () => {
const { showSpinner } = useSpinner();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const userId = getUserId(); // recheck user ID when timeout triggers
      if (userId) {
        logoutUser();
        showSpinner("error", "Session Timed Out!")
        navigate("/login");
      }
    }, INACTIVITY_LIMIT);
  }, [navigate, showSpinner]);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    const activityEvents = ["mousemove", "keydown", "scroll", "touchstart"];
    const handleActivity = () => resetTimer();

    activityEvents.forEach(event =>
      window.addEventListener(event, handleActivity)
    );

    resetTimer();

    return () => {
      activityEvents.forEach(event =>
        window.removeEventListener(event, handleActivity)
      );
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer]);
};

export default useAutoLogout;
