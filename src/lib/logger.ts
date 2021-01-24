enum Criticality
{
    Info  = 'info',
    Warn  = 'warn',
    Error = 'error',
}

interface IEmit
{
    [criticality: string]: (msg: string, err?: Error) => void;
}

function emit(isDebug: boolean, crit: Criticality, msg: string, err?: Error): void
{
    if (!isDebug)
        return;

    const now  = new Date();
    const monf = ((): string => {
        const month = now.getMonth() + 1;
        if (month < 10)
            return `0${month}`;

        return month.toString();
    })();

    const datef = `${now.getFullYear()}-${monf}-${now.getDate()}`;
    const timef = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    const ts   = `${datef} ${timef}`;
    const line = `${ts} ${crit}`;

    const log = ((): Function => {
        switch (crit) {
            case Criticality.Info:  return console.log;
            case Criticality.Warn:  return console.warn;
            case Criticality.Error: return console.error;
        }
    })();

    log(`${line}: ${msg}`);

    if (err)
        log(`${line}: ${err.message}`);
}

export const logger = (config: { isDebug: boolean }): IEmit => {
    return {
        info:  (msg: string, err?: Error): void => { emit(config.isDebug, Criticality.Info, msg, err); },
        warn:  (msg: string, err?: Error): void => { emit(config.isDebug, Criticality.Warn, msg, err); },
        error: (msg: string, err?: Error): void => { emit(config.isDebug, Criticality.Error, msg, err); },
    };
};
