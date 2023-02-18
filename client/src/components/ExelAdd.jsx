import React, { useState, useEffect } from 'react';
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import { Table, Button, message } from 'antd'

function ExelAdd() {

    const [arrUsers, setUsers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/getusers')
            .then(res => res.json())
            .then(res => {
                let newArr = [];
                console.log({ res })
                let result = res.response
                for (let i = 0; i < result.length; i++) {
                    let obj = {}
                    obj.id_user = result[i].id_user
                    obj.fio = result[i].fio
                    obj.position = result[i].position
                    obj.salary = result[i].salary
                    obj.education = result[i].education
                    newArr.push(obj)
                };
                setUsers(newArr)
            })
    }, [])

    const deleteUsers = async (id) => {
        const reqComparison = await fetch(
            'http://localhost:5000/deleteusers',
            {
                headers: {
                    'Content-Type': "application/json",
                },
                method: 'POST',
                body: JSON.stringify({ idDeleteUsers: id })
            })
        const result = await reqComparison.json()
        console.log(result)
        if (result.response.length === 0) {
            let newArrUsers = [...arrUsers];
            let fliterArrUsers = newArrUsers.filter(e => e.id !== id)
            setUsers(fliterArrUsers)
            message.success('Удалено успешно')
        }
    }

    const columns = [
        {
            title: 'ФИО',
            dataIndex: 'fio',
            key: 'fio',
        },
        {
            title: 'Должность',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Зарплата',
            dataIndex: 'salary',
            key: 'salary',
        },
        {
            title: 'Образование',
            dataIndex: 'education',
            key: 'education',
        },
        {
            title: 'Удалить',
            dataIndex: 'id',
            key: 'id',
            render: (id_user) => (
                <Button onClick={() => { console.log(id_user); deleteUsers(id_user); }}>
                    Удалить
                </Button>
            )
        }
    ];

    const [data, setData] = useState([])

    const fileHandler = (event) => {
        let fileObj = event.target.files[0];

        //just pass the fileObj as parameter
        ExcelRenderer(fileObj, (err, resp) => {
            if (err) {
                console.log(err);
            }
            else {

                console.log({
                    cols: resp.cols,
                    rows: resp.rows
                })
                setData(resp.rows)
            }
        });

    }

    const sent_toBack = async () => {

        const sent_toBack_users = await fetch('http://localhost:5000/save_data',
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: "POST",
                body: JSON.stringify(data)
            })

        const answer_from_back = await sent_toBack_users.json();
        console.log(answer_from_back);

    }

    return (
        <>
            <h1>Загрузка Exel для сохранения в БД</h1>
            <div>
                <input type="file" onChange={(e) => fileHandler(e)} style={{ "padding": "10px" }} />
            </div>
            <div>
                <button onClick={() => sent_toBack()}>Отправить</button>
            </div>
            <Table dataSource={arrUsers} columns={columns} />
        </>
    )
}

export default ExelAdd