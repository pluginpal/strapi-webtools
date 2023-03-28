'use strict';

const { getPluginService } = require('../../util/getPluginService');

module.exports = () => ({
  /**
   * Get a queue by it's name.
   *
   * @param {string} name the name.
   * @returns {void}
   */
  getQueue: async (name) => {
    try {
      const queues = await strapi.entityService.findMany('plugin::url-alias.queue', {
        filters: {
          name,
        },
        populate: {
          queue_jobs: true,
        },
      });

      return queues[0];
    } catch (e) {
      strapi.log.error(e);
    }
  },

  /**
   * Create a job.
   *
   * @param {string} queueId the id of the queue.
   * @param {object} data the data of the job.
   * @returns {void}
   */
   createJob: async (queueId, data) => {
    try {
      return await strapi.entityService.create('plugin::url-alias.job', {
        data: {
          data,
          queue: queueId,
        },
      });
    } catch (e) {
      strapi.log.error(e);
    }
  },

  /**
   * Deletes a job.
   *
   * @param {obj} job the job to delete.
   * @returns {void}
   */
   deleteJob: async (job) => {
    try {
      await strapi.entityService.delete('plugin::url-alias.job', job.id);
    } catch (e) {
      strapi.log.error(e);
    }
  },

  /**
   * Update the progress
   *
   * @param {number} queueId the id of the queue to update.
   * @param {number} progress the new progress.
   * @returns {void}
   */
   updateProgress: async (queueId, progress) => {
    try {
      await strapi.entityService.update('plugin::url-alias.queue', queueId, {
        data: {
          progress: Math.floor(progress),
        },
      });
    } catch (e) {
      strapi.log.error(e);
    }
  },
});
