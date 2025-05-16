import React, { useState } from "react";
import logo from "../images/logo.png";
import { IoEye, IoEyeOff } from "react-icons/io5"; // Import both icons
import { MdEmail } from "react-icons/md";
import { MdOutlineWifiPassword } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import rightIMG from "../images/loginRight.png";
import { api_base_url } from "../Helper";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${api_base_url}/login`, {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password: pwd,
        }),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("userId", data.user.id);
        navigate("/"); // Redirect to home page
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred. Please try again.");
    }
  };

  const loginAsGuest = () => {
    localStorage.setItem("token", "guest-token");
    localStorage.setItem("isLoggedIn", true);
    localStorage.setItem("userId", "682727a14bc47d745b1c46b2"); // ✅ must be a real MongoDB ObjectId

    window.location.href = "/";
  };

  return (
    <>
      <div className="flex overflow-hidden items-center w-screen justify-center flex-col h-screen bg-[#F0F0F0]">
        <div className="flex w-full items-center">
          <div className="left w-[30%] flex flex-col ml-[100px]">
            <img className="w-[210px]" src={logo} alt="" />
            <form onSubmit={login} className="pl-3 mt-5" action="">
              <div className="inputCon">
                <p className=" text-[14px] text-[#808080]">Email</p>
                <div className="inputBox w-[100%]">
                  <i>
                    <MdEmail />
                  </i>
                  <input
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    value={email}
                    type="email"
                    placeholder="Email"
                    id="Email"
                    name="Email"
                    required
                  />
                </div>
              </div>

              <div className="inputCon">
                <p className=" text-[14px] text-[#808080]">Password</p>
                <div className="inputBox w-[100%] flex items-center">
                  <i>
                    <MdOutlineWifiPassword />
                  </i>
                  <input
                    onChange={(e) => {
                      setPwd(e.target.value);
                    }}
                    value={pwd}
                    type={showPassword ? "text" : "password"} // Toggle input type
                    placeholder="Password"
                    id="Password"
                    name="Password"
                    required
                  />
                  <i
                    className="cursor-pointer !mr-3 !text-[25px]"
                    onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                  >
                    {showPassword ? <IoEyeOff /> : <IoEye />}{" "}
                    {/* Toggle icon */}
                  </i>
                </div>
              </div>

              <p className="text-red-500 text-[14px] my-2">{error}</p>
              <p>
                Don't have an account{" "}
                <Link to="/signUp" className="text-blue-500">
                  Sign Up
                </Link>
              </p>

              <button className="p-[10px] bg-green-500 transition-all hover:bg-green-600 text-white rounded-lg w-full border-0 mt-3">
                Login
              </button>
            </form>

            {/* Login as Guest Button */}
            <button
              className="p-[10px] bg-gray-500 transition-all hover:bg-gray-600 text-white rounded-lg w-full border-0 mt-3"
              onClick={loginAsGuest}
            >
              Login as Guest
            </button>
          </div>
          <div className="right flex items-end justify-end">
            <img className="w-[35vw]" src={rightIMG} alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
