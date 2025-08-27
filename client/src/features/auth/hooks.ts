import { useMutation } from '@tanstack/react-query'
import { apiLogin, apiRegister } from './api'

const handleError = (err: Error) => window.alert(err.message)

export const useRegister = () =>
  useMutation({ mutationFn: apiRegister, onError: handleError })

export const useLogin = () =>
  useMutation({ mutationFn: apiLogin, onError: handleError })
