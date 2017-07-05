var builder = require('botbuilder');
var restify = require('restify');
var request = require('request');
var anything= require('dotenv-extended');
var y='yes';
var n='no';
var e='exit';
var options=[y,n,e];
var clp,pswd,gp,ad,net,mail,pci,hrm,dm,nprint,sp,ii;
//var response= require('response');
//var spellService = require('./spell-service');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create connector and listen for messages
var connector = new builder.ChatConnector({
   //appId:process.env.MICROSOFT_APP_ID,
    //appPassword: process.env.MICROSOFT_APP_PASSWORD
appId:'55b3a953-ecb7-4384-85f9-9e8ef2bb5ff8',
 appPassword:'fAHmxp8NkzFbsQi6Fk8Phrj'
});
server.post('/api/messages', connector.listen());
var bot = new builder.UniversalBot(connector,
function(session){
    
//Speech(voice recognition)
if (hasAudioAttachment(session)) {
        var stream = getAudioStreamFromMessage(session.message);
        speechService.getTextFromAudioStream(stream)
            .then(function (text) {
                session.send(processText(text));
            })
            .catch(function (error) {
               // session.send('Oops! Something went wrong. Try again later.');
                console.error(error);})
    }//if
    else {
        //session.send('Did you upload an audio file? I\'m more of an audible person. Try sending me a wav file');
    }}
);

//url after publishing
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e0a26263-411c-450d-8172-d805099a8668?subscription-key=eb7529ef4b8f4b85a8397daef4dc1e90&timezoneOffset=0&verbose=true&q=';
var recognizer = new builder.LuisRecognizer(model);
bot.recognizer(recognizer);

//None intent
bot.dialog('None', [ 
    function (session,args,next){
   session.send('Sorry, we could be of no help. Please wait for your engineer to arrive');
   //builder.Prompts.text(session,'please enter your employee id');
//session.send('Our engineer will contact you shortly');
//if(!session.userData.name)
//{
   session.beginDialog('/profile');
next();
},
function(session,results)
{
    //session.send(session.userData.name);
}]).triggerAction({
    matches: 'None'
});
bot.dialog('/profile',[
    function(session)
    {
        builder.Prompts.text(session,'please enter your employee id:');  
    },
function(session,results)
{
   // var ab=results.response;
    //var ab=session.userData.name;
    session.userData.name=results.response;
    session.endDialog();
//function (session,results){
  //builder.Prompts.text(session,'Please enter your emp id ');
//var empid=101;
//session.userData=results.response();
//session.send('%s',session.userData);    
   //session.send('Please enter your employee ID');
   request({
    url:'http://boancomm.net/boansms/boansmsinterface.aspx?mobileno=9908400028&smsmsg=My%20employee%20ID%20is%20'+session.userData.name+'.%20Please%20contact%20me%20ASAP.%20&uname=itcpspdsms&pwd=itcpspd2017sms&pid=858',
method:'GET'
});
session.endDialog('Message has been sent to fms department, an engineer will be there shortly');
}]);

//Hello intent 
bot.dialog('greetmsg', 
function (session,args,next){
    //session.sendTyping();
    session.send("Hi! I'm S-bot.\n"+"\n"+"\nTell me what is the problem you are facing so that I can help you provide a solution.\n"+"\n"+"\n I can convert speech to text as well. \n"+"\n"+"\nPlease check your keywords before submitting");
session.beginDialog('/choice')
}).triggerAction({
    matches: 'greetmsg'
});
  bot.dialog('/choice',
[   function (session) {
      session.send("You can try the following queries")
    var cards = getCardsAttachments();
    // create reply with Carousel AttachmentLayout
    var reply = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards);
    session.send(reply);
}]);
function getCardsAttachments(session) {
    return [
        new builder.HeroCard(session)
            .title('Printer Defects')
            .subtitle('Printer has stopped functioning appropriately?')
            .text('You could always toss a misbehaving inkjet or laser out the window, but where would that leave you? ')
            .images([
                builder.CardImage.create(session, 'http://www.tonerhaus.com/blog/wp-content/uploads/2014/10/Typical-Problems-Office-Printers-12164023_s.jpg')
            ]),
        new builder.HeroCard(session)
            .title('Internet Issue')
            .subtitle('Net too slow?')
            .text('If you are experiencing problems with a variety of websites, they may be caused by your modem or router.')
            .images([
                builder.CardImage.create(session, 'http://img.etimg.com/thumb/msid-19299729,width-640,resizemode-4,imglength-75013/technical-computer-problem-get-help-from-an-expert-over-the-internet.jpg')
            ]),
        new builder.HeroCard(session)
            .title('Lotus Notes')
            .subtitle('IBM Notes ')
            .text('A modern business that connects using enterprise email. The IBM Notes enterprise email client integrates messaging, business applications and social collaboration into one easier-to-use workspace')
            .images([
                builder.CardImage.create(session, 'http://litmuswww.s3.amazonaws.com/community/learning-center/lotus-notes-icon.png')
            ]),
        new builder.HeroCard(session)
            .title('SAP')
            .subtitle('German multinational software')
            .text('Solve the problem?')
            .images([
                builder.CardImage.create(session, 'http://itamchannel.com/wp-content/uploads/2015/07/sapman.jpg')
            ]),
             new builder.HeroCard(session)
            .title('Others')
            .subtitle('Type Your query')
            .text('Let us know what else do you need help with!')
            .images([
                builder.CardImage.create(session, 'http://www.radhanath-swami.net/wp-content/uploads/2010/09/Inconviniences-in-serving-others_s1.jpg')
            ])
            ];
}

bot.dialog('howToChangeLotusNotesPassword', 
function (session,args,next){
    //session.sendTyping();
  var clp=session.message.text;  
    session.send("Click File Tab and choose security and User Security.\n"+"\n"+"\nIn User Security, Click on Change Password .\n"+"\n"+"\nIt must be contain of Upper, lower case, number and Special characters(8 Characters).\n"+"\n"+"\n");
session.userData.number=clp;
session.beginDialog('/lotuscard',clp);
},
function(session,results,clp)
{ 
//sh=results.response;
//session.beginDialog('/ncard');
}).triggerAction({
    matches: 'howToChangeLotusNotesPassword'
});
bot.dialog('/lotuscard',
[   function(session,clp)
{ avg=clp;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{ //session.message.text=avg;
   //session.send(session.message.text);
var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
{
    var card = createHeroCardlotus(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();
    }
    else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardlotus(session,sc,s1) {
    //console.log(avg);
    var trial;
    //trial=newh;    
    return new builder.HeroCard(session)
        .title('Lotus notes')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'http://www-10.lotus.com/ldd/insidelotusblog.nsf/dx/notes32b256p.png/$file/notes32b256p.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Lotus IBM results'),    
        ]);
}

   
bot.dialog('howToSynchronizeWindowsPasswordWithNotesPassword', function (session,arg){
    //session.sendTyping();
    var pswd=session.message.text;
    session.send("Check that you have installed the Client Single Logon feature by choosing File > Security > UserSecurity. The option 'Login to Notes using your operating system login' in Security Basics is enabled if you installed the single logon feature.\n"+"\n"+"\nIf the single logon option is not enabled, exit Notes, uninstall it, and then re-install, being sure to select Client Single Logon Feature in the Custom Setup dialog box.\n"+"\n"+"\nWhen the feature finishes installing, restart Notes and change your Notes password so it matches your Windows password.\n"+"\n"+"\nWhen you have changed your Notes password to match your Windows password, exit Notes and restart your computer. When prompted, log in to your computer using your Windows password. When you launch Notes, you should not be prompted for a password.");
session.userData.number=pswd;
session.beginDialog('/pwdcard',pswd);
},
function(session,results,pswd)
{ 
//sh=results.response;
//session.beginDialog('/ncard');
}).triggerAction({
    matches: 'howToSynchronizeWindowsPasswordWithNotesPassword'
});
bot.dialog('/pwdcard',
[   function(session,pswd)
{ avg=pswd;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=pswd;
 },
 function(session,results,avg)
{ //session.message.text=avg;
   //session.send(session.message.text);
var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
        //newh=avg;
        //session.send(newh);
        var card = createHeroCardwnp(session,pswd);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardwnp(session,sc,s1) {    
    return new builder.HeroCard(session)
        .title('Synchronize passwords')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'http://melbournemontessori.vic.edu.au/wp-content/uploads/2016/06/Change-Password.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Synchronize Password'),    
        ]);
}

bot.dialog('solveAdsAccountProblem', 
function (session,args,next){
    //session.sendTyping();
     var ad=session.message.text;
    session.send("Admin work(unlocking)");
    session.userData.number=ad;
session.beginDialog('/adscard',ad);
},
function(session,results,ad)
{ }).triggerAction({
    matches: 'solveAdsAccountProblem'
});
bot.dialog('/adscard',
[   function(session,ad)
{ avg=ad;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardads(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardads(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('ADS account')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'http://www.itcpspd.com/uploads/images/Logo-PSPD.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'ADS ACCOUNT'),    
        ]);
}

bot.dialog('solveGpeditAndDisableRightClick', 
function (session,args,next){
    //session.sendTyping();
    var gp=session.message.text;
    session.send("Gpedit uses to modify the group policies.\n"+"\n"+"\nrun gpedit.msc and User Configuration > Administrative Templates > Windows Components > File Explorer.\n"+"\n"+"\nIn the right pane, double-click on Remove File Explorer’s default context menu to open its settings box.\n"+"\n"+"\nSelect Configured > Apply. Exit and restart your computer.");
session.beginDialog('/gpcard',gp);
session.userData.number=gp;
},
function(session,results,gp)
{ }).triggerAction({
    matches: 'solveGpeditAndDisableRightClick'
});
bot.dialog('/gpcard',
[   function(session,gp)
{ avg=gp;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardgped(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardgped(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('GP edit')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'http://www.itcpspd.com/uploads/images/Logo-PSPD.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'GP edit'),    
        ]);
}

bot.dialog('solveMailsNotReceived',
function (session,args,next){
    //session.sendTyping();
var mail=session.message.text;  
    session.send("OPEN REPLICATION TAB PRESENT AT LEFT SIDE FILE TAB.\n"+"\n"+"\nENSURE OUTBOX AND LOCAL MAIL ENABLE BUTTON IS CHECK.\n"+"\n"+"\nOPEN OUTBOX FILE FROM WORKSPACE AND ANY PENDING MAILS ARE THERE . DELETE LARGE FILE MAIL.\n"+"\n"+"\nGO TO FILE ---> PREFERNCES----> LOCATION ---> SELECT ONLINE ----> REPLICATION OPTION ENABLE.\n"+"\n"+"\nGO TO FILE -->RELICATION --> RELICATE ---> REPLICATE VIA REPLICATOR.");
session.beginDialog('/mailcard',mail);
session.userData.number=mail;
},
function(session,results,mail)
{ }).triggerAction({
    matches: 'solveMailsNotReceived'
});
bot.dialog('/mailcard',
[   function(session,mail)
{ avg=mail;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardm(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardm(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Mail Problems')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'https://www.canadapost.ca/assets/img/en/landingpages/manageMail_image2.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Mail results'),    
        ]);
}

bot.dialog('solveNetProblem', 
function (session,args,next){
    //session.sendTyping();
   var net=session.message.text;
    session.send("Check whether the LAN Icon in system tray is showing connected. \n"+"\n"+"\nIn the same system tray, ensure that sysmantec icon is marked with green dot, showing that it is updated.\n"+"\n"+"\nOpen the symantec end point protection console and ensure that the virus and spyware protection in status tab is showing the latest date ( preferrably the previous day date ).\n"+"\n"+"\nClick on the Option tab in the Network access control status and click on the Check Host Intergrity option.\n"+"\n"+"\nCheck whether the message ' Host Integrity has passed  is came or not. If not came, raise the ticket in service desk for engineer to address and resolve the problem.\n"+"\n"+"\n");
session.beginDialog('/netcard',net);
session.userData.number=net;
},
function(session,results,net)
{ }).triggerAction({
    matches: 'solveNetProblem'
});
bot.dialog('/netcard',
[   function(session,net)
{ avg=net;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardnet(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardnet(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Network')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'http://www.itcpspd.com/uploads/images/Logo-PSPD.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Network Problem'),    
        ]);
}

bot.dialog('solvePgpEncryptDecrypt', 
function (session,args,next){
    //session.sendTyping();
    var pgp=session.message.text;;
    session.send("After running the Exe Setup file and Choose the Disk to encrypt and click OK.\n"+"\n"+"\nWhile Encrypting User must put in charge and when the battery getting 0% it will affect (losses)the data's.\n"+"\n"+"\nUser can able to Stop or Pause it and run it as later.\n"+"\n"+"\nAfter completed should be restart. Password or passpharse is important.\n"+"\n"+"\nDecrypt with clipboard and it allows encrypted data which user have copied to the windows clipboard.");
session.beginDialog('/pgpcard',pgp);
session.userData.number=pgp;
},
function(session,results,pgp)
{ }).triggerAction({
    matches: 'solvePgpEncryptDecrypt'
});
bot.dialog('/pgpcard',
[   function(session,pgp)
{ avg=pgp;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardpgped(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardpgped(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('PGP Encrypt')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'https://i.ytimg.com/vi/8UnCu1NM378/hqdefault.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'PGP'),    
        ]);
}

bot.dialog('solveProfileCorruptedIssue', 
function (session,args,next){
    //session.sendTyping();
    var pci=session.message.text;
    session.send("Before do anything, restart the computer 2 or 3 times to see whether it’s going back to your old correct profile. Go to next step if this doesn’t work.\n"+"\n"+"\nRename the temp profile registry and revert back the old registry settings for the correct profile.\n"+"\n"+"\nFew times this method worked for me, repair the corrupted files. Usually the corrupted ‘Ntuser’ files cause this issue. So, run the check disk for partition which is having user profile.\n"+"\n"+"\nRestarting for check disk, if you see corrupted entries and repairing process inside your user profile folder, If it finds and repairs any files especially Ntuser files, you may get your old Windows 7 profile back.\n"+"\n"+"\nCreate new user name in non domain (workgroup environment) from control panel or computer management. Make sure to add the new user to administrators group.\n"+"\n"+"\nNew user profile in domain environment.\n"+"\n"+"\nSince we can’t delete and create new domain user account for this purpose, we will play around with client computer only. Let’s completely remove the user profile and re create again.\n"+"\n"+"\nCopy the important user data or entire folders from corrupted profile to new location. Double-check that you have copied all required folders and files from old profile, because we are going to delete it now.\n"+"\n"+"\nGo to Advanced settings of System as shown below, click on Settings (user profiles), select the corrupted user profile which is not loading properly in Windows 7, then press Delete button. Delete button will be enabled only if you login with different user account.\n"+"\n"+"\n");
session.beginDialog('/pccard',pci);
session.userData.number=pci;
},
function(session,results,pci)
{ }).triggerAction({
    matches: 'solveProfileCorruptedIssue'
});
bot.dialog('/pccard',
[   function(session,pci)
{ avg=pci;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardpci(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardpci(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Profile corruption')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'http://www.itcpspd.com/uploads/images/Logo-PSPD.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Profile'),    
        ]);
}

bot.dialog('solveHrmsAccountIssue', 
function (session,args,next){
    //session.sendTyping();
    var hrm=session.message.text;
    session.send("Reset the HRMS password");
session.beginDialog('/hrcard',hrm);
session.userData.number=hrm;
},
function(session,results,hrm)
{}).triggerAction({
    matches: 'solveHrmsAccountIssue'
});
bot.dialog('/hrcard',
[   function(session,hrm)
{ avg=hrm;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardhrms(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardhrms(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('HRMS Account')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'https://3.imimg.com/data3/IU/NA/MY-4439715/hrms-500x500.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'HRMS'),    
        ]);
}

bot.dialog('solveDotMatrixPrinterProblem', 
function (session,args,next){
    //session.sendTyping();
    var dm=session.message.text;
    session.send("CHECK PRINTER HEAD CABLE IS CORRECTLY CONNECTED WITH HEAD.\n"+"\n"+"\nCHECK RIBBON PULLING GEAR IS ROATING OR NOT , ENSURE WITH AFTER FIXING RIBBON ALSO.\n"+"\n"+"\nCHECK PAPER TRAY SENSOR AND FEEDING WEEL IS WORKING OR NOT .\n"+"\n"+"\nWHILE POWER ON PRESS EJECT BUTTON ON CONTROL PANEL . RELEASE HAND ON ONCE PRINT IS STARTED.\n"+"\n"+"\n ENSURE PRINTER TO PC COMMUNICATION CABLE IS PLUED COREECT OR NOT.\n"+"\n"+"\n");
session.beginDialog('/dotcard',dm);
session.userData.number=dm;
},
function(session,results,dm)
{}).triggerAction({
    matches: 'solveDotMatrixPrinterProblem'
});
bot.dialog('/dotcard',
[   function(session,dm)
{ avg=dm;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCarddot(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCarddot(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('DOT Matrix Issue')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'http://www.pcdl.org/files/images/printer.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Dot Matrix'),    
        ]);
}

bot.dialog('solveSapBarCodeValueNotPrinting', 
function (session,args,next){
    //session.sendTyping();
    var sp=session.message.text;
    session.send("ENSURE BARCODE PRINT COME WITH ANOTHER PAGE.\n"+"\n"+"\nGO TO SAP GUI OPTION CLICK SECUIRTY OPTION.\n"+"\n"+"\nGO TO CUSTOMIZED DETAILS AND CHECK WHETHER ALL SECURITY ITEMS ARE ALLOW.\n"+"\n"+"\nGO TO ALL LAST PAGE AND CHANGE ALL THE DENY OPTION IS ALLOW .\n"+"\n"+"\nAPPLY OK . THEN RESTART SAP GUI APPLICATION.\n"+"\n"+"\n");
session.beginDialog('/scard',sp);
session.userData.number=sp;
},
function(session,results,sp)
{ }).triggerAction({
    matches: 'solveSapBarCodeValueNotPrinting'
});
bot.dialog('/scard',
[   function(session,sp)
{ avg=sp;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardsap(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardsap(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('SAP')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'https://toinovate.com/wp-content/uploads/2014/01/sap-logo21.gif')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'SAP Bar Code'),    
        ]);
}

bot.dialog('solveNetworkPrinterIssue',
function (session,args,next){
    var nprint=session.message.text;
    session.send("CHECK PRINTER IP ADDRESS AS PRESS NETWORK BUTTON ON PRINTER.\n"+"\n"+"\nCHECK IP ADDRESS IS COMMUNICATED FROM PC.\n"+"\n"+"\nCHECK CABLE ARE PLUGED BACK SIDE OF PRINTER.\n"+"\n"+"\nCHECK OUR PC GETTING NETWORK OR NOT.\n"+"\n"+"\nGO TO DEVICE AND PRINTER SELECT PRINTER AND PORT TAB CORRESPONDING IP ADRESS IS SELECTED OR NOT.");
        session.beginDialog('/printcard');
        session.userData.number=nprint;
},
function(session,results,nprint)
{ }).triggerAction({
    matches: 'solveNetworkPrinterIssue'
});
bot.dialog('/printcard',
[   function(session,nprint)
{ avg=nprint;
   builder.Prompts.choice(session,'not solved yet? Do you want to search the web?',options);
session.message.text=avg; 
},
 function(session,results,avg)
{
    var sc = results.response.entity;
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {var card = createHeroCardnetworkp(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
    session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
     function createHeroCardnetworkp(session,sc,s1) {
    return new builder.HeroCard(session)
        .title('network printer')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'http://www.inkpal.com/images/top-10-common-printer-problems.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Network')
        ]);
}

bot.dialog('solveInternetIssue',
function (session,args,next){
    //session.sendTyping();
    var ii=session.message.text;
    session.send("Insert the switch side cable properly.\n"+"\n"+"\nNetwork/Fibre cable might be faulty.\n"+"\n"+"\nPower adapter issue.\n"+"\n"+"\nSplicing needed.\n"+"\n"+"\nChange proxy settings.\n"+"\n"+"\nChange IO and patch cards.\n"+"\n"+"\nReinstall SEP.\n"+"\n"+"\nMotherboard issues.\n"+"\n"+"\nChanging the port number.");
session.beginDialog('/ipcard',ii);
session.userData.number=ii;
},
function(session,results,ii)
{ }).triggerAction({
    matches: 'solveInternetIssue'
});
bot.dialog('/ipcard',
[   function(session,ii)
{ avg=ii;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardinter(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardinter(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Internet')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'http://www.techiwarehouse.com/userfiles/network%20problems.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Internet problems'),    
        ]);
}

bot.dialog('PerfexNotOpening', 
function (session,args,next){
    var per=session.message.text;
    //session.sendTyping();
    session.send("Step 1:	Choose the Firefox Browser for Perfex. And Open it.\n"+"\n"+"\nStep 2:	Click Open menu on right hand top corner symbol look likes 3 lines(=).\n"+"\n"+"\nStep 3: Click Open and choose 'Advance' tab and Choose 'Network' tab and set it as 'No Proxy'.\n"+"\n"+"\nStep 4: Now Choose General Tab and In firefox starts field type as 'Perfexws/perfex'.\n"+"\n"+"\nStep 5: Close Tab's and click on Home Button now whenever opening browser perfex is open defaultly.\n"+"\n"+"\n");
session.beginDialog('/percard',per);
session.userData.number=per;
},
function(session,results,per)
{ }).triggerAction({
    matches: 'PerfexNotOpening'
});
bot.dialog('/percard',
[   function(session,per)
{ avg=per;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardperfex(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardperfex(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Perfex')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'https://www.perfexcrm.com/wp-content/uploads/2016/02/perfex-crm-logo.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Perfex is perfect'),    
        ]);
}

bot.dialog('addSignatureAndLetterheadInLotusnotes', 
function (session,args,next){
    //session.sendTyping();
    var sal=session.message.text;
    session.send("Step 1:	Open Lotus Notes program and click the 'Mail' icon to access the email functions.\n"+"\n"+"\nStep 2:	Click the 'More' tab at the top of a blank email to open a pull-down menu.\n"+"\n"+"\nStep 3:	select 'Preferences' from the menu to open an options box.\n"+"\n"+"\nStep 4:	Click the 'Letterhead' tab in the options box to display the available letterhead graphics. \n"+"\n"+"\nStep 5:	Scroll down the list and select a letterhead to see it displayed in the preview area. \n"+"\n"+"\nStep 6:	Click the 'Signature' tab and Select Automatically append a signature to the bottom of my outgoing mail messages.\n"+"\n"+"\nStep 7:	For the format of your signature, select Rich text, Plain text, or HTML or image file. Enter text in the corresponding Signature field.");
session.beginDialog('/slhcard',sal);
session.userData.number=sal;
},
function(session,results)
{ }).triggerAction({
    matches: 'addSignatureAndLetterheadInLotusnotes'
});
bot.dialog('/slhcard',
[   function(session,sal)
{avg=sal;
   builder.Prompts.choice(session,'Do you want to search the web?',options);
session.message.text=avg; 
},
 function(session,results,avg)
{    var sc = results.response.entity;
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {var card = createHeroCardsign(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
    session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardsign(session,sc,s1) {
    return new builder.HeroCard(session)
        .title('Signature and letter head')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'http://litmuswww.s3.amazonaws.com/community/learning-center/lotus-notes-icon.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Lotus Notes')
        ]);
}

bot.dialog('historyNotShowingInSap', 
function (session,args,next){
    //session.sendTyping();
    var his=session.message.text;
    session.send("STEP 1 : In GUI Configuration, Choose Options Tab click on ‘Local Data’ folder and then ‘History’.\n"+"\n"+"\n STEP 2 :Click on history status back to ON and click on Apply.\n"+"\n"+"\n STEP 3 :Click Clear History  button and finally click OK  to close the window.\n"+"\n"+"\nSTEP 4:Now navigate to  C:\'users'\User name\AppData\Roaming\SAP\SAP GUI\History.\n"+"\n"+"\n STEP 5:	Here you will find MDB file which is usually named SAPHistory username.mdb.\n"+"\n"+"\n STEP 6:Delete this file, Now this should take care of the history not getting saved. Reopen SAP GUI");
session.beginDialog('/historycard',his);
session.userData.number=his;
},
function(session,results,his)
{ }).triggerAction({
    matches: 'historyNotShowingInSap'
});
bot.dialog('/historycard',
[   function(session,his)
{ avg=his;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardhist(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardhist(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('SAP')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'https://toinovate.com/wp-content/uploads/2014/01/sap-logo21.gif')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'History Issue'),    
        ]);
}

bot.dialog('registerCallServiceDeskToPortal', 
function (session,args,next){
   var serv=session.message.text;
    //session.sendTyping();
    session.send("Step 1:Open Internet Browser and Choose Tools and Select Internet Options.\n"+"\n"+"\nStep 2: click Connection tab and Click Lan Settings tab. \n"+"\n"+"\nStep 3:Check the box of proxy server. Now Click Advance tab and type proxy.itc.in, port no. 8080.\n"+"\n"+"\nStep 4:	check the box of use the same proxy server for all protocols.\n"+"\n"+"\nStep 5: Goto Advance tab Enable all TLS and SSL.\n"+"\n"+"\nStep 6: Close and reopen Internet explore now ITC Portal will be open.\n"+"\n"+"\nStep 7:	Choose IT SUPPORT Tab and Click NEW CALL and Fill the Entire Fields.");
session.beginDialog('/servicecard',serv);
session.userData.number=serv;
},
function(session,results,serv)
{ }).triggerAction({
    matches: 'registerCallServiceDeskToPortal'
});
bot.dialog('/servicecard',
[   function(session,serv)
{ avg=serv;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardcsd(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardcsd(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Service Desk')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'http://www.bccservices.com/wp-content/uploads/2013/12/ServiceDesk-peeps.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Portal link'),    
        ]);
}

bot.dialog('solveerrornetworkinIp', 
function (session,args,next){
    //session.sendTyping();
    var er=session.message.text;
    session.send("Step 1:Run Regedit.exe file.\n"+"\n"+"\nStep 2:Choose the path HKEY_LOCAL_MACHINE\ControlSet001\Control\NetworkProvider\Order.\n"+"\n"+"\nStep 3:Choose ProviderOrder.\n"+"\n"+"\nStep 4:Change the Value as LanmanWorkstation.\n"+"\n"+"\nStep 5:Logoff and Logon again it will Started Network path");
session.beginDialog('/solvecard',er);
session.userData.number=er;
},
function(session,results,er)
{ }).triggerAction({
    matches: 'solveerrornetworkinIp'
});
bot.dialog('/solvecard',
[   function(session,er)
{ avg=er;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardsolve(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardsolve(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Network')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'https://blog.sqlauthority.com/i/a/errorstop.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Error Network'),    
        ]);
}

bot.dialog('screenBlueError', 
function (session,args,next){
    //session.sendTyping();
    var blue=session.message.text;
    session.send("Ram issue.\n"+"\n"+"\nOs issue.\n"+"\n"+"\nIncompatible drivers.\n"+"\n"+"\nHard disk issue.\n"+"\n"+"\nIncompatible hardwarePlease note the error code available on the screen and do the hard reboot of PC.\n"+"\n"+"\nIf system is working normally. Its Ok.\n"+"\n"+"\nRaise the complaint in service desk mentioning the error code if the problem still persists after hard reboot. \n"+"\n"+"\n");
session.beginDialog('/erbcard',blue);
session.userData.number=blue;
},
function(session,results,blog)
{ }).triggerAction({
    matches: 'screenBlueError'
});
bot.dialog('/erbcard',
[   function(session,blue)
{ avg=blue;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardblueer(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardblueer(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Blue')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'https://www.partitionwizard.com/images/tu201609/blue-screen-error-during-windows-10-upgrade-2.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'screen display'),    
        ]);
}

bot.dialog('laptopRestartIssue', 
function (session,args,next){
    //session.sendTyping();
var lap=session.message.text;
    session.send("Ram issue.\n"+"\n"+"\nOs issue.\n"+"\n"+"\nProcessor fan issue.\n"+"\n"+"\nMother board issue.\n"+"\n"+"\nDefected use device issue.");
session.beginDialog('/lricard',lap);
session.userData.number=lap;
},
function(session,results,lap)
{ }).triggerAction({
    matches: 'laptopRestartIssue'
});
bot.dialog('/lricard',
[   function(session,lap)
{ avg=lap;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardlaptop(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardlaptop(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Laptop')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'http://www.qbonk.org/wp-content/uploads/2014/04/Laptop-Restart-Sendiri.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Laptop Restart'),    
        ]);
}

bot.dialog('hardDriveIssue', 
function (session,args,next){
    //session.sendTyping();
    var hdd=session.message.text;
    session.send("Hard drive cable issue.\n"+"\n"+"\nHard disk bad sector issue.\n"+"\n"+"\nFirmware or manufacturer fault.\n"+"\n"+"\nHeat issue.\n"+"\n"+"\nCorrupted file.");
session.beginDialog('/drivecard',hdd);
session.userData.number=hdd;
},
function(session,results,hdd)
{ }).triggerAction({
    matches: 'hardDriveIssue'
});
bot.dialog('/drivecard',
[   function(session,hdd)
{ avg=hdd;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCarddrive(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCarddrive(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Hard Drive')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'https://s3-ap-southeast-2.amazonaws.com/wc-prod-pim/JPEG_300x300/TOPRE1TBDG_.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Hard DRive Issue'),    
        ]);
}

bot.dialog('connectionInterruptionInVDI', 
function (session,args,next){
    //session.sendTyping();
 var cii=session.message.text;
    session.send("Local lan connectivity issue.\n"+"\n"+"\nIf the server is out of the location means check the internet connection.\n"+"\n"+"\nIf the vdi server is reachable or not?.\n"+"\n"+"\nNetworking port hanging issue.\n"+"\n"+"\nWhat version of Citrix Receiver do you have on the end-point?");
session.beginDialog('/conncard',cii);
session.userData.number=cii;
},
function(session,results,cii)
{}).triggerAction({
    matches: 'connectionInterruptionInVDI'
});
bot.dialog('/conncard',
[   function(session,cii)
{ avg=cii;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardinter(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardinter(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Connection')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'https://i.ytimg.com/vi/4bnEeKVeDNQ/hqdefault.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Conn Interruption'),    
        ]);
}

bot.dialog('internetExplorerNotResponding', 
function (session,args,next){
    //session.sendTyping();
    var iex=session.message.text;
    session.send("Update the available updates of IE.\n"+"\n"+"\nKeep your antivirus program consistently updated.\n"+"\n"+"\nDelete your Temporary Internet Files.\n"+"\n"+"\nRemove unnecessary add-ons.\n"+"\n"+"\nReset your browser.");
session.beginDialog('/internetecard',iex);
session.userData.number=iex;
},
function(session,results,iex)
{}).triggerAction({
    matches: 'internetExplorerNotResponding'
});
bot.dialog('/internetecard',
[   function(session,iex)
{ avg=iex;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardexp(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardexp(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Internet')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'https://screenshots.en.sftcdn.net/en/scrn/318000/318673/internet-explorer-10-for-windows-7-16-535x535.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Explorer issues'),    
        ]);
}

bot.dialog('sharingFolderNotOpening', 
function (session,args,next){
    //session.sendTyping();
    var sf=session.message.text;
    session.send("We have to check the folder sharing permission.\n"+"\n"+"\nUser account locked.\n"+"\n"+"\nFile server is reachable to user or not.\n"+"\n"+"\nSharing connectivity issue.\n"+"\n"+"\nFolder Security permission");
session.beginDialog('/folderscard',sf);
session.userData.number=sf;
},
function(session,results,sf)
{}).triggerAction({
    matches: 'sharingFolderNotOpening'
});
bot.dialog('/folderscard',
[   function(session,sf)
{ avg=sf;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
   else if(sc==='yes')
    {
         var card = createHeroCardshare(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardshare(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Sharing folder')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'http://1.bp.blogspot.com/-W_WpcAdhgno/VYQajrz4a7I/AAAAAAAAAQI/P2tMoO8c78w/s1600/share1.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Sharing Folder'),    
        ]);
}

bot.dialog('solveNetworkSlowness', 
function (session,args,next){
    //session.sendTyping();
     var ns=session.message.text;
    session.send("Check the nic card.\n"+"\n"+"\nFailing the switches or router.\n"+"\n"+"\n Virus infected.\n"+"\n"+"\nIpconflict issue.\n"+"\n"+"\nApplication server issue or browser  issue.\n"+"\n"+"\n");
session.beginDialog('/foldercard',ns);
session.userData.number=ns;
},
function(session,results,ns)
{}).triggerAction({
    matches: 'solveNetworkSlowness'
});
bot.dialog('/foldercard',
[   function(session,ns)
{ avg=ns;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardslow(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardslow(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Network')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'https://mexicoinstitute.files.wordpress.com/2013/08/people-network.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Slow network'),    
        ]);
}

bot.dialog('excelNotResponding', 
function (session,args,next){
    //session.sendTyping();
   var enr=session.message.text;
    session.send("Install the latest updates.\n"+"\n"+"\nCheck to make sure Excel is not in use by another process.\n"+"\n"+"\nInvestigate possible issues with add-ins.\n"+"\n"+"\nRepair your Office programs.\n"+"\n"+"\nCheck to see if your antivirus software is up-to-date or conflicting with Excel.");
session.beginDialog('/exccard',enr);
session.userData.number=enr;
},
function(session,results,enr)
{}).triggerAction({
    matches: 'excelNotResponding'
});
bot.dialog('/exccard',
[   function(session,enr)
{ avg=enr;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardexcel(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardexcel(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Excel')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'https://www.activia.co.uk/imageFiles/courses1/microsoft-excel-03.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Excel Response'),    
        ]);
}

bot.dialog('solveCameraLiveStreamingIssue', 
function (session,args,next){
    //session.sendTyping();
    var cam=session.message.text;
    session.send("Antivirus is blocking.\n"+"\n"+"\nLan connectivity issue.Network port hanging.\n"+"\n"+"\nFlash player is not working.\n"+"\n"+"\nBrowser issue or application issue.");
session.beginDialog('/camecard',cam);
session.userData.number=cam;
},
function(session,results,cam)
{}).triggerAction({
    matches: 'solveCameraLiveStreamingIssue'
});
bot.dialog('/camecard',
[   function(session,cam)
{ avg=cam;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardcame(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardcame(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Camera')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'https://webcamtoy.com/assets/images/icon-200.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Cam help'),    
        ]);
}

bot.dialog('solveServerSlownessIssue', 
function (session,args,next){
    //session.sendTyping();
    var sers=session.message.text;
    session.send("Low disk space.\n"+"\n"+"\nVirus infected.\n"+"\n"+"\nBad sectors in hard disk.\n"+"\n"+"\nOs issue.\n"+"\n"+"\nProcessor fan issue");
session.beginDialog('/sscard',sers);
session.userData.number=sers;
},
function(session,results,sers)
{
}).triggerAction({
    matches: 'solveServerSlownessIssue'
});
bot.dialog('/sscard',
[   function(session,sers)
{ avg=sers;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardserver(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardserver(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Server')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'https://graphiclineweb.files.wordpress.com/2012/09/slow-server-blues.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Server Slow'),    
        ]);
}

bot.dialog('solveRaidFailures', 
function (session,args,next){
    //session.sendTyping();
     var rai=session.message.text;
    session.send("Raid rebuild error or volume reconstruction problem.\n"+"\n"+"\nWrong replacement of good disk element belonging to a working raid volume.\n"+"\n"+"\nLoss of RAID disk access after system or application upgrade.\n"+"\n"+"\nLoss of RAID configuration settings or system registry.\n"+"\n"+"\nMalfunctioned Controller");
session.beginDialog('/rcard',rai);
session.userData.number=rai;
},
function(session,results,rai)
{}).triggerAction({
    matches: 'solveRaidFailures'
});
bot.dialog('/rcard',
[   function(session,rai)
{ avg=rai;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardraid(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardraid(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Raid')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'http://www.raidnetwork.org/sites/default/files/images/RAID-logo-small.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Raid Failure'),    
        ]);
}

bot.dialog('systemShowingLowDiskSpacePopup', 
function (session,args,next){
    //session.sendTyping();
 var lowd=session.message.text;
    session.send("1.Double click on My Computer icon and select the C: drive.\n"+"\n"+"\n2.Right Click on the C: and select properties.\n"+"\n"+"\n3.In the General Tab, Select the Disk Cleanup. Let the tool scan for the files.\n"+"\n"+"\n4.Select all the checkboxes in the window opened and then Select Ok.\n"+"\n"+"\n5.Let System Run the Deletion of Junk files. After the same, please see that the Pop-up is not appearing.\n"+"\n"+"\n");
session.beginDialog('/lowdiskcard',lowd);
session.userData.number=lowd;
},
function(session,results,lowd)
{}).triggerAction({
    matches: 'systemShowingLowDiskSpacePopup'
});
bot.dialog('/lowdiskcard',
[   function(session,lowd)
{ avg=lowd;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCarddiskspace(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCarddiskspace(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Disk Space')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'http://www.disk-partition.com/windows-10/images/low-disk-space-windows-10/low-disk-sapce.gif')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Low disk space'),    
        ]);
}

bot.dialog('printerShowingOffline', 
function (session,args,next){
    //session.sendTyping();
   var off=session.message.text;
    session.send("1.Go to System settings and then Select the Control Panel.\n"+"\n"+"\n2.Select the printer in the Devices and Printers of Control Panel.\n"+"\n"+"\n3.Right click on the printer and bring it online.\n"+"\n"+"\n4.Check whether the printer is powered on or not.\n"+"\n"+"\n5.Check whether LAN Cable or USB Cable is connected properly. If still the problem is persisting, Raise the Ticket in Service Desk for Engineer addressing the complaint.\n"+"\n"+"\n");
session.beginDialog('/offlinecard',off);
session.userData.number=off;
},
function(session,results,off)
{}).triggerAction({
    matches: 'printerShowingOffline'
});
bot.dialog('/offlinecard',
[   function(session,off)
{ avg=off;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardoffline(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardoffline(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Printer offline')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'http://www.brainchamber.com/wp-content/uploads/2016/03/printer-printer-error-printer-offline-printing-error1.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Offline'),    
        ]);
}

bot.dialog('solveSystemSlowness', 
function (session,args,next){
    //session.sendTyping();
     var sysl=session.message.text;
    session.send("1.Check whether any unused applications are running in the desktop. Close them if not being used.\n"+"\n"+"\n2.	Open My Computer and Right click on the C:\n"+"\n"+"\n3.	Select the Properties tab and Select the option 'Clean System Files'.\n"+"\n"+"\n4.	Let the option clean the system files.\n"+"\n"+"\n5.	Restart the computer and see the performance. If problem is still persisting, raise the tickect in service desk. \n"+"\n"+"\n");
session.beginDialog('/slowcard',sysl);
session.userData.number=sysl;
},
function(session,results,sysl)
{}).triggerAction({
    matches: 'solveSystemSlowness'
});
bot.dialog('/slowcard',
[   function(session,sysl)
{ avg=sysl;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardsysl(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardsysl(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('System')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'https://media.licdn.com/mpr/mpr/AAEAAQAAAAAAAAJfAAAAJDJlYjVmZDVmLTU5NzAtNGJjMC1hMGQxLTFhYmI5MjI5MzZkYw.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Slow System'),    
        ]);
}

bot.dialog('solveUserLockedWhileLoginIssue', 
function (session,args,next){
    //session.sendTyping();
    var lg=session.message.text;
    session.send("1. Please approach any other near by system in the office and open the internet explorer. Ensure that the PSPD portal is opening in the Internet Explorer.\n"+"\n"+"\n2.	Select the ADS Password  Reset / Unlock option available in the PSPD Portal.\n"+"\n"+"\n3.	Provide the details being asked in the option and select the Unlock Account.\n"+"\n"+"\n4.	Now login in to your system with your id. \n"+"\n"+"\n5.	If still not able to login to your PC. Call Service desk and provide them your User ID for unlocking.\n"+"\n"+"\n ");
session.beginDialog('/issuecard',lg);
session.userData.number=lg;
},
function(session,results,lg)
{}).triggerAction({
    matches: 'solveUserLockedWhileLoginIssue'
});
bot.dialog('/issuecard',
[   function(session,lg)
{ avg=lg;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardus(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardus(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('User')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'https://cdn2.iconfinder.com/data/icons/security-2-1/512/user_lock-512.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'User locked'),    
        ]);
}

bot.dialog('solveSapIdLockedIssue', 
function (session,args,next){
    //session.sendTyping();
     var lcki=session.message.text;
    session.send("1.	Please open your internet explorer browser and ensure that PSPD portal is opened up.\n"+"\n"+"\n2.	Select the option SAP Password reset / Unlock.\n"+"\n"+"\n3.	Select the appropriate option shown in the internet explorer for SAP Password Reset or SAP Unlock your ID.\n"+"\n"+"\n 4.	Provide the SAP User ID and select the option for Password reset or Unlock.\n"+"\n"+"\n5.	If still not able to login to SAP. Raise the ticket in service desk.\n"+"\n"+"\n");
session.beginDialog('/sapidcard',lcki);
session.userData.number=lcki;
},
function(session,results,lcki)
{}).triggerAction({
    matches: 'solveSapIdLockedIssue'
});
bot.dialog('/sapidcard',
[   function(session,lcki)
{ avg=lcki;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardsapid(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardsapid(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Sap')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'https://cdn2.iconfinder.com/data/icons/security-2-1/512/user_lock-512.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'SAP ID LOCKED'),    
        ]);
}

bot.dialog('solveFH4ConvWeightNotTransferredIssue', 
function (session,args,next){
    //session.sendTyping();
    var fcw=session.message.text;
    session.send("1.	Ensure that EAD Device is running.\n"+"\n"+"\n2.	Check whether EAD Device is connected to Network or not.\n"+"\n"+"\n3.	Check whether EAD device is able to communicate to  weight scale,\n"+"\n"+"\n4.	Raise the ticket in service Desk.\n"+"\n"+"\n");
session.beginDialog('/fcwcard',fcw);
session.userData.number=fcw;
},
function(session,results,fcw)
{}).triggerAction({
    matches: 'solveFH4ConvWeightNotTransferredIssue'
});
bot.dialog('/fcwcard',
[   function(session,fcw)
{ avg=fcw;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardfcw(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardfcw(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('FH4')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'http://www.fallsafetysolutions.com/fallsafetysolutions_com/bank/pageimages/weight_icon.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'FH4 Convoy'),    
        ]);
}

bot.dialog('solveFH4Conv6BarcodeScanningIssue', 
function (session,args,next){
    //session.sendTyping();
    var fcb=session.message.text;
    session.send("1	Check whether the Lable Barcode print is proper or not.\n"+"\n"+"\n2.	Check whether the Lable is placed properly.\n"+"\n"+"\n3.	Confirm on the functioning of EAD Device.\n"+"\n"+"\n4.	If not, Check whether Network is Coming to EAD Device.\n"+"\n"+"\n5.	Confirm there is Communication between EAD and Barcode scanner.\n"+"\n"+"\n6.	Raise the ticket in Service desk if still the problem is not resolved.\n"+"\n"+"\n ");
session.beginDialog('/fcbcard',fcb);
session.userData.number=fcb;
},
function(session,results,fcb)
{}).triggerAction({
    matches: 'solveFH4Conv6BarcodeScanningIssue'
});
bot.dialog('/fcbcard',
[   function(session,fcb)
{ avg=fcb;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardfcb(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardfcb(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Barcode Scan')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'http://iplusstd.com/item/eventBookingPro/example/wp-content/uploads/2014/11/barcode.gif')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Bar code scan issue'),    
        ]);
}

bot.dialog('unableToPrintFromSystem', 
function (session,args,next){
    //session.sendTyping();
      var pfs=session.message.text;
    session.send("1.	Check whether the printer selected while printing from system is correct or not.\n"+"\n"+"\n 2.	Check whether the printer is powered on or not. If not powered on. Please power on the same. \n"+"\n"+"\n3.	Check whether USB Cable or the LAN Cable is connected properly or not.\n"+"\n"+"\n4.	Make sure the printer is showing Ready status in the Devices and printers in the control panel of the system settings option. \n"+"\n"+"\n5.	Raise the ticket in service desk for engineer addressing and resolving the problem.\n"+"\n"+"\n ");
session.beginDialog('/pfscard',pfs);
session.userData.number=pfs;
},
function(session,results,pfs)
{}).triggerAction({
    matches: 'unableToPrintFromSystem'
});
bot.dialog('/pfscard',
[   function(session,pfs)
{ avg=pfs;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardpfs(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardpfs(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Print')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'http://couponchristine.com/wp-content/uploads/2013/02/printing-prob.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Print problem'),    
        ]);
}

bot.dialog('noDisplayOnMonitor', 
function (session,args,next){
    //session.sendTyping();
    var dom=session.message.text;
    session.send("1.	Ensure that the Monitor is powered on.\n"+"\n"+"\n2.	Check whether the cable from System and Power cable for monitor is plugged properly.\n"+"\n"+"\n3.	Ensure that the System is powered on and the LED's on the keyboard such as Num Lock and Caps Lock are blinking upon selecting the Num Lock on and Caps Lock on Button. \n"+"\n"+"\n4.	Press Ctrl+Alt+Del for System to Show the Task Manager screen. \n"+"\n"+"\n5.	If still the display is not appearing on the screen. Please raise the ticket in service desk for engineer to address the complaint.\n"+"\n"+"\n");
session.beginDialog('/domcard',dom);
session.userData.number=dom;
},
function(session,results,dom)
{}).triggerAction({
    matches: 'noDisplayOnMonitor'
});
bot.dialog('/domcard',
[   function(session,dom)
{ avg=dom;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCarddom(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCarddom(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Monitor')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'http://4.bp.blogspot.com/-yrzKRtrOz80/Utt8Lj_mAYI/AAAAAAAAAIU/JclV4Xyzvyo/s1600/download.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'diplay on monitor'),    
        ]);
}

bot.dialog('keyboardNotWorkingIssue', 
function (session,args,next){
    //session.sendTyping();
    var knw=session.message.text;
    session.send("1.	Check whether the power to Keyboard is coming or not by pressing the Num Lock and Caps Lock buttons for LED's to glow.\n"+"\n"+"\n2.	Check whether the Keyboard cable is connected properly to system.\n"+"\n"+"\n3.	Restart the system using mouse after reconnecting the keyboard cable properly.\n"+"\n"+"\n 4.	If still Keyboard is not working. Raise the ticket in service desk .\n"+"\n"+"\n");
session.beginDialog('/knwcard',knw);
session.userData.number=knw;
},
function(session,results,knw)
{}).triggerAction({
    matches: 'keyboardNotWorkingIssue'
});
bot.dialog('/knwcard',
[   function(session,knw)
{ avg=knw;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardknw(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardknw(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Keyboard')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'https://htse.kapilarya.com/FIX-Keyboard-Windows-Key-Not-Working-In-Windows.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Keyboard solutions'),    
        ]);
}

bot.dialog('systemStartingSlowly', 
function (session,args,next){
    //session.sendTyping();
      var sss=session.message.text;
    session.send("1.	Please wait for system to login. Once the system is logged in. Press Windows button along with the R key.\n"+"\n"+"\n 2.	Type the string  'msconfig' in the run prompt and press enter. \n"+"\n"+"\n3.	Select the Startup tab in the console screen opened. \n"+"\n"+"\n4.	Disable the unwanted applications from startup tab and restart the computer once.\n"+"\n"+"\n 5.	If still the problem is not solved. Please raise the ticket in service desk for addressing the problem.\n"+"\n"+"\n");
session.beginDialog('/knwcard',sss);
session.userData.number=sss;
},
function(session,results,sss)
{}).triggerAction({
    matches: 'systemStartingSlowly'
});
bot.dialog('/ssscard',
[   function(session,sss)
{ avg=sss;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardsss(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardsss(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('System')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'https://www-03.ibm.com/systems/ae/resources/system_storage_flashsystem-powering-thumbnail_700x300.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Slow System'),    
        ]);
}

bot.dialog('lotusNotesEmailAsAttachment', function (session,arg){
    //session.sendTyping();
      var lnea=session.message.text;
    session.send("1.	Close the email and re-open for twice or thrice.\n"+"\n"+"\n 2.	If getting opened. Its Ok.\n"+"\n"+"\n3.	Else, raise the ticket in Service desk.\n"+"\n"+"\n4.	FMS team will inturn raise the ticket to corporate and resolve the problem.\n"+"\n"+"\n5.	After seeing the update in Service Desk, please check whether you are able to open the email or not. If not getting done. Reply in service desk about the problem.\n"+"\n"+"\n");
session.beginDialog('/lneacard',lnea);
session.userData.number=lnea;
},
function(session,results,lnea)
{}).triggerAction({
    matches: 'lotusNotesEmailAsAttachment'
});
bot.dialog('/lneacard',
[   function(session,lnea)
{ avg=lnea;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardlnea(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardlnea(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Lotus Notes')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'http://litmuswww.s3.amazonaws.com/community/learning-center/lotus-notes-icon.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Email'),    
        ]);
}

bot.dialog('dristiNotOpening', 
function (session,args,next){
    //session.sendTyping();
    var dris=session.message.text;
    session.send("1.	Check Flash player is installed in the PC or not by searching in Windows Search assistant.\n"+"\n"+"\n 2.	If not installed. Raise the ticket in Servicedesk for installing the same mentioning the purpose. \n"+"\n"+"\n3.	After installation of the Flash player, check whether you are able to open the dristi or not. Enter the user name and password to login.\n"+"\n"+"\n4.	If not able to login and work. Please update in service desk once again about the problem in your ticket.\n"+"\n"+"\n");
session.beginDialog('/driscard',dris);
session.userData.number=dris;
},
function(session,results,dris)
{}).triggerAction({
    matches: 'dristiNotOpening'
});
bot.dialog('/driscard',
[   function(session,dris)
{ avg=dris;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCarddris(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCarddris(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('Drishti')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'https://media.glassdoor.com/sqll/581702/drishti-soft-solutions-squarelogo-1383305916035.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Drishti not opening'),    
        ]);
}

bot.dialog('systemNotPoweredOn', 
function (session,args,next){
    //session.sendTyping();
    var snpo=session.message.text;
    session.send("1.	Ensure the power cable is plugged in properly.\n"+"\n"+"\n2.	Ensure the power to system is coming or not by confirming the same with Monitor power cable.\n"+"\n"+"\n 3.	Check whether the system power button is firmly available for pressing it gently to power on. \n"+"\n"+"\n4.	Check whether the system fan is running after power button is pressed.\n"+"\n"+"\n5.	If still not powered on. Raise the ticket in service desk for engineer to address.\n"+"\n"+"\n");
session.beginDialog('/snpocard',snpo);
session.userData.number=snpo;
},
function(session,results,snpo)
{}).triggerAction({
    matches: 'systemNotPoweredOn'
});
bot.dialog('/snpocard',
[   function(session,snpo)
{ avg=snpo;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardsnpo(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
 }
  ]);
 function createHeroCardsnpo(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('System')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'https://cdn0.iconfinder.com/data/icons/cosmo-symbols/40/switcher_2-128.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Power on'),    
        ]);
}

bot.dialog('systemGivingDisplayWithBiggerFonts', 
function (session,args,next){
    //session.sendTyping();
   var sgdb=session.message.text;
    session.send("1.	Select the Auto configuration button available on the monitor.\n"+"\n"+"\n2.	Go to the screen resolution settings in the Personalize options available by right clicking on the desktop.\n"+"\n"+"\n3.	Adjust the resolution to the desired and required level and select the keep changes options. \n"+"\n"+"\n4.	If problem is not resolved. Please approach service desk by raising a ticket.\n"+"\n"+"\n");
session.beginDialog('/sgdbcard',sgdb);
session.userData.number=sgdb;
},
function(session,results,snpo)
{}).triggerAction({
    matches: 'systemGivingDisplayWithBiggerFonts'
});
bot.dialog('/sgdbcard',
[   function(session,sgdb)
{ avg=sgdb;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardsgdb(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardsgdb(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('System')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'http://getandroid.ir/uploads/posts/2014-03/1394470654_big-font-change-font-size-icon.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Fonts'),    
        ]);
}

bot.dialog('systemDesktopScreenReversed', 
function (session,args,next){
    //session.sendTyping();
   var sdsr=session.message.text;
    session.send("1. Press the buttons Ctrl + Alt + Up arrow available on keyboard.\n"+"\n"+"\n2.	Screen should come to the normal position. If not done.\n"+"\n"+"\n3.	Raise ticket in service desk.\n"+"\n"+"\n");
session.beginDialog('/sdsrcard',sdsr);
session.userData.number=sdsr;
},
function(session,results,sdsr)
{}).triggerAction({
    matches: 'systemDesktopScreenReversed'
});
bot.dialog('/sdsrcard',
[   function(session,sdsr)
{ avg=sdsr;
    //session.send(avg);  
   builder.Prompts.choice(session,'Do you want to search the web?',options);   
session.message.text=avg;
 },
 function(session,results,avg)
{var sc = results.response.entity;
   //session.send(avg);
    if(sc==='no')
    {session.beginDialog('None');}
    else if(sc==='yes')
    {
         var card = createHeroCardsdsr(session,sc,session.message.text);
        // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);
   session.endDialog();   
}
else{
    session.send("I hope we were able to assist you.");
    session.endDialog();
}
 }
  ]);
 function createHeroCardsdsr(session,sc,s1) {
       return new builder.HeroCard(session)
        .title('System')
        .subtitle('Additional help')
        .text('In the mean time, while your engineer arrives feel free to access the google page')
        .images([
            builder.CardImage.create(session, 'http://i1-news.softpedia-static.com/images/news2/microsoft-confirms-desktop-screen-flashes-bug-in-windows-10-offers-fix-489872-2.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.co.in/#q='+session.userData.number+'&spf=1498190457709', 'Desktop Screen'),    
        ]);
}

bot.dialog('Bye', function (session,arg){
    //session.sendTyping();
    session.send("Bye.");
session.endDialog();
}).triggerAction({
    matches: 'Bye'
});

// Spell Check
if (process.env.IS_SPELL_CORRECTION_ENABLED === 'true') {
    bot.use({
        botbuilder: function (session, next) {
            spellService
                .getCorrectedText(session.message.text)
                .then(function (text) {
                    session.message.text = text;
                    next();
                })
                .catch(function (error) {
                    console.error(error);
                    next();
                });
        }
    });
}
//require('dotenv-extended').load();

//var builder = require('botbuilder'),
    fs = require('fs'),
    needle = require('needle'),
   // restify = require('restify'),
   // request = require('request'),
    url = require('url'),
    speechService = require('./speech_service.js');

//=========================================================
function hasAudioAttachment(session) {
    return session.message.attachments.length > 0 &&
        (session.message.attachments[0].contentType === 'audio/wav' ||
            session.message.attachments[0].contentType === 'application/octet-stream');
}

function getAudioStreamFromMessage(message) {
    var headers = {};
    var attachment = message.attachments[0];
    if (checkRequiresToken(message)) {
        // The Skype attachment URLs are secured by JwtToken,
        // you should set the JwtToken of your bot as the authorization header for the GET request your bot initiates to fetch the image.
        // https://github.com/Microsoft/BotBuilder/issues/662
        connector.getAccessToken(function (error, token) {
            var tok = token;
            headers['Authorization'] = 'Bearer ' + token;
            headers['Content-Type'] = 'application/octet-stream';

            return needle.get(attachment.contentUrl, { headers: headers });
        });
    }

    headers['Content-Type'] = attachment.contentType;
    return needle.get(attachment.contentUrl, { headers: headers });
}

function checkRequiresToken(message) {
    return message.source === 'skype' || message.source === 'msteams';
}

function processText(text) {
    var result = 'You said: ' + text + '.';

    if (text && text.length > 0) {
        var wordCount = text.split(' ').filter(function (x) { return x; }).length;
        result += '\n\nWord Count: ' + wordCount;

        var characterCount = text.replace(/ /g, '').length;
        result += '\n\nCharacter Count: ' + characterCount;

        var spaceCount = text.split(' ').length - 1;
        result += '\n\nSpace Count: ' + spaceCount;

        var m = text.match(/[aeiou]/gi);
        var vowelCount = m === null ? 0 : m.length;
        result += '\n\nVowel Count: ' + vowelCount;
    }

    return result;
}

//=========================================================
// Bots Events
//=========================================================

// Sends greeting message when the bot is first added to a conversation
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                var reply = new builder.Message()
                    .address(message.address)
                    //.text('Hi! I am SpeechToText Bot. I can understand the content of any audio and convert it to text. Try sending me a wav file.');
                bot.send(reply);
            }
        });
    }
});
