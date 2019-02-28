const _ = require("./util");
const emitter = require("./mediator");
const template = require("../templates/about");

const Toolbar = function(data) {
  this.about = _.create(
    "button",
    ["about-map", "leaflet-control-roy", "tt-w"],
    document.body
  );
  this.about.setAttribute("data-tt", "About this map");
  this.imgAbout = _.create("img", "", this.about);
  this.imgAbout.setAttribute("src", "./svg/help.svg");
  this.imgAbout.setAttribute("alt", "Icon representing help");
  this.modal = _.create("aside", "about-modal", document.body);
  this.close = _.create("button", "modal-close", this.modal);
  this.close.innerHTML = "&times;";
  this.aboutContent = _.create("section", "about-content", this.modal);
  this.aboutContent.innerHTML = template();

  this.about.addEventListener("click", this.toggleModal.bind(this));
  this.close.addEventListener("click", this.hideModal.bind(this));
  document.body.addEventListener("keyup", keyHandler.bind(this));
};

module.exports = Toolbar;

function keyHandler(e) {
  const key = e.code || e.keyCode || e.which || 0;
  // Close the modal if the user hits escape
  if (key === 27 && this.modal) this.hideModal();
}

Toolbar.prototype.showModal = function() {
  this.modal.classList.add("active");
  this.close.focus();
  emitter.emit("modal:open");
};

Toolbar.prototype.hideModal = function() {
  this.modal.classList.remove("active");
  emitter.emit("modal:close");
};

Toolbar.prototype.toggleModal = function() {
  if (this.modal.classList.contains("active")) this.hideModal();
  else this.showModal();
};
