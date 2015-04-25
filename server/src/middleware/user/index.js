import {
  User
}
from '../../data'
export default {
  checkUserModel: function*(next) {
    this.checkBody('email').isEmail('邮箱地址格式不对')
    this.checkBody('password').notEmpty('请输入密码')
    if (this.errors) {
      console.log(this.errors)
      this.flash = this.errors
      return
    }
    yield next
  },
  register: function*(next) {
    const userModel = this.request.body;
    const userExist =
      yield User.emailExist(userModel.email)
    if (userExist[0]) {
      this.body = 'email 已被注册'
      return
    }
    const newUser = new User(userModel);
    var user =
      yield newUser.save();
    yield next
  }
}