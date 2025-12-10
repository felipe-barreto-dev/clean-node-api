export interface StrongPasswordValidator {
  isValid: (password: string) => boolean
}
