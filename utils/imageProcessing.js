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

async function createThumbnailAndJpg (original) {
  console.log(original.slice(0, 20))
  console.log(original.length)
  let thumbnail = null
  let full = null
  if (original) {
    const match = original.match(/^data:image\/\w+;base64,(.*)$/)
    const originalData = match[1]
    const originalBuf = Buffer.from(originalData, 'base64')

    thumbnail = await sharp(originalBuf)
      .resize(200)
      .jpeg()
      .toBuffer()
    thumbnail = 'data:image/jpeg;base64,' + thumbnail.toString('base64')
    console.log(thumbnail.slice(0, 20))
    console.log(thumbnail.length)

    full = await sharp(originalBuf)
      .jpeg()
      .toBuffer()
    full = 'data:image/jpeg;base64,' + full.toString('base64')
    console.log(full.slice(0, 20))
    console.log(full.length)
  }
  return { full, thumbnail }
}

module.exports = {
  createThumbnail,
  createThumbnailAndJpg
}
