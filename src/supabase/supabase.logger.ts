import { ConsoleLogger } from '@nestjs/common';
import * as fs from 'fs';

export class DatabaseLogger extends ConsoleLogger {
  DB_LOG_FILE = 'logs/database.log';

  constructor() {
    super();
    if (!fs.existsSync('logs')) {
      fs.mkdir('logs', (error) => (error ? console.error(error) : null));
    }
  }

  log(message: string) {
    if (!fs.existsSync('logs')) {
      fs.mkdir('logs', (error) => (error ? console.error(error) : null));
    }
    const context = 'DB';
    fs.appendFileSync(
      this.DB_LOG_FILE,
      `${this.getTimestamp()}\t LOG [${context}] ${message}\n`,
      'utf-8',
    );
    this.setContext(context);
    //super.log(message);
  }

  error(message: string) {
    if (!fs.existsSync('logs')) {
      fs.mkdir('logs', (error) => (error ? console.error(error) : null));
    }
    const context = 'DB';
    fs.appendFileSync(
      this.DB_LOG_FILE,
      `${this.getTimestamp()}\t ERROR [${context}] ${message}\n`,
      'utf-8',
    );
    this.setContext(context);
    super.error(message);
  }
}
