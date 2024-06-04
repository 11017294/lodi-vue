/**
 * token
 */
import Cookies from 'js-cookie'

const TokenKey = 'tokenValue'
const TokenNameKey = 'tokenName'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getTokenName() {
  return Cookies.get(TokenNameKey)
}

export function setToken(tokenInfo: any) {
  Cookies.set(TokenNameKey, tokenInfo.tokenName)
  return Cookies.set(TokenKey, tokenInfo.tokenValue)
}

export function removeToken() {
  Cookies.remove(TokenNameKey)
  return Cookies.remove(TokenKey)
}
