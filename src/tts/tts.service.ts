import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import { spawn } from 'child_process';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { join } from 'path';

@Injectable()
export class TtsService {
  async synthesize(text: string): Promise<string> {
    const pythonPath = process.env.PIPER_PYTHON_PATH;
    const scriptPath = process.env.PIPER_SCRIPT_PATH;
    const modelPath = process.env.PIPER_MODEL_PATH;
    const outputDir = process.env.PIPER_OUTPUT_DIR;

    if (!pythonPath || !scriptPath || !modelPath || !outputDir) {
      throw new InternalServerErrorException(
        'Faltan variables de entorno para Piper (PIPER_PYTHON_PATH, PIPER_SCRIPT_PATH, PIPER_MODEL_PATH, PIPER_OUTPUT_DIR).',
      );
    }

    if (!existsSync(pythonPath)) {
      throw new InternalServerErrorException(
        `No existe PIPER_PYTHON_PATH: ${pythonPath}`,
      );
    }
    if (!existsSync(scriptPath)) {
      throw new InternalServerErrorException(
        `No existe PIPER_SCRIPT_PATH: ${scriptPath}`,
      );
    }
    if (!existsSync(modelPath)) {
      throw new InternalServerErrorException(
        `No existe PIPER_MODEL_PATH: ${modelPath}`,
      );
    }

    await mkdir(outputDir, { recursive: true });

    const filename = `nino-${randomUUID()}.wav`;
    const outputPath = join(outputDir, filename);

    const args = [
      scriptPath,
      '--text',
      text,
      '--model',
      modelPath,
      '--output',
      outputPath,
    ];

    const stderrChunks: string[] = [];

    const exitCode = await new Promise<number>((resolve, reject) => {
      const child = spawn(pythonPath, args, {
        windowsHide: true,
        stdio: ['ignore', 'ignore', 'pipe'],
      });

      child.stderr?.on('data', (chunk: Buffer) => {
        stderrChunks.push(chunk.toString('utf-8'));
      });

      child.on('error', (err) => reject(err));
      child.on('close', (code) => resolve(code ?? 1));
    });

    if (exitCode !== 0 || !existsSync(outputPath)) {
      const stderr = stderrChunks.join('').trim();
      throw new InternalServerErrorException(
        `Error generando voz con Piper: ${stderr || `exit ${exitCode}`}`,
      );
    }

    return outputPath;
  }
}

