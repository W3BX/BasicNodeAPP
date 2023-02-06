const comment = require('../models/commentModel')

const saveComment = async (postData) => {

    const { data, user } = postData

    const commnets = new comment({ user: user, comment: data })
    const saved = await commnets.save()

    if (saved) {
        const commnetsRecevived = await comment.find({}, { 'user': 1, 'comment': 1, 'createdAt': 1, '_id': 0 })
        return commnetsRecevived
    } else {
        console.log("something went wrong")
    }

}

module.exports = { saveComment }