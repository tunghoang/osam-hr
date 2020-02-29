global.createGroup = createGroup;
global.create = create;
global.getService = getService;

function createGroup() {
    create('group2@rvtcompany.page', 'Testing', 'This is group created by Thinh');
  }
  
  function create(email, name ,des) {
    var service = getService();
    var requestBody = JSON.stringify({email: email, name : name, description : des});
    if (service.hasAccess()) {
      var url = 'https://www.googleapis.com/admin/directory/v1/groups';
      var response = UrlFetchApp.fetch(url, {
        method: 'post',
        contentType: "application/json",
        payload: requestBody,
        headers: {
          Authorization: 'Bearer ' + service.getAccessToken()
        }
      });
      var result = JSON.parse(response.getContentText());
      Logger.log(JSON.stringify(result, null, 2));
    } else {
      var authorizationUrl = service.getAuthorizationUrl();
      Logger.log('Open the following URL and re-run the script: %s',
          authorizationUrl);
    }
    return;
  
  }
  
  function getService() {
    return OAuth2.createService('Google')
        .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/v2/auth')
        .setTokenUrl('https://oauth2.googleapis.com/token')
        .setClientId('662965188559-01aaqnfc5ut6s30s15r2clka6rti7ppc.apps.googleusercontent.com')
        .setClientSecret('gl8hJEQfE1kmOgsmR0SpV2GJ')
        .setCallbackFunction('authCallback')
        .setPropertyStore(PropertiesService.getUserProperties())
        .setScope('https://www.googleapis.com/auth/admin.directory.group')
        .setParam('access_type', 'offline')
        .setParam('approval_prompt', 'force')
        .setParam('login_hint', Session.getActiveUser().getEmail());
  }
  
  
  function authCallback(request) {
    var service = getService();
    var authorized = service.handleCallback(request);
    if (authorized) {
      return HtmlService.createHtmlOutput('Success!');
    } else {
      return HtmlService.createHtmlOutput('Denied.');
    }
  }
  
 