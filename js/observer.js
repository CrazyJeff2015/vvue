function Observer(data) {
  if (!data || typeof data !== 'object') {
    return
  }
  Object.keys(data).forEach(key => {
    difineReactive(data, key, data[key])
  })
}

function difineReactive(data, key, value) {
  //递归所有
  Observer(value)
  let dep = new Dep()
  Object.defineProperty(data, key, {
    get: function () {
      if (Dep.target) {
        //加入watcher
        dep.addSub(Dep.target)
      }
      return value
    },
    set: function (newValue) {
      if (value !== newValue) {
        value = newValue
        //发布更新
        dep.notily()
      }
    }
  })
}
//dep容器  用于wacther的收集和更新
function Dep() {
  this.subs = [];
  this.target = null;
}
Dep.prototype = {
  //收集wacther fn
  addSub: function (sub) {
    this.subs.push(sub)
  },
  //发布更新 fn
  notily: function () {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}