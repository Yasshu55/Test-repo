import express from 'express'
import {sum} from 'sum2number'

const app = express();

app.get('/', (req, res) => {
    res.send("Sum : " + sum(2,3));
});

app.listen(3000, () => console.log("App listening on - 3000"))