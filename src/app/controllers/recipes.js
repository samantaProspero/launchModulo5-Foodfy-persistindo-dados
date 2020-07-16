const {date} = require('../../lib/utils')
const Recipe = require('../models/Recipe')


module.exports ={
    home(req, res){
        Recipe.all(function(recipes){
            return res.render("home/home", {items: recipes})
        })
    }, 
    index(req, res){
        let {filter, page, limit} = req.query

        page = page || 1
        limit = limit || 6
        let offset = limit*(page-1)
        const params ={
            filter,
            page,
            limit,
            offset,
            callback(recipes){
                if(recipes[0] == undefined) {
                    recipes[0]=0
                }
                const pagination = {
                    total: Math.ceil(recipes[0].total/limit),
                    page
                }         
                return res.render("admin/recipes/index", {recipes, pagination, filter})
            }
        }
        Recipe.paginate(params)
    },
    create(req, res){
        Recipe.find(req.params.id, function(recipe){
            
            Recipe.chefsSelector(function(options){
                return res.render("admin/recipes/create", {recipe, chefOptions: options})
            })      
        })   
    },
    post(req, res){
        const keys = Object.keys(req.body) 
        for(key of keys){
            if(req.body[key] == "") {
                return res.send('Please, fill all fields!')
            }
        }
        Recipe.create(req.body, function(recipe){
            return res.redirect(`/admin/recipes/${recipe.id}`)
        })
    },
    show(req,res){
        Recipe.find(req.params.id, function(recipe){
            if(!recipe) return res.send("Recipe not found!")
            recipe.created_at = date(recipe.created_at).format
            return res.render("admin/recipes/show", {recipe})
        })
    },
    edit(req, res){
        Recipe.find(req.params.id, function(recipe){
            if(!recipe) return res.send("Recipe not found!")
            
            Recipe.chefsSelector(function(options){
                return res.render("admin/recipes/edit", {recipe, chefOptions: options})
            })      
        })    
    },
    put(req,res){
        const keys = Object.keys(req.body)
        for(key of keys){
            if(req.body[key] == "") {
                return res.send('Please, fill all fields!')
            }
        }
        Recipe.update(req.body, function(recipe){
            return res.redirect(`/admin/recipes/${req.body.id}`)
        })
    },
    delete(req, res){
        Recipe.delete(req.body.id, function(){
            return res.redirect(`/admin/recipes`)
        })   
    },
}