const EventEmitter = require("events");

class School extends EventEmitter {
  startSchool() {
    console.log("start school");
    this.emit("bellRing", "go at home");
  }
}

module.exports = School;
