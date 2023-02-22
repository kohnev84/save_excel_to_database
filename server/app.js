const express = require('express')
const app = express()
const cors = require('cors')
var bodyParser = require('body-parser');
var pg = require('pg');


const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));
const path = require('path');

const config = {
    user: 'postgres',
    database: 'exel_to_database',
    password: 'postgres',
    port: 5432
};

const pool = new pg.Pool(config);

app.get('/', function (req, res) {
    res.send('Hello World!!!')
})

app.get('/getusers', function (req, res) {
    console.log('Запрос получен');

    pool.connect(function (err, client, done) {

        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        client.query('SELECT * FROM users order by id_user', function (err, result) {
            done();
            if (err) {
                console.log(err);
                return res.status(400).send(err);
            }
            console.log(result.rows)
            return res.status(200).json({ response: result.rows });
        })
    })
})

app.post('/deleteusers', function (req, res) {
    console.log('Запрос на удаление', req.body);

    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        client.query(`DELETE FROM users WHERE id_user='${req.body.idDeleteUsers}';`, function (err, result) {
            done();
            if (err) {
                console.log(err);
                return res.status(400).send(err);
            }
            console.log(result.rows)
            return res.status(200).json({ response: result.rows })
        })
    })
})

app.post('/save_data', function (req, res) {
    console.log(req.body);
    let arr_users = req.body

    let result_str = `INSERT INTO users (fio, position, salary, education) VALUES`;
    for (let i = 1; i < arr_users.length; i++) {
        result_str += `('${arr_users[i][0]}', '${arr_users[i][1]}', '${arr_users[i][2]}', '${arr_users[i][3]}'), `
    }
    let query_result = result_str.substring(0, result_str.length - 2) + ";"
    console.log(result_str.substring(0, result_str.length - 2) + ";")
    pool.connect(function (err, client, done) {

        if (err) {
            console.log("Can not connect to the DB" + err);
        }


        client.query(query_result, function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            console.log(result.rows);
            res.status(200).json({ response: 'Пользователи успешно сохранены в базе данных' })
        })
    })
})

app.post('/upload', upload.single('ited'), function (req, res, next) {

})

app.listen(5000, console.log("Сервер запущен на порту 5000"))