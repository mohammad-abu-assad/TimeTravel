import { useMutation } from '@tanstack/react-query'
import { apiLogin, apiRegister } from './api'

export const useRegister = () => useMutation({ mutationFn: apiRegister })
export const useLogin = () => useMutation({ mutationFn: apiLogin })
