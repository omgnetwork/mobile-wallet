const getOriginalRequestIPFromCloudFlare = req => {
  return req.headers['CF-Connecting-IP'] || req.headers['X-Forwarded-For']
}

module.exports = {
  getOriginalRequestIPFromCloudFlare
}
