// Strips the `aps-environment` entitlement that expo-notifications adds by
// default. We only use local notifications, so we don't need APNs / Push
// Notifications capability — and including it forces the iOS provisioning
// profile to support Push Notifications, which a free Apple Developer
// account cannot do.
const { withEntitlementsPlist } = require('expo/config-plugins')

module.exports = function withNoApsEntitlement(config) {
  return withEntitlementsPlist(config, (cfg) => {
    if (cfg.modResults && 'aps-environment' in cfg.modResults) {
      delete cfg.modResults['aps-environment']
    }
    return cfg
  })
}
