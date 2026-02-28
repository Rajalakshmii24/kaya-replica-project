import { useState, useEffect } from "react";
import CrmLogin from "@/components/crm/CrmLogin";
import CrmLayout from "@/components/crm/CrmLayout";

const CurrentMarket = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("crm_auth");
    const savedEmail = localStorage.getItem("crm_email");
    if (saved === "true") {
      setAuthenticated(true);
      if (savedEmail) setUserEmail(savedEmail);
    }
  }, []);

  const handleLogin = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setUserEmail("");
    localStorage.removeItem("crm_auth");
    localStorage.removeItem("crm_email");
  };

  if (!authenticated) {
    return <CrmLogin onLogin={handleLogin} />;
  }

  return <CrmLayout onLogout={handleLogout} userEmail={userEmail} />;
};

export default CurrentMarket;
