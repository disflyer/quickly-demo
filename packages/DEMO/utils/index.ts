import axios from 'axios'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
const ffmpeg = createFFmpeg({ log: true })

export const getProvision = async () => {
  const res = await fetch(`/api/photo`, {
    method: 'get'
  })
  const token = (await res.json()).token
  return token
}
export const uploadFile = async (file: Blob) => {
  const token = await getProvision()
  const formData = new FormData()
  formData.append('token', token)
  formData.append('file', file)
  try {
    const { data } = await axios.post('https://up-z2.qiniup.com', formData)
    return data.file
  } catch (err) {
    console.log(err)
    throw err
  }
}
export const transcode2MP3 = async (file) => {
  const { name } = file
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load()
  }
  ffmpeg.FS('writeFile', encodeURIComponent(name), await fetchFile(file))
  await ffmpeg.run('-i', encodeURIComponent(name), 'output.mp3')
  const data = ffmpeg.FS('readFile', `output.mp3`)
  const newFile = new Blob([data.buffer], { type: 'audio/mp3' })
  return newFile
}

export const transcode2GIF = async (file) => {
  const { name } = file
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load()
  }
  ffmpeg.FS('writeFile', encodeURIComponent(name), await fetchFile(file))
  await ffmpeg.run('-i', encodeURIComponent(name), 'output.gif')
  const data = ffmpeg.FS('readFile', `output.gif`)
  const newFile = new Blob([data.buffer], { type: 'video/gif' })
  return newFile
}

export function fetchAndInstantiate(url, importObject?) {
  return WebAssembly.instantiateStreaming(fetch(url), importObject).then((results) => results.instance)
}
