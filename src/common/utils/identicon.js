import jdenticon from 'jdenticon'

export const create = (hash, size = 64, config) => {
  return jdenticon.toSvg(hash, size, config)
}
