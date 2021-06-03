var express = require('express');
var pakelection = require('./blockchain_interactor.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Express' });
});

/* GET home page. */
router.get('/voterhome', function(req, res, next) {
  res.render('voterhome');
});

router.get('/displaycandidates', function (req, res) {
  res.render("DisplayCandidates");
});

router.get('/displayconstituencies', function (req, res) {
  res.render("DisplayConstituencies");
});

router.get('/displayparties', function (req, res) {
  res.render("DisplayParties");
});

router.get('/displayvoters', function (req, res) {
  res.render("DisplayVoters");
});

router.get('/displaypollingstations', function (req, res) {
  res.render("DisplayPollingStations");
});

router.get('/displayadmins', function (req, res) {
  res.render("DisplayAdmins");
});

router.get('/displayresults', function (req, res) {
  res.render("DisplayResults");
});

router.get('/displayvotecast', function (req, res) {
  res.render("votecast");
});

router.get('/start', function (req, res) {
  try {
    let lr = new pakelection();
    lr.init().then(function() {
      lr.StartElection().then(function() {
        res.send("true");
      });
     });
    } 
    catch(err)
    {
      console.log(err);
    }
});

router.get('/stop', function (req, res) {
  try {
    let lr = new pakelection();
    lr.init().then(function() {
      lr.StopElection().then(function() {
        res.send("true");
      });
     });
    } 
    catch(err)
    {
      console.log(err);
    }
});



router.post('/appendconstituency', function (req, res) {
  try {
  let lr = new pakelection();
  lr.init().then(function() {
    let constID = req.body.addconstid;
    let constCity = req.body.addconstcity;

    lr.addConstituency(constID, constCity).then(function() {
      res.send("true");
    });
   });
  } 
  catch(err)
  {
    console.log(err);
  }
});

router.post('/updateconstituency', function (req, res) {
  let lr = new pakelection();
  let constID = req.body.editconstid;
  let constCity = req.body.editconstcity;

  lr.init().then(function() {
    lr.editConstituency(constID, constCity).then(function() {
      res.send("true");
    });
  });
});

router.post('/deleteconstituency', function (req, res) {
  let lr = new pakelection();
  let constID = req.body.deleteconstid;

  lr.init().then(function() {
    lr.deleteConstituency(constID).then(function() {
      res.send("true");
    });
  });
});

router.get('/fetchconstituencies', function (req, res) {
  let lr = new pakelection();
  lr.init().then(function() {
      lr.displayConstituencies().then(function(data) {
        res.json(data);
      });
    });
  });

router.post('/appendcandidate', function (req, res) {
  try {
    let lr = new pakelection();
    lr.init().then(function() {
      let candCNIC = req.body.addcandcnic;
      let candName = req.body.addcandname;
      let candParty = req.body.addcandparty;
      let candconstID = req.body.addcandconstID;
  
      lr.addCandidate(candCNIC, candName, candParty, candconstID).then(function() {
        res.send("true");
      });
     });
    } 
    catch(err)
    {
      console.log(err);
    }
  });

router.post('/updatecandidate', function (req, res) {
  let lr = new pakelection();
  let candCNIC = req.body.editcandcnic;
  let candName = req.body.editcandname;
  let candParty = req.body.editcandparty;
  let candconstID = req.body.editcandconstID;

  lr.init().then(function() {
    lr.editCandidate(candCNIC, candName, candParty, candconstID).then(function() {
      res.send("true");
    });
  });
  });

  router.post('/deletecandidate', function (req, res) {
    let lr = new pakelection();
    let candCNIC = req.body.deletecandcnic;
  
    lr.init().then(function() {
      lr.deleteCandidate(candCNIC).then(function() {
        res.send("true");
      });
    });
  });

router.get('/fetchcandidates', function (req, res) {
  let lr = new pakelection();
  lr.init().then(function() {
        lr.displayCandidates().then(function(data) {
          res.json(data);
        });
    });
});

router.post('/appendparty', function (req, res) {
  try {
    let lr = new pakelection();
    lr.init().then(function() {
      let partyName = req.body.addpartyname;
      let registeredDate = req.body.addregdate;
  
      lr.addParty(partyName, registeredDate).then(function() {
        res.send("true");
      });
     });
    } 
    catch(err)
    {
      console.log(err);
    }
  });

router.post('/updateparty', function (req, res) {
  let lr = new pakelection();
  let partyName = req.body.editpartyname;
  let registeredDate = req.body.editregdate;

  lr.init().then(function() {
    lr.editParty(partyName, registeredDate).then(function() {
      res.send("true");
    });
  });
  });

  router.post('/deleteparty', function (req, res) {
    let lr = new pakelection();
    let partyName = req.body.deletepartyname;
  
    lr.init().then(function() {
      lr.deleteParty(partyName).then(function() {
        res.send("true");
      });
    });
  });

router.get('/fetchparties', function (req, res) {
  let lr = new pakelection();
  lr.init().then(function() {
        lr.displayParties().then(function(data) {
          res.json(data);
        });
    });
});

router.post('/appendpollingstation', function (req, res) {
  try {
    let lr = new pakelection();
    lr.init().then(function() {
      let pollID = req.body.addpollid;
      let cityName= req.body.addpollcity;
  
      lr.addPollingStation(pollID, cityName).then(function() {
        lr.IssuePollingStation(pollID, pollID).then(function() {
          res.send("true");
        })     
      });
     });
    } 
    catch(err)
    {
      console.log(err);
    }
  });

 router.post('/updatepollingstation', function (req, res) {
  let lr = new pakelection();
  let pollID = req.body.editpollid;
  let cityName = req.body.editpollcity;

  lr.init().then(function() {
    lr.editPollingStation(pollID, cityName).then(function() {
      res.send("true");
    });
   });
  });

  router.post('/deletepollingstation', function (req, res) {
    let lr = new pakelection();
    let pollID = req.body.deletepollid;
  
    lr.init().then(function() {
      lr.RevokePollingStation(pollID).then(function() {
        lr.deletePollingStation(pollID).then(function(){
          res.send("true");
        });
      });
    });
  });

router.get('/fetchpollingstations', function (req, res) {
  let lr = new pakelection();
  lr.init().then(function() {
        lr.displayPollingStations().then(function(data) {
          res.json(data);
        });
    });
});


router.post('/appendadmin', function (req, res) {
  try {
    let lr = new pakelection();
    lr.init().then(function() {
      let adminCNIC = req.body.addadmincnic;
      let name = req.body.addadminname;
      let city = req.body.addadmincity;
      let contactno = req.body.addadmincontactno;
  
      lr.addAdmin(adminCNIC, name, city, contactno).then(function() {
        lr.IssueAdmin(adminCNIC, adminCNIC).then(function() {
          res.send("true");
        })     
      });
     });
    } 
    catch(err)
    {
      console.log(err);
    }
  });

 router.post('/updateadmin', function (req, res) {
  let lr = new pakelection();
  let adminCNIC = req.body.editadmincnic;
  let name = req.body.editadminname;
  let city = req.body.editadmincity;
  let contactno = req.body.editadmincontactno;

  lr.init().then(function() {
    lr.editAdmin(adminCNIC, name, city, contactno).then(function() {
      res.send("true");
    });
   });
  });

  router.post('/deleteadmin', function (req, res) {
    let lr = new pakelection();
    let adminCNIC = req.body.deleteadmincnic;
  
    lr.init().then(function() {
      lr.RevokeAdmin(adminCNIC).then(function() {
        lr.deleteAdmin(adminCNIC).then(function(){
          res.send("true");
        });
      });
    });
  });

router.get('/fetchadmins', function (req, res) {
  let lr = new pakelection();
  lr.init().then(function() {
        lr.displayAdmins().then(function(data) {
          res.json(data);
        });
    });
});

router.post('/appendvoter', function (req, res) {
  try {
    let lr = new pakelection();
    lr.init().then(function() {
      let voterCNIC = req.body.addvotercnic;
      let name = req.body.addvotername;
      let password = req.body.addvoterpassword;
      let contactno = req.body.addvotercontactno;
      let constituencyID = req.body.addvoterconstid;
  
      lr.addVoter(voterCNIC, name, password, contactno, constituencyID).then(function() {
      res.send("true");    
      });
     });
    } 
    catch(err)
    {
      console.log(err);
    }
  });

 router.post('/updatevoter', function (req, res) {
  let lr = new pakelection();
  let voterCNIC = req.body.editvotercnic;
  let name = req.body.editvotername;
  let password = req.body.editvoterpassword;
  let contactno = req.body.editvotercontactno;
  let constituencyID = req.body.editvoterconstid;

  lr.init().then(function() {
    lr.editVoter(voterCNIC, name, password, contactno, constituencyID).then(function() {
      res.send("true");
    });
  });
});

  router.post('/deletevoter', function (req, res) {
    let lr = new pakelection();
    let voterCNIC = req.body.deletevotercnic;
  
    lr.init().then(function() {
        lr.deleteVoter(voterCNIC).then(function() {
          res.send("true");
      });
    });
 });

router.get('/fetchvoters', function (req, res) {
  let lr = new pakelection();
  lr.init().then(function() {
        lr.displayVoters().then(function(data) {
          res.json(data);
        });
    });
});

router.get('/fetchelectionresults', function (req, res) {
  let lr = new pakelection();
  lr.init().then(function() {
        lr.displayResults().then(function(data) {
          res.json(data);
        });
    });
});

router.get('/verifyvoter', function (req, res) {
  let lr = new pakelection();
  lr.init().then(function() {
    let voterCNIC = req.query.votercnic;
    let pass = req.query.password;
    lr.VerifyVoter(voterCNIC, pass).then(function(data) {
    res.send(data);
    });
  });
});

router.post('/castvote', function (req, res) {
  let lr = new pakelection();
  let voterCNIC = req.body.votercnic;
  let candCNIC = req.body.candidatecnic;

  lr.init().then(function() {
    lr.Vote(candCNIC, voterCNIC).then(function() {
      res.send("true");
    });
  });
});


module.exports = router;