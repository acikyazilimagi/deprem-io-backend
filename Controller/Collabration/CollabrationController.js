const CollabrationListing = require('../../models/Collobration/CollabrationListing');

class CollabrationController {
    async getAll(req, res) {
        try {
          const query = req.query;
          let where = {};
          if (query.city) {
            where.City = query.city;
          }
          if (query.district) {
            where.District = query.district;
          }
          if (query.type) {
            where.needType = { [Op.in]: query.type.split(',') };
          }
          if (query.emergency) {
            where.emergencyStatus = query.emergency;
          }
          const collabrationListings = await CollabrationListing.find({
            where,
          });
          res.json(collabrationListings);
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
    async show(req, res) {
        const collabrationListing = await CollabrationListing.findById(req.params.id);
        return res.json(collabrationListing);
    }

    async store(req, res) {
        const collabrationListing = await CollabrationListing.create(req.body);

        return res.json(collabrationListing);
    }

    async update(req, res) {
        const collabrationListing = await CollabrationListing.findById(req.params.id);

        await collabrationListing.update(req.body);

        return res.json(collabrationListing);
    }

    async delete(req, res) {
        const collabrationListing = await CollabrationListing.findById(req.params.id);

        await collabrationListing.destroy();

        return res.send();
    }
}

module.exports = new CollabrationController();

