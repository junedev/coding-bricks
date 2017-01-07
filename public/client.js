$(function () {
  $(".brick").draggable({
    revert: "invalid", // when not dropped, the item will revert back to its initial position
    containment: "document",
    helper: "clone",
    zIndex: 10000,
    appendTo: "body",
    cursor: "move"
  });
});