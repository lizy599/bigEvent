$(function () {
  // 登录注册跳转
  $('#link_reg').on('click', () => {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  $('#link_login').on('click', () => {
    $('.login-box').show()
    $('.reg-box').hide()
  })

  // 导出layui的对象
  const form = layui.form
  const layer = layui.layer
  // 自定义校验规则

  form.verify({
    username: (value, item) => {
      //value：表单的值、item：表单的DOM对象
      if (!new RegExp('^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$').test(value)) {
        return '用户名不能有特殊字符'
      }
      if (/(^\_)|(\__)|(\_+$)/.test(value)) {
        return "用户名首尾不能出现下划线'_'"
      }
      if (/^\d+\d+\d$/.test(value)) {
        return '用户名不能全为数字'
      }

      //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
      if (value === 'xxx') {
        alert('用户名不能为敏感词')
        return true
      }
    },

    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    password: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    repassword: (value) => {
      // 比较两次密码是否一致
      let pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致'
      }
    }
  })

  // 监听注册提交
  $('#form_reg').on('submit', async (event) => {
    event.preventDefault()
    let data = {
      username: $('#form_reg [name=username').val(),
      password: $('#form_reg [name=password]').val()
    }
    const res = await $.post(`/api/reguser`, data)
    if (res.status !== 0) {
      return layer.msg(res.message)
    }
    layer.msg(res.message)
    $('#link_login').click()
  })

  // 登录跳转首页
  $('#form_login').on('submit', async function(event)  {
    event.preventDefault()
    let data = $(this).serialize()
    const res = await $.post('/api/login', data)
    if (res.status !== 0) {
      return layer.msg(res.message||'注册失败')
    }
    layer.msg('注册成功')
    localStorage.setItem('token',res.token)
    location.href = '../index.html'
  })
})
