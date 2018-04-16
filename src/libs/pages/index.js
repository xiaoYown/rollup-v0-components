import eles from './mixins/template';
import { CreateElement } from '@/utils';

class Pages {
  index: any = 1;
  pages: any = 0;
  pageSize: any = 10;
  total: any = 0;
  wrap: any = null;
  el: any = null;
  elGo: any = null;
  elGoForm: any = null;
  elGoBtn: any = null;
  elFirst: any = null; // *update
  elLast: any = null; // *update
  elPre: any = null; // *update
  elNext: any = null; // *update
  elIndex: any = null; // *update
  elLink: any = null;
  elSize: any = null; // *update
  elSizeBtn: any = null; // *update
  elSizeCh: any = null;
  elTotal: any = null;

  constructor (options: any) {
    if (typeof options.wrap === 'string') {
      this.wrap = document.getElementById(options.wrap)
    } else {
      this.wrap = options.wrap
    }
    this.index = options.index
    this.pageSize = options.pageSize
    this.total = options.total
    this.cb = options.cb
    
    // this.bindMethods()
    this.create()
  }
  create () {
    // 计算总页数
    this.calTotal()

    CreateElement(this, eles)
  }
  init () {
    this.wrap.appendChild(this.el)
    this.bindEvent()

    this.updateView()
  }
  // bindMethods () {
  //   function bind (fn, ctx) {
  //     return function (a) {
  //       var l = arguments.length
  //       return l
  //           ? l > 1
  //           ? fn.apply(ctx, arguments)
  //           : fn.call(ctx, a)
  //           : fn.call(ctx)
  //     }
  //   }
  //   for (let key in this.__proto__) {
  //     if (typeof this[key] === 'function') {
  //       this[key] = bind(this.__proto__[key], this)
  //     }
  //   }
  // }
  bindEvent () {
    this.elLink.addEventListener('selectstart', this.prevent.bind(this))
    this.elFirst.addEventListener('click', this.linkFirst.bind(this))
    this.elPre.addEventListener('click', this.linkPre.bind(this))
    this.elNext.addEventListener('click', this.linkNext.bind(this))
    this.elLast.addEventListener('click', this.linkLast.bind(this))
    this.elSizeBtn.addEventListener('click', this.sizeChooseShow.bind(this))
    this.elSizeCh.addEventListener('click', this.sizeChoose.bind(this))
    this.elGoBtn.addEventListener('click', this.goPage.bind(this))
    this.elGoForm.addEventListener('keydown', this.keydown.bind(this))
  }
  destroy () {
    this.elLink.removeEventListener('selectstart', this.prevent.bind(this))
    this.elFirst.removeEventListener('click', this.linkFirst.bind(this))
    this.elPre.removeEventListener('click', this.linkPre.bind(this))
    this.elNext.removeEventListener('click', this.linkNext.bind(this))
    this.elLast.removeEventListener('click', this.linkLast.bind(this))
    this.elSizeBtn.removeEventListener('click', this.sizeChooseShow.bind(this))
    this.elSizeCh.removeEventListener('click', this.sizeChoose.bind(this))
    this.elGoBtn.removeEventListener('click', this.goPage.bind(this))
    this.elGoForm.removeEventListener('keydown', this.keydown.bind(this))

    this.wrap.removeChild(this.el)
    for (var key in this) {
      this[key] = null
    }
  }
  prevent (event) {
    event.preventDefault()
  }
  // 计算总页数
  calTotal () {
    this.pages = this.total % this.pageSize === 0 ? this.total / this.pageSize : Math.floor(this.total / this.pageSize) + 1
  }
  // 设置 || 更新翻页按钮 class
  setLinkClass (eles, disable) {
    var className = ''
    for (var i = 0, len = eles.length; i < len; i++) {
      className = eles[i].className.replace(/\sdisable/, '')
      if (disable) {
        eles[i].className = className + ' disable'
      } else {
        eles[i].className = className
      }
    }
  }
  // 视图更新
  updateView () {
    // 总页数更新
    this.elTotal.innerHTML = '共 ' + this.pages + ' 页'
    this.elSizeBtn.innerHTML = this.pageSize
    // 翻页 class 更新
    this.setLinkClass([this.elFirst, this.elPre], this.index === 1)
    this.setLinkClass([this.elNext, this.elLast], this.index >= this.pages)
    // 更新 index 显示
    this.elIndex.innerHTML = this.index
  }
  // 内部调用, 修改数据时 发起回调 并 修改视图
  setView () {
    this.link()
    this.updateView()
  }
  // 外部调用， 修改数据 并 修改视图
  updateData (params) {
    for (var key in params) {
      this[key] = params[key]
    }
    this.setView()
  }
  linkFirst () {
    if (this.index > 1) {
      this.index = 1
      this.setView()
    }
  }
  linkPre () {
    if (this.index > 1) {
      this.index -= 1
      this.setView()
    }
  }
  linkNext () {
    if (this.index < this.pages) {
      this.index += 1
      this.setView()
    }
  }
  linkLast () {
    if (this.index < this.pages) {
      this.index = this.pages
      this.setView()
    }
  }
  link () {
    this.cb({
      index: this.index,
      pageSize: this.pageSize,
      total: this.total
    })
  }
  sizeChooseShow () {
    var className = this.elSize.className
    if (/choosing/.test(className)) {
      this.elSize.className = className.replace(/\schoosing/, '')
    } else {
      this.elSize.className += ' choosing'
    }
  }
  sizeChoose (event) {
    var pageSize = parseInt(event.target.innerHTML.replace(/[^\d]+/g, ''))
    if (this.pageSize !== pageSize) {
      this.pageSize = pageSize
      // 页码重置
      this.index = 1
      this.calTotal()
      this.setView()
      this.sizeChooseShow()
    }
  }
  pageFilter () {
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
  }
  keydown (event) {
    if (event.keyCode === 13) {
      this.goPage()
    }
  }
  goPage () {
    var page = this.pageFilter()
    // 判断数字是否有效
    if (page && page !== this.index) {
      this.index = page
      this.setView()
    }
  }
}

function CreatePages (options: any) {
  return new Pages(options)
}

export default CreatePages
