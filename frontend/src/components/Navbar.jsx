import React, { useEffect, useState } from "react";
import logo from "../images/logo.png";
import { RiSearchLine } from "react-icons/ri";
import Avatar from "react-avatar";
import { api_base_url } from "../Helper";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [docs, setDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDocs, setFilteredDocs] = useState([]);

  const navigate = useNavigate();

  const getUser = () => {
    fetch(api_base_url + "/getUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: localStorage.getItem("userId") }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === false) setError(data.message);
        else setData(data.user);
      });
  };

  const getAllDocs = () => {
    fetch(api_base_url + "/getAllDocs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: localStorage.getItem("userId") }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDocs(data.docs);
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  };

  const logout = () => {
    fetch(api_base_url + "/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: localStorage.getItem("userId") }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === false) setError(data.message);
        else {
          localStorage.clear();
          navigate("/login");
        }
      });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = docs.filter((doc) =>
      doc.title.toLowerCase().includes(query)
    );
    setFilteredDocs(filtered);
  };

  useEffect(() => {
    getUser();
    getAllDocs();
  }, []);

  return (
    <>
      <div className="navbar flex flex-col md:flex-row items-center px-4 md:px-[100px] h-auto md:h-[90px] justify-between bg-[#fefdfd] relative z-10 border-b-2 border-gray-200 py-4 md:py-0">
        <img src={logo} alt="logo" className="w-[80px] h-auto mb-4 md:mb-0" />
        <div className="right flex flex-col md:flex-row items-center justify-end gap-4 md:gap-2 w-full md:w-auto">
          <div className="inputBox w-full md:w-[30vw] relative">
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-2 w-full md:w-[30vw] bg-white">
              <RiSearchLine />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={handleSearch}
                className="p-2 w-full focus:outline-none"
              />
            </div>

            {/* Search result dropdown */}
            {searchQuery && filteredDocs.length > 0 && (
              <div className="absolute top-[105%] left-0 right-0 bg-white border border-gray-300 max-h-[200px] overflow-y-auto rounded-md shadow-md z-50">
                {filteredDocs.map((doc) => (
                  <div
                    key={doc._id}
                    onClick={() => navigate(`/createDocs/${doc._id}`)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {doc.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-row gap-2">
            <button
              className="back-button p-[10px] min-w-[100px] md:min-w-[120px] bg-blue-500 text-white rounded-lg border-0 transition-all hover:bg-blue-600"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            <button
              onClick={logout}
              className="p-[10px] min-w-[100px] md:min-w-[120px] bg-red-500 text-white rounded-lg border-0 transition-all hover:bg-red-600"
            >
              Logout
            </button>

            <Avatar
              name={data ? data.name : ""}
              className="cursor-pointer"
              size="40"
              round="50%"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
