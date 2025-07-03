import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn } = useUser();
  const location = useLocation();

  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
