const options_container = document.querySelector(".options-container");
const tool_kit = document.querySelector(".tool-kit");
const tools = document.querySelector(".tools");
const pencil_tools_container = document.querySelector(
  ".pencil-tools-container"
);
const eraser_tools_container = document.querySelector(
  ".eraser-tools-container"
);

// const notes_container = document.querySelector(".notes_container");

//----------------------------------------- Tools --------------------------------------------------------

const pencil = document.querySelector(".pencil");
const eraser = document.querySelector(".eraser");
const undo = document.querySelector(".undo");
const redo = document.querySelector(".redo");
const download = document.querySelector(".download");
const upload = document.querySelector(".upload");
const notes = document.querySelector(".notes");
const canvas1 = document.querySelector("canvas");
//----------------------------------------- States-------------------------------------------------------

let pencil_state = true;
let eraser_state = true;

// -------------------------------------------------------------------------------------------------------
options_container.addEventListener("click", (e) => {
  if (options_container.children[0].className === "fas fa-times") {
    open_tools();
  } else {
    close_tools();
  }
});

// open-tools
function open_tools() {
  options_container.children[0].className = "fas fa-bars";
  tools.style.display = "flex";
}

// close-tools
function close_tools() {
  pencil_tools_container.style.display = "none";
  eraser_tools_container.style.display = "none";
  tools.style.display = "none";
  options_container.children[0].className = "fas fa-times";
}

// pencil-event-listner

pencil.addEventListener("click", (e) => {
  if (!pencil_state) {
    pencil_state = true;
    pencil_tools_container.style.display = "block";
  } else {
    pencil_state = false;
    pencil_tools_container.style.display = "none";
  }
});

//eraser-event-listner

eraser.addEventListener("click", (e) => {
  if (!eraser_state) {
    eraser_state = true;
    eraser_tools_container.style.display = "flex";
  } else {
    eraser_state = false;
    eraser_tools_container.style.display = "none";
  }
});

//notes-event-listner-------------------------------------------------------------------------------------------------------------------

notes.addEventListener("click", (e) => {
  const new_note = create_notes();
  remove(new_note);
  minimise(new_note);
});

/**************  drag-drop******************* */
const dragAndDrop = (new_note) => {
  new_note.addEventListener("dragstart", () => {
    let dragValue = new_note;
    document.onmouseup = () => {
      dragValue = null;
    };

    dragValue.ondragstart = () => {
      return false;
    };

    document.onmousemove = (e) => {
      var Y = e.pageY;
      var X = e.pageX;
      if (dragValue !== null) {
        dragValue.style.position = "absolute";
        dragValue.style.left = X + "px";
        dragValue.style.top = Y + "px";
      }
    };
  });
};
/******************************************** */

// Uplode------------------------------------------------------------------------------------------

upload.addEventListener("click", (e) => {
  // open file explorer

  const fileExpolrer = document.createElement("input");

  fileExpolrer.setAttribute("type", "file");
  fileExpolrer.click();

  fileExpolrer.addEventListener("change", (e) => {
    let img = fileExpolrer.files[0];
    let createURL = URL.createObjectURL(img);

    const image = create_notes_img(createURL);

    remove(image);
    minimise(image);
  });
});

const create_notes = () => {
  let new_note = document.createElement("div");
  new_note.setAttribute("class", "notes_container");
  new_note.setAttribute("draggable", "true");
  new_note.innerHTML = `
          <div class="notes-header">
                <div class="notes-remove">
                    <i class="fas fa-times-circle"></i>
                </div>

                <div class="notes-minimise">
                    <i class="fas fa-window-minimize"></i>
                </div>
          </div>
          <div class="notes-body" >
              <textarea name="notes" id="notes-textarea" placeholder="type something"></textarea>
          </div>
  `;

  document.body.appendChild(new_note);
  // canvas1.append(new_note);

  dragAndDrop(new_note);
  return new_note;
};

const create_notes_img = (createURL) => {
  let image = document.createElement("div");
  image.setAttribute("class", "notes_container");
  image.setAttribute("draggable", "true");
  image.innerHTML = `
          <div class="notes-header">
                <div class="notes-remove">
                    <i class="fas fa-times-circle"></i>
                </div>

                <div class="notes-minimise">
                    <i class="fas fa-window-minimize"></i>
                </div>
          </div>
          <div class="notes-body" >
            <img class="upload" src=${createURL} alt="upload">
          </div>
  `;
  document.body.appendChild(image);
  // canvas1.appendChild(image);
  dragAndDrop(image);
  return image;
};
/*------------------------------------------------------ minimise tab--------------------------------------------*/

const minimise = (new_note) => {
  let min = new_note.querySelector(".notes-minimise");

  min.addEventListener("click", (e) => {
    let note_Area = new_note.querySelector(".notes-body");
    let checkDisplay = window
      .getComputedStyle(note_Area)
      .getPropertyValue("display");
    if (checkDisplay === "none") {
      note_Area.style.display = "block";
    } else {
      note_Area.style.display = "none";
    }
  });
};

/*------------------------------------------------------- remove tab------------------------------------------ */

const remove = (note_name) => {
  let remove_note_name = note_name.querySelector(".notes-remove");

  remove_note_name.addEventListener("click", () => {
    note_name.remove();
  });
};

//
