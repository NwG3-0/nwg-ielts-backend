import cloudinary from 'cloudinary'

export const cloud = cloudinary.v2

export const options = {
  use_filename: true,
  unique_filename: false,
  overwrite: true,
}

cloudinary.v2.config({
  cloud_name: 'website-selling-game',
  api_key: '117736693572573',
  api_secret: '5i0_C1OYngaeHYd9Q3Vj2LElml4',
  secure: true,
})
