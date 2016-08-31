/**
 * @providesModule isValidEmail
 * @flow
 */

export default function isValidEmail(email: string): bool {
  return /^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/.test(email);
}
