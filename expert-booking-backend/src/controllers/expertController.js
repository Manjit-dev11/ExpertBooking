const Expert = require('../models/Expert');

exports.getExperts = async (req, res) => {
  const { page = 1, limit = 10, category, search } = req.query;

  let query = {};

  if (category && category !== 'All') {
    query.category = category;
  }

  if (search) {
    query.$text = { $search: search };
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    select: '-availableSlots'
  };

  const result = await Expert.paginate(query, options);

  res.status(200).json({
    success: true,
    data: {
      experts: result.docs,
      pagination: {
        total: result.totalDocs,
        page: result.page,
        pages: result.totalPages,
        limit: result.limit,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      }
    }
  });
};

exports.getExpertById = async (req, res) => {
  const expert = await Expert.findById(req.params.id);

  if (!expert) {
    return res.status(404).json({ success: false, message: 'Expert not found' });
  }

  res.status(200).json({
    success: true,
    data: { expert }
  });
};
