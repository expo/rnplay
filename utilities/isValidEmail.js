/**
 * @providesModule isValidEmail
 * @flow
 */

export default function isValidEmail(email: string): boolean {
  return /^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/.test(email);
}
