const getOriginalRequestIPFromCloudFlare = req => {
  return req.headers['CF-Connecting-IP']
}

module.exports = {
  getOriginalRequestIPFromCloudFlare
}
