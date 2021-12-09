const express = require('express');
const app = express();
const cors = require("cors");
var router = express.Router();
const serialport = require('serialport');
const nodemailer = require("nodemailer");
const details = require("./details.json");

const { mongoose } = require('./db/mongoose');

const bodyParser = require('body-parser');

// Load in the mongoose models
const { List, Task, User , Tanknode , Node , Sensornode , Gatewaynode } = require('./db/models');

const jwt = require('jsonwebtoken');


/* MIDDLEWARE  */

// Load middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.post("/sendmail", (req, res) => {
    console.log("request came");
    let user = req.body;
    sendMail(user, info => {
      console.log(`The mail has beed send 😃 and the id is ${info.messageId}`);
      res.send(info);
    });
  });
  
  async function sendMail(user, callback) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'alisha43@ethereal.email',
        pass: 'Cws7y828gsrEFDJU1w'
      }
    });
  
    let mailOptions = {
      from: '<jebrimouna1996@gmail.com>', // sender address
      to: 'user.email, mouna.jabri@esprit.tn', // list of receivers
      subject: "Wellcome to Smart agriculture 👻", // Subject line
      html: `<h1>Hi ${user.email}</h1><br>
      <h1> you have an important new task </h1>`
    };
  
    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);
  
    callback(info);
  }

// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});


// check whether the request has a valid JWT access token
let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');

    // verify the JWT
    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err) {
            // there was an error
            // jwt is invalid - * DO NOT AUTHENTICATE *
            res.status(401).send(err);
        } else {
            // jwt is valid
            req.user_id = decoded._id;
            next();
        }
    });
}

// Verify Refresh Token Middleware (which will be verifying the session)
let verifySession = (req, res, next) => {
    // grab the refresh token from the request header
    let refreshToken = req.header('x-refresh-token');

    // grab the _id from the request header
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            // user couldn't be found
            return Promise.reject({
                'error': 'User not found. Make sure that the refresh token and user id are correct'
            });
        }


        // if the code reaches here - the user was found
        // therefore the refresh token exists in the database - but we still have to check if it has expired or not

        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                // check if the session has expired
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    // refresh token has not expired
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            // the session is VALID - call next() to continue with processing this web request
            next();
        } else {
            // the session is not valid
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            })
        }

    }).catch((e) => {
        res.status(401).send(e);
    })
}

/* END MIDDLEWARE  */




/* ROUTE HANDLERS */

/* LIST ROUTES */

/**
 * GET /lists
 * Purpose: Get all lists
 */
app.get('/list', authenticate, (req, res) => {
    // We want to return an array of all the lists that belong to the authenticated user 
    List.find({
        _userId: req.user_id
    }).then((lists) => {
        res.send(lists);
    }).catch((e) => {
        res.send(e);
    });
})
/* ROUTE HANDLERS */

/* LIST ROUTES */

/**
 * GET /node
 * Purpose: Get all nodes
 */
app.get('/node',authenticate,  (req, res) => {
    // We want to return an array of all the lists that belong to the authenticated user 
    Node.find({
        _userId: req.user_id
    }).then((node) => {
        res.send(node);
    }).catch((e) => {
        res.send(e);
    });
})
 

app.post('/lists', authenticate, (req, res) => {
    // We want to create a new list and return the new list document back to the user (which includes the id)
    // The list information (fields) will be passed in via the JSON request body
    let title = req.body.title;
    let newList = new List({
        title,
        _userId: req.user_id
    });
    newList.save().then((listDoc) => {
        // the full list document is returned (incl. id)
        res.send(listDoc);
    })
});
/**
 * POST /nodes
 * Purpose: Create a node
 */
app.post('/nodes', authenticate, (req ,res)=> {
    // We want to create a new list and return the new list document back to the user (which includes the id)
    // The list information (fields) will be passed in via the JSON request body
   
    let address = req.body.address;
    let type = req.body.type;
    let activeornot = req.body.activeornot;
    let batterylevel = req.body.batterylevel;
    let electrovan = req.body.electrovan;
    let mode = req.body.mode;

    let newNode = new Node({
    address,
    type,
    activeornot,
    batterylevel,
    electrovan,
    mode,
    _userId: req.user_id
    });
    newNode.save().then((nodeDoc) => {
        // the full list document is returned (incl. id)
        res.send(nodeDoc);
    })
});

app.patch('/nodes/:id', authenticate, (req, res) => {
    // We want to update the specified list (list document with id in the URL) with the new values specified in the JSON body of the request
    Node.findOneAndUpdate({ _id: req.params.id, _userId: req.user_id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'updated successfully'});
    });
});

/**
 * PATCH /lists/:id
 * Purpose: Update a specified list
 */
app.patch('/lists/:id', authenticate, (req, res) => {
    // We want to update the specified list (list document with id in the URL) with the new values specified in the JSON body of the request
    List.findOneAndUpdate({ _id: req.params.id, _userId: req.user_id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'updated successfully'});
    });
});

/**
 * DELETE /lists/:id
 * Purpose: Delete a list
 */
app.delete('/lists/:id', authenticate, (req, res) => {
    // We want to delete the specified list (document with id in the URL)
    List.findOneAndRemove({
        _id: req.params.id,
        _userId: req.user_id
    }).then((removedListDoc) => {
        res.send(removedListDoc);

        // delete all the tasks that are in the deleted list
        deleteTasksFromList(removedListDoc._id);
    })
});

app.delete('/nodes/:id', authenticate, (req, res) => {
    // We want to delete the specified list (document with id in the URL)
    Node.findOneAndRemove({
        _id: req.params.id,
        _userId: req.user_id
    }).then((removedListDoc) => {
        res.send(removedListDoc);

        // delete all the tasks that are in the deleted list
    })
});


/**
 * GET /lists/:listId/tasks
 * Purpose: Get all tasks in a specific list
 */
app.get('/list/:listId/task', authenticate, (req, res) => {
    // We want to return all tasks that belong to a specific list (specified by listId)
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);
    })
});

app.get('/node/:nodeId/getwaynodes', authenticate, (req, res) => {
    // We want to return all tasks that belong to a specific list (specified by listId)
    Gatewaynode.find({
        _nodeId: req.params.nodeId
    }).then((gatewaynodes) => {
        res.send(gatewaynodes);
        console.log(gatewaynodes) ;
    })
});

app.get('/node/:nodeId/getwaynode', authenticate, (req, res) => {
    // We want to return all tasks that belong to a specific list (specified by listId)
    Gatewaynode.find({
        address: req.params.nodeId
    }).then((gatewaynodes) => {
        res.send(gatewaynodes);
        console.log(gatewaynodes) ;
    })
});

app.get('/node/:nodeId/sensornodes', authenticate, (req, res) => {
    // We want to return all tasks that belong to a specific list (specified by listId)
    Sensornode.find({
        _nodeId: req.params.nodeId
    }).then((sensornode) => {
        res.send(sensornode);
        console.log(sensornode) ;
    })
});

app.get('/node/:nodeId/tanknodes', authenticate, (req, res) => {
    // We want to return all tasks that belong to a specific list (specified by listId)
    Tanknode.find({
        _nodeId: req.params.nodeId
    }).then((tanknode) => {
        res.send(tanknode);
        console.log(tanknode) ;
    })
});
/**
 * POST /lists/:listId/tasks
 * Purpose: Create a new task in a specific list
 */
app.post('/lists/:listId/tasks', authenticate, (req, res) => {
    // We want to create a new task in a list specified by listId

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            // list object with the specified conditions was found
            // therefore the currently authenticated user can create new tasks
            return true;
        }

        // else - the list object is undefined
        return false;
    }).then((canCreateTask) => {
        if (canCreateTask) {
            let newTask = new Task({
                title: req.body.title,
                _listId: req.params.listId
            });
            newTask.save().then((newTaskDoc) => {
                res.send(newTaskDoc);
            })
        } else {
            res.sendStatus(404);
        }
    })
})
app.post('/nodes/:nodeId/gatewaynode', authenticate, (req, res) => {
    // We want to create a new task in a list specified by listId

    Gatewaynode.findOne({
        _id: req.params.gatewayId,
        _userId: req.user_id
    }).then((node) => {
        if (node) {
            // list object with the specified conditions was found
            // therefore the currently authenticated user can create new tasks
            return true;
        }

        // else - the list object is undefined
        return false;
    }).then((canCreateGatewaynode) => {
        if (canCreateGatewaynode) {
            let newGatewaynode = new Gatewaynode({
                _nodeId: req.params.nodeId,
                ordders: req.body.ordders,
                address: req.body.address,
                time: req.body.time,
            });
            newGatewaynode.save().then((newGatewayDoc) => {
                res.send(newGatewayDoc);
            })
        } else {
            res.sendStatus(404);
        }
    })
})

app.post('/nodes/:nodeId/sensornode', (req, res) => {
    // We want to create a new task in a list specified by listId

    Sensornode.findOne({
        _id: req.params.sensornodeId
    }).then((sensornode) => {
        if (sensornode) {
            // list object with the specified conditions was found
            // therefore the currently authenticated user can create new tasks
            return true;
        }

        // else - the list object is undefined
        return false;
    }).then((canCreatesensornode) => {
        if (canCreatesensornode) {
            let newsensornode = new Sensornode({
                
                Ram: req.body.Ram,
                smoke :req.body.smoke  ,
                temperature : req.body.temperature,
                humidity : req.body.humidity,
                moisture : req.body.moisture,
                time : req.body.time , 
                electrovan : req.body.electrovan,
                _nodeId: req.params._nodeId
                
            });
            newsensornode.save().then((newSensornodeDoc) => {
                res.send(newSensornodeDoc);
            })
        } else {
            res.sendStatus(406);
        }
    })
})
/**
 * PATCH /lists/:listId/tasks/:taskId
 * Purpose: Update an existing task
 */
app.patch('/lists/:listId/tasks/:taskId', authenticate, (req, res) => {
    // We want to update an existing task (specified by taskId)

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            // list object with the specified conditions was found
            // therefore the currently authenticated user can make updates to tasks within this list
            return true;
        }

        // else - the list object is undefined
        return false;
    }).then((canUpdateTasks) => {
        if (canUpdateTasks) {
            // the currently authenticated user can update tasks
            Task.findOneAndUpdate({
                _id: req.params.taskId,
                _listId: req.params.listId
            }, {
                    $set: req.body
                }
            ).then(() => {
                res.send({ message: 'Updated successfully.' })
            })
        } else {
            res.sendStatus(404);
        }
    })
});

/**
 * DELETE /lists/:listId/tasks/:taskId
 * Purpose: Delete a task
 */
app.delete('/lists/:listId/tasks/:taskId', authenticate, (req, res) => {

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            // list object with the specified conditions was found
            // therefore the currently authenticated user can make updates to tasks within this list
            return true;
        }

        // else - the list object is undefined
        return false;
    }).then((canDeleteTasks) => {
        
        if (canDeleteTasks) {
            Task.findOneAndRemove({
                _id: req.params.taskId,
                _listId: req.params.listId
            }).then((removedTaskDoc) => {
                res.send(removedTaskDoc);
            })
        } else {
            res.sendStatus(404);
        }
    });
});

app.delete('/nodes/:nodeId/gateway/:gatewayId', authenticate, (req, res) => {

    Node.findOne({
        _id: req.params.gatewayId,
        _userId: req.user_id
    }).then((node) => {
        if (node) {
            // list object with the specified conditions was found
            // therefore the currently authenticated user can make updates to tasks within this list
            return true;
        }

        // else - the list object is undefined
        return false;
    }).then((canDeletegateways) => {
        
        if (canDeletegateways) {
            Task.findOneAndRemove({
                _id: req.params.gatewayId,
                _nodeId: req.params.nodeId
            }).then((removedTaskDoc) => {
                res.send(removedTaskDoc);
            })
        } else {
            res.sendStatus(404);
        }
    });
});

/* USER ROUTES */

/**
 * POST /users
 * Purpose: Sign up
 */
app.post('/users', (req, res) => {
    // User sign up

    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        // Session created successfully - refreshToken returned.
        // now we geneate an access auth token for the user

        return newUser.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now we return an object containing the auth tokens
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
})


/**
 * POST /users/login
 * Purpose: Login
 */
app.post('/users/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // Session created successfully - refreshToken returned.
            // now we geneate an access auth token for the user

            return user.generateAccessAuthToken().then((accessToken) => {
                // access auth token generated successfully, now we return an object containing the auth tokens
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
})


/**
 * GET /users/me/access-token
 * Purpose: generates and returns an access token
 */
app.get('/users/me/access-token', verifySession, (req, res) => {
    // we know that the user/caller is authenticated and we have the user_id and user object available to us
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
})



/* HELPER METHODS */
let deleteTasksFromList = (_listId) => {
    Task.deleteMany({
        _listId
    }).then(() => {
        console.log("Tasks from " + _listId + " were deleted!");
    })
}




app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})
//define variavel
let SerialPort = serialport ;

const Readline = serialport.parsers.Readline;
var parser= new Readline('\n') ;

//configura porta serial
var port = new serialport("COM5", {
  baudRate: 1000000,
  parser: parser

});


//Tratar eventos
port.on('open', onOpen);
port.on('data',onData);

//função chamada quando a porta serial recebe dados
function onData(data) {
  console.log(data.toString().trim());
  test = data.toString().split(/\n+/).join('');
  var tab = test.split(",");
  console.log(tab[0]) ;
  console.log(tab[1]) ;
  console.log(tab[2]) ;
  console.log(tab[3]) ;
  console.log(tab[4]) ;
  console.log(tab[5]) ;
  console.log(tab[6]) ;
  if (tab[0]===undefined||tab[1]===undefined||tab[2]===undefined||tab[3]===undefined||tab[4]===undefined||tab[5]===undefined||tab[6]===undefined)
  {
      console.log(tab[0]===undefined||tab[1]===undefined||tab[2]===undefined||tab[3]===undefined||tab[4]===undefined||tab[5]===undefined||tab[6]===undefined)
  }
  else
  {
  if (tab[3]==0)
  {    
    let _nodeId = tab[0];
    let electrovan = tab[1];
    let waterlevel = tab[2];
    let time = Date.now();

    let newtankdata = new Tanknode({
    _nodeId,
    electrovan,
    waterlevel,
    time,
    });
    newtankdata.save().then((Doc) => {
    })  
    /*
      //io.emit('data', { data: tab });
      console.log("water tank") ;
      const logg = {
          _nodeId: tab[0],
          electrovan: tab[1],
          waterlevel: tab[2],
          time: Date.now()
      };
      const monk = require('monk');
      const db = monk('localhost:27017/agriculture',
          function(err) {
              if(err)
                  console.log(err.toString());
          });
//const doc = {user: 'aa', password: 'password'};
//const doc = {_id: 'aa', password: 'password'};
      //const doc = {_id: monk.id('aa'), password: 'password'};
      var sensordata = db.get('sensornode');
      sensordata.insert([logg]);
        */}
  else
  {  

    let _nodeId = tab[0];
    let Ram = tab[1];
    let smoke = tab[2];
    let temperature = tab[3];
    let humidity = tab[4];
    let moisture = tab[5];
    let electrovan = tab[6];
    let time = Date.now();

    let newsensornode = new Sensornode({
    _nodeId,
    Ram,
    smoke,
    temperature,
    humidity,
    moisture,
    time,
    electrovan
    });
    newsensornode.save().then((Doc) => {
    })  
    /*  console.log("else") ;
  const logg = {
    _nodeId: tab[0],
    Ram: tab[1],
    smoke: tab[2],
    temperature: tab[3],
    humidity: tab[4],
    moisture: tab[5],
    electrovan: tab[6],
    time: Date.now()
  };
  const monk = require('monk');
  const db = monk('localhost:27017/agriculture',
      function(err) {
        if(err)
          console.log(err.toString());
      });
//const doc = {user: 'aa', password: 'password'};
//const doc = {_id: 'aa', password: 'password'};
  //const doc = {_id: monk.id('aa'), password: 'password'};
  var sensordata = db.get('sensornode');
  sensordata.insert([logg]);*/

}}
    setTimeout(() => {
        console.log('flush...');
        port.flush(function(err) {
            console.log(err);
            console.log('resume...');
            port.resume();
        });
    }, 1000);}

//função chamada quando a porta serial é aberta
function onOpen() {
  console.log("serial port open");
}
router.get('/logslist',function(req,res){
  var db = req.db;
  var collection = db.get('logs');
  collection.find({},{},function(e,docs){
    res.json(docs);
  });
});
app.get('/StartStopVan/:action/:destinaton', function (req, res) {

    var action = req.params.action || req.param('action');
    var dest = req.params.destination || req.param('destinaton');

    if(action == 'StartNode'){
        port.write("4");  
        let _nodeId = '41826825';
        let ordders = 4 ;
        let address = dest ;
        let time = Date.now();
    
        let newGatewaynode = new Gatewaynode({
        _nodeId,
        ordders,
        address,
        time
        });
        newGatewaynode.save().then((docs) => {
        })
        return res.send('Van is on!');

    }
    if(action == 'StopNode') {
        port.write("5");
        let _nodeId = '41826825';
        let ordders = 5 ;
        let address = dest;
        let time = Date.now();
    
        let newGatewaynode = new Gatewaynode({
        _nodeId,
        ordders,
        address,
        time
        });
        newGatewaynode.save().then((docs) => {
        })
        return res.send("Van is off!");
    }
    if(action == 'AutoTank') {
        port.write("1");
        let _nodeId = '41826825';
        let ordders = 1 ;
        let address = dest;
        let time = Date.now();
    
        let newGatewaynode = new Gatewaynode({
        _nodeId,
        ordders,
        address,
        time
        });
        newGatewaynode.save().then((docs) => {
        })
        return res.send("Tank auto");
    }
    if(action == 'ManTank') {
        port.write("0");
        let _nodeId = '41826825';
        let ordders = 0 ;
        let address = dest;
        let time = Date.now();
    
        let newGatewaynode = new Gatewaynode({
        _nodeId,
        ordders,
        address,
        time
        });
        newGatewaynode.save().then((docs) => {
        })
        return res.send("Tank Manual");
    }

    return res.send('Action: ' + action);

});

/*StartStopVan(cmd)
{
  port.write(cmd) ;
}*/

module.exports = router;