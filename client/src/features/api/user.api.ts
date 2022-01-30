import { config } from "@app/customLocalStorage"
import axios from "axios"

export const registerUser = async (user:any) => {
  try {
    const { data } = await axios.post(`/api/auth/register`, user, config())
    

    typeof window !== undefined &&
      localStorage.setItem('userInfo', JSON.stringify(data))
    return data
  } catch (error) {
    throw error.response.data
  }
}

export const login = async (credentials:any) => {
  try {
    const { data } = await axios.post(`/api/auth/login`, credentials, config())

    typeof window !== undefined &&
      localStorage.setItem('userInfo', JSON.stringify(data))
    return data
  } catch (error) {
    throw error.response.data
  }
}

export const logout:any = () => {
  return typeof window !== undefined && localStorage.removeItem('userInfo')
}