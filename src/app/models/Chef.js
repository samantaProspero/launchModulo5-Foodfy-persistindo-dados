const {date} = require('../../lib/utils')
const db = require('../config/db')

module.exports ={

    all(cb){
        db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            GROUP BY chefs.id
            ORDER BY total_recipes DESC`, function(err, results){
        if(err) throw `Database Error! ${err}`
        
            cb(results.rows) 
        })
    },
    create(data, cb){
        const query =`
            INSERT INTO chefs(
                name,
                avatar_url,
                created_at 
            ) VALUES ($1, $2, $3)
            RETURNING id        
        `
        const values =[
            data.name,
            data.avatar_url,
            date(Date.now()).iso
        ]
        db.query(query, values, function(err, results){
            if(err) throw `Database Error! ${err}`  
            cb(results.rows[0]) 
        })
    },
    find(id, cb){ 
      db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        GROUP BY chefs.id`, [id], function(err, results){
      if (err) throw `Database Error! ${err}`
      
      cb(results.rows[0])
    }) 
    },
    chefsSelectRecipes(id, callback) { // A SOLUCAO É INSERIR UM "ID" COMO PARAMETRO
    db.query(`
      SELECT chefs.id, chefs.name AS chefname, recipes.*
      FROM chefs
      INNER JOIN recipes ON (recipes.chef_id = chefs.id)
      WHERE chefs.id = $1
      `, [id], function(err, results){
      if (err) throw `Database Error! ${err}`

      callback(results.rows)
    })
  },
    findBy(filter, callback){
        db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        WHERE chefs.name ILIKE '%${filter}%'
        GROUP BY chefs.id 
        ORDER BY total_recipes DESC`, function (err, results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })  
    },
    findAll(data,cb){
        db.query(`
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id)`, function(err, results){
                if(err) throw `Database Error! ${err}`
                cb(results.rows)
            })
    },
    newFind(id){
        db.query(`SELECT chefs.*, COUNT (recipes) AS total
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = ${id}
        GROUP BY chefs.id`)
    }, 
    recipesForChef(data,cb){
        db.query(`
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            WHERE chefs.id={data}
            ORDER BY created_at DESC`,
            function(err, results){
                if(err) throw `Database Error! ${err}`
                cb(results.rows)
        })
    },
    update(data, cb){ 
        const query = `
        UPDATE chefs SET
            name =($1),
            avatar_url =($2)
        WHERE id =$3
        `
        const values =[
            data.name,
            data.avatar_url,
            data.id
        ] 
        db.query(query, values, function(err, results){
            if(err) throw `Database Error! ${err}`

            cb()
        })
    },
    delete(id, cb){
        db.query(`DELETE FROM chefs WHERE id=$1`, [id], function(err, results){
            if(err) throw `Database Error! ${err}`
            return cb()   
        }) 
    },
    paginate(params){
        const {filter, limit, offset, callback } = params

        let query="",
            filterQuery = "",
            totalQuery = `(SELECT count(*) FROM chefs) AS total`

        if(filter){

            filterQuery =`
            WHERE chefs.name ILIKE '%${filter}%'
            `
            totalQuery =`( SELECT count(*) FROM chefs 
            ${filterQuery}
            ) AS total`
        }

        query = `
            SELECT chefs.*, ${totalQuery}, count(recipes) AS total_recipes 
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            ${filterQuery}
            GROUP BY chefs.id LIMIT $1 OFFSET $2`

        db.query(query, [limit, offset], function(err, results){
            if (err) throw 'Database Error!'
            
            callback(results.rows)
        })
    }
} 