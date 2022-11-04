var grid = document.querySelector(".grid");
var moves = 0;
var shm = document.getElementById("moves");
shm.innerHTML = moves;
let last_score = $.cookie("new_score");
if (last_score !== undefined || last_score) {
  let loadData = JSON.parse(last_score);
  // console.log(loadData);
  // console.log(loadData.score);
  document.getElementById("lasts").style.display = "flex";
  document.getElementById("last_moves").innerHTML = loadData.score;
}

var pckry = new Packery(grid, {
  itemSelector: ".tile",
  columnWidth: 100,
  transitionDuration: "0.3s",
});

pckry.getItemElements().forEach(function (itemElem) {
  var draggie = new Draggabilly(itemElem);
  pckry.bindDraggabillyEvents(draggie);
});

// map items by their data-tile
var mappedItems = {};

pckry.items.forEach(function (item) {
  var attr = item.element.getAttribute("data-tile");
  mappedItems[attr] = item;
});

(function () {
  var orders = ["abcdefghijklm", "ecdibmhfajkgl", "ilckfgdebhjam"];
  var d = Object.keys(Packery.defaults).sort(function (a, b) {
    return b < a ? 1 : -1;
  });
  var i = 3,
    j = 9,
    o = Packery.namespace;
  var orderIndex = 0;

  function shuffleTiles() {
    // shuffle items
    orderIndex++;
    var order = orders[orderIndex % 3];
    pckry.items = order.split("").map(function (attr) {
      return mappedItems[attr];
    });
    // stagger transition
    pckry._resetLayout();
    pckry.items.forEach(function (item, i) {
      setTimeout(function () {
        pckry.layoutItems([item]);
      }, i * 34);
    });
    document.getElementById("lasts").style.display = "flex";
    if (moves != 0) {
      document.getElementById("last_moves").innerHTML = moves;
    } else {
      document.getElementById("last_moves").innerHTML = "NA";
    }

    moves = 0;
    shm.innerHTML = moves;
  }

  var dialog = document.querySelector(".dialog");
  var didWin = false;

  function win() {
    if (!didWin) {
      document.querySelector(".dialog__text").innerHTML = "Nice work!<br>";
      $.cookie.json = true;
      $.cookie("new_score", {
        score: moves,
      });
    }
    didWin = true;
    showDialog();
  }

  function showDialog() {
    dialog.classList.remove("is-waiting");
  }

  function hideDialog() {
    dialog.classList.add("is-waiting");
  }

  dialog.querySelector(".try-again-button").onclick = function () {
    hideDialog();
    shuffleTiles();
  };

  dialog.querySelector(".close-dialog-button").onclick = hideDialog;

  document.querySelector(".shuffle-button").onclick = shuffleTiles;

  pckry.on("dragItemPositioned", function () {
    var order = pckry.items
      .map(function (item) {
        return item.element.getAttribute("data-tile");
      })
      .join("");
    if (pckry.maxY == 500 && order == "fmgdbalkjihce") {
      win();
    }
    moves = moves + 1;
    shm.innerHTML = moves;
  });
})();
