exports = function(changeEvent){
  const http = context.services.get("getVer");
  const slackWebhookURI = context.values.get("slackDevHookUrl");
  const {updateDescription, fullDocument} = changeEvent;
  var gitVer = changeEvent.fullDocument.gitVersion;
  var announceText = `New Cloud version live: <https://github.com/10gen/mms/commit/${gitVer}|${gitVer}>`;
  //console.log(announceText);
  var slackPayload = {"text": announceText};
  
  return http.post({
    url: slackWebhookURI,
    body: slackPayload,
    encodeBodyAsJSON: true
  })
  .then(response => {
    const ejson_body = EJSON.parse(response.body.text());
    return ejson_body;
  });
};