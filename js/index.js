function Vvue(options, prop) {
  this.$options = options
  this.$prop = prop
  this.$el = document.querySelector(options.el)
  this.$data = options.data
  this.proxy(this, this.$data)
  this.init()
}
Vvue.prototype = {
  //代理fn 把this.$data.xx -> this.xx
  proxy: function (obj, data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(obj, key, {
        get: function () {
          return obj[key]
        },
        set: function (val) {
          obj[key] = val
        }
      })
    })
  },
  //vue初始化
  init: function () {
    //observer
    Observer(this.$data)
    //comiler
    new Compiler(this)
  }
}