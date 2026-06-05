let selectedFrame = 1;

function selectFrame(frame, button){

  selectedFrame = frame;

  document
    .querySelectorAll(".frame-btn")
    .forEach(btn =>
      btn.classList.remove("selected")
    );

  button.classList.add("selected");

}

window.addEventListener("load", () => {

  document
    .querySelector(".frame-btn")
    .classList.add("selected");

});

document
.querySelector(".start-btn")
.addEventListener("click", function(){

  localStorage.setItem(
    "selectedFrame",
    selectedFrame
  );

  window.location.href = "camera.html";

});
