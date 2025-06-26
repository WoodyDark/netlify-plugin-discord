const site = require('./site')
const request = require('./request')

/**
 * netlify-plugin-discord
 */

async function ifHasWebhookAndSiteContext (buildStatus) {
  if (!site.webhook) {
    console.log(`Build status(${buildStatus}), skipping Discord`)
    return
  }

  try {
    const contexts = site.notify_context?.split(' ') || []

    if (
      contexts.includes(site.context) ||
      contexts.includes('all')
    ) {
      await request(buildStatus)
      console.log(
        `Build status(${buildStatus}), sent to Discord`,
      )
    } else {
      console.log(
        `Build status(${buildStatus}), skipping Discord`,
      )
    }
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  /**
   * Pre-build
   */
  async onPreBuild ({build}) {
    if (site.webhook) {
      console.log('Discord webhook URL was found')
      console.log(
        'Discord notify context found:',
        site.notify_context,
      )
      console.log('Current site context', site.context)
    } else {
      // build.failBuild('No webhook set')
      console.log(
        'DISCORD_WEBHOOK_URL not set. Will skip Discord.',
      )
    }
  },

  /**
   * Success
   */
  async onSuccess () {
    ifHasWebhookAndSiteContext('success')
  },

  /**
   * Error
   */
  async onError () {
    ifHasWebhookAndSiteContext('fail')
  },
}
