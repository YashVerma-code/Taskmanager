import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import { handleError, handleSuccess } from "@/lib/toastutil";
import { ToastContainer } from "react-toastify";

interface User {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [isSubmitting,setIsSubmitting]=useState<boolean>(false);
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState<User>({
    email: "",
    password: "",
  });

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetail({ ...userDetail, email: event.target.value });
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetail({ ...userDetail, password: event.target.value });
  };
  const handleSubmit = async (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();
    const { email, password } = userDetail;
    if (!email || !password) {
      return handleError("All field are required!");
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userDetail),
        }
      );
      const data = await response.json();
      const {message,jwtToken,success,email}=data;
      if (success) {
        handleSuccess(message || "User logged In successfully!");
        localStorage.setItem('token',jwtToken)
        localStorage.setItem('loggedInUserEmail',email);
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        handleError(data.message || "Failed to register");
      }
    } catch (error) {
      console.log("Error occured: ", error);
      return handleError("An error ocurred during login");
    }finally{
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <div className="auth-container">
        <div className="left-auth-container">
          <img src="/images/taskfront3.jpg" alt="" />
        </div>
        <div className="right-auth-container">
          <div className="login-container">
            <div className="login-container-content">
              <div className="title-header">
                <h1 className="title">Welcome Back!</h1>
                <p className="sub-heading">Please enter login details below</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter the email"
                    value={userDetail.email}
                    onChange={handleEmailChange}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter the Password"
                    value={userDetail.password}
                    onChange={handlePasswordChange}
                  />
                </div>
                <button className="sign-in-btn" type="submit" disabled={isSubmitting}>
                {!isSubmitting?"Sign in":"Loading..."}
                </button>
              </form>
              <div className="divider">
                <span>Or continue</span>
              </div>
              <div className="signup-content">
                Don&apos;t have an account?{" "}
                <Link to={"/signup"}>
                  <span className="signup-link">SignUP</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default LoginForm;
