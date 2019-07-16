exports = function(changeEvent) {
  const http = context.services.get("getVer");
  const mongodb = context.services.get("mongodb-atlas");
  const versionCollection = mongodb.db("mms").collection("version");
  var gitVer = http.get({url:"https://cloud.mongodb.com/api/private/unauth/version"})
    .then(x => {
      console.log(x.body.text());
      const query = {"gitVersion" : x.body.text() };
      return versionCollection.findOne(query)
        .then(result => {
          if(result) {
            //console.log(`Successfully found document: ${JSON.stringify(result)}`);
            const update = { "$set": {"lastSeen": new Date()}};
            const options = {"upsert": false};
            versionCollection.updateOne(query,update,options)
              .then(result =>{
                const { matchedCount, modifiedCount } = result;
                if(matchedCount && modifiedCount) {
                 //console.log(`Successfully updated the item.`);
                }
              }).catch(err => console.error(`Failed to update the item: ${err}`));
          } else {
            //console.log(`No document matches query:`);
            //console.log(JSON.stringify(query));
            var newDoc = {
              "gitVersion": x.body.text(),
              "firstSeen": new Date(),
              "lastSeen": new Date(),
            };
            versionCollection.insertOne(newDoc)
              .then(result => console.log(`Successfully inserted item with _id: ${result.insertedId}`))
              .catch(err => console.error(`Failed to insert item: ${err}`));
         }
        return result;
    })
    .catch(err => console.error(`Failed to find document: ${err}`));
      });
};