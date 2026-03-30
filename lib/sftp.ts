import { execFile, exec } from "child_process";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { promisify } from "util";

const execAsync = promisify(exec);
const execFileAsync = promisify(execFile);

const SFTP_HOST = "ftp.myshoptet.com";
const SFTP_PORT = "22";
const SFTP_USER = "uploader_727188";
const SFTP_PASS = "$uwY19fkfhyjE9";
const REMOTE_DIR = "/upload/webeditor";

const SSHPASS_ENV = { ...process.env, SSHPASS: SFTP_PASS };
const SFTP_OPTS = [
  "-oBatchMode=no",
  "-oStrictHostKeyChecking=accept-new",
  `-oPort=${SFTP_PORT}`,
];

export async function sftpUpload(
  localBuffer: Buffer,
  remoteFilename: string,
): Promise<void> {
  // Write buffer to temp file
  const tmpPath = join(tmpdir(), `upload-${Date.now()}-${remoteFilename}`);
  await writeFile(tmpPath, localBuffer);

  const remotePath = `${REMOTE_DIR}/${remoteFilename}`;
  const batchCmd = `put ${tmpPath} ${remotePath}`;
  const batchFile = `${tmpPath}.batch`;
  await writeFile(batchFile, batchCmd);

  try {
    await execFileAsync("sshpass", [
      "-e",
      "sftp",
      ...SFTP_OPTS,
      "-b",
      batchFile,
      `${SFTP_USER}@${SFTP_HOST}`,
    ], { env: SSHPASS_ENV });
  } finally {
    await unlink(tmpPath).catch(() => {});
    await unlink(batchFile).catch(() => {});
  }
}

export interface RemoteFile {
  filename: string;
  size: number;
  modifiedAt: number;
}

export async function sftpList(): Promise<RemoteFile[]> {
  const { stdout } = await execAsync(
    `sshpass -e sftp ${SFTP_OPTS.join(" ")} ${SFTP_USER}@${SFTP_HOST} << 'EOF'
ls -l ${REMOTE_DIR}
EOF`,
    { env: SSHPASS_ENV },
  );

  const files: RemoteFile[] = [];
  for (const line of stdout.split("\n")) {
    // Parse ls -l output: -rw-r--r--    1 user group  12345 Mar 30 12:00 filename.jpg
    const match = line.match(
      /^[-dl]\S+\s+\d+\s+\S+\s+\S+\s+(\d+)\s+(\w+\s+\d+\s+[\d:]+)\s+(.+)$/,
    );
    if (match) {
      const [, sizeStr, , filename] = match;
      if (filename === "." || filename === "..") continue;
      files.push({
        filename: filename.trim(),
        size: parseInt(sizeStr, 10),
        modifiedAt: Date.now(), // ls -l doesn't give epoch; sort by name instead
      });
    }
  }

  return files.sort((a, b) => a.filename.localeCompare(b.filename));
}

export function getShoptetUrl(filename: string): string {
  return `https://727188.myshoptet.com/user/documents/upload/webeditor/${filename}`;
}
