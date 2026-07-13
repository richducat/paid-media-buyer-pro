import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

export type Platform = 'google' | 'meta';

export type PlatformAccount = {
  id: string;
  name: string;
  currency?: string;
  timezone?: string;
  manager?: boolean;
};

type EncryptedValue = {
  iv: string;
  tag: string;
  ciphertext: string;
};

export type StoredConnection = {
  platform: Platform;
  connectedAt: string;
  profile: { id?: string; name?: string; email?: string };
  accounts: PlatformAccount[];
  selectedAccountId?: string;
  tokens: EncryptedValue;
};

type Vault = {
  version: 1;
  connections: Partial<Record<Platform, StoredConnection>>;
};

const emptyVault = (): Vault => ({ version: 1, connections: {} });

function dataDirectory() {
  return process.env.PAID_MEDIA_DATA_DIR || path.join(process.cwd(), '.paidmedia-data');
}

function vaultPath() {
  return path.join(dataDirectory(), 'connections.json');
}

function encryptionKey() {
  const secret = process.env.TOKEN_ENCRYPTION_KEY;
  if (!secret || secret.length < 32) {
    throw new Error('TOKEN_ENCRYPTION_KEY must be configured with at least 32 characters.');
  }
  return createHash('sha256').update(secret).digest();
}

export function encryptTokens(value: unknown): EncryptedValue {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  return {
    iv: iv.toString('base64url'),
    tag: cipher.getAuthTag().toString('base64url'),
    ciphertext: ciphertext.toString('base64url'),
  };
}

export function decryptTokens<T>(value: EncryptedValue): T {
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(value.iv, 'base64url'));
  decipher.setAuthTag(Buffer.from(value.tag, 'base64url'));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(value.ciphertext, 'base64url')),
    decipher.final(),
  ]);
  return JSON.parse(plaintext.toString('utf8')) as T;
}

async function readVault(): Promise<Vault> {
  try {
    const contents = await readFile(vaultPath(), 'utf8');
    const parsed = JSON.parse(contents) as Vault;
    return parsed.version === 1 ? parsed : emptyVault();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return emptyVault();
    throw error;
  }
}

async function writeVault(vault: Vault) {
  await mkdir(dataDirectory(), { recursive: true, mode: 0o700 });
  const destination = vaultPath();
  const temporary = `${destination}.${randomBytes(6).toString('hex')}.tmp`;
  await writeFile(temporary, `${JSON.stringify(vault, null, 2)}\n`, { mode: 0o600 });
  await rename(temporary, destination);
}

export async function getConnection(platform: Platform) {
  return (await readVault()).connections[platform] ?? null;
}

export async function saveConnection(connection: StoredConnection) {
  const vault = await readVault();
  vault.connections[connection.platform] = connection;
  await writeVault(vault);
}

export async function selectPlatformAccount(platform: Platform, accountId: string) {
  const vault = await readVault();
  const connection = vault.connections[platform];
  if (!connection || !connection.accounts.some((account) => account.id === accountId)) {
    throw new Error('That ad account is not available on this connection.');
  }
  connection.selectedAccountId = accountId;
  await writeVault(vault);
  return connection;
}

export async function deleteConnection(platform: Platform) {
  const vault = await readVault();
  delete vault.connections[platform];
  await writeVault(vault);
}
