import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export async function getDiff(workspacePath: string): Promise<string> {
    const { stdout } = await execFileAsync('git', ['diff', '--no-color'], {
        cwd: workspacePath,
        maxBuffer: 10 * 1024 * 1024
    });
    return stdout;
}
