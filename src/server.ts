import express from 'express';
import { Application, Request, Response } from 'express';

import * as bodyParser from 'body-parser';

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
    console.log(JSON.stringify(req.headers));
    console.log(JSON.stringify(req.body));
    res.sendStatus(200);
});

app.listen(port, '0.0.0.0', (): void => {
    console.log(`listening at port ${port}`);
});
