/*!
 * Piece v0.0.0 (date: 2018-6-16 0:5)
 * (c) 2018 xiaoYown
 * @license MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Piece = factory());
}(this, (function () { 'use strict';

var template = [
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
];

function CreateElement (_this, eles) {
  var __eles = [], __el = null, childrens = [];
  for (var i = 0, len = eles.length; i < len; i++) {
    __el = document.createElement(eles[i].el);
    // bind class
    if (eles[i].className) {
      __el.className = eles[i].className;
    }
    // bind attrs
    if (eles[i].attrs) {
      for (var key in eles[i].attrs) {
        __el.setAttribute(key, eles[i].attrs[key]);
      }
    }
    // append children || set innerHTML
    if (eles[i].childrens) {
      childrens = CreateElement(_this, eles[i].childrens);
      for (var z = 0, __len = childrens.length; z < __len; z++) {
        __el.appendChild(childrens[z]);
      }
    } else if (eles[i].html) {
      __el.innerHTML = eles[i].html;
    }
    // bind el
    if (eles[i].bindEL) {
      if (!_this[eles[i].bindEL]) {
        _this[eles[i].bindEL] = __el;
      } else if (_this[eles[i].bindEL].constructor === Array) {
        _this[eles[i].bindEL].push(__el);
      } else {
        _this[eles[i].bindEL] = [_this[eles[i].bindEL]];
        _this[eles[i].bindEL].push(__el);
      }
    }
    __eles.push(__el);
  }
  return __eles
}

var Pages = function Pages (options) {
  if (typeof options.wrap === 'string') {
    this.wrap = document.getElementById(options.wrap);
  } else {
    this.wrap = options.wrap;
  }
  this.index = options.index;
  this.pageSize = options.pageSize;
  this.total = options.total;
  this.cb = options.cb;
    
  // this.bindMethods()
  this.create();
};
Pages.prototype.create = function create () {
  // 计算总页数
  this.calTotal();

  CreateElement(this, template);
};
Pages.prototype.init = function init () {
  this.wrap.appendChild(this.el);
  this.bindEvent();

  this.updateView();
};
// bindMethods () {
// function bind (fn, ctx) {
//   return function (a) {
//     var l = arguments.length
//     return l
//         ? l > 1
//         ? fn.apply(ctx, arguments)
//         : fn.call(ctx, a)
//         : fn.call(ctx)
//   }
// }
// for (let key in this.__proto__) {
//   if (typeof this[key] === 'function') {
//     this[key] = bind(this.__proto__[key], this)
//   }
// }
// }
Pages.prototype.bindEvent = function bindEvent () {
  this.elLink.addEventListener('selectstart', this.prevent.bind(this));
  this.elFirst.addEventListener('click', this.linkFirst.bind(this));
  this.elPre.addEventListener('click', this.linkPre.bind(this));
  this.elNext.addEventListener('click', this.linkNext.bind(this));
  this.elLast.addEventListener('click', this.linkLast.bind(this));
  this.elSizeBtn.addEventListener('click', this.sizeChooseShow.bind(this));
  this.elSizeCh.addEventListener('click', this.sizeChoose.bind(this));
  this.elGoBtn.addEventListener('click', this.goPage.bind(this));
  this.elGoForm.addEventListener('keydown', this.keydown.bind(this));
};
Pages.prototype.destroy = function destroy () {
    var this$1 = this;

  this.elLink.removeEventListener('selectstart', this.prevent.bind(this));
  this.elFirst.removeEventListener('click', this.linkFirst.bind(this));
  this.elPre.removeEventListener('click', this.linkPre.bind(this));
  this.elNext.removeEventListener('click', this.linkNext.bind(this));
  this.elLast.removeEventListener('click', this.linkLast.bind(this));
  this.elSizeBtn.removeEventListener('click', this.sizeChooseShow.bind(this));
  this.elSizeCh.removeEventListener('click', this.sizeChoose.bind(this));
  this.elGoBtn.removeEventListener('click', this.goPage.bind(this));
  this.elGoForm.removeEventListener('keydown', this.keydown.bind(this));

  this.wrap.removeChild(this.el);
  for (var key in this$1) {
    this$1[key] = null;
  }
};
Pages.prototype.prevent = function prevent (event) {
  event.preventDefault();
};
// 计算总页数
Pages.prototype.calTotal = function calTotal () {
  this.pages = this.total % this.pageSize === 0 ? this.total / this.pageSize : Math.floor(this.total / this.pageSize) + 1;
};
// 设置 || 更新翻页按钮 class
Pages.prototype.setLinkClass = function setLinkClass (eles, disable) {
  var className = '';
  for (var i = 0, len = eles.length; i < len; i++) {
    className = eles[i].className.replace(/\sdisable/, '');
    if (disable) {
      eles[i].className = className + ' disable';
    } else {
      eles[i].className = className;
    }
  }
};
// 视图更新
Pages.prototype.updateView = function updateView () {
  // 总页数更新
  this.elTotal.innerHTML = '共 ' + this.pages + ' 页';
  this.elSizeBtn.innerHTML = this.pageSize;
  // 翻页 class 更新
  this.setLinkClass([this.elFirst, this.elPre], this.index === 1);
  this.setLinkClass([this.elNext, this.elLast], this.index >= this.pages);
  // 更新 index 显示
  this.elIndex.innerHTML = this.index;
};
// 内部调用, 修改数据时 发起回调 并 修改视图
Pages.prototype.setView = function setView () {
  this.link();
  this.updateView();
};
// 外部调用， 修改数据 并 修改视图
Pages.prototype.updateData = function updateData (params) {
    var this$1 = this;

  for (var key in params) {
    this$1[key] = params[key];
  }
  this.setView();
};
Pages.prototype.linkFirst = function linkFirst () {
  if (this.index > 1) {
    this.index = 1;
    this.setView();
  }
};
Pages.prototype.linkPre = function linkPre () {
  if (this.index > 1) {
    this.index -= 1;
    this.setView();
  }
};
Pages.prototype.linkNext = function linkNext () {
  if (this.index < this.pages) {
    this.index += 1;
    this.setView();
  }
};
Pages.prototype.linkLast = function linkLast () {
  if (this.index < this.pages) {
    this.index = this.pages;
    this.setView();
  }
};
Pages.prototype.link = function link () {
  this.cb({
    index: this.index,
    pageSize: this.pageSize,
    total: this.total
  });
};
Pages.prototype.sizeChooseShow = function sizeChooseShow () {
  var className = this.elSize.className;
  if (/choosing/.test(className)) {
    this.elSize.className = className.replace(/\schoosing/, '');
  } else {
    this.elSize.className += ' choosing';
  }
};
Pages.prototype.sizeChoose = function sizeChoose (event) {
  var pageSize = parseInt(event.target.innerHTML.replace(/[^\d]+/g, ''));
  if (this.pageSize !== pageSize) {
    this.pageSize = pageSize;
    // 页码重置
    this.index = 1;
    this.calTotal();
    this.setView();
    this.sizeChooseShow();
  }
};
Pages.prototype.pageFilter = function pageFilter () {
  var val = this.elGoForm.value,
      page = 0,
      __page = 0;

  // 过滤无效字符
  if (/[^\d]+/.test(val)) {
    val = val.replace(/[^\d]+/g, '');
  }
  if (val) {
    page = parseInt(val);
  } else {
    this.elGoForm.value = '';
    return null
  }
  // 范围修正
  __page = page === 0 ? 1 : page > this.pages ? this.pages : page;
  this.elGoForm.value = __page;

  return __page
};
Pages.prototype.keydown = function keydown (event) {
  if (event.keyCode === 13) {
    this.goPage();
  }
};
Pages.prototype.goPage = function goPage () {
  var page = this.pageFilter();
  // 判断数字是否有效
  if (page && page !== this.index) {
    this.index = page;
    this.setView();
  }
};

function CreatePages (options) {
  return new Pages(options)
}

var index = {
  name: 'piece',
  Pages: CreatePages
}

return index;

})));
