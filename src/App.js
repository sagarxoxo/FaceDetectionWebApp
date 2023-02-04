import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

function App() {
  const [img, setImg] = useState(
    "https://www.nhm.ac.uk/content/dam/nhmwww/our-science/news/neanderthal-news.jpg.thumb.1160.1160.jpg"
  );
  const [box, setBox] = useState();

  const handleSubmit = () => {
    const raw = JSON.stringify({
      user_app_id: {
        user_id: "4b28fo5goj97",
        app_id: "my-first-application",
      },
      inputs: [
        {
          data: {
            image: {
              url: img,
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key f9c9d20ce4754ac0b2ab4b3f06ad8ff9",
      },
      body: raw,
    };

    fetch(
      "https://api.clarifai.com/v2/models/" +
        "face-detection" +
        "/versions/" +
        "45fb9a671625463fa646c3523a3087d5" +
        "/outputs",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) =>
        // console.log(result.outputs[0].data.regions[0].region_info.bounding_box)
        regionCalculate(result)
      )
      .catch((error) => console.log("error", error));
  };

  const regionCalculate = (data) => {
    const clrFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("imageUpload");
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height, clrFace);

    setBox({
      leftCr: clrFace.left_col * width,
      topCr: clrFace.top_row * height,
      rightCr: width - clrFace.right_col * width,
      bottomCr: height - clrFace.bottom_row * height,
    });
  };

  console.log(box);
  return (
    <div className="App">
      <h1>Face Detection</h1>
      <span>You can detect a face by uploading a image.</span>
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter URL of Image"
          onChange={(e) => {
            setImg(e.target.value);
            setBox({});
          }}
        />
        <button onClick={handleSubmit}>Detect</button>
      </div>
      <div className="img-section">
        <img id="imageUpload" src={img} />
        <div
          className="bounding_box"
          style={{
            top: box?.topCr,
            bottom: box?.bottomCr,
            left: box?.leftCr,
            right: box?.rightCr,
          }}
        ></div>
      </div>
    </div>
  );
}

export default App;
