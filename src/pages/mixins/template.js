let template = [
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

export default template
