// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://trackingvent-b8da0.firebaseio.com'
});

var childUser=null;
var childPass=null;
var childTime=null;
var childStatus=null;
var childPO=null;
var username=null;
var password=null;
var currenttime=null;
var dep=null;

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function welcome(agent) {
    agent.add(`สวัสดีค่ะ`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  function monitor(agent) {
      username = request.body.queryResult.parameters.username;
      password = request.body.queryResult.parameters.password;
      currenttime = getDateTime();
     
      let objectPushlog = {
        user : username,
        pw 	 : password,
        time : currenttime
      };
      agent.add("รอบอทคิดก่อนนะ รอได้ไหม?");
    
      return writeLog('Logsmonitor',objectPushlog).then(response => {
        console.log('write success');
      }).catch (error => {
        console.log(error);
      });
  }
  
  function monitor_login(agent) {
    var LogsRef = admin.database().ref().child('StatusLogin');
  			LogsRef.on('value',function(snapshot){
    			snapshot.forEach(function(childSnapshot){
      				childUser = childSnapshot.val().user;
                  	childPass = childSnapshot.val().pw;
                  	childTime = childSnapshot.val().time;
                  	childStatus = childSnapshot.val().status;
                  	dep = childSnapshot.val().dep;
                  	if(username == childUser && password == childPass && currenttime == childTime){
                      	if(childStatus == 'success'){
          					agent.add("คุณ "+childUser+" กรุณากรอกรหัส PO ค่ะ");
        				}else agent.add("username หรือ password ไม่ถูกต้องกรุณาทำรายการใหม่อีกครั้ง");
                    }
    			});
  			});
  }

  function poIdQuery(agent) {
    	let po_id = request.body.queryResult.parameters.perchaseid;
    	//agent.add(po_id);
    	let objectPushlog = {
        	user : username,
        	pw 	 : password,
        	time : currenttime,
        	poid : po_id,
      		dep  : dep
     	};
    
  		agent.add("รอบอทคิดก่อนนะ รอได้ไหม?");
    
    	return writeLog('LogsPoid',objectPushlog).then(response => {
        	console.log('write success');
      	}).catch (error => {
        	console.log(error);
      	});
  }
  
  function poIdResponse(agent){
        var LogsRef = admin.database().ref().child('StatusPO');
  			LogsRef.on('value',function(snapshot){
    			snapshot.forEach(function(childSnapshot){
      				childUser = childSnapshot.val().user;
                  	childPass = childSnapshot.val().pw;
                  	childTime = childSnapshot.val().time;
                  	childPO = childSnapshot.val().percent;
    			});
  			});
    	if(username == childUser && password == childPass && currenttime == childTime && childPO!==null){
          agent.add("ทำงานเสร็จสิ้นไป "+childPO+"%");
        }else agent.add("เกิดข้อผิดพลาด กรุณาทำรายการใหม่อีกครั้งค่ะ");
  }
  
  function manager(agent){
  	  	username = request.body.queryResult.parameters.username;
      	password = request.body.queryResult.parameters.password;
      	currenttime = getDateTime();
     
      	let objectPushlog = {
        	user : username,
        	pw 	 : password,
        	time : currenttime
      	};
     	
      	agent.add("รอบอทคิดก่อนนะ รอได้ไหม?");
    
        return writeLog('LogsManager',objectPushlog).then(response => {
        	console.log('write success');
      	}).catch (error => {
        	console.log(error);
      	});
  }
  
  function manager_login(agent) {
    var LogsRef = admin.database().ref().child('StatusManager');
  			LogsRef.on('value',function(snapshot){
    			snapshot.forEach(function(childSnapshot){
      				childUser = childSnapshot.val().user;
                  	childPass = childSnapshot.val().pw;
                  	childTime = childSnapshot.val().time;
                  	childStatus = childSnapshot.val().status;
                  	dep = childSnapshot.val().dep;
                  	if(username == childUser && password == childPass && currenttime == childTime){
                      	if(childStatus == 'success'){
          					agent.add("คุณ "+childUser+" กรุณากรอกเดือนค่ะ 1-12");
        				}else agent.add("username หรือ password ไม่ถูกต้องกรุณาทำรายการใหม่อีกครั้ง");
                    }
    			});
  			});
  }
  
  function manager_kpi(agent){
  		let month = request.body.queryResult.parameters.month;
      	let objectPushlog = {
        	user : username,
        	pw 	 : password,
        	time : currenttime,
          	month : month
      	};
    
    	agent.add("รอบอทคิดก่อนนะ รอได้ไหม?");
    
        return writeLog('LogsKPI',objectPushlog).then(response => {
        	console.log('write success');
      	}).catch (error => {
        	console.log(error);
      	});
    
  }
  
  function manager_showkpi(agent){
        var LogsRef = admin.database().ref().child('StatusPO');
  			LogsRef.on('value',function(snapshot){
    			snapshot.forEach(function(childSnapshot){
      				childUser = childSnapshot.val().user;
                  	childPass = childSnapshot.val().pw;
                  	childTime = childSnapshot.val().time;
                  	childPO = childSnapshot.val().percent;
    			});
  			});
    	if(username == childUser && password == childPass && currenttime == childTime && childStatus!==null){
          agent.add("ทำงานเสร็จสิ้นไป "+childStatus+"งาน/เดือน");
        }else agent.add("เกิดข้อผิดพลาด กรุณาทำรายการใหม่อีกครั้งค่ะ");
  }
  
  function qc(agent){
  	  	username = request.body.queryResult.parameters.username;
      	password = request.body.queryResult.parameters.password;
      	currenttime = getDateTime();
     
      	let objectPushlog = {
        	user : username,
        	pw 	 : password,
        	time : currenttime
      	};
      	agent.add("รอบอทคิดก่อนนะ รอได้ไหม?");
    
       	return writeLog('LogsQC',objectPushlog).then(response => {
        	console.log('write success');
      	}).catch (error => {
        	console.log(error);
      	});
  }
  
  function qc_login(agent){
    var LogsRef = admin.database().ref().child('StatusQC');
  			LogsRef.on('value',function(snapshot){
    			snapshot.forEach(function(childSnapshot){
      				childUser = childSnapshot.val().user;
                  	childPass = childSnapshot.val().pw;
                  	childTime = childSnapshot.val().time;
                  	childStatus = childSnapshot.val().status;
                  	dep = childSnapshot.val().dep;
                  	if(username == childUser && password == childPass && currenttime == childTime){
                      	if(childStatus == 'success'){
          					agent.add("คุณ "+childUser+" กรุณาส่ง QR Code ค่ะ");
        				}else agent.add("username หรือ password ไม่ถูกต้องกรุณาทำรายการใหม่อีกครั้ง");
                    }
    			});
  			});
  }
  
  function writeLog(ref,objectPushlog){
      return admin.database().ref(ref).push(objectPushlog).then((snapshot) => {
      	console.log('database write sucessful: ' + snapshot.ref.toString());
      });
  }
  
  function test(agent) {
	var LogsRef = admin.database().ref().child('StatusPO');
  			LogsRef.on('value',function(snapshot){
    			snapshot.forEach(function(childSnapshot){
      				childUser = childSnapshot.val().user;
                  	childPass = childSnapshot.val().pw;
                  	childTime = childSnapshot.val().time;
                  	childPO = childSnapshot.val().percent;
    			});
  			});
    	agent.add("ทำงานเสร็จสิ้นไป "+childPO+"%");
    	agent.add("ได้อยู่");
  }
  
  function getDateTime() {
    var date = new Date();
    var hour = parseInt(date.getHours())+7;
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = parseInt(date.getDate());
    if(hour > 24){
      hour-=24;
      day+=1;
    }
    day = (day < 10 ? "0" : "") + day;
    return day + "/" + month + "/" + year + "/" + hour + ":" + min + ":" + sec;
  }
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Monitor - custom - yes', monitor);
  intentMap.set('Monitor - custom - yes - custom', monitor_login);
  intentMap.set('Monitor - custom - yes - custom - custom - yes', poIdQuery);
  intentMap.set('Monitor - custom - yes - custom - custom - yes - custom', poIdResponse);
  intentMap.set('Manager - custom - yes', manager);
  intentMap.set('Manager - custom - yes - custom', manager_login);
  intentMap.set('Manager - custom - yes - custom - custom - yes', manager_kpi);
  intentMap.set('Manager - custom - yes - custom - custom - yes - custom', manager_showkpi);
  intentMap.set('QC - custom - yes', qc);
  intentMap.set('QC - custom - yes - custom', qc_login);
  intentMap.set('Test', test);
  agent.handleRequest(intentMap);
});
