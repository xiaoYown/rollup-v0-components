import Pages from '@/libs/pages'
import '@/reset.scss'
import '@/libs/pages/main.scss'

var pages = Pages({
  // 放置 page 的元素
  wrap: 'pages-demo',
  // 进入时页码
  index: 1,
  // 每页条数
  pageSize: 10,
  // 总条数
  total: 100,
  // 回调
  cb: function (data) {
    console.log(data)
  }
})
pages.init()

