const site = require('./site')
const request = require('./request')

/**
 * netlify-plugin-discord
 */
module.exports = {
  /**
   * Pre-build
   */
  async onPreBuild ({build}) {
    !site.webhook && build.failBuild('No webhook set')

    console.log('Discord webhook URL was found')
    console.log(
      'Discord notify context found:',
      site.notify_context,
    )
    console.log('Current site context', site.context)
  },

  /**
   * Success
   */
  async onSuccess () {
    try {
      const contexts = site.notify_context?.split(' ') || []

      if (
        contexts.includes(site.context) ||
        contexts.includes('all')
      ) {
        await request('success')
        console.log('Build status (success) sent to Discord')
      } else {
        console.log('Build status (success), skipping Discord')
      }
    } catch (err) {
      console.error(err)
    }
  },

  /**
   * Error
   */
  async onError () {
    try {
      await request('fail')

      console.log('Build status (fail) sent to Discord')
    } catch (err) {
      console.error(err)
    }
  },
}
