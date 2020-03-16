const getOriginalRequestIPFromCloudFlare = req => {
  return (
    req.headers['CF-Connecting-IP'] ||
    req.headers['X-Forwarded-For'].split(',')[0]
  )
}

module.exports = {
  getOriginalRequestIPFromCloudFlare
}
