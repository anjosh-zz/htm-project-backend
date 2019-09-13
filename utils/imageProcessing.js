const sharp = require('sharp')

async function createThumbnail (img) {
  let thumbnail = null
  if (img) {
    const match = img.match(/(^data:image\/\w+;base64,)(.*)$/)
    const prefix = match[1]
    const imgData = match[2]
    const imgBuf = Buffer.from(imgData, 'base64')
    thumbnail = await sharp(imgBuf)
      .resize(200)
      .toBuffer()
    thumbnail = prefix + thumbnail.toString('base64')
  }
  return thumbnail
}

async function createThumbnailAndJpg (img) {
  let thumbnail = null
  if (img) {
    const match = img.match(/(^data:image\/\w+;base64,)(.*)$/)
    const prefix = match[1]
    const imgData = match[2]
    const imgBuf = Buffer.from(imgData, 'base64')
    const sharpImg = sharp(imgBuf)

    thumbnail = await sharpImg
      .resize(200)
      .jpeg()
      .toBuffer()
    thumbnail = prefix + thumbnail.toString('base64')

    img = await sharpImg
      .jpeg()
      .toBuffer()
    img = prefix + img.toString('base64')
  }
  return { img, thumbnail }
}

module.exports = {
  createThumbnail,
  createThumbnailAndJpg
}
