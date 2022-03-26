//
let redColorPencil = document.querySelector("#pencil-red");
let yellowColorPencil = document.querySelector("#pencil-yellow");
let blackColorPencil = document.querySelector("#pencil-black");

let penilRange = document.querySelector("#pencil-range");
let eraserRange = document.querySelector("#eraser-range");
//

let canvas = document.querySelector("canvas");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// canvas.style.marginLeft = "15rem";

let contex = canvas.getContext("2d");

// default tools values----------------------------------------
contex.strokeStyle = "red";
contex.lineWidth = 5;
redColorPencil.style.border = "2px solid red";

//  States -------------------------------------------------------------

let isMouseDown = false;
let isEraserCicked = false;
let undoState = [];

let current_undo_state = 0;

let erase_width = 5;
let pencil_width = 5;

// -------------------------------------------------------------

canvas.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  // contex.moveTo(e.offsetX, e.offsetY);
  let data = {
    x: e.offsetX,
    y: e.offsetY,
  };
  //
  socket.emit("mousedown", data);
});

canvas.addEventListener("mousemove", (e) => {
  if (isMouseDown === true) {
    // contex.lineTo(e.offsetX, e.offsetY);
    let data = {
      x: e.offsetX,
      y: e.offsetY,
    };
    socket.emit("mouseMove", data);
  }
});

canvas.addEventListener("mouseup", (e) => {
  isMouseDown = false;
  // update canvas state
  let url = canvas.toDataURL();

  undoState.push(url);
  current_undo_state = undoState.length - 1;
});

// set pencil color

redColorPencil.addEventListener("click", () => {
  contex.strokeStyle = "red";
  socket.emit("change-color", "red");
  yellowColorPencil.style.border = "none";
  blackColorPencil.style.border = "none";
  redColorPencil.style.border = "2px solid red";
});
yellowColorPencil.addEventListener("click", () => {
  contex.strokeStyle = "yellow";
  socket.emit("change-color", "yellow");

  redColorPencil.style.border = "none";
  blackColorPencil.style.border = "none";
  yellowColorPencil.style.border = "2px solid yellow";
});
blackColorPencil.addEventListener("click", () => {
  contex.strokeStyle = "black";
  socket.emit("change-color", "black");

  redColorPencil.style.border = "none";
  yellowColorPencil.style.border = "none";
  blackColorPencil.style.border = "2px solid black";
});

penilRange.addEventListener("click", (e) => {
  contex.lineWidth = penilRange.value % 100;
  pencil_width = contex.lineWidth;
  socket.emit("pencil_width_change", pencil_width);
});

// eraser events
eraser.addEventListener("click", (e) => {
  console.log("erase event active ");
  if (!isEraserCicked) {
    isEraserCicked = true;
    contex.strokeStyle = "red";
    contex.lineWidth = pencil_width;

    let Eraser_obj = {
      color: contex.strokeStyle,
      width: pencil_width,
      isEraserCicked: true,
    };
    socket.emit("eraser-event", Eraser_obj);
  } else {
    contex.strokeStyle = "white";
    contex.lineWidth = erase_width;
    isEraserCicked = false;
    let Eraser_obj = {
      color: contex.strokeStyle,
      width: erase_width,
      isEraserCicked: false,
    };
    socket.emit("eraser-event", Eraser_obj);
  }
});

eraserRange.addEventListener("click", (e) => {
  contex.lineWidth = eraserRange.value;
  erase_width = contex.lineWidth;
  socket.emit("eraser_width_change", erase_width);
});

// download handler

download.addEventListener("click", (e) => {
  let URL = canvas.toDataURL();

  let a = document.createElement("a");
  a.href = URL;
  a.download = "canvas.jpg";
  a.click();
});

// redo-handler
redo.addEventListener("click", (e) => {
  if (current_undo_state < undoState.length - 1) current_undo_state++;
  socket.emit("redo", {
    current_undo_state: current_undo_state,
    undoState: undoState,
  });
  // display_image();
});

// undo-handler

undo.addEventListener("click", (e) => {
  if (current_undo_state > 0) current_undo_state--;
  socket.emit("undo", {
    current_undo_state: current_undo_state,
    undoState: undoState,
  });

  // display_image();
});

// display current image

const display_image = () => {
  let image = new Image();
  image.src = undoState[current_undo_state];

  image.addEventListener("load", (e) => {
    contex.clearRect(0, 0, canvas.width, canvas.height);
    contex.drawImage(image, 0, 0, canvas.width, canvas.height);
  });
};

//

// change color
socket.on("change-color", (color) => {
  console.log("color", color);

  contex.strokeStyle = color;
  if (color == "red") {
    yellowColorPencil.style.border = "none";
    blackColorPencil.style.border = "none";
  } else if (color == "yellow") {
    blackColorPencil.style.border = "none";
    redColorPencil.style.border = "none";
  } else {
    yellowColorPencil.style.border = "none";
    redColorPencil.style.border = "none";
  }
});

// mouse-down

socket.on("mouse-down", (data) => {
  contex.beginPath();
  console.log("down");

  contex.moveTo(data.x, data.y);
  contex.stroke();
});

// mouse-Move

socket.on("mouse-Move", (data) => {
  console.log("enter_mousemove");

  contex.lineTo(data.x, data.y);
  contex.stroke();
});

// eraser-event

socket.on("eraser-event", (data) => {
  contex.strokeStyle = data.color;
  contex.lineWidth = data.width;
  isEraserCicked = data.isEraserCicked;
});

// set-eraser-range
socket.on("eraser_width_change", (width) => {
  contex.lineWidth = width;
  erase_width = width;
});

// pencil-eraser-range

socket.on("pencil_width_change", (data) => {
  contex.lineWidth = data;
  pencil_width = data;
});

// undo

socket.on("undo", (data) => {
  current_undo_state = data.current_undo_state;
  undoState = data.undoState;
  display_image();
});

// redo

socket.on("redo", (data) => {
  current_undo_state = data.current_undo_state;
  undoState = data.undoState;
  display_image();
});
