import React, { FC } from "react";
import { Navigate } from "react-router-dom";
import useStore from "../store";

const ProtectedRoute: FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user } = useStore();

  // Redirect to welcome page if user isn't authenticated
  return user.userId !== "" ? element : <Navigate to='/welcome' replace />;
};

export default ProtectedRoute;
