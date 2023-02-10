const YardimEt = require("../models/yardimEtModel");
const Yardim = require("../models/yardimKaydiModel");

async function yardimEtPostIdExists(request, reply, next) {
  const postId = request.body.postId;
  const existingYardimEtKaydi = await YardimEt.findOne({
    _id: postId,
  });
  if (!existingYardimEtKaydi) {
    reply.code(400).send({
      error: "postId bulunamadı.",
    });
  }
  next();
}
async function yardimPostIdExists(request, reply) {
  const postId = request.body.postId;
  const existingYardimKaydi = await Yardim.findOne({
    _id: postId,
  });
  if (!existingYardimKaydi) {
    reply.status(400).send({
      error: "postId bulunamadı.",
    });
  }
}

module.exports = {
  yardimEtPostIdExists,
  yardimPostIdExists,
};
