const fs = require('fs')
const data = require("../data.json")


exports.home= function(req, res){
    return res.render("home/home", {items: data.recipes})
}
exports.about =  function(req, res){
    return res.render("home/about")
}
exports.recipesFiltered = function(req, res){
   
    let recipesFiltered = []
    for(let i=0; i<data.recipes.length; i++){
        const obj = data.recipes[i]
        obj.index = i
        recipesFiltered.push(obj)
    }

    return res.render("home/recipes", {items: recipesFiltered})
}
exports.recipe = function(req, res){
    const {index:recipeIndex} = req.params

    const recipe = data.recipes[recipeIndex]
    if(!recipe){
        return res.send("Recipe not found!")
    }
    return res.render("home/recipe", {item: recipe})
}
exports.index = function(req, res){
    return res.render("admin/recipes/index", {data})
 }

exports.create = function(req, res){
    return res.render("admin/recipes/create")
}
exports.post = function(req, res){
    const keys = Object.keys(req.body)
    for(key of keys){
        if(req.body[key] == "") {
            return res.send('Please, fill all fields!')
        }
    }
    let {image, title, author, ingredients, preparation, information} = req.body
    const id = Number(data.recipes.length +1)
    data.recipes.push({
        id, 
        image,
        title,
        author, 
        ingredients,
        preparation,
        information, 
    })
    
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!")
        return res.redirect(`/admin/recipes/${id}`)
    })
}
exports.show = function(req,res){
    const {id} = req.params
    const foundRecipe = data.recipes.find(function(recipe){
        return recipe.id==id
    })
   if(!foundRecipe) return res.send("Recipe not found!")

   const recipe ={
       ...foundRecipe
   }
   return res.render("admin/recipes/show", {item:recipe})
}
exports.edit = function(req, res){
    const {id} = req.params
    const foundRecipe = data.recipes.find(function(recipe){
        return recipe.id==id
    })
    if(!foundRecipe) return res.send("Recipe not found!")

    const recipe ={
        ...foundRecipe
    }
    return res.render("admin/recipes/edit", {item:recipe})
}
exports.put = function(req,res){
    const {id} = req.body
    let index = 0
    const foundRecipe = data.recipes.find(function(recipe, foundIndex){
        if(id== recipe.id){
            index = foundIndex
            return true
        }
    })
    if(!foundRecipe) return res.send("Recipe not found!")

    const recipe = {
        ...foundRecipe,
        ...req.body
    }
    data.recipes[index] = recipe
    
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write error!- problema no put2")
        return res.redirect(`/admin/recipes/${id}`)
    })
}
exports.delete = function(req, res){
    const { id } = req.body
    const filteredRecipes = data.recipes.filter(function(recipe){
        return recipe.id !== id
    })

    data.recipes = filteredRecipes
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!-problema no delete")
        
        return res.redirect('/admin/recipes')
    })
}