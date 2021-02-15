const mysql2=require('mysql2')

let task = {
    list: async (connection, name)=>{
        let sql=   `SELECT id,done,title FROM ??`;
        let s=[name]
        sql=mysql2.format(sql, s)
        console.log(sql)
        let [todo, fields] = await connection.query(sql);
        return todo
    },
    insert: async (connection, todoItem)=>{
        let sql=   `INSERT DELAYED INTO    ??(done, title) VALUES(?, ?)` 
        sql=mysql2.format(sql, todoItem)
        let [todo, fields] = await connection.execute(sql, todoItem);
        return todo
    },
    delete: async (connection, id)=>{
        let  sql = `DELETE FROM ?? WHERE id=?`; 
        sql=mysql2.format(sql, id)
        let [todo, fields] = await connection.execute(sql, id);
        return todo
    },
    update: async (connection, todoItem)=>{
        let sql=   `UPDATE  ?? SET done=?, title=? WHERE id=?` 
        sql=mysql2.format(sql, todoItem)
        let [todo, fields] = await connection.execute(sql, todoItem);
        return todo
    },
}

module.exports = task