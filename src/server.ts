import express from 'express';
import { Application, Request, Response } from 'express';

import * as bodyParser from 'body-parser';

import { handler } from '.';

function getPort(): number
{
    const p = parseInt(process.env.PORT as string);
    if (isNaN(p))
        return 8080;

    return p;
}

const app: Application = express();
const port = getPort();

app.use(bodyParser.json());

app.post('/', async (req: Request, res: Response): Promise<void> => {
    const body = JSON.stringify(req.body);

    // @ts-ignore
    const content = await handler({ body }, {});
    res.json(content);
});

app.listen(port, '0.0.0.0', (): void => {
    console.log(`listening at port ${port}`);
});
