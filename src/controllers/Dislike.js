const DevModel = require('../models/Dev');

module.exports = {
  async store(req, res) {
    const { user } = req.headers;
    const { devId } = req.params;

    const loggedDev = await DevModel.findById(user);
    const targetDev = await DevModel.findById(devId);

    if (!targetDev) return res.status(400).json({ error: 'dev doesnt exist!' });

    loggedDev.dislikes.push(targetDev._id);
    await loggedDev.save();

    return res.json(loggedDev);
  },
};
