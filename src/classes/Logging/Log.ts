import { LogTag } from './LogTag';

import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: (process.env.NODE_ENV === 'prod' ? format.json() : format.simple()),
  transports: [
    new transports.Console({})
  ]
});

interface ILogMeta {
  details?: any;
  tag: LogTag
}

const constructMeta = (tag: LogTag, data?: unknown): ILogMeta  => {
  const meta: ILogMeta = {
    tag
  };
  if (data) { meta.details = data; }
  return meta;
}

const _Log = (level: 'info'|'warn'|'error', tag: LogTag, message: string, data?: unknown) => {
  logger.log(level, message, constructMeta(tag, data));
}


export const LogWithTag = (tag: LogTag, message: string, data?: unknown) => {
  _Log('info', tag, message, data);
}
export const Log = (message: string, data?: unknown) => {
  LogWithTag('exec', message, data)
}

export const LogWarnWithTag = (tag: LogTag, message: string, data?: unknown) => {
  _Log('warn', tag, message, data);
}
export const LogWarn = (message: string, data?: unknown) => {
  LogWarnWithTag('exec', message, data)
}

export const LogErrorWithTag = (tag: LogTag, message: string, data?: unknown) => {
  _Log('error', tag, message, data);
}
export const LogError = (message: string, data?: unknown) => {
  LogErrorWithTag('exec', message, data)
}