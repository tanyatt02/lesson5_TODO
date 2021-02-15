let task = {
    list: async (connection, name)=>{
        let sql=   `SELECT id,done,title FROM `+name
        let [todo, fields] = await connection.query(sql);
        return todo
    },
    insert: async (connection, todoItem,name)=>{
        let sql=   `INSERT DELAYED INTO    `+name+ `(done, title) VALUES(?, ?)` 
        let [todo, fields] = await connection.execute(sql, todoItem);
        return todo
    },
    delete: async (connection, id, name)=>{
        let  sql = `DELETE FROM `+name+ ` WHERE id=?`; 
        let [todo, fields] = await connection.execute(sql, id);
        return todo
    },
    update: async (connection, todoItem,name)=>{
        let sql=   `UPDATE  `+name+ ` SET done=?, title=? WHERE id=?` 
        let [todo, fields] = await connection.execute(sql, todoItem);
        return todo
    },
}

module.exports = task