const DevModel = require('../models/Dev');

module.exports = {
  async store(req, res) {
    const { io, connectedUsers } = req;
    const { user } = req.headers;
    const { devId } = req.params;

    const loggedDev = await DevModel.findById(user);
    const targetDev = await DevModel.findById(devId);

    if (!targetDev) return res.status(400).json({ error: 'dev doesnt exist!' });

    if (targetDev.likes.includes(loggedDev._id)) {
      const loggedDevSocket = connectedUsers[loggedDev._id];
      const targetDevSocket = connectedUsers[targetDev._id];

      if (loggedDevSocket) {
        io.to(loggedDevSocket).emit('match', targetDev);
      }

      if (targetDevSocket) {
        io.to(targetDevSocket).emit('match', loggedDev);
      }
    }

    loggedDev.likes.push(targetDev._id);
    await loggedDev.save();

    return res.json(loggedDev);
  },
};
