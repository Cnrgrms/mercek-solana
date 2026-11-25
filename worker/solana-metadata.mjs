import {solanaAddress} from './solana-risk.mjs';
const metadataProgram = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';
const metadataAlphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const metadataEncoder = new TextEncoder();
const metadataField = (1n << 255n) - 19n;
const metadataCurveD = 37095705934669439343138083508754565189542113879843219016388785533085940283555n;
const metadataMod = value => (value % metadataField + metadataField) % metadataField;

function metadataDecodeAddress(address) {
  let value = 0n;
  for (const char of address) value = value * 58n + BigInt(metadataAlphabet.indexOf(char));
  const bytes = new Uint8Array(32);
  for (let i = 31; i >= 0; i--) {
    bytes[i] = Number(value & 255n);
    value >>= 8n;
  }
  return bytes;
}

function metadataEncodeAddress(bytes) {
  let value = bytes.reduce((total, byte) => total * 256n + BigInt(byte), 0n);
  let address = '';
  while (value) {
    address = metadataAlphabet[Number(value % 58n)] + address;
    value /= 58n;
  }
  for (const byte of bytes) {
    if (byte !== 0) break;
    address = '1' + address;
  }
  return address;
}

// Solana PDAs must be off the Ed25519 curve. Test x² without computing an inversion.
function metadataOnCurve(bytes) {
  let y = BigInt(bytes[31] & 127);
  for (let i = 30; i >= 0; i--) y = y * 256n + BigInt(bytes[i]);
  if (y >= metadataField) return false;
  const square = metadataMod(y * y);
  const numerator = metadataMod(square - 1n);
  const denominator = metadataMod(metadataCurveD * square + 1n);
  if (!denominator) return false;
  if (!numerator) return (bytes[31] & 128) === 0;
  let base = metadataMod(numerator * denominator);
  let exponent = (metadataField - 1n) / 2n;
  let result = 1n;
  while (exponent) {
    if (exponent & 1n) result = metadataMod(result * base);
    base = metadataMod(base * base);
    exponent >>= 1n;
  }
  return result === 1n;
}

export async function metadataAddress(mint) {
  const data = Uint8Array.of(
    ...metadataEncoder.encode('metadata'), ...metadataDecodeAddress(metadataProgram),
    ...metadataDecodeAddress(mint), 0, ...metadataDecodeAddress(metadataProgram),
    ...metadataEncoder.encode('ProgramDerivedAddress')
  );
  const bumpIndex = 'metadata'.length + 64;
  for (let bump = 255; bump >= 0; bump--) {
    data[bumpIndex] = bump;
    const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', data));
    if (!metadataOnCurve(digest)) return metadataEncodeAddress(digest);
  }
  throw new Error('Could not derive metadata PDA');
}

export function metadataFromMint(info, mint) {
  const extensions = Array.isArray(info.extensions) ? info.extensions : [];
  const pointer = extensions.find(entry => entry?.extension === 'metadataPointer');
  const target = pointer?.state?.metadataAddress;
  const metadata = extensions.find(entry => entry?.extension === 'tokenMetadata');
  if (!pointer && !metadata) return null;
  if (target && target !== mint) return {status:'external', source:'Token-2022', address:target};
  const state = metadata?.state;
  if (!state || state.mint !== mint) return {status:'unknown', source:'Token-2022', address:mint};
  // Token-2022 encodes a missing authority as an all-zero optional address.
  const authority = state.updateAuthority;
  const status = authority === null || authority === '11111111111111111111111111111111'
    ? 'immutable' : solanaAddress(authority)
      ? 'mutable' : 'unknown';
  return {status, source:'Token-2022', address:mint};
}

export function metadataFromAccount(account, mint, address) {
  const status = value => ({status:value, source:'Metaplex', address});
  if (account === null) return status('missing');
  if (account?.owner !== metadataProgram || account?.data?.[1] !== 'base64') return status('unknown');
  try {
    const bytes = Uint8Array.from(atob(account.data[0]), char => char.charCodeAt(0));
    if (bytes[0] !== 4 || bytes.length < 65 || metadataEncodeAddress(bytes.subarray(33,65)) !== mint) {
      return status('unknown');
    }
    const view = new DataView(bytes.buffer);
    // Skip name, symbol and URI, then seller fee and optional creator records.
    let cursor = 65;
    for (let i = 0; i < 3; i++) cursor += 4 + view.getUint32(cursor,true);
    cursor += 2;
    const creators = view.getUint8(cursor++);
    if (creators === 1) cursor += 4 + 34 * view.getUint32(cursor,true);
    else if (creators !== 0) return status('unknown');
    if (view.getUint8(cursor++) > 1) return status('unknown');
    const mutable = view.getUint8(cursor);
    return status(mutable === 1 ? 'mutable' : mutable === 0 ? 'immutable' : 'unknown');
  } catch {
    return status('unknown');
  }
}
