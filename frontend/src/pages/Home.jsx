import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { BsPlusLg } from "react-icons/bs";
import Docs from "../components/Docs";
import { MdOutlineTitle } from "react-icons/md";
import { api_base_url } from "../Helper";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [isCreateModelShow, setIsCreateModelShow] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const titleInputRef = useRef(null);

  const createDoc = () => {
    if (title === "") {
      setError("Please enter title");
      toast.error("Please enter a title");
    } else {
      fetch(api_base_url + "/createDoc", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          docName: title,
          userId: localStorage.getItem("userId"),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setIsCreateModelShow(false);
            toast.success("Document created successfully!");
            setTimeout(() => {
              navigate(`/createDocs/${data.docId}`);
            }, 1000); 
          } else {
            setError(data.message);
            toast.error(data.message || "Failed to create document.");
          }
        })
        .catch((err) => {
          console.error("Error creating doc:", err);
          toast.error("Server error. Please try again later.");
        });
    }
  };

  const getData = () => {
    fetch(api_base_url + "/getAllDocs", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.docs);
      })
      .catch((err) => {
        console.error("Error fetching docs:", err);
        toast.error("Failed to fetch documents.");
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleCreateButtonClick = () => {
    setIsCreateModelShow(true);
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      createDoc();
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-between px-[100px]">
        <h3 className="mt-7 mb-3 text-3xl">All Documents</h3>
        <button className="btnBlue" onClick={handleCreateButtonClick}>
          <i>
            <BsPlusLg />
          </i>{" "}
          Create New Document
        </button>
      </div>

      <div className="allDocs px-[100px] mt-4">
        {data
          ? data.map((el, index) => (
              <Docs key={index} docs={el} docID={`doc-${index + 1}`} />
            ))
          : ""}
      </div>

      {isCreateModelShow && (
        <div className="createDocsModelCon fixed top-0 left-0 right-0 bottom-0 bg-[rgb(0,0,0,.3)] w-screen h-screen flex flex-col items-center justify-center">
          <div className="createDocsModel p-[15px] bg-[#fff] rounded-lg w-[30vw] h-[26.5vh]">
            <h3 className="text-[20px]">Create New Document</h3>

            <div className="inputCon mt-3">
              <p className="text-[14px] text-[#808080]">Title</p>
              <div className="inputBox w-[100%]">
                <i>
                  <MdOutlineTitle />
                </i>
                <input
                  ref={titleInputRef}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setError("");
                  }}
                  onKeyDown={handleKeyDown}
                  value={title}
                  type="text"
                  placeholder="Title"
                  id="title"
                  name="title"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <div className="flex -mt-2 items-center gap-2 justify-between w-full">
              <button onClick={createDoc} className="btnBlue !min-w-[49%]">
                Create New Document
              </button>
              <button
                onClick={() => {
                  setIsCreateModelShow(false);
                  setTitle("");
                  setError("");
                }}
                className="p-[10px] bg-[#D1D5DB] text-black rounded-lg border-0 cursor-pointer min-w-[49%]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Home;
