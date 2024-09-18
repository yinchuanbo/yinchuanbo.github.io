const fileInput = document.getElementById("fileInput");
const imageElement = document.getElementById("image");
const resultElement = document.getElementById("result");

fileInput.addEventListener("change", async function () {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async function () {
      const image = new Image();
      image.src = reader.result;
      image.onload = async function () {
        imageElement.src = reader.result;
        imageElement.style.display = "block";
        // ....
        const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
        const detectorConfig = {
          runtime: "mediapipe",
          solutionPath:
            "https://cdn.jsdelivr.net/npm/@mediapipe/face_detection",
        };
        detector = await faceDetection.createDetector(model, detectorConfig);
        const estimationConfig = {
          flipHorizontal: false,
        };
        const faces = await detector.estimateFaces(image, estimationConfig);
        console.log("faces", faces);
        resultElement.textContent = `检测到人脸数量：${faces.length}`;
        // ....
      };
    };
    reader.readAsDataURL(file);
  }
});
