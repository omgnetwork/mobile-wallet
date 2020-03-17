const getOriginalRequestIPFromCloudFlare = req => {
  return (
    req.headers['cf-connecting-ip'] ||
    (req.headers['x-forwarded-for'] &&
      req.headers['x-forwarded-for'].split(',')[0])
  )
}

module.exports = {
  getOriginalRequestIPFromCloudFlare
}
