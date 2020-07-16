const {date} = require('../../lib/utils')
const db = require('../config/db')

module.exports ={
    all(cb){
        db.query(`
            SELECT recipes.*, chefs.name AS chefName
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            `, function(err, results) {
            if (err) throw `Database Error! ${err}`
        
            cb(results.rows)
        })
    },
    create(data, cb){
        const query =`
            INSERT INTO recipes(
                chef_id,
                image,
                title,
                ingredients,
                preparation,
                information,
                created_at 
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `
        const values =[
            data.chef,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]
        db.query(query, values, function(err, results){
            if(err) throw `Database Error! ${err}`
            cb(results.rows[0])
        })
    },
    find(id, cb){
        db.query(`
            SELECT recipes.*, chefs.name AS chef_name 
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)  
            WHERE recipes.id = $1`, [id], function(err, results){
            if(err) throw `Database Error! ${err}`
            cb(results.rows[0])
        }) 
    },
    findBy(filter, cb){
        db.query(`
            SELECT recipes.*, chefs.name AS chefname
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.title ILIKE '%${filter}%'
            `, function(err, results) {
            if (err) throw `Database Error! ${err}`
        
            cb(results.rows)
        })
    },
    update(data, cb){
        const query = `
        UPDATE recipes SET
            chef_id =($1),
            image =($2),
            title =($3),
            ingredients =($4),
            preparation =($5),
            information=($6)
        WHERE id =$7
        `
        const values =[
            data.chef,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ] 
        db.query(query, values, function(err, results){
            if(err) throw `Database Error! ${err}`

            cb()
        })
    },
    delete(id, cb){
        db.query(`DELETE FROM recipes WHERE id=$1`, [id], function(err, results){
            if(err) throw `Database Error! ${err}`
            return cb()
        })
    },
    chefsSelector(cb){
        db.query(`SELECT name, id FROM chefs`, function(err, results){
            if(err) throw `Database Error! ${err}`
            cb(results.rows)
        })
    },
    paginate(params){
        const {filter, limit, offset, callback } = params

        let query="",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*) FROM recipes
            ) AS total`

        if(filter){

            filterQuery =`
            WHERE recipes.title ILIKE '%${filter}%'
            `
            totalQuery =`( 
                SELECT count(*) FROM recipes 
                ${filterQuery}
            ) AS total`
        }

        query = `
            SELECT recipes.*, ${totalQuery}
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ${filterQuery}
            GROUP BY recipes.id, chefs.name LIMIT $1 OFFSET $2
            `

        db.query(query, [limit, offset], function(err, results){
            if (err) throw 'Database Error!'
            
            callback(results.rows)
        })
    }
}