const emitter = require("./mediator");
const _ = require("./util");

const templates = {
  init: require("../templates/detail-init"),
  detail: require("../templates/detail"),
  nearest: require("../templates/nearest")
};

const Detail = function(data) {
  this.offices = data.offices;
  this.initialOffice = data.initialOffice;
  this.active = data.initialView;

  this.container = _.create("aside", "detail-container", document.body);
  this.close = _.create("button", "detail-toggle", this.container);
  this.close.innerHTML = "&#9650;";
  this.content = _.create("section", "detail-content", this.container);

  this.content.innerHTML = templates.init();
  this.container.addEventListener("click", this.blur.bind(this));
  this.close.addEventListener("click", this.toggle.bind(this));
  emitter.on("office:selected", this.renderOffice.bind(this));
  emitter.on("marker:click", this.renderOffice.bind(this));
  emitter.on("autocomplete:keyup", this.hide.bind(this));
  emitter.on("view:changed", this.hide.bind(this));
  emitter.on("zoom:fullextent", this.hide.bind(this));
  emitter.on("found:office", this.renderOffice.bind(this));
  emitter.on("offices:random", this.renderOffice.bind(this));
  emitter.on("found:nearest", this.renderNearest.bind(this));

  if (this.active) this.show();
};

module.exports = Detail;

Detail.prototype.blur = function() {
  emitter.emit("blur:input");
};

Detail.prototype.show = function() {
  if (!this.active) emitter.emit("detail:show", -200);
  this.active = true;
  this.close.innerHTML = "&#9660;";
  this.container.classList.add("active");
};

Detail.prototype.hide = function() {
  if (this.active) emitter.emit("detail:hide", 200);
  this.active = false;
  this.close.innerHTML = "&#9650;";
  this.container.classList.remove("active");
};

Detail.prototype.toggle = function() {
  const eventName = this.active ? "detail:hide" : "detail:show";
  const distance = this.active ? 200 : -200;
  this.close.innerHTML = this.active ? "&#9650;" : "&#9660;";
  this.container.classList.toggle("active");
  this.active = !this.active;
  emitter.emit(eventName, distance);
};

Detail.prototype.renderOffice = function(office) {
  this.content.innerHTML = templates.detail(office.properties);
  this.show();
};

Detail.prototype.renderNearest = function(nearest) {
  this.content.innerHTML = templates.nearest(nearest);
  this.show();
};
