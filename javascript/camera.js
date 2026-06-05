const video = document.getElementById("camera");

navigator.mediaDevices.getUserMedia({
  video: true
})
.then(function(stream){

  video.srcObject = stream;

})
.catch(function(error){

  console.log(error);

});

const canvas = document.getElementById("canvas");

const photo1 = document.getElementById("photo1");
const photo2 = document.getElementById("photo2");

let selectedFrame =
  Number(
    localStorage.getItem("selectedFrame")
  );

if(!selectedFrame){
  selectedFrame = 1;
}

let photoCount = 0;

/* ========================= */
/* FRAME SETUP */
/* ========================= */

if(selectedFrame === 1){

  document.getElementById("frameImage").src =
    "asset/frameRapunzel.PNG";

  document
    .querySelector(".strip-container")
    .classList.add("single-frame");

  photo2.style.display = "none";

}
else{

  document.getElementById("frameImage").src =
    "asset/frameMenara.PNG";

}

/* ========================= */
/* CAPTURE PHOTO */
/* ========================= */

function capturePhoto(){

  if(selectedFrame === 1 && photoCount >= 1){
    return;
  }

  if(selectedFrame === 2 && photoCount >= 2){
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");

  ctx.save();

  ctx.scale(-1,1);

  ctx.drawImage(
    video,
    -canvas.width,
    0,
    canvas.width,
    canvas.height
  );

  ctx.restore();

  const imageData =
    canvas.toDataURL("image/png");

  if(photoCount === 0){

    photo1.src = imageData;
    photoCount++;

  }
  else if(photoCount === 1){

    photo2.src = imageData;
    photoCount++;

  }

}

/* ========================= */
/* COUNTDOWN */
/* ========================= */

async function startCountdown(){

  const countdown =
    document.getElementById("countdown");

  for(let i = 3; i > 0; i--){

    countdown.innerText = i;

    await new Promise(
      resolve => setTimeout(resolve,1000)
    );

  }

  countdown.innerText = "📸";

  await new Promise(
    resolve => setTimeout(resolve,500)
  );

  countdown.innerText = "";

  capturePhoto();

}

/* ========================= */
/* BUTTON EVENTS */
/* ========================= */

document
.querySelector(".capture-btn")
.addEventListener("click", startCountdown);

document
.querySelector(".retake-btn")
.addEventListener("click", function(){

  photo1.src = "";
  photo2.src = "";

  photoCount = 0;

});

document
.querySelector(".download-btn")
.addEventListener("click", downloadStrip);

/* ========================= */
/* DOWNLOAD */
/* ========================= */

async function downloadStrip(){

  const frameImage =
    document.getElementById("frameImage");

  const downloadCanvas =
    document.createElement("canvas");

  const ctx =
    downloadCanvas.getContext("2d");

  const frame =
    new Image();

  frame.src = frameImage.src;

  await new Promise(resolve => {
    frame.onload = resolve;
  });

  downloadCanvas.width =
    frame.width;

  downloadCanvas.height =
    frame.height;

  if(selectedFrame === 2){

    const img1 = new Image();
    const img2 = new Image();

    img1.src = photo1.src;
    img2.src = photo2.src;

    await Promise.all([
      new Promise(r => img1.onload = r),
      new Promise(r => img2.onload = r)
    ]);

    ctx.drawImage(
      img1,
      225,
      270,
      3000,
      1500
    );

    ctx.drawImage(
      img2,
      225,
      2750,
      3000,
      1500
    );

  }
  else{

    const img1 = new Image();

    img1.src = photo1.src;

    await new Promise(
      r => img1.onload = r
    );

    ctx.drawImage(
      img1,
      7,
      53,
      1457,
      988
    );

  }

  ctx.drawImage(
    frame,
    0,
    0,
    frame.width,
    frame.height
  );

  const link =
    document.createElement("a");

  link.download =
    "Sunpetalcam.png";

  link.href =
    downloadCanvas.toDataURL(
      "image/png"
    );

  link.click();

}
