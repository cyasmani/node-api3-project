// code away!
const express = require('express')
const postsData =  require('./posts/postDb')
const server = require('./server')
const userData = require('./users/userDb')


function logger (req,res,next) {
    console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get('Origin')}`)
    next()

}

server.use(logger)

server.put('/api/user/:id', validateUser,validateUserId, (req, res) => {
    const newChanges = req.body
    userData.update(req.params.id, newChanges)
    .then(updated => {
        res.status(200).json(updated)
    })
    .catch(error => {
        console.log(error)
    })
})

server.delete('/api/user/:id', validateUserId, (req, res) => {
    userData.getUserPosts(req.params.id)
    .then(user => {
        res.status(204).json(user)
    })
    .catch(error => {
        console.log(error)
    })
})
server.get('/api/users/:id', validateUserId, (req, res) => {
    userData.getById(req.params.id)
    .then(user => {
        res.status(200).json(user)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            message: 'Error getting id'
        })
    })
    
})

server.post('/api/users/:id', validateUser, (req, res) => {
   userData.insert(req.body)
    .then(data => {
        if(data) {
            res.status(201).send("Created")
        } else {
            res.status(400).json({message: "Missing required named field"})
        }
    })
    .catch(error => {
        console.log(error)
        res.status(400).json({message: "missing user data"})
    }) 

})

server.get('/api/posts' , (req,res) => {
    postsData.get()
    .then(post => {
        res.status(201).json(posts)
    })
    .catch(error => {
        console.log(error)
    })
})



server.post('/api/posts/:id', validatePostId, (req, res) => {
    postsData.insert(req.body)
     .then(data => {
         if(data) {
             res.status(201).send("Created")
         } else {
             res.status(400).json({message: "Missing required text field"})
         }
     })
     .catch(error => {
         console.log(error)
         res.status(400).json({message: "missing post data"})
     }) 
 
 })

 server.delete('/api/posts/:id', validatePostId, (req, res) => {
     postsData.remove(req.params.id)
     .then(post => {
         res.status(204).json(post)
     })
     .catch(error => {
         console.log(error)
     })
 })

 server.put('/api/posts/:id', (req,res) => {
     const newChanges = req.body
     postsData.update(req.params.id, newChanges)
     .then(change => {
         res.status(200).json(change)
     })
     .catch(error => {
         console.log(error)
     })
 })

function validateUserId (req, res, next) {
    const id = req.params.id
    userData.getById(id)
    .then(info => {
        if(info) {
            req.user = info
            next();
        } else {
            res.status(404).json({message : "unable to find user id"})
        }
    })
    .catch(error => {
        console.log(error)
        res.status(400).json({message: "invalid user id"})
    })

}

function validateUser (req, res, next) {
    const body = req.body.name
    body.insert()
    .then(info => {
        if(info) {

            res.status(201).json({created: body})
        } else {
            res.status(400).json({message: "missing required name field "})
        }

        next()

    })
    .catch(error => {
        console.log(error)
        res.status(400).json({message: "missing user data"})
    })

}

function validatePost(req,res,next) {
    const body = req.body.text
    body.insert()
    .then(info => {
        if(info) {

            res.status(201).json({created: body})
        } else {
            res.status(400).json({message: "missing required text field "})
        }

        next()

    })
    .catch(error => {
        console.log(error)
        res.status(400).json({message: "missing post data"})
    })


}

function validatePostId(req, res, next) {
    
    postsData.getById(req.params.id)
    .then(resource => {
      if(resource){
        req.post = resource;
        next();
      } else {
        res.status(400).json({message:"invalid post id"})
      }
    })
    .catch(error => {
      console.log(error)
    })
  }

require('dotenv').config()
const port = process.env.PORT;

server.listen(port , () => {
    console.log(`Server is running on http://localhost:${port}`)
})
