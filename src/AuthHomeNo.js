import React from "react";
import { Link } from "react-router-dom";

function AuthHomeNo({ message }) {
  return (
    <div className="bg-white p-3 rounded w-25">
      <div>
        <h3 className="text-center">Welcome - Guest</h3>
        <p className="">You must login to access this page - {message}</p>
        <div className="d-grid gap-2">
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AuthHomeNo;
