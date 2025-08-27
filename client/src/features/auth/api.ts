import { http } from '../../shared/api/http'
export const apiRegister = (body: { email: string; password: string }) => http.post('/auth/register', body)
export const apiLogin = (body: { email: string; password: string }) => http.post('/auth/login', body)
