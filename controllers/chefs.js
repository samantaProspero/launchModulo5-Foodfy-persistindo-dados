const fs = require('fs')
const data = require("../data.json")


exports.home= function(req, res){
    return res.render("home", {items: data.chefs})
}
exports.about =  function(req, res){
    return res.render("about")
}
exports.chefsFiltered = function(req, res){
   
    let chefsFiltered = []
    for(let i=0; i<data.chefs.length; i++){
        const obj = data.chefs[i]
        obj.index = i
        chefsFiltered.push(obj)
    }

    return res.render("chefs", {items: chefsFiltered})
}
exports.chef = function(req, res){
    const {index:chefIndex} = req.params

    const chef = data.chefs[chefIndex]
    if(!chef){
        return res.send("Chef not found!")
    }
    return res.render("chef", {item: chef})
}
exports.index = function(req, res){
    return res.render("admin/chefs/index", {data})
 }

exports.create = function(req, res){
    return res.render("admin/chefs/create")
}
exports.post = function(req, res){
    const keys = Object.keys(req.body)
    for(key of keys){
        if(req.body[key] == "") {
            return res.send('Please, fill all fields!')
        }
    }
    let {name, avatar} = req.body
    const id = Number(data.chefs.length +1)
    data.chefs.push({
        id, 
        name,
        avatar
    })
    
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!")
        return res.redirect(`/admin/chefs/${id}`)
    })
}
exports.show = function(req,res){
    const {id} = req.params
    const foundChef = data.chefs.find(function(chef){
        return chef.id==id
    })
   if(!foundChef) return res.send("Chef not found!")

   const chef ={
       ...foundChef
   }
   return res.render("admin/chefs/show", {item:chef})
}
exports.edit = function(req, res){
    const {id} = req.params
    const foundChef = data.chefs.find(function(chef){
        return chef.id==id
    })
    if(!foundChef) return res.send("Chef not found!")

    const chef ={
        ...foundChef
    }
    return res.render("admin/chefs/edit", {item:chef})
}
exports.put = function(req,res){
    const {id} = req.body
    let index = 0
    const foundChef = data.chefs.find(function(chef, foundIndex){
        if(id== chef.id){
            index = foundIndex
            return true
        }
    })
    if(!foundChef) return res.send("Chef not found!")

    const chef = {
        ...foundChef,
        ...req.body
    }
    data.chefs[index] = chef
    
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write error!- problema no put2")
        return res.redirect(`/admin/chefs/${id}`)
    })
}
exports.delete = function(req, res){
    const { id } = req.body
    const filteredChefs = data.chefs.filter(function(chef){
        return chef.id !== id
    })

    data.chefs = filteredChefs
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!-problema no delete")
        
        return res.redirect('/admin/chefs')
    })
}