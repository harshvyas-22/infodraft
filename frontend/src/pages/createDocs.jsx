import { useParams, useLocation } from "react-router-dom"; // Add useLocation for getting the current URL
import Navbar from "../components/Navbar";
import React, { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-pro-react";
import { api_base_url } from "../Helper";

const createDocs = () => {
  let { docsId } = useParams();
  const location = useLocation(); // Get the current location
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState([]); // All documents
  const [filteredData, setFilteredData] = useState([]); // Filtered documents
  const [searchQuery, setSearchQuery] = useState(""); // Search query

  const updateDoc = () => {
    fetch(api_base_url + "/uploadDoc", {
      mode: "cors",
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        docId: docsId,
        content: content,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === false) {
          setError(data.message);
        } else {
          setError("Document saved successfully!");
        }
      })
      .catch((error) => {
        console.error("Error saving document:", error);
        setError("An error occurred while saving the document.");
      });
  };

  const getContent = () => {
    fetch(api_base_url + "/getDoc", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        docId: docsId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === false) {
          setError(data.message);
        } else {
          setContent(data.doc.content);
        }
      })
      .catch((error) => {
        console.error("Error fetching document:", error);
        setError("An error occurred while fetching the document.");
      });
  };

  const getAllDocs = () => {
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
        if (data.success) {
          setData(data.docs || []); // Ensure docs is an array
          setFilteredData(data.docs || []); // Initialize filtered data
        }
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = data
      .filter((doc) => doc.title.toLowerCase().includes(query))
      .sort((a, b) => a.title.localeCompare(b.title)); // Sort alphabetically
    setFilteredData(filtered);
  };

  const shareDoc = () => {
    const currentUrl = `${window.location.origin}${location.pathname}`;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert("URL copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy URL:", error);
        alert("Failed to copy URL. Please try again.");
      });
  };

  useEffect(() => {
    getContent();
    getAllDocs();
  }, []);

  return (
    <>
      <Navbar />
      <div className="px-[100px] mt-3">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl font-bold">Edit Document</h1>
          <div className="flex gap-3">
            <button
              className="p-[10px] bg-blue-500 transition-all hover:bg-blue-600 text-white rounded-lg border-0"
              onClick={updateDoc}
            >
              Save
            </button>
            <button
              className="p-[10px] bg-gray-500 transition-all hover:bg-gray-600 text-white rounded-lg border-0"
              onClick={shareDoc}
            >
              Share
            </button>
          </div>
        </div>
        <JoditEditor
          ref={editor}
          value={content}
          tabIndex={1} // tabIndex of textarea
          onChange={(e) => setContent(e)}
        />
        <p className="text-red-500 mt-2">{error}</p>

        {/* Search Bar */}
        <div className="mt-5">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={handleSearch}
            className="p-[10px] border border-gray-300 rounded-lg w-full"
          />
        </div>

        {/* Search Results */}
        <div className="mt-3">
          {filteredData.length === 0 ? (
            <p>No documents found</p>
          ) : (
            filteredData.map((doc) => (
              <div
                key={doc._id}
                className="p-[10px] border-b border-gray-300 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  console.log(`Selected document: ${doc.title}`);
                }}
              >
                {doc.title}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default createDocs;
