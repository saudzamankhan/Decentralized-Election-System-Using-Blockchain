'use strict';

const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

// these are the credentials to use to connect to the Hyperledger Fabric
let cardname = 'admin@tutorial-network';
//1@tutorial-network
//35200-1904330-8
/** Class for the land registry*/
class ElectionPakistan {

   /**
    * Need to have the mapping from bizNetwork name to the URLs to connect to.
    * bizNetwork name will be able to be used by Composer to get the suitable model files.
    *
    */
    constructor() {
        this.bizNetworkConnection = new BusinessNetworkConnection();
    }

   /** 
    * @description Initalizes the ElectionPakistan by making a connection to the Composer runtime
    * @return {Promise} A promise whose fullfillment means the initialization has completed
    */
    async init() {
        this.businessNetworkDefinition = await this.bizNetworkConnection.connect(cardname);
        console.log('ElectionPakistan:<init>', 'businessNetworkDefinition obtained', this.businessNetworkDefinition.getIdentifier());   
    }

    async StartElection() {
        let factory = this.businessNetworkDefinition.getFactory();
        let transaction = factory.newTransaction('org.example.empty','StartElection');
        await this.bizNetworkConnection.submitTransaction(transaction);
    }

    async StopElection() {
        let factory = this.businessNetworkDefinition.getFactory();
        let transaction = factory.newTransaction('org.example.empty','StopElection');
        await this.bizNetworkConnection.submitTransaction(transaction);
    }

    async VerifyVoter(votercnic, password)  {
        try {
            let registry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Voter');
            let aResources = await registry.getAll();
            let arrayLength = aResources.length;
        
            for (let i = 0; i < arrayLength; i++) 
            {
              var item = aResources[i];
              
              if (item.voterCNIC === votercnic)
              {      
                  if (item.password === password)
                  {
                      if (item.voted)
                      {
                          return "3";
                      }
                      else
                      {
                          return "1";
                      }
                  }   
              }
            }
            return "2";
           } catch(error) {
                console.log(error);
            }
    }

   /** 
    * adding Admin into the Admin registry
    * @return {Promise} resolved when the assets have been created
    */
    async addAdmin(cnic, name, cityname, contactno) {
       try {
        let Registry = await this.bizNetworkConnection.getParticipantRegistry('org.example.empty.ElectionAdmin');
        let factory = this.businessNetworkDefinition.getFactory();
        
        let admin = factory.newResource('org.example.empty', 'ElectionAdmin', cnic);
        admin.name = name;
        admin.city = cityname;
        admin.contactno = contactno;

        await Registry.add(admin);
        console.log('successfully added');
       } catch(error) {
            console.log(error);
        }
    }

   /** 
    * update a party
    * @return {Promise} resolved when the assets have been created
    */
    async editAdmin(cnic, name, city, contactno) { 
        try {
        let factory = this.businessNetworkDefinition.getFactory();
        let transaction = factory.newTransaction('org.example.empty','editAdmin');

        transaction.old_admin = factory.newRelationship('org.example.empty', 'ElectionAdmin', cnic);
        transaction.new_name = name;
        transaction.new_city = city;
        transaction.new_contactno = contactno;

        await this.bizNetworkConnection.submitTransaction(transaction);
        } catch(error) {
            console.log(error);
        }
    }

   /** 
    * Delete data
    * @return {Promise} resolved when the assets have been created
    */
    async deleteAdmin(cnic) { 
        try {
        let Registry = await this.bizNetworkConnection.getParticipantRegistry('org.example.empty.ElectionAdmin');
        await Registry.remove(cnic);  
        } catch(error) {
             console.log("Cannot Delete");
          }
    }

    async IssueAdmin(participantCNIC, name)
    {
      return this.bizNetworkConnection.issueIdentity('org.example.empty.ElectionAdmin#' + participantCNIC, name).then((result) => {
            console.log(`userID = ${result.userID}`);
            console.log(`userSecret = ${result.userSecret}`);
            const CardCreate = require('composer-cli').Card.Create;

            let options = {
            file: 'admin'+ participantCNIC + '.card',
            businessNetworkName: 'tutorial-network',
            connectionProfileFile: 'connection.json',
            user: result.userID,
            enrollSecret: result.userSecret
            };
            CardCreate.handler(options);
        })
        .catch((error) => {
            console.error(error);
            //process.exit(1);
        });
    }

    async RevokeAdmin(participantCNIC)
    {
        try {
        let identityRegistry = await this.bizNetworkConnection.getIdentityRegistry();
        let identities = await identityRegistry.getAll();
        identities.forEach((identity) => {
            //console.log(identity.name);
        if (identity.name === participantCNIC)
        {
            console.log(`tate`);
       
            const IdentityRevoke = require('composer-cli').Identity.Revoke;

            let options = {
                card: this.cardname,
                identityId: identity.identityId
            };  
            
       
            IdentityRevoke.handler(options);
            console.log(`te}`);
        }
        console.log(`identityId = ${identity.identityId}, name = ${identity.name}, state = ${identity.state}`);
        });
        }
        catch(error) {
            console.log(error);
        }
    }

    async IssuePollingStation(participantID, name)
    {
      return this.bizNetworkConnection.issueIdentity('org.example.empty.PollingStation#' + participantID, name).then((result) => {
            console.log(`userID = ${result.userID}`);
            console.log(`userSecret = ${result.userSecret}`);
            const CardCreate = require('composer-cli').Card.Create;

            let options = {
            file: 'poll'+ participantID + '.card',
            businessNetworkName: 'tutorial-network',
            connectionProfileFile: 'connection.json',
            user: result.userID,
            enrollSecret: result.userSecret
            };
            CardCreate.handler(options);
        })
        .catch((error) => {
            console.error(error);
            //process.exit(1);
        });
    }

    async RevokePollingStation(participantID)
    {
        try {
        let identityRegistry = await this.bizNetworkConnection.getIdentityRegistry();
        let identities = await identityRegistry.getAll();
        identities.forEach((identity) => {
            //console.log(identity.name);
        if (identity.name === participantID)
        {
            console.log(`tate`);
       
            const IdentityRevoke = require('composer-cli').Identity.Revoke;

            let options = {
                card: this.cardname,
                identityId: identity.identityId
            };  
            
       
            IdentityRevoke.handler(options);
            console.log(`te}`);
        }
        console.log(`identityId = ${identity.identityId}, name = ${identity.name}, state = ${identity.state}`);
        });
        }
        catch(error) {
            console.log(error);
        }
    }

   /** 
    * adding Party into the Party registry
    * @return {Promise} resolved when the assets have been created
    */
    async addPollingStation(pollid, city) {
       try {
        let Registry = await this.bizNetworkConnection.getParticipantRegistry('org.example.empty.PollingStation');
        let factory = this.businessNetworkDefinition.getFactory();
        
        let pol = factory.newResource('org.example.empty', 'PollingStation', pollid);
        pol.city = city;

        await Registry.add(pol);
        console.log('successfully added');

       } catch(error) {
            console.log("can't be added");
        }
    }

   /** 
    * update a party
    * @return {Promise} resolved when the assets have been created
    */
    async editPollingStation(pollid, city) { 
        try {
        let factory = this.businessNetworkDefinition.getFactory();
        let transaction = factory.newTransaction('org.example.empty','editPollingStation');

        transaction.old_pollingstation = factory.newRelationship('org.example.empty', 'PollingStation', pollid);
        transaction.new_city = city;

        await this.bizNetworkConnection.submitTransaction(transaction);
        } catch(error) {
            console.log(error);
        }
    }

   /** 
    * Delete data
    * @return {Promise} resolved when the assets have been created
    */
    async deletePollingStation(id) { 
        try {
        let Registry = await this.bizNetworkConnection.getParticipantRegistry('org.example.empty.PollingStation');
        await Registry.remove(id);  
        } catch(error) {
             console.log("Cannot Delete");
          }
    }

   /** 
    * adding Party into the Party registry
    * @return {Promise} resolved when the assets have been created
    */
    async addVoter(cnic, name, pass, contactno, constID) {
       try {
        let Registry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Voter');
        let factory = this.businessNetworkDefinition.getFactory();
        
        let voter = factory.newResource('org.example.empty', 'Voter', cnic);
        voter.fullName = name;
        voter.password = pass;
        voter.contactno = contactno;
        voter.constituency = factory.newRelationship('org.example.empty', 'Constituency', constID);
        await Registry.add(voter);
        console.log('successfully added');
       } catch(error) {
            console.log(error);
        }
    }

   /** 
    * update a party
    * @return {Promise} resolved when the assets have been created
    */
    async editVoter(cnic, name, pass, contactno, constID) { 
        try {
        let factory = this.businessNetworkDefinition.getFactory();
        let transaction = factory.newTransaction('org.example.empty','editVoter');

        transaction.old_voter = factory.newRelationship('org.example.empty', 'Voter', cnic);
        transaction.new_fullName = name;
        transaction.new_password = pass;
        transaction.new_contactno = contactno;
        transaction.new_constituency = factory.newRelationship('org.example.empty', 'Constituency', constID);

        await this.bizNetworkConnection.submitTransaction(transaction);
        } catch(error) {
            console.log(error);
        }
    }

   /** 
    * Delete data
    * @return {Promise} resolved when the assets have been created
    */
    async deleteVoter(cnic) { 
        try {
        let Registry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Voter');
        await Registry.remove(cnic);  
        } catch(error) {
             console.log("Cannot Delete");
          }
    }

   /** 
    * adding Party into the Party registry
    * @return {Promise} resolved when the assets have been created
    */
    async addCandidate(candCNIC, fullname, partyname, constID) {
       try {
        let constregistry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Constituency');
        let asset = await constregistry.get(constID);
        if (asset.no_of_candidates_registered < 15) // wont register more than 15 candidates in a constituency
        {  
        let Registry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Candidate');
        let factory = this.businessNetworkDefinition.getFactory();
        
        let cand = factory.newResource('org.example.empty', 'Candidate', candCNIC);
        cand.fullName = fullname;
        cand.party = factory.newRelationship('org.example.empty', 'Party', partyname);
        cand.constituency = factory.newRelationship('org.example.empty', 'Constituency', constID);
        
        await Registry.add(cand);
        asset.no_of_candidates_registered = asset.no_of_candidates_registered + 1;
        await constregistry.update(asset);

        let resRegistry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.ElectionResults');
        let electResults = factory.newResource('org.example.empty', 'ElectionResults', candCNIC);
        await resRegistry.add(electResults);

        console.log('successfully added');
        }
       } catch(error) {
            console.log(error);
        }
    }

  /** 
    * update a party
    * @return {Promise} resolved when the assets have been created
    */
    async editCandidate(candCNIC, fullname, partyname, constID) { 
        try {
        let factory = this.businessNetworkDefinition.getFactory();

        let constregistry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Constituency');
        let asset = await constregistry.get(constID);
        if (asset.no_of_candidates_registered < 15) // wont register more than 15 candidates in a constituency
        {
        let candRegistry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Candidate');
        let candasset = await candRegistry.get(candCNIC);
        let candconstID = candasset.constituency.getIdentifier();
        let cand_oldconst_asset = await constregistry.get(candconstID);
        cand_oldconst_asset.no_of_candidates_registered = cand_oldconst_asset.no_of_candidates_registered - 1;
        await constregistry.update(cand_oldconst_asset);

        let transaction = factory.newTransaction('org.example.empty','editCandidate');

        transaction.old_candidate = factory.newRelationship('org.example.empty', 'Candidate', candCNIC);
        transaction.new_fullName = fullname;
        transaction.new_party = factory.newRelationship('org.example.empty', 'Party', partyname);
        transaction.new_constituency = factory.newRelationship('org.example.empty', 'Constituency', constID);
        
        //asset.no_of_candidates_registered = asset.no_of_candidates_registered + 1;
        await constregistry.update(asset);

        await this.bizNetworkConnection.submitTransaction(transaction);
        }
        } catch(error) {
            console.log(error);
        }
    }
    
   /** 
    * Delete data
    * @return {Promise} resolved when the assets have been created
    */
    async deleteCandidate(cnic) { 
        try {
        let candRegistry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Candidate');
        let candasset = await candRegistry.get(cnic);
        let candconstID = candasset.constituency.getIdentifier();
        let constregistry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Constituency');
        let cand_oldconst_asset = await constregistry.get(candconstID);
        cand_oldconst_asset.no_of_candidates_registered = cand_oldconst_asset.no_of_candidates_registered - 1;
        await constregistry.update(cand_oldconst_asset);

        await candRegistry.remove(cnic);  
      
        let resultsRegistry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.ElectionResults');
        await resultsRegistry.remove(cnic);      
        } catch(error) {
             console.log("Cannot Delete");
        }
    }


   /** 
    * adding Party into the Party registry
    * @return {Promise} resolved when the assets have been created
    */
    async addParty(partyname, registered_date) {
       try {
        let partyRegistry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Party');
        let factory = this.businessNetworkDefinition.getFactory();
        
        let party = factory.newResource('org.example.empty', 'Party', partyname);
        party.registered_date = registered_date;

        await partyRegistry.add(party);
        console.log('successfully added');

       } catch(error) {
            console.log("can't be added");
        }
    }
    
   /** 
    * update a party
    * @return {Promise} resolved when the assets have been created
    */
    async editParty(partyname, registered_date) { 
        try {
        let factory = this.businessNetworkDefinition.getFactory();
        let transaction = factory.newTransaction('org.example.empty','editParty');

        transaction.old_party = factory.newRelationship('org.example.empty', 'Party', partyname);
        //transaction.new_partyname = 'NA-780';
        transaction.new_registered_date = registered_date;

        await this.bizNetworkConnection.submitTransaction(transaction);
        } catch(error) {
            console.log(error);
        }
    }

   /** 
    * Delete data
    * @return {Promise} resolved when the assets have been created
    */
    async deleteParty(id) { 
        try {
        let Registry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Party');
        let candregistry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Candidate');
        let candidates = await candregistry.getAll();
        let arrayLength = candidates.length;
    
        for (let i = 0; i < arrayLength; i++) 
        {
          if (candidates[i].party.getIdentifier() === id)
          {
            await this.deleteCandidate(candidates[i].candidateCNIC);
          }
        }
        await Registry.remove(id);  
        } catch(error) {
             console.log("Cannot Delete");
          }
    }

   /** 
    * adding a constituency by calling the function from the chain code
    * @return {Promise} resolved when the assets have been created
    */
    async addConstituency(constID, constcityname) {
      try {
        let constRegistry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Constituency');
        let factory = this.businessNetworkDefinition.getFactory();
        
        let constituency = factory.newResource('org.example.empty', 'Constituency', constID);
        constituency.cityname = constcityname;
        //constituency.no_of_candidates_registered = '0';
        
        await constRegistry.add(constituency);
        console.log('successfully added');
        
       } catch(error) {
            console.log("can't be added");
        }
    }
   
   /** 
    * update a constituency
    * @return {Promise} resolved when the assets have been created
    */
    async editConstituency(constID, constcityname) { 
        try {
        let factory = this.businessNetworkDefinition.getFactory();
        let transaction = factory.newTransaction('org.example.empty','editConstituency');

        transaction.old_constituency = factory.newRelationship('org.example.empty', 'Constituency', constID);
        transaction.new_cityname = constcityname;

        await this.bizNetworkConnection.submitTransaction(transaction);
        } catch(error) {
            console.log(error);
        }
    }

  /** 
    * Delete data
    * @return {Promise} resolved when the assets have been created
    */
    async deleteConstituency(id) { 
        try {
        let Registry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Constituency');
        
        let candregistry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Candidate');
        let candidates = await candregistry.getAll();
        let arrayLength = candidates.length;

        for (let i = 0; i < arrayLength; i++) 
        {
          if (candidates[i].constituency.getIdentifier() === id)
          {
            await this.deleteCandidate(candidates[i].candidateCNIC);
          }
        }
        await Registry.remove(id);  
        } catch(error) {
             console.log("Cannot Delete");
          }
    }

   /** 
    * cast a vote
    * @return {Promise} resolved when the assets have been created
    */
    async Vote(candidateCNIC, voterCNIC) { 
        try {
        let factory = this.businessNetworkDefinition.getFactory();
        let transaction = factory.newTransaction('org.example.empty','vote');
        console.log(candidateCNIC);
        console.log(voterCNIC);
        transaction.voter = factory.newRelationship('org.example.empty', 'Voter', voterCNIC);
        transaction.results = factory.newRelationship('org.example.empty', 'ElectionResults', candidateCNIC);

        await this.bizNetworkConnection.submitTransaction(transaction);
        } catch(error) {
            console.log(error);
        }
    }

    async displayCandidates() {
     try {
      let registry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Candidate');
      //let rs = await registry.getAll();
      //await registry.removeAll(rs); 
      let constregistry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Constituency');
      let partyregistry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Party');

      let aResources = await registry.getAll();
      let arrayLength = aResources.length;
      let displaytemp;
      var partyname, cityname, candconstID;
      var data = [];

      for (let i = 0; i < arrayLength; i++) 
      {
       displaytemp = await partyregistry.get(aResources[i].party.getIdentifier());
       partyname = displaytemp.partyname;    
       displaytemp = await constregistry.get(aResources[i].constituency.getIdentifier());
       cityname = displaytemp.cityname;
       candconstID = displaytemp.constituencyID;
    
       var item = aResources[i];

        data.push({ 
             "candidatecnic" : item.candidateCNIC,
             "candidatename" : item.fullName,
             "candidateconstID": candconstID,
             "partyname": partyname,
             "cityname": cityname
         });
      }
      return data;
     } catch(error) {
          console.log(error);
      }
    }

     async displayResults() {
     try {
      let resultsregistry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.ElectionResults');
      let candregistry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Candidate');
      let constregistry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Constituency');
      let partyregistry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Party');

      let aResources = await resultsregistry.getAll();
      let arrayLength = aResources.length;
      let displaytemp;
      var data = [];

      for (let i = 0; i < arrayLength; i++) 
      {
       let candidate = await candregistry.get(aResources[i].candidateCNIC);
       var candidatename = candidate.fullName;
       displaytemp = await partyregistry.get(candidate.party.getIdentifier());
       var partyname = displaytemp.partyname;
       displaytemp = await constregistry.get(candidate.constituency.getIdentifier());
       var cityname = displaytemp.cityname;

       var item = aResources[i];

        data.push({ 
             "candidatename" : candidatename,
             "constituencyid": candidate.constituency.getIdentifier(),
             "constituencycity": cityname,
             "partyname": partyname,
             "totalvotes": item.totalVotes
         });
      }
      return data;
     } catch(error) {
          console.log(error);
      }
    }

    
    async displayVoters() {
     try {
      let registry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Voter');
      let aResources = await registry.getAll();
      let arrayLength = aResources.length;
      var data = [];

      for (let i = 0; i < arrayLength; i++) 
      {
        var item = aResources[i];
    
        data.push({ 
             "votercnic" : item.voterCNIC,
             "votername" : item.fullName,
             "voterpassword" : item.password,
             "votercontactno" : item.contactno,
             "voterconstid" : item.constituency.getIdentifier(),
             "voted": item.voted
         });
      }
      return data;
     } catch(error) {
          console.log(error);
      }
    }

    async displayAdmins() {
     try {
      let registry = await this.bizNetworkConnection.getParticipantRegistry('org.example.empty.ElectionAdmin');
      let aResources = await registry.getAll();
      let arrayLength = aResources.length;
      var data = [];

      for (let i = 0; i < arrayLength; i++) 
      {
        var item = aResources[i];

        data.push({ 
             "adminCNIC" : item.adminCNIC,
             "name" : item.name,
             "city": item.city,
             "contactno": item.contactno
         });
      }
      return data;
     } catch(error) {
          console.log(error);
      }
    }

    async displayPollingStations() {
     try {
      let registry = await this.bizNetworkConnection.getParticipantRegistry('org.example.empty.PollingStation');
      let aResources = await registry.getAll();
      let arrayLength = aResources.length;
      var data = [];

      for (let i = 0; i < arrayLength; i++) 
      {
        var item = aResources[i];

        data.push({ 
             "pollid" : item.pollID,
             "city"  : item.city
         });
      }
      return data;

     } catch(error) {
          console.log(error);
      }
    }

    async displayConstituencies() {
     try {
      let registry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Constituency');
      let aResources = await registry.getAll();
      let arrayLength = aResources.length;
      var data = [];

      for (let i = 0; i < arrayLength; i++) 
      {
        var item = aResources[i];

        data.push({ 
             "constituencyid" : item.constituencyID,
             "cityname"  : item.cityname,
             "no_of_candidates_registered" : item.no_of_candidates_registered
         });
      }
      return data;
     } catch(error) {
          console.log(error);
      }
    }

    async displayParties() {
     try {
      let registry = await this.bizNetworkConnection.getAssetRegistry('org.example.empty.Party');
      let aResources = await registry.getAll();
      let arrayLength = aResources.length;
      var data = [];

      for (let i = 0; i < arrayLength; i++) 
      {
       var item = aResources[i];

        data.push({ 
             "partyname" : item.partyname,
             "registered_date" : item.registered_date
        });
      }
      return data;
    } catch(error) {
          console.log(error);
      }
   }
}
   
module.exports = ElectionPakistan;
