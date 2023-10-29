const box = document.getElementById("box");
const shape = document.getElementById("shape");

const colorbtn = document.getElementById("color-btn");
const shapebtn = document.getElementById("shape-btn");

const colors = ["green", "purple", "red", "blue", "yellow", "orange"];

colorbtn.addEventListener("click", changeColor);

function changeColor() {
  let random = Math.floor(Math.random() * colors.length);
  box.style.backgroundColor = colors[random];
}

const shapes = ["circle", "square", "rectangle", "triangle"];

shapebtn.addEventListener("click", changeShape);

function changeShape() {
  if (shape.classList.contains(shapes[0])) {
    shape.classList.remove(shapes[0]);
  }
  if (shape.classList.contains(shapes[1])) {
    shape.classList.remove(shapes[1]);
  }
  if (shape.classList.contains(shapes[2])) {
    shape.classList.remove(shapes[2]);
  }
  if (shape.classList.contains(shapes[3])) {
    shape.classList.remove(shapes[3]);
  }
  let random = Math.floor(Math.random() * shapes.length);
  shape.classList.add(shapes[random]);
}
