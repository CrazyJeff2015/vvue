function Watcher(vm, prop, callback) {
  this.vm = vm;
  this.prop = prop;
  this.callback = callback;
  this.value = this.getValue()
}
Watcher.prototype = {
  getValue: function () {
    Dep.target = this;
    const value = this.vm.$data[this.prop];
    Dep.target = null;
    return value
  },
  update: function () {
    let value = this.vm.$data[this.prop]
    let oldValue = this.value;
    if (value !== oldValue) {
      this.value = value
      this.callback(value)
    }
  }
}