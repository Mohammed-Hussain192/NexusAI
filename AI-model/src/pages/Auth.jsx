import React from "react";
import { useForm } from "react-hook-form";
import {useNavigate} from 'react-router-dom'

import axios from "axios";
import "../styles/auth.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Cookies from "js-cookie";


const API_URL = import.meta.env.VITE_BASE_URL;


const AuthForm = () => {
  const [isLogin, setIsLogin] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState("");
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  });

  const toggleAuthMode = () => {
    reset();
    setServerError("");
    setIsLogin((prev) => !prev);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError("");

    try {
      if (isLogin) {
        // Login API call
        const response = await axios.post(`${API_URL}/login`, {
          email: data.email,
          password: data.password,
        });
        if (response.data.success) {
          Cookies.set("email",response.data.email,{expires:2})
          navigate("/home");
        } else {
          toast.error(response.data.message);
          setTimeout(() => {
            setIsLogin(false)
          }, 2000);
          
        }

        
       
      } else {
        // Register API call
        const response = await axios.post(`${API_URL}/register`, {
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        });
         if (response.data.success) {
          Cookies.set("email",response.data.email,{expires:2})

          navigate("/home");
        } else {
          toast.error(response.data.message);
          setTimeout(() => {
            setIsLogin(false)
          }, 2000);
          
        }

        
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* NAVBAR SECTION INSIDE SAME FILE */}
          <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <span className="logo-icon">🤖</span>
            <h1>Nexus AI</h1>
          </div>
        </div>
      </header>

      {/* AUTH FORM SECTION */}
      <div className="auth-container">
        <h2>{isLogin ? "Login" : "Register"}</h2>
        {serverError && <div className="error-message">{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                {...register("name", {
                  required: !isLogin && "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className={errors.name ? "error" : ""}
              />
              {errors.name && (
                <span className="error-message">{errors.name.message}</span>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className={errors.email ? "error" : ""}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={errors.password ? "error" : ""}
            />
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", {
                  required: !isLogin && "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                className={errors.confirmPassword ? "error" : ""}
              />
              {errors.confirmPassword && (
                <span className="error-message">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          )}

          <button type="submit" disabled={isLoading} className="auth-button">
            {isLoading
              ? "Processing..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}
          <button
            type="button"
            onClick={toggleAuthMode}
            className="toggle-button"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
