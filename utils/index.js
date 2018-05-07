// 时间获取函数
function timeformat (time) {
	return [
    time.getFullYear(),
    time.getMonth() + 1,
    time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes()
  ].join('-')
}
// 首字母设置大写函数
function initialUpCase (word) {
  return word.replace(/^\w/, character => character.toUpperCase())
}

module.exports = {
  timeformat,
  initialUpCase
}
