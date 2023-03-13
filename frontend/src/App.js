import "./App.css";
import { useState } from "react";
import axios from "axios";
import { BsFillFileEarmarkFill } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import ProgressBar from "./ProgressBar";

function App() {
  const [files, setFiles] = useState([]);
  const [urls, setUrls] = useState([]);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  

  const handleFileChange = (e) => {
    if (e.target.files) {
      // console.log(e.target.files);
      const fileList = Array.from(e.target.files);
      setFiles(fileList);
      // console.log(fileList)
    }
  };

  const handleCopyLink = (url) => {
    console.log(url);
    navigator.clipboard.writeText(url).then(
      () => {
        setIsLinkCopied(true);
      },
      () => {
        alert("Link copied failed");
      }
    );
  };

  const handleCancel = () => {
    setFiles((prevState) => prevState.splice(0, prevState.length));
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const config = {
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        setProgress(progress.toFixed(2));
      },
    };
    setIsUploading(true);
    axios
      .post("/", formData,config)
      .then(function (response) {
        setIsUploading(false);
        setUrls(response.data.urls);
      })
      .catch(function (error) {
        console.log(error);
      });

  };

  const handleDone = () => {
    setUrls((prevState) => prevState.splice(0, prevState.length));
    setFiles((prevState) => prevState.splice(0, prevState.length));
  };

  return (
    <div className="App">
      {urls.length === 0 && (
        <form onSubmit={handleFileSubmit}>
          {!isUploading && <div className="content">
            <h2>Upload a File</h2>
            <p>Select a file to upload from your computer</p>
          </div>}
          {files.length === 0 && (
            <label>
              <p>Choose a file</p>
              <BsFillFileEarmarkFill style={{ marginLeft: "5px" }} />
              <input type="file" name="file" onChange={handleFileChange} />
            </label>
          )}
          {!isUploading && files.length > 0 && (
            <div className="container">
              {files.length > 0 && (
                <p className="selected-files">
                  {files[0].name.substr(0, 20) + "..."}
                  <RxCross2 onClick={handleCancel} className="cross" />
                </p>
              )}
              <button type="submit">Upload</button>
            </div>
          )}
          {isUploading && <div className="progress-bar-container">
            <h2>Uploading...</h2>
            <p>Just give us a moment to process your file</p>
            <ProgressBar progress={progress} />
          </div>}
        </form>
      )}
      {urls.length > 0 && (
        <div className="links">
          <h2>Upload Successful!</h2>
          <p className="links-content">
            Your file has been uploaded. You can copy the link to your clipboard
          </p>
          {urls.map((url) => {
            return (
              <div className="btn">
                <button
                  onClick={() => {
                    handleCopyLink(url);
                  }}
                >
                  {isLinkCopied ? "Link Copied!" : "Copy link"}
                </button>
                <button onClick={handleDone}>Done</button>
              </div>
            );
          })}
        </div>
      )}
      
    </div>
  );
}

export default App;
