/**
 * New script file
 */

/**
* A transaction processor function description
* @param {org.example.empty.StartElection} trx A human description of the parameter
* @transaction
*/
async function StartElection(trx)
{
  try
  {
    let Registry = await getAssetRegistry('org.example.empty.ElectionState'); 
    var factory = getFactory(); 
    let exist = await Registry.exists('1');
    if (!exist)
    {
    console.log('NOT EXISTS');
    let candidateRegistry = await getAssetRegistry('org.example.empty.Candidate'); 
    let resultsRegistry = await getAssetRegistry('org.example.empty.ElectionResults'); 
    let candidates = await candidateRegistry.getAll();
    let results = await resultsRegistry.getAll();
    await candidateRegistry.removeAll(candidates);
    await resultsRegistry.removeAll(results);
    let asset = factory.newResource('org.example.empty', 'ElectionState', '1'); 
    asset.election_status = true; 
    await Registry.add(asset); 
    console.log('Added');
    }
    else
    { 
     console.log('EXISTS');
     let asset = Registry.get('1'); 
     if (asset.election_status != true) 
     {
      console.log('Entered');
      let candidateRegistry = await getAssetRegistry('org.example.empty.Candidate'); 
      let resultsRegistry = await getAssetRegistry('org.example.empty.ElectionResults'); 
      let candidates = await candidateRegistry.getAll();
      let results = await resultsRegistry.getAll();
      await candidateRegistry.removeAll(candidates);
      await resultsRegistry.removeAll(results);
      var updatedasset = factory.newResource('org.example.empty', 'ElectionState', '1');
      updatedasset.election_status = true;
      await Registry.update(updatedasset);
     }
    }
  } catch(error) {
    console.log('Error: ', error);
  }
}

/**
* A transaction processor function description
* @param {org.example.empty.StopElection} tc A human description of the parameter
* @transaction
*/
async function StopElection(tc)
{
  try
  {
    let Registry = await getAssetRegistry('org.example.empty.ElectionState'); 
    var factory = getFactory(); 
    var asset = await Registry.get('1'); 
    if(asset.election_status)
    {  
    asset.election_status = false; 
    await Registry.update(asset); 
    console.log('Election stopped');
    }
  } catch(error) {
    console.log('Error: ', error);
  }
}

/**
* A transaction processor function description
* @param {org.example.empty.VerifyVoter} trxn A human description of the parameter
* @transaction
*/
async function VerifyVoter(trxn)
{
  try
  {
    let Registry = await getAssetRegistry('org.example.empty.Voter'); 
    var factory = getFactory(); 
    if (Registry.exists(trxn.voterCNIC))
    {
      return true;
    }
    else
    { 
      return false;
    }
  } catch(error) {
    console.log('Error: ', error);
  }
}

/**
* A transaction processor function description
* @param {org.example.empty.addVoter} advot A human description of the parameter
* @transaction
*/
async function addVoter(advot) 
{ 
 var voterassetreg; 

 advot.voter.voted = false; 
  
 return getAssetRegistry('org.example.empty.Voter')
  .then(function (voterAssetRegistry) {
    // Determine if the specific party exists in the party asset registry.. 
    voterassetreg = voterAssetRegistry;
    return voterAssetRegistry.exists(advot.voter.voterCNIC);
  })
  .then(function (exists) {
   if (exists)
   {
    console.log('A voter with the same CNIC already exists');
   }
   else
   { 
     console.log('A different voter defined');
    // Adding the party to the partyregistry here
    return voterassetreg.add(advot.voter);
   }
  })
  .catch(function (error) {
   console.log('Error: ', error);
  });
}

/**
 * Sample transaction processor function.
 * @param {org.example.empty.editVoter} edcand The sample transaction instance.
 * @transaction
 */
async function editVoter(edvot) {  
    // Update the value in the asset.
    let oldasset = edvot.old_voter;
    // oldasset.voterCNIC = edvot.new_voterCNIC;
    oldasset.fullName = edvot.new_fullName;
    oldasset.voted = false;
    oldasset.password = edvot.new_password;
    oldasset.contactno = edvot.new_contactno;
    oldasset.constituency = edvot.new_constituency;
   
    let assetRegistry = await getAssetRegistry('org.example.empty.Voter');

    // Update the asset in the asset registry. Again, note
    // that update() returns a promise, so so we have to return
    // the promise so that Composer waits for it to be resolved.
    await assetRegistry.update(oldasset);
}

/**
 * Sample transaction processor function.
 * @param {org.example.empty.editCandidate} edcand The sample transaction instance.
 * @transaction
 */
async function editCandidate(edcand) {  
    // Update the value in the asset.
    let oldasset = edcand.old_candidate;
    //oldasset.candidateCNIC = edcand.new_candidateCNIC;
    oldasset.fullName = edcand.new_fullName;
    //oldasset.totalVotes = 0;
    oldasset.party = edcand.new_party;
    oldasset.constituency = edcand.new_constituency;
    
    let assetRegistry = await getAssetRegistry('org.example.empty.Candidate');

    // Update the asset in the asset registry. Again, note
    // that update() returns a promise, so we have to return
    // the promise so that Composer waits for it to be resolved.
    await assetRegistry.update(oldasset);
}

/**
 * Sample transaction processor function.
 * @param {org.example.empty.editConstituency} edc The sample transaction instance.
 * @transaction
 */
async function editConstituency(edc) {  
    // Update the value in the asset.
    let oldasset = edc.old_constituency;
    //oldasset.constituencyID = edc.new_constituencyID;
    oldasset.cityname = edc.new_cityname;
    oldasset.no_of_candidates_registered = edc.new_no_of_candidates_registered;
  
    let assetRegistry = await getAssetRegistry('org.example.empty.Constituency');

    // Update the asset in the asset registry. Again, note
    // that update() returns a promise, so so we have to return
    // the promise so that Composer waits for it to be resolved.
    await assetRegistry.update(oldasset);
}

/**
 * Sample transaction processor function.
 * @param {org.example.empty.editParty} edc The sample transaction instance.
 * @transaction
 */
async function editParty(edp) {  
    // Update the value in the asset.
    let oldasset = edp.old_party;
    //oldasset.partyname = edp.new_partyname;
    oldasset.registered_date = edp.new_registered_date;
  
    let assetRegistry = await getAssetRegistry('org.example.empty.Party');

    // Update the asset in the asset registry. Again, note
    // that update() returns a promise, so so we have to return
    // the promise so that Composer waits for it to be resolved.
    await assetRegistry.update(oldasset);
}

/**
 * Sample transaction processor function.
 * @param {org.example.empty.editPollingStation} edc The sample transaction instance.
 * @transaction
 */
async function editPollingStation(edpol) {  
    // Update the value in the asset.
    let oldparticipant = edpol.old_pollingstation;
    //oldparticipant.pollID = edpol.new_pollID;
    oldparticipant.city = edpol.new_city;
  
    let participantRegistry = await getParticipantRegistry('org.example.empty.PollingStation');

    // Update the asset in the asset registry. Again, note
    // that update() returns a promise, so so we have to return
    // the promise so that Composer waits for it to be resolved.
    await participantRegistry.update(oldparticipant);
}

/**
 * Sample transaction processor function.
 * @param {org.example.empty.editAdmin} edc The sample transaction instance.
 * @transaction
 */
async function editAdmin(edpol) {
   // Update the value in the asset.
    let oldparticipant = edpol.old_admin;
    oldparticipant.name = edpol.new_name;
    oldparticipant.city = edpol.new_city;
    oldparticipant.contactno = edpol.new_contactno;
  
    let participantRegistry = await getParticipantRegistry('org.example.empty.ElectionAdmin');

    // Update the asset in the asset registry. Again, note
    // that update() returns a promise, so so we have to return
    // the promise so that Composer waits for it to be resolved.
    await participantRegistry.update(oldparticipant);
}

/**
* A transaction processor function description
* @param {org.example.empty.vote} tx A human description of the parameter
* @transaction
*/
async function vote(tx) {
  let Registry = await getAssetRegistry('org.example.empty.ElectionState'); 
  var factory = getFactory(); 
  var asset = await Registry.get('1'); 
  
  if(asset.election_status)
  {    
    if (!tx.voter.voted) 
    {
        tx.voter.voted = true;
        tx.results.totalVotes = tx.results.totalVotes + 1;
      
        return getAssetRegistry('org.example.empty.Voter')
            .then(function (voterRegistry) {
                return voterRegistry.update(tx.voter);
            })
            .then(function () {
                return getAssetRegistry('org.example.empty.ElectionResults')
                    .then(function (resultsRegistry) {
                        return resultsRegistry.update(tx.results);
                    })
            });
    } 
    else 
    {
        throw new Error('Vote already submitted!');
    }
  }
  else
  {
    throw new Error('Election not started!');
  }
}
