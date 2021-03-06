const {
  userModel,
  teamModel
} = app.model
export default {
  getTeamList: function*(pageIndex = 1, pageSize = 10, sortParam = {}) {
    pageIndex = pageIndex < 1 ? 1 : parseInt(pageIndex)
    let count = yield teamModel.count().exec()
      //总页数
    let total = 1
    if (count >= pageSize) {
      total = Math.ceil(count / pageSize)
    }
    let start = pageIndex == 0 ? 0 : (pageIndex - 1) * pageSize
    let data = yield teamModel.find().sort(sortParam).skip(start).limit(pageSize).exec()
    let next = pageIndex
    let previous = pageIndex
    next++
    previous--
    //是否为第一页
    if (pageIndex === 1) {
      previous = null
    }
    //是否超过总页
    if (pageIndex > total - 1) {
      next = null
        //previous = total--
    }
    return {
      data: data,
      //页数
      total: total,
      //下一页编号
      next: next,
      //上一页编号
      previous: previous,
      //当前页
      pageIndex: pageIndex,
      //数据长度
      dataLength: data.length,
      //团队个数
      count: count
    }
  },
  async getTeam (teamId) {
    return await teamModel.findById(teamId).exec()
  },
  createTeam: function*(body) {
    body.creator = "554c263adf78ff141dd84693"
    let team, data;
    try {
      team = new teamModel(body)
      data = yield team.save()
    } catch (e) {
      console.log(e)
    }
    return data
  },
  updateTeam: function*(teamId, diff) {
    let query = {
      "_id": teamId
    }
    return yield teamModel.update(query, diff).exec()
  },
  deleteTeam: function*(teamId) {
    let query = {
      "_id": teamId
    }
    return yield teamModel.remove(query).exec()
  }
}
