export const getOriginalRequestIPFromCloudFlare = req => {
  return req.headers['CF-Connecting-IP']
}
