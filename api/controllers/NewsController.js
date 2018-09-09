/**
 * NewsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const moment = require('moment');

module.exports = {
  
  getNews: async (req, res) => {
    /**
    * Params:
    * - searchTerm
    * - sortBy (ASC or DESC)
    * - sortType
    * - pageNum
    * - pageSize
    * - latest
    */

    sails.log('NewsController::getNews called');

    const params = req.allParams();
    
    const criteria = {where: {isArchived: false}};
    const fields = ['_id', 'title', 'content'];

    //  search query
    if (params.searchTerm) {
      criteria.where.or = _.map(fields, (field) => ({[field]: field === '_id' ? params.searchTerm : {contains: params.searchTerm}}));
    }

    //  pagination
    if ((params.pageNum && params.pageNum > 0) && (params.pageSize && params.pageSize > 0)) {
      criteria.limit = params.pageSize;
      criteria.skip = params.pageSize * (params.pageNum - 1);
    }

    //  sorting
    if ((params.sortType === 'ASC' || params.sortType === 'DESC') && (params.sortBy && fields.indexOf(params.sortBy) !== -1)) {
      criteria.sort = `${params.sortBy} ${params.sortType}`;
    }

    if (params.latest === 'true') {
      const startDate = moment().valueOf();
      const endDate = moment().subtract(30, 'days').valueOf();
  
      criteria.where.createdAt = {'>=': endDate, '<=': startDate};
    }

    const news = await News.find(criteria)
    .intercept((err) => {
      return err;
    });

    return res.status(200).json({news});

  },

  createNews: async (req, res) => {
    /**
     * Params:
     * - title (req)
     * - content (req)
    */

    sails.log('NewsController:: createNews called');

    const params = req.allParams();

    const news = await News.create(params)
    .intercept((err) => {
      return err;
    }).fetch();

    return res.status(200).json({news});
  },

  updateNews: async (req, res) => {
    /**
     * Params:
     * - id (req, query param)
     * - title (req)
     * - content (req)
    */

    sails.log('NewsController:: updateNews called');

    const params = req.allParams();

    const news = await News.update({id: params.id, isArchived: false}, {
      title: params.title,
      content: params.content,
    }).intercept((err) => {
      return err;
    }).fetch();

    return res.status(200).json({news: _.head(news)});
  },

  deleteNews: async (req, res) => {
    /**
     * Params:
     * - id (req, query param)
    */

    sails.log('NewsController:: deleteNews called');

    const params = req.allParams();

    const news = await News.update({id: params.id, isArchived: false}, {
      isArchived: true,
    }).intercept((err) => {
      return err;
    }).fetch();

    if (!news) {
      return res.status(404).json({details: 'News does not exist.'});
    } else {
      return res.status(200).json({details: 'News deleted successfully.'});
    }
    
  },

};

