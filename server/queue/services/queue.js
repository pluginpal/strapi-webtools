'use strict';

const { getPluginService } = require('../../util/getPluginService');

module.exports = () => ({
  /**
   * Create queue.
   *
   * @param {string} name the name.
   * @returns {void}
   */
  create: async (name) => {
    try {
      return await strapi.entityService.create('plugin::url-alias.queue', {
        data: {
          name,
        },
      });
    } catch (e) {
      strapi.log.error(e);
    }
  },

  /**
   * Add job.
   *
   * @param {string} name the name of the queue.
   * @param {object} data the data of the job.
   * @returns {void}
   */
   addJob: async (name, data) => {
    try {
      const queue = await getPluginService('queueHelpers').getQueue(name);
      await getPluginService('queueHelpers').createJob(queue.id, data);
    } catch (e) {
      strapi.log.error(e);
    }
  },

  /**
   * Process the queue.
   *
   * @param {string} name the name of the queue.
   * @param {function} fn the process function.
   * @returns {void}
   */
   process: async (name, fn) => {
    const queue = await getPluginService('queueHelpers').getQueue(name);
    const queueSizeOnePercent = queue.queue_jobs.length / 100;
    let queueSize = queue.queue_jobs.length;

    const done = async (job) => {
      await getPluginService('queueHelpers').deleteJob(job);
      queueSize--;
      const progress = 100 - (queueSize / queueSizeOnePercent);
      await getPluginService('queueHelpers').updateProgress(queue.id, progress);
    };

    queue.queue_jobs.map((job) => {
      fn(job, () => done(job));
    });

    // TODO:
    // Delete the queue.
  },
});
