import axios from "axios"

export const api_url = `https://api-forrocwb.nandoburgos.dev`
// export const api_url = `http://192.168.15.24:4545`

export const api = axios.create({ baseURL: api_url })