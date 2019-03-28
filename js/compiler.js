function Compiler(vm) {
  this.vm = vm;
  this.data = vm.$data;
  this.el = vm.$el
  this.fragment = null;
  this.init()
}
Compiler.prototype = {
  init: function () {
    this.fragment = this.nodeFragment(this.el)
    this.complieNode(this.fragment)
    this.el.appendChild(this.fragment)
  },
  nodeFragment(el) {
    let fragment = document.createDocumentFragment(el)
    let child = el.firstChild;
    while (child) {
      fragment.appendChild(child)
      child = el.firstChild
    }
    return fragment
  },
  complieNode(fragment) {
    let nodes = fragment.childNodes;
    [...nodes].forEach(node => {
      if (this.isElementNode(node)) {
        let modelProp = this.isDrieactive(node)
        if (modelProp) {
          this.complileModel(node, modelProp)
        }
      }
      if (this.isTextNode(node)) {
        let textProp = this.isBrackets(node)
        if (textProp) {
          this.complieText(node, textProp)
        }
      }

      if (node.childNodes && node.childNodes.length) {
        this.complieNode(node)
      }
    })
  },
  complileModel(node, prop) {
    let val = this.data[prop]
    this.updateModel(node, val)
    new Watcher(this.vm, prop, (value) => {
      this.updateModel(node, value)
    })
    node.addEventListener('input', e => {
      let newValue = e.target.value;
      this.vm.$data[prop] = newValue
    })
  },
  complieText(node, prop) {
    let val = this.data[prop]
    this.updateText(node, val)
    new Watcher(this.vm, prop, (value) => {
      this.updateText(node, value)
    })
  },
  updateModel(node, value) {
    node.value = typeof value === 'undefined' ? '' : value
  },
  updateText(node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value
  },
  isBrackets(node) {
    let text = node.textContent;
    let reg = /\{\{(.*)}\}/
    if (reg.test(text)) {
      return reg.exec(text)[1]
    }
    return false
  },
  isDrieactive(node) {
    let attributes = node.attributes;
    let len = [...attributes].length;
    for (let i = 0; i < len; i++) {
      let name = [...attributes][i].name;
      let value = [...attributes][i].value;
      if (name.indexOf('v-model') !== -1) {
        return value
      }
    }
    return false
  },
  isElementNode(node) {
    return node.nodeType === 1
  },
  isTextNode(node) {
    return node.nodeType === 3
  }
}