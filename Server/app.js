const express = require("express");

const app = express();
const socket = require("socket.io");
const PORT = 5500;

app.use(express.static("../client"));

app.get("/", (req, res) => {
  res.json({
    response: "OK",
  });
});

const server = app.listen(PORT, () => {
  console.log(`server is started on port ${PORT}`);
});

let io = socket(server);

io.on("connection", (socket) => {
  console.log(`connection build ${socket.id}`);

  // mouseMove
  socket.on("mouseMove", (data) => {
    io.emit("mouse-Move", data);
  });
  // mouse-down
  socket.on("mousedown", (data) => {
    io.emit("mouse-down", data);
  });

  // change-color

  socket.on("change-color", (color) => {
    io.emit("change-color", color);
  });

  // Eraser_event

  socket.on("eraser-event", (data) => {
    io.emit("eraser-event", data);
  });

  // eraser widht

  socket.on("eraser_width_change", (eraser_widht) => {
    io.emit("eraser_width_change", eraser_widht);
  });

  // pencil

  socket.on("pencil_width_change", (data) => {
    io.emit("pencil_width_change", data);
  });

  // undo

  socket.on("undo", (undoState) => {
    io.emit("undo", undoState);
  });

  socket.on("redo", (redoState) => {
    io.emit("redo", redoState);
  });
});
