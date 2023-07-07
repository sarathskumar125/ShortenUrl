import React, { useState } from "react";
import axios from "axios";
import { Navbar, Typography, Button, Input } from "@material-tailwind/react";

const App = () => {
  const [url, setUrl] = useState();
  const [shortenUrl, setShortenUrl] = useState([]);
  const urlArray = url?.split(",") && url?.split(" ")

  // Function for connect to server and shorten the urls
  const handleShorten = async () => {
    try {
      setShortenUrl([]);
      const Data = await axios.post("/api/shorten", { url: urlArray });
      setShortenUrl(Data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar className="mx-auto max-w-screen-xl px-4 py-3 mt-5 shadow-2xl mb-24">
        <div className="flex flex-wrap items-center justify-between gap-y-4 text-blue-gray-900">
          <Typography
            as="a"
            href="#"
            variant="h5"
            className="mx-auto cursor-pointer py-1.5 text-light-blue-700 animate-zoom-in-out"
            style={{
              animationDuration: "10s",
              animationIterationCount: "infinite",
              animationName: "zoom-in-out",
            }}
          >
            CLEAROUT.IO
          </Typography>
        </div>
      </Navbar>
      <div className="flex flex-wrap justify-center ">
        <span className="w-screen text-center text-2xl mb-2 font-bold">
          Paste links to shorten it
        </span>
        <span className="w-screen text-center text-xs mb-2 text-red-600">
        If multiple urls are pasted please use comma or space between urls
        </span>
        <div className="relative w-1/2 gap-2 mb-8">
          <Input
            type="search"
            label="Orliginal URL"
            className="pr-20"
            containerProps={{
              className: "min-w-[288px]",
            }}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button
            size="sm"
            className="!absolute right-1 top-1 rounded"
            onClick={handleShorten}
          >
            Shorten
          </Button>
        </div>
        <div className="w-screen text-center">
          {shortenUrl.length > 0 &&
            shortenUrl.map((data, index) => (
              <div className="mb-8" key={index}>
                <span>{index + 1}, </span>
                <span>Original url :</span>{" "}
                <a
                  href={data.full_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {data.full_url}
                </a>
                <br />
                <span>Shortened url :</span>
                <a
                  href={data.full_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {data.shortened_url}
                </a>
                <br />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default App;
