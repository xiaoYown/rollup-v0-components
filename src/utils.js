export function CreateElement (_this, eles) {
  var __eles = [], __el = null, childrens = []
  for (var i = 0, len = eles.length; i < len; i++) {
    __el = document.createElement(eles[i].el)
    // bind class
    if (eles[i].className) {
      __el.className = eles[i].className
    }
    // bind attrs
    if (eles[i].attrs) {
      for (var key in eles[i].attrs) {
        __el.setAttribute(key, eles[i].attrs[key])
      }
    }
    // append children || set innerHTML
    if (eles[i].childrens) {
      childrens = CreateElement(_this, eles[i].childrens)
      for (var z = 0, __len = childrens.length; z < __len; z++) {
        __el.appendChild(childrens[z])
      }
    } else if (eles[i].html) {
      __el.innerHTML = eles[i].html
    }
    // bind el
    if (eles[i].bindEL) {
      if (!_this[eles[i].bindEL]) {
        _this[eles[i].bindEL] = __el
      } else if (_this[eles[i].bindEL].constructor === Array) {
        _this[eles[i].bindEL].push(__el)
      } else {
        _this[eles[i].bindEL] = [_this[eles[i].bindEL]]
        _this[eles[i].bindEL].push(__el)
      }
    }
    __eles.push(__el)
  }
  return __eles
}
