import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import { handleError, handleSuccess } from "@/lib/toastutil";
import { ToastContainer } from "react-toastify";

interface User {
  username: string;
  email: string;
  password: string;
}

const SignUpForm: React.FC = () => {
  const navigate=useNavigate();
  const [userDetail, setUserDetail] = useState<User>({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { username, email, password } = userDetail;
    if (!username || !email || !password) {
      return handleError("All fields are required!");
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userDetail),
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => null); // Fallback if JSON fails
        return handleError(errorData?.message || "Login failed. Please try again.");
      }
      const data = await response.json();
      if (response.ok) {
        handleSuccess(data.message||"User registered successfully!");
        setTimeout(()=>{
          navigate('/login');
        },1000)
      } else {
        handleError(data.message || "Failed to register");
      }
      console.log("Response", response);
    } catch (error) {
      console.log("error: ", error);
      handleError("An error occurred during signup");
    }
    // console.log("Registered user :", userDetail);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetail({ ...userDetail, username: event.target.value });
  };

  const handlEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetail({ ...userDetail, email: event.target.value });
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetail({ ...userDetail, password: event.target.value });
  };
  return (
    <div className="form-container">
      <div className="auth-container">
        <div className="left-auth-container">
          <img src="/images/taskfront2.jpg" alt="" />
        </div>
        <div className="right-auth-container">
          <div className="login-container">
            <div className="login-container-content">
              <div className="title-header">
                <h1 className="title">SignUp</h1>
                <p className="sub-heading">Create your account within 20sec.</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    type="username"
                    placeholder="Enter your username"
                    onChange={handleUsernameChange}
                    value={userDetail.username}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter the email"
                    value={userDetail.email}
                    onChange={handlEmailChange}
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
                <button className="sign-in-btn" type="submit">
                  Sign up
                </button>
              </form>
              <div className="divider">
                <span>Or continue</span>
              </div>
              <div className="signup-content">
                Already have an account?{" "}
                <Link to={"/login"}>
                  <span className="signup-link">login</span>
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

export default SignUpForm;
