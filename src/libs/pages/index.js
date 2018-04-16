/** 
 * @param {index} -- 当前页面
 * @param {size} -- 每页条数
 * @param {total}
 */
var eles = [
  {
    el: 'div',
    bindEL: 'el',
    className: 'xy__page',
    childrens: [
      {
        el: 'div',
        bindEL: 'elTotal',
        className: 'xy__page-total',
        html: '共 0 页'
      },{
        el: 'div',
        className: 'xy__page-text',
        html: '每页'
      },{
        el: 'div',
        bindEL: 'elSize',
        className: 'xy__page-size',
        childrens: [{
          el: 'button',
          bindEL: 'elSizeBtn',
          html: 10
        },{
          el: 'ul',
          bindEL: 'elSizeCh',
          className: 'xy__page-size_list',
          childrens: [{
            el: 'li',
            html: 10
          },{
            el: 'li',
            html: 15
          },{
            el: 'li',
            html: 20
          },{
            el: 'li',
            html: 30
          }]
        }]
      },{
        el: 'div',
        className: 'xy__page-text',
        html: '条'
      },{
        el: 'div',
        bindEL: 'elLink',
        className: 'xy__page-link',
        childrens: [{
          el: 'div',
          bindEL: 'elFirst',
          className: 'xy__page-link_btn',
          childrens: [{
            el: 'span',
            html: '«'
          }]
        },{
          el: 'div',
          bindEL: 'elPre',
          className: 'xy__page-link_btn',
          childrens: [{
            el: 'span',
            html: '‹'
          }]
        },{
          el: 'div',
          bindEL: 'elIndex',
          className: 'xy__page-link_btn',
          childrens: [{
            el: 'span',
            html: '0'
          }]
        },{
          el: 'div',
          bindEL: 'elNext',
          className: 'xy__page-link_btn',
          childrens: [{
            el: 'span',
            html: '›'
          }]
        },{
          el: 'div',
          bindEL: 'elLast',
          className: 'xy__page-link_btn',
          childrens: [{
            el: 'span',
            html: '»'
          }]
        }]
      },{
        el: 'div',
        className: 'xy__page-go',
        childrens: [{
          el: 'input',
          bindEL: 'elGoForm',
          className: 'xy__page-go_form',
          attrs: { type: 'text' }
        },{
          el: 'span',
          bindEL: 'elGoBtn',
          className: 'xy__page-go_btn',
          html: 'GO'
        }]
      }
    ]
  }
]
function CreateElement (_this, eles) {
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
function Page (params) {
  this.wrap = document.getElementById(params.wrap)
  this.index = params.index
  this.pageSize = params.pageSize
  this.total = params.total
  this.cb = params.cb
  
  this.bindMethods()
  this.create()
}

// 更行视图对象 *update
Page.prototype = {
  index: 1,
  pages: 0,
  pageSize: 10,
  total: 0,
  wrap: null,
  el: null,
  elGo: null,
  elGoForm: null,
  elGoBtn: null,
  elFirst: null, // *update
  elLast: null, // *update
  elPre: null, // *update
  elNext: null, // *update
  elIndex: null, // *update
  elLink: null,
  elSize: null, // *update
  elSizeBtn: null, // *update
  elSizeCh: null,
  elTotal: null,
  create: function () {
    // 计算总页数
    this.calTotal()

    window.CreateElement(this, window.eles)
  },
  init: function () {
    this.wrap.appendChild(this.el)
    this.bindEvent()

    this.updateView()
  },
  bindMethods () {
    function bind (fn, ctx) {
      return function (a) {
        var l = arguments.length
        return l
            ? l > 1
            ? fn.apply(ctx, arguments)
            : fn.call(ctx, a)
            : fn.call(ctx)
      }
    }
    for (let key in this) {
      if (typeof this[key] === 'function') {
        this[key] = bind(this[key], this)
      }
    }
  },
  bindEvent: function () {
    this.elLink.addEventListener('selectstart', this.prevent)
    this.elFirst.addEventListener('click', this.linkFirst)
    this.elPre.addEventListener('click', this.linkPre)
    this.elNext.addEventListener('click', this.linkNext)
    this.elLast.addEventListener('click', this.linkLast)
    this.elSizeBtn.addEventListener('click', this.sizeChooseShow)
    this.elSizeCh.addEventListener('click', this.sizeChoose)
    this.elGoBtn.addEventListener('click', this.goPage)
    this.elGoForm.addEventListener('keydown', this.keydown)
  },
  destroy: function () {
    this.elLink.removeEventListener('selectstart', this.prevent)
    this.elFirst.removeEventListener('click', this.linkFirst)
    this.elPre.removeEventListener('click', this.linkPre)
    this.elNext.removeEventListener('click', this.linkNext)
    this.elLast.removeEventListener('click', this.linkLast)
    this.elSizeBtn.removeEventListener('click', this.sizeChooseShow)
    this.elSizeCh.removeEventListener('click', this.sizeChoose)
    this.elGoBtn.removeEventListener('click', this.goPage)
    this.elGoForm.removeEventListener('keydown', this.keydown)

    this.wrap.removeChild(this.el)
    for (var key in this) {
      this[key] = null
    }
  },
  prevent: function (event) {
    event.preventDefault()
  },
  // 计算总页数
  calTotal: function () {
    this.pages = this.total % this.pageSize === 0 ? this.total / this.pageSize : Math.floor(this.total / this.pageSize) + 1
  },
  // 设置 || 更新翻页按钮 class
  setLinkClass: function (eles, disable) {
    var className = ''
    for (var i = 0, len = eles.length; i < len; i++) {
      className = eles[i].className.replace(/\sdisable/, '')
      if (disable) {
        eles[i].className = className + ' disable'
      } else {
        eles[i].className = className
      }
    }
  },
  // 视图更新
  updateView: function () {
    // 总页数更新
    this.elTotal.innerHTML = '共 ' + this.pages + ' 页'
    this.elSizeBtn.innerHTML = this.pageSize
    // 翻页 class 更新
    this.setLinkClass([this.elFirst, this.elPre], this.index === 1)
    this.setLinkClass([this.elNext, this.elLast], this.index >= this.pages)
    // 更新 index 显示
    this.elIndex.innerHTML = this.index
  },
  // 内部调用, 修改数据时 发起回调 并 修改视图
  setView: function () {
    this.link()
    this.updateView()
  },
  // 外部调用， 修改数据 并 修改视图
  updateData: function (params) {
    for (var key in params) {
      this[key] = params[key]
    }
    this.setView()
  },
  linkFirst: function () {
    if (this.index > 1) {
      this.index = 1
      this.setView()
    }
  },
  linkPre: function () {
    if (this.index > 1) {
      this.index -= 1
      this.setView()
    }
  },
  linkNext: function () {
    if (this.index < this.pages) {
      this.index += 1
      this.setView()
    }
  },
  linkLast: function () {
    if (this.index < this.pages) {
      this.index = this.pages
      this.setView()
    }
  },
  link: function () {
    this.cb({
      index: this.index,
      pageSize: this.pageSize,
      total: this.total
    })
  },
  sizeChooseShow: function () {
    var className = this.elSize.className
    if (/choosing/.test(className)) {
      this.elSize.className = className.replace(/\schoosing/, '')
    } else {
      this.elSize.className += ' choosing'
    }
  },
  sizeChoose: function (event) {
    var pageSize = parseInt(event.target.innerHTML.replace(/[^\d]+/g, ''))
    if (this.pageSize !== pageSize) {
      this.pageSize = pageSize
      // 页码重置
      this.index = 1
      this.calTotal()
      this.setView()
      this.sizeChooseShow()
    }
  },
  pageFilter: function () {
    var isFilter = 0,
        val = this.elGoForm.value,
        page = 0,
        __page = 0;

    // 过滤无效字符
    if (/[^\d]+/.test(val)) {
      isFilter = 1
      val = val.replace(/[^\d]+/g, '')
    }
    if (val) {
      page = parseInt(val)
    } else {
      this.elGoForm.value = ''
      return null
    }
    // 范围修正
    __page = page === 0 ? 1 : page > this.pages ? this.pages : page
    this.elGoForm.value = __page

    return __page
  },
  keydown: function (event) {
    if (event.keyCode === 13) {
      this.goPage()
    }
  },
  goPage: function () {
    var page = this.pageFilter()
    // 判断数字是否有效
    if (page && page !== this.index) {
      this.index = page
      this.setView()
    }
  }
}

function CreatePage (options) {
  return new Page(options)
}

export default CreatePage
/** 提供调用函数
 * @function updateData({index, pageSize, total})
 * @function destroy 销毁实例 并解除事件绑定
 */ 

// var page = new Page({
//   // 放置 page 的元素
//   wrap: 'page-cop',
//   // 进入时页码
//   index: 1,
//   // 每页条数
//   pageSize: 10,
//   // 总条数
//   total: 100,
//   // 回调
//   cb: function (data) {
//     console.log(data)
//   }
// })
// page.init()
