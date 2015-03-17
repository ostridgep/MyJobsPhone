var objtype="";	
var objid="";	
var objshorttext="";	
var objaddress="";	
var objswerk="";		

var SAPServerPrefix="";
var SAPServerSuffix="";	

var parTrace= "ON";
var syncDetsSet=false;
var demoDataLoaded=0;
var syncTransactionalDetsUpdated=false;
var syncReferenceDetsUpdated=false;
function sendSMS(to, message)
{
    $.post("https://sms.cginotify.com/api/SMS/Send",{ LicenseKey: "hmJks0HcfKplAP2i4vuVrXxThFbj4JYfHmRRB1Dw", PhoneNumbers: to, Message : message}, function(data, status){
       // alert("Data: " + data + "\nStatus: " + status);
    });
}
function convertDate(dt){
var fdt="";
	fdt = dt.substring(0,4)+"-"+dt.substring(4,6)+"-"+dt.substring(6,9)+dt.substring(9,11)+":"+dt.substring(11,13);

return fdt;
}

function requestSAPData(page,params){

	opMessage(SAPServerPrefix+page+params);
	var myurl=SAPServerPrefix+page+params;

  $.getJSON(myurl);
  
}
function sendSAPData(page){
	opMessage(page);

   $.getJSON(page);
}

function opMessage(msg){



	opLog(msg);


}
function prepLogMessage(msg){

nowd=getDate();
nowt=getTime();
dtstamp=nowd+nowt;


return('INSERT INTO LogFile (datestamp , type, message ) VALUES ("'+dtstamp+'","I","'+ msg+'")');

}
function opLog(msg){

nowd=getDate();
nowt=getTime();
dtstamp=nowd+nowt;


var sqlstatement='INSERT INTO LogFile (datestamp , type, message ) VALUES ("'+dtstamp+'","I","'+ msg+'");';
	if (localStorage.Trace=='ON'){
		html5sql.process(sqlstatement,
						 function(){
							 //alert("Success Creating Tables");
						 },
						 function(error, statement){
							 window.console&&console.log("Error: " + error.message + " when processing " + statement);
						 }        
				);

	}
}
function getTraceState(){
traceState="OFF";
xtraceState="";
	html5sql.process(
		["SELECT * from MyWorkConfig where paramname = 'TRACE'"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				traceState= rowsArray[0].paramvalue;
				}
			localStorage.setItem('Trace',traceState);
			$('#traceState').val(traceState); 	
			$('#traceState').selectmenu('refresh', true);

		},
		 function(error, statement){
			 window.console&&console.log("Error: " + error.message + " when processing " + statement);
		 }   
	);
}	
function databaseExists(){

	html5sql.process(
		["SELECT * FROM sqlite_master WHERE type='table';"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 10) {
				//alert("Database Existsh");
				return(true);
				}
			//alert("Database does not exist")
			return(false);

		},
		 function(error, statement){
			 window.console&&console.log("Error: " + error.message + " when processing " + statement);
			 return(false);
		 }   
	);
	
}	
function SetLocalStorage(){

html5sql.process(
    ["SELECT * from MyWorkConfig "],
    function(transaction, results, rowsArray){
      for(var i = 0; i < rowsArray.length; i++){
        //each row in the rowsArray represents a row retrieved from the database

		if (rowsArray[i].paramname=='SERVERNAME'){
			localStorage.setItem('ServerName',rowsArray[i].paramvalue);
			
		}
		if (rowsArray[i].paramname=='SYNC_REFERENCE_FREQUENCY'){
			localStorage.setItem('SyncReferenceFrequency',rowsArray[i].paramvalue);
	
		}
		if (rowsArray[i].paramname=='SYNC_TRANSACTIONAL_FREQUENCY'){
			localStorage.setItem('SyncTransactionalFrequency',rowsArray[i].paramvalue);
		}
		if (rowsArray[i].paramname=='SYNC_UPLOAD_FREQUENCY'){
			localStorage.setItem('SyncUploadFrequency',rowsArray[i].paramvalue);
		}			

		if (rowsArray[i].paramname=='LASTSYNC_REFERENCE'){
			localStorage.setItem('LastSyncReference',rowsArray[i].paramvalue);
	
		}
		if (rowsArray[i].paramname=='LASTSYNC_TRANSACTIONAL'){
			localStorage.setItem('LastSyncTransactional',rowsArray[i].paramvalue);
		}
		if (rowsArray[i].paramname=='LASTSYNC_UPLOAD'){
			localStorage.setItem('LastSyncUpload',rowsArray[i].paramvalue);
	
		}			
		if (rowsArray[i].paramname=='TRACE'){
			localStorage.setItem('Trace',rowsArray[i].paramvalue);
	
		}	
      }
    },
    function(error, statement){
      //hande error here           
    }
);			
	
}



function GetConfigParam(paramName){

	html5sql.process(
		["SELECT * from MyWorkConfig where paramname = '"+paramName+"'"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				if (paramName == "TRACE"){
					parTrace=item['paramvalue'];
				}
				
			}
	

		},
		 function(error, statement){
			 window.console&&console.log("Error: " + error.message + " when processing " + statement);
		 }   
	);
}
function SetConfigParam(paramName, paramValue){

			if (paramName=='SERVERNAME'){
				localStorage.setItem('ServerName',paramValue);
			}
			if (paramName=='SYNC_REFERENCE_FREQUENCY'){			
				localStorage.setItem('SyncReferenceFrequency',paramValue);		
			}
			if (paramName=='SYNC_TRANSACTIONAL_FREQUENCY'){
				localStorage.setItem('SyncTransactionalFrequency',paramValue);		
			}
			if (paramName=='SYNC_UPLOAD_FREQUENCY'){
				localStorage.setItem('SyncUploadFrequency',paramValue);		
			}
			if (paramName=='LASTSYNC_REFERENCE'){
				localStorage.setItem('LastSyncReference',paramValue);
		
			}
			if (paramName=='LASTSYNC_TRANSACTIONAL'){
				localStorage.setItem('LastSyncTransactional',paramValue);
			}
			if (paramName=='LASTSYNC_UPLOAD'){
				localStorage.setItem('LastSyncUpload',paramValue);
		
			}
			if (paramName=='TRACE'){
				localStorage.setItem('Trace',paramValue);		
			}
			
	html5sql.process(
		["SELECT * from MyWorkConfig where paramname = '"+paramName+"'"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				sqlstatement="UPDATE MyWorkConfig SET paramvalue = '"+paramValue+"' WHERE paramname = '"+paramName+"';";
				}else{
				sqlstatement="INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('"+paramName+"','"+paramValue+"');";
				}
			html5sql.process(sqlstatement,
			 function(){
				 //alert("Success dropping Tables");
			 },
			 function(error, statement){
				opMessage("Error: " + error.message + " when SetConfigParam processing " + statement);
			 }        
			);
		},
		function(error, statement){
		 opMessage("Error: " + error.message + " when SetConfigParam processing " + statement);          
		}
	);
}		
function SetAllConfigParam(p1,v1,p2,v2,p3,v3,p4,v4,p5,v5){
	SetConfigParam(p1,v1);
	SetConfigParam(p2,v2);
	SetConfigParam(p3,v3);
	SetConfigParam(p4,v4);
	SetConfigParam(p5,v5);
}
//*************************************************************************************************************************
//
//  User Maintenance Functions
//
//*************************************************************************************************************************
function CreateUser(muser,vehiclereg, u, p, employeeid){
	
	opMessage("Creating User "+muser+":"+vehiclereg+":"+u+":"+p+":"+employeeid);

	html5sql.process("INSERT INTO MyUserDets (mobileuser , vehiclereg, user, password ,employeeid) VALUES ('"+muser+"','" +vehiclereg+"','" +u+"','" +p+"','" + employeeid+"');",
	 function(){
		//alert("User Created");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when drop processing " + statement);
	 }        
	);

}
function ChangeUserPW(muser, u, p){

	opMessage("Changing Password for User "+muser);
	html5sql.process("UPDATE MyUserDets set password = '"+p+"' Where user = '"+u+"';",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when drop processing " + statement);
	 }        
	);


}

function validateUser(u, p){
var wait = true;
var retVal= false;
	opMessage("Changing Password for User "+u);
	html5sql.process("SELECT * from MyUserDets where user = '"+u+"' and password =  '"+p+"'",
	 function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
			retval = true;
			wait = false;
			//alert("hh")
			}else{
			wait = false;
			}
		
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when drop processing " + statement);
		wait = false;
	 }        
	);
while(wait == true){
}
return(retVal);

}
function validateUserExists(u,p){

	opMessage("Checking for User "+u);
	html5sql.process("SELECT * from MyUserDets where user = '"+u+"' ",
	 function(transaction, results, rowsArray){
			if( rowsArray.length < 1) {
			return(2);
			}else if (rowsArray[0].password!=p){
			return(1);
			}else {
			return(0);
			}
		
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when drop processing " + statement);
		return(2);
	 }        
	);
return(2);

}
function CheckSyncInterval(SyncType){
	
	var dtNow=getDate()+getTime();
					if (SyncType=='REFERENCE'){
						lastSyncDT=localStorage.getItem('LastSyncReference');
						
						SyncInterval=localStorage.getItem('SyncReferenceFrequency');
					}
					if (SyncType=='TRANSACTIONAL'){
						lastSyncDT=localStorage.getItem('LastSyncTransactional');
						SyncInterval=localStorage.getItem('SyncTransactionalFrequency');
				
					}
					if (SyncType=='UPLOAD'){
						lastSyncDT=localStorage.getItem('LastSyncUpload');
						SyncInterval=localStorage.getItem('SyncUploadFrequency');
				
					}
					
	var diff = parseDate(dtNow) - parseDate(lastSyncDT);
	
	opMessage("Checking Sync Interval:");
	opMessage("--Type="+SyncType);
	opMessage("--Last Synced="+lastSyncDT);
	opMessage("--Iterval ="+SyncInterval);
	opMessage("--MS Since Last Sync="+diff);

	if (diff>SyncInterval){

		return true;
		}else{

		return false;
		}


}



function SetLastSyncDetails(paramName){
nowd=getDate();
nowt=getTime();
paramValue=nowd+nowt;
var sqlstatement="";
var lastsync=localStorage.getItem('LastSyncedDT')	;		
	if (paramName=='LASTSYNC_REFERENCE'){
		localStorage.setItem('LastSyncReference',paramValue);

	}
	if (paramName=='LASTSYNC_TRANSACTIONAL'){
		localStorage.setItem('LastSyncTransactional',paramValue);

	}
	if (paramName=='LASTSYNC_UPLOAD'){
		localStorage.setItem('LastSyncUpload',paramValue);

	}	
	if(paramValue>lastsync){
		localStorage.setItem('LastSyncedDT',paramValue);
	}
	html5sql.process(
		["SELECT * from MyWorkConfig where paramname = '"+paramName+"'"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				sqlstatement="UPDATE MyWorkConfig SET paramvalue = '"+paramValue+"' WHERE paramname = '"+paramName+"';";
				}else{
				sqlstatement="INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('"+paramName+"','"+paramValue+"');";
				}
			html5sql.process(sqlstatement,
			 function(){
				 //alert("Success dropping Tables");
			 },
			 function(error, statement){
				opMessage("Error: " + error.message + " when Last Sync Update processing " + statement);
			 }        
			);
		},
		function(error, statement){
		 opMessage("Error: " + error.message + " when Last Sync Update processing " + statement);          
		}
	);




}

function syncTransactional(){
var SAPServerSuffix="";

	if (!CheckSyncInterval('TRANSACTIONAL')){return; }
	opMessage("Synchronizing Transactional Data");

	html5sql.process(
		["SELECT * from MyUserDets"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				SAPServerSuffix="?jsonCallback=?&sap-client=700&sap-user="+rowsArray[0].user+"&sap-password="+rowsArray[0].password+"&username="+rowsArray[0].user;
				
				html5sql.process("SELECT * from MyWorkConfig where paramname = 'SERVERNAME'",
					function(transaction, results, rowsArray){
						if( rowsArray.length > 0) {
									SetLastSyncDetails("LASTSYNC_TRANSACTIONAL");
									localStorage.setItem('LastSyncTransactionalDetails','');
									syncTransactionalDetsUpdated=false;
									SAPServerPrefix=$.trim(rowsArray[0].paramvalue);
									requestSAPData("MyJobsOrders.htm",SAPServerSuffix);
									requestSAPData("MyJobsNotifications.htm",SAPServerSuffix);
									requestSAPData("MyJobsMessages.htm",SAPServerSuffix);
						 }
						 
					},
					function(error, statement){
						opMessage("Error: " + error.message + " when syncTransactional processing " + statement); 
					}
				);
			}
		},
		function(error, statement){
		 opMessage("Error: " + error.message + " when syncTransactional processing " + statement);          
		}
	);
	

	
	
	
	

}

function syncUpload(){
var SAPServerSuffix="";
var newDets="";
var currentUser="";
syncDetsSet=false;

sapCalls = 0;
	if (!CheckSyncInterval('UPLOAD')){return; }
	opMessage("Synchronizing Upload Data");
	
var syncDetails = false	;
	html5sql.process(
		["SELECT * from MyUserDets"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				curremtUser="&username="+rowsArray[0].user;
				SAPServerSuffix="?jsonCallback=?&sap-client=700&sap-user="+rowsArray[0].user+"&sap-password="+rowsArray[0].password;
// Process Vehicle Defects
				html5sql.process("SELECT * from MyNewJobs where state = 'VEHICLEDEFECT'",
					function(transaction, results, rowsArray){
						if( rowsArray.length > 0) {
							if (syncDetails){
								localStorage.setItem('LastSyncUploadDetails',localStorage.getItem('LastSyncUploadDetails')+", VehicleCheck:"+String(rowsArray.length));
							}else{
								syncDetails=true;
								localStorage.setItem('LastSyncUploadDetails',"VehicleCheck:"+String(rowsArray.length));
							}
							if(!syncDetsSet){
								syncDetsSet=true;
								SetLastSyncDetails("LASTSYNC_UPLOAD");
								
								}
							item = rowsArray[0];

							newDets='&TYPE='+item['type']+'&EQUIPMENT='+item['equipment']+'&STARTDATE='+item['date']+'&STARTTIME='+item['time']+'&SHORTTEXT='+item['shorttext']+'&LONGTEXT='+escape(item['longtext'])+'&ID='+item['id']+'&REPORTEDBY='+item['reportedby']+'&DEFECT='+item['defect']+'&MPOINT='+item['mpoint']+'&MPVAL='+item['mpval'];
							opMessage("NewJob Details="+newDets);
							SAPServerPrefix=$.trim(localStorage.getItem('ServerName'));
							sapCalls+=1;
							
							html5sql.process("UPDATE MyNewJobs SET state = 'SENDING' WHERE id='"+item['id']+"'",
									 function(){
										sendSAPData(SAPServerPrefix+"MyJobsCreateVehicleDefect.htm"+SAPServerSuffix+newDets);
									 },
									 function(error, statement){
										 
										 opMessage("Error: " + error.message + " when processing " + statement);
									 }        
							);
						 }
						 
					},
					function(error, statement){
						opMessage("Error: " + error.message + " when syncTransactional processing " + statement); 
					}
				);	
// Process New Notifications				
				html5sql.process("SELECT * from MyNotifications where notifno = 'NEW'",
					function(transaction, results, rowsArray){
						if( rowsArray.length > 0) {
							if (syncDetails){
								localStorage.setItem('LastSyncUploadDetails',localStorage.getItem('LastSyncUploadDetails')+", Notifications:"+String(rowsArray.length));
							}else{
								syncDetails=true;
								localStorage.setItem('LastSyncUploadDetails',"Notifications:"+String(rowsArray.length));
							}
							if(!syncDetsSet){
								syncDetsSet=true;
								SetLastSyncDetails("LASTSYNC_UPLOAD");
								
								}
							for (var n = 0; n < rowsArray.length; n++) {
								item = rowsArray[n];

								newDets='&TYPE='+item['type']+'&STARTDATE='+item['startdate'].substring(0,8)+'&STARTTIME='+item['startdate'].substring(9,13)+'&SHORTTEXT='+item['shorttext']+'&LONGTEXT='+item['longtext']+'&ID='+item['id'];
								newDets+='&CODE='+item['pcode']+'&GROUP='+item['pgroup']+'&EQUIPMENT='+item['equipment']+'&FUNCLOC='+item['funcloc']+'&REPORTEDBY='+item['reportedby'];
								opMessage("New Notifications Details="+newDets);
								SAPServerPrefix=$.trim(localStorage.getItem('ServerName'));
								sapCalls+=1;
								
								html5sql.process("UPDATE MyNotifications SET notifno = 'SENDING' WHERE id='"+item['id']+"'",
										 function(){
											sendSAPData(SAPServerPrefix+"MyJobsCreateNotification.htm"+SAPServerSuffix+newDets);
										 },
										 function(error, statement){
											 
											 opMessage("Error: " + error.message + " when processing " + statement);
										 }        
								);
							}
						 }
						 
					},
					function(error, statement){
						opMessage("Error: " + error.message + " when syncTransactional processing " + statement); 
					}
				);
// Process Time Confirmations
				html5sql.process("SELECT * from MyTimeConfs where confno = 'NEW'",
					function(transaction, results, rowsArray){
						if( rowsArray.length > 0) {
							if (syncDetails){
								localStorage.setItem('LastSyncUploadDetails',localStorage.getItem('LastSyncUploadDetails')+", TimeConfs:"+String(rowsArray.length));
							}else{
								syncDetails=true;
								localStorage.setItem('LastSyncUploadDetails',"TimeConfs:"+String(rowsArray.length));
							}
							for (var n = 0; n < rowsArray.length; n++) {
								item = rowsArray[n];
								if(item['final']=="Yes"){
									fconf="X";
								}else{
									fconf="";
								}									
								newDets='&ORDERNO='+item['orderno']+'&OPNO='+item['opno']+'&REASON='+item['description']+'&TIME='+item['duration']+'&USER='+item['user']+'&RECNO='+item['id']+'&SDATE='+item['date']+'&STIME='+item['time']+'&EDATE='+item['enddate']+'&ETIME='+item['endtime']+'&ACTIVITYTYPE='+item['type']+'&FINAL='+fconf;
								opMessage("NewTconf Details="+newDets);
								SAPServerPrefix=$.trim(localStorage.getItem('ServerName'));
								sapCalls+=1;
								
								html5sql.process("UPDATE MyTimeConfs SET confno = 'SENDING' WHERE id='"+item['id']+"'",
										 function(){
											sendSAPData(SAPServerPrefix+"MyJobsCreateTConf.htm"+SAPServerSuffix+newDets);
										 },
										 function(error, statement){
											 
											 opMessage("Error: " + error.message + " when processing " + statement);
										 }        
								);
							 }
						}
					},
					function(error, statement){
						opMessage("Error: " + error.message + " when syncTransactional processing " + statement); 
					}
				);	

// Process Status Updates				
				html5sql.process("SELECT * from MyStatus where state = 'NEW'",
					function(transaction, results, rowsArray){
						if( rowsArray.length > 0) {
							if (syncDetails){
								localStorage.setItem('LastSyncUploadDetails',localStorage.getItem('LastSyncUploadDetails')+", Status:"+String(rowsArray.length));
							}else{
								syncDetails=true;
								localStorage.setItem('LastSyncUploadDetails',"Status:"+String(rowsArray.length));
							}
							for (var n = 0; n < rowsArray.length; n++) {
								item = rowsArray[n];
								newDets='&ORDERNO='+item['orderno']+'&OPNO='+item['opno']+'&STATUS='+item['status']+'&STSMA='+item['stsma']+'&RECNO='+item['id'];
								opMessage("Newstatus Details="+newDets);
								SAPServerPrefix=$.trim(localStorage.getItem('ServerName'));		
								sapCalls+=1;							
								
								html5sql.process("UPDATE MyStatus SET state = 'SENDING' where id='"+item['id']+"'",
										 function(){
											sendSAPData(SAPServerPrefix+"MyJobsUpdateStatus.htm"+SAPServerSuffix+newDets);
										 },
										 function(error, statement){
											 
											 opMessage("Error: " + error.message + " when processing " + statement);
										 }        
								);
							}
						} 
					},
					function(error, statement){
						opMessage("Error: " + error.message + " when syncTransactional processing " + statement); 
					}
				);	
// Upload the Messages READ Indicator
				
				html5sql.process("SELECT * from MyMessages where state = 'READ'",
					function(transaction, results, rowsArray){
						
						opMessage("done READ Message Select");
						opMessage("READ Messages = "+rowsArray.length);
						if( rowsArray.length > 0) {
							if (syncDetails){
								localStorage.setItem('LastSyncUploadDetails',localStorage.getItem('LastSyncUploadDetails')+", Read Messages:"+String(rowsArray.length));
							}else{
								syncDetails=true;
								localStorage.setItem('LastSyncUploadDetails',"Read Messages:"+String(rowsArray.length));
							}
							if(!syncDetsSet){
								syncDetsSet=true;
								SetLastSyncDetails("LASTSYNC_UPLOAD");
								
								}

							item = rowsArray[0];

							newDets='&ID='+item['id']+'&DOCID='+item['msgid'];
							opMessage("READ Status= "+newDets);
							SAPServerPrefix=$.trim(localStorage.getItem('ServerName'));
							
							html5sql.process("UPDATE MyMessages SET state = 'SENDING' WHERE id='"+item['id']+"'",
									 function(){
									sendSAPData(SAPServerPrefix+"MyJobsMessageSetReadFlag.htm"+SAPServerSuffix+newDets);
									 },
									 function(error, statement){
										 
										 opMessage("Error: " + error.message + " when processing " + statement);
									 }        
							);	
						 }
						 
					},
					function(error, statement){
						opMessage("Error: " + error.message + " when syncTransactional processing " + statement); 
					}
				);				
// Upload the NEW Sent Messages
			
				html5sql.process("SELECT * from MyMessages where state = 'NEW'",
					function(transaction, results, rowsArray){
					
						opMessage("done SEND Message Select");
						opMessage("SEND Messages = "+rowsArray.length);
						if( rowsArray.length > 0) {
							if (syncDetails){
								localStorage.setItem('LastSyncUploadDetails',localStorage.getItem('LastSyncUploadDetails')+", Messages:"+String(rowsArray.length));
							}else{
								syncDetails=true;
								localStorage.setItem('LastSyncUploadDetails',"Messages:"+String(rowsArray.length));
							}
							if(!syncDetsSet){
								syncDetsSet=true;
								SetLastSyncDetails("LASTSYNC_UPLOAD");
								sapCalls+=1;
								}

							item = rowsArray[0];

							newDets='&ID='+item['id']+'&TO='+item['msgtoid']+'&SUBJECT='+item['msgsubject']+'&CONTENT='+item['msgtext'];
							opMessage("SEND Status= "+newDets);
							SAPServerPrefix=$.trim(localStorage.getItem('ServerName'));
							
							html5sql.process("UPDATE MyMessages SET state = 'SENDING' WHERE id='"+item['id']+"'",
										 function(){
										      sendSAPData(SAPServerPrefix+"MyJobsMessageSend.htm"+SAPServerSuffix+newDets);
										 },
										 function(error, statement){
											 
											 opMessage("Error: " + error.message + " when processing " + statement);
										 }        
								);	
							
						 }
						 
					},
					function(error, statement){
						opMessage("Error: " + error.message + " when syncTransactional processing " + statement); 
					}
				);					
				
// Check for New Messages to retrieve
				SAPServerPrefix=$.trim(localStorage.getItem('ServerName'));
				requestSAPData("MyJobsMessages.htm",SAPServerSuffix+currentUser);
			}
		},
		function(error, statement){
		 opMessage("Error: " + error.message + " when syncTransactional processing " + statement);          
		}
	);
	

	
	
	
	

}

function syncReference(){

var SAPServerSuffix="";
	if (!CheckSyncInterval('REFERENCE')){return; }
	opMessage("Synchronizing Reference Data");

	html5sql.process(
		["SELECT * from MyUserDets"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				SAPServerSuffix="?jsonCallback=?&sap-client=700&sap-user="+rowsArray[0].user+"&sap-password="+rowsArray[0].password+"&username="+rowsArray[0].mobileuser;
			
				html5sql.process("SELECT * from MyWorkConfig where paramname = 'SERVERNAME'",
					function(transaction, results, rowsArray){
						if( rowsArray.length > 0) {
							SetLastSyncDetails("LASTSYNC_REFERENCE");
							localStorage.setItem('LastSyncReferenceDetails','');
							syncReferenceDetsUpdated=false;
							SAPServerPrefix=$.trim(rowsArray[0].paramvalue);							
							opMessage("Sending SAP Request for Ref Data");	
							requestSAPData("MyJobsRefData.htm",SAPServerSuffix);
							requestSAPData("MyJobsRefDataCodes.htm",SAPServerSuffix+"&SCENARIO=MAMDEMO");
							requestSAPData("MyJobsUsers.htm",SAPServerSuffix);
							requestSAPData("MyJobsVehicles.htm",SAPServerSuffix);
							requestSAPData("MyJobsFunclocs.htm",SAPServerSuffix);
						 }
						 
					},
					function(error, statement){
						opMessage("Error: " + error.message + " when syncTransactional processing " + statement); 
					}
				);
			}
		},
		function(error, statement){
		 opMessage("Error: " + error.message + " when syncTransactional processing " + statement);          
		}
	);
	

	
	
	
	

}



//*************************************************************************************************************************
//
//  Survery Routines
//
//*************************************************************************************************************************
function getSurveyType(type){

var TypeName="";
switch(type) {
    case "1":
        TypeName="CheckBox";
        break;
    case "2":
        TypeName="Radio";
        break;
    case "3":
        TypeName="Text";
        break;
    case "4":
        TypeName="Number";
        break;
    case "5":
        TypeName="TextArea";
        break;
    case "6":
        TypeName="Select";
        break;
    case "7":
        TypeName="Slider";
        break;
    case "8":
        TypeName="Date";
        break;
    case "9":
        TypeName="Time";
        break;
	case "10":
        TypeName="Group";
        break;

}

	return TypeName;

}

//*************************************************************************************************************************
//
//  Update Routines
//
//*************************************************************************************************************************
function updateOrderEquipment(orderno, property, funcloc, equipment)
{

	html5sql.process("UPDATE MyOrders SET property = '"+property+"', funcloc =  '"+funcloc+"',  equipment =  '"+equipment+"' where orderno = '"+orderno+"' ",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when updateOrderEquipment processing " + statement);
	 }        
	);
}

function updateTaskLongText(id,longtext)
{

	html5sql.process("UPDATE MyTasks SET longtext = '"+longtext+"' where id = '"+id+"' ",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when updateTaskLongText processing " + statement);
	 }        
	);
}
function updateOrderAddress(orderno, house, houseno, street, district, city, postcode, workaddress)
{

	html5sql.process("UPDATE MyOrders SET house = '"+house+"', houseno = '"+houseno+"',  street ='"+street+"',  district = '"+district+"', city = '"+city+"',  postcode = '"+postcode+"',  workaddress='"+workaddress+"' where orderno = '"+orderno+"' ",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when updateOrderAddress processing " + statement);
	 }        
	);
}
function updateNotifLatLong(notifno, fname, latlong)
{
res=notifno.split("|");


	html5sql.process("UPDATE MyOrders SET "+fname+" = '"+latlong+"' where id = '"+res[1]+"';",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when updateNotifLatLong processing " + statement);
	 }        
	);
}
function updateOrderLatLong(orderno, fname, latlong)
{

	html5sql.process("UPDATE MyOrders SET "+fname+" = '"+latlong+"' where orderno = '"+orderno+"';",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when updateOrderLatLong processing " + statement);
	 }        
	);
}

function updateOperationStatus(orderno, opno, code, status)
{

	html5sql.process("update  myuserstatus set statuscode = '"+code+"', statusdesc = '"+status+"', inact = 'Local' where type = 'OV' and orderno = '"+orderno+"' and opno = '"+ opno+"';",
		function(){
			
				html5sql.process("insert into mystatus (orderno, opno, state,  stsma, status, statusdesc) values("+
					 "'"+orderno+"','"+opno+"','NEW','ZMAM_1', '"+code+"','"+status+"');",				
				function(){
					
				 },
				 function(error, statement){
					opMessage("Error: " + error.message + " when InsertOperationStatus processing " + statement);
				 }        
				);
		},
		function(error, statement){
		 
		opMessage("Error: " + error.message + " when insertOperationStatus processing " + statement);          
		
		}
	);
}
//*************************************************************************************************************************
//
//  Create Routines
//
//*************************************************************************************************************************
function createTConf(order,opno,empid,type,startdate,starttime,enddate,endtime,duration,finalconf,comments)
{

	html5sql.process("INSERT INTO  MyTimeConfs (orderno , opno,type, confno , description , date , time , enddate, endtime, duration, empid, final , datestamp, user, state) VALUES ("+
					 "'"+order+"','"+opno+"','"+type+"','NEW','"+comments+"','"+startdate+"','"+starttime+"','"+enddate+"','"+endtime+"','"+duration+"','"+empid+"','"+finalconf+"','"+getDate+" "+getTime()+"','"+localStorage.getItem("MobileUser")+"','');",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when createTConf processing " + statement);
	 }        
	);
}
function xxcreateNotification(type,priority,group,code,grouptext,codetext,description,details,startdate,funcloc,equipment)
{
var ReportedpOn=getDate()+" "+getTime();
var ReportedBy=localStorage.getItem("MobileUser");


	html5sql.process("INSERT INTO  MyNotifications (notifno , type, startdate, shorttext, longtext , priority , pgroup , pcode , grouptext, codetext, funcloc, equipment, reportedby, reportedon, plant , orderno, funclocgis, equipmentgis) VALUES ("+
					 "'NEW','"+type+"','"+startdate+"','"+description+"','"+details+"','"+priority+"','"+group+"','"+code+"','"+grouptext+"','"+codetext+"','"+funcloc+"','"+equipment+"','"+ReportedBy+"','"+ReportedpOn+"','','','','');",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when createNotification processing " + statement);
	 }        
	);
}
function createVehicleDefect(type,description,details,equipment)
{
var startdate=getSAPDate();
var starttime=getSAPTime();
var ReportedBy=localStorage.getItem("MobileUser");
//alert("INSERT INTO  MyNewJobs (state , type, date, time, shorttext, longtext, equipment, reportedby) VALUES ("+
//					 "'VEHICLEDEFECT','"+type+"','"+startdate+"','"+starttime+"','"+description+"','"+details+"','"+equipment+"','"+ReportedBy+"');");
	html5sql.process("INSERT INTO  MyNewJobs (state , type, date, time, shorttext, longtext, equipment, reportedby) VALUES ("+
					 "'VEHICLEDEFECT','"+type+"','"+startdate+"','"+starttime+"','"+description+"','"+details+"','"+equipment+"','"+ReportedBy+"');",
	 function(){
		 //alert("Created VDefect");
	 },
	 function(error, statement){
		 //alert("Error: " + error.message + " when createNotification processing " + statement);
		opMessage("Error: " + error.message + " when createNotification processing " + statement);
	 }        
	);
	
}
function createTask(notifno,groupcd,codecd, grouptext, codetext, description)
{

	html5sql.process("INSERT INTO MyTasks (notifno , item_id, task_codegrp , task_code , txt_taskgrp, txt_taskcd , task_text, task_cat_typ, plnd_start_date, plnd_start_time, plnd_end_date, plnd_end_time, sla_end_date, sla_end_time, longtext, complete, status) VALUES ("+
					 "'"+notifno+"','NEW','"+groupcd+"','"+codecd+"','"+grouptext+"','"+codetext+"','"+description+"','','"+getDate()+"','"+getTime()+"','','','"+ getDate()+"','"+getTime()+"','','','');",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when createNotification processing " + statement);
	 }        
	);
}


function createActivity(notifno,task,groupcd,codecd, grouptext, codetext, description)
{
	html5sql.process("INSERT INTO MyActivities (notifno ,task_id, item_id, act_codegrp , act_code , txt_actgrp, txt_actcd , act_text, act_id, act_cat_typ, start_date, start_time, end_date, end_time, long_text, status) VALUES ("+
					 "'"+notifno+"','"+task+"','NEW','"+groupcd+"','"+codecd+"','"+grouptext+"','"+codetext+"','"+description+"','','','"+getDate()+"','"+getTime()+"','','','');",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when createActivity processing " + statement);
	 }        
	);
}
function createEffect(notifno,groupcd,codecd, grouptext, codetext, description)
{

	html5sql.process("INSERT INTO MyEffects (notifno , item_id, effect_codegrp , effect_code , txt_effectgrp, txt_effectcd , value, task_id, effect_cat_typ ) VALUES ("+
					 "'"+notifno+"','NEW','"+groupcd+"','"+codecd+"','"+grouptext+"','"+codetext+"','"+description+"','','');",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when createActivity processing " + statement);
	 }        
	);
}
function createCause(notifno,groupcd,codecd, grouptext, codetext, description)
{

	html5sql.process("INSERT INTO MyCauses (notifno , item_id, cause_codegrp , cause_code , txt_causegrp, txt_causecd , cause_text , cause_id, cause_cat_typ, long_text, status) VALUES ("+
					 "'"+notifno+"','NEW','"+groupcd+"','"+codecd+"','"+grouptext+"','"+codetext+"','"+description+"','','','','');",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when createActivity processing " + statement);
	 }        
	);
}
//*************************************************************************************************************************
//
//  Create Database Tables
//
//*************************************************************************************************************************
function createTables(type) { 




	//opMessage("Creating The Tables");	
        
		sqlstatement='CREATE TABLE IF NOT EXISTS MyOrders     			( orderno TEXT, shorttext TEXT, longtext TEXT, startdate TEXT, enddate TEXT, contact TEXT,   telno TEXT,    type TEXT, priority TEXT, address TEXT, workaddress TEXT, house TEXT, houseno TEXT, street TEXT, district TEXT, city TEXT, postcode TEXT,gis TEXT, property TEXT, funcloc TEXT, equipment TEXT, propertygis TEXT, funclocgis TEXT, equipmentgis TEXT, notifno TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyOperations 			( orderno TEXT, opno TEXT,      type TEXT,     priority TEXT,  shorttext TEXT, startdate TEXT, enddate TEXT, duration TEXT, status TEXT, assignedto TEXT, apptstart TEXT, apptend TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyOperationsSplit 		( orderno TEXT, opno TEXT,      assignedto TEXT,  duration TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyPartners   			( orderno TEXT, notifno TEXT, id TEXT,        type TEXT,     name TEXT,      address TEXT,   postcode TEXT, telno TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyAssets     			( orderno TEXT, id TEXT,        type TEXT,     name TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyMaterials     		( orderno TEXT, id TEXT, material TEXT, qty TEXT, description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyUserStatus     		( id integer primary key autoincrement, type TEXT, orderno TEXT, opno TEXT, inact TEXT, status TEXT, statuscode TEXT, statusdesc TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyOperationInfo     	( id integer primary key autoincrement, orderno TEXT, opno TEXT, type TEXT, value1 TEXT, value2 TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyNotifications     	( id integer primary key autoincrement, notifno TEXT, shorttext TEXT, longtext TEXT, cattype TEXT,  pgroup TEXT, pcode TEXT, grouptext TEXT, codetext TEXT, startdate TEXT, starttime TEXT, type TEXT, priority TEXT, funcloc TEXT,   equipment TEXT, orderno TEXT, reportedon TEXT,   reportedby TEXT, plant TEXT, funclocgis TEXT,   equipmentgis TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyItems     			( id integer primary key autoincrement, notifno TEXT, item_id TEXT, descript TEXT, d_cat_typ TEXT, d_codegrp TEXT, d_code TEXT, dl_cat_typ TEXT, dl_codegrp TEXT, dl_code TEXT, long_text TEXT, stxt_grpcd TEXT ,txt_probcd TEXT  ,txt_grpcd TEXT , txt_objptcd TEXT, status TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyCauses      			( id integer primary key autoincrement, notifno TEXT, item_id TEXT, cause_id TEXT, cause_text TEXT, cause_cat_typ TEXT, cause_codegrp TEXT, cause_code TEXT, long_text TEXT, txt_causegrp TEXT, txt_causecd TEXT, status TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyActivities     		( id integer primary key autoincrement, notifno TEXT, task_id TEXT, item_id TEXT,  act_id TEXT, act_text TEXT, act_cat_typ TEXT, act_codegrp TEXT, act_code TEXT,  start_date TEXT, start_time TEXT ,end_date TEXT  ,end_time TEXT , long_text TEXT, txt_actgrp TEXT, txt_actcd TEXT, status TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyTasks      			( id integer primary key autoincrement, notifno TEXT, item_id TEXT, task_text TEXT, task_cat_typ TEXT, task_codegrp TEXT, task_code TEXT, txt_taskgrp TEXT, txt_taskcd TEXT, plnd_start_date TEXT, plnd_start_time TEXT ,plnd_end_date TEXT  ,plnd_end_time TEXT , sla_end_date TEXT  ,sla_end_time TEXT , longtext TEXT, complete TEXT, status TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyEffects      		( id integer primary key autoincrement, notifno TEXT, item_id TEXT, task_id TEXT, effect_cat_typ TEXT, effect_codegrp TEXT, effect_code TEXT, txt_effectgrp TEXT, txt_effectcd TEXT, value TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyStatus     			( id integer primary key autoincrement, orderno TEXT, opno TEXT, stsma TEXT, status TEXT, statusdesc, state TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyTimeConfs     		( id integer primary key autoincrement, orderno TEXT, opno TEXT, confno TEXT, type TEXT, description TEXT, date TEXT, time TEXT, enddate TEXT, endtime TEXT,duration TEXT, datestamp TEXT,  user TEXT,  empid TEXT, final TEXT, state TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyNewJobs     			( id integer primary key autoincrement, type TEXT, defect TEXT, mpoint TEXT, mpval TEXT, shorttext TEXT, longtext TEXT, description TEXT, date TEXT, time TEXT, funcloc TEXT, equipment TEXT, cattype TEXT, activitycodegroup TEXT, activitycode TEXT, activitytext TEXT, prioritytype TEXT, priority TEXT, reportedby TEXT, state TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyWorkConfig     		( id integer primary key autoincrement, paramname TEXT, paramvalue TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyWorkSyncDets    		( id integer primary key autoincrement, lastsync TEXT, comments   TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyUserDets             ( id integer primary key autoincrement, mobileuser TEXT, vehiclereg TEXT, employeeid TEXT, user TEXT, password TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyRefUsers    			(  id integer primary key autoincrement, userid TEXT, scenario TEXT, plant TEXT, workcenter TEXT, plannergroup TEXT, plannergroupplant TEXT, storagegroup TEXT, storageplant TEXT, partner TEXT, partnerrole TEXT, funclocint TEXT, funcloc TEXT, compcode TEXT, employeeno TEXT, equipment TEXT, firstname TEXT, lastname TEXT, telno TEXT);'+													
					 'CREATE TABLE IF NOT EXISTS MyRefOrderTypes     	(  id integer primary key autoincrement, scenario TEXT, type TEXT, description TEXT, statusprofile TEXT, opstatusprofile TEXT, priorityprofile TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyRefNotifTypes     	(  id integer primary key autoincrement, scenario TEXT, type TEXT, description TEXT, statusprofile TEXT, taskstatusprofile TEXT,priority_type TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyRefPriorityTypes     (  id integer primary key autoincrement, scenario TEXT, type TEXT, priority TEXT, description TEXT);'+
				  	 'CREATE TABLE IF NOT EXISTS MyRefUserStatusProfiles (  id integer primary key autoincrement, scenario TEXT, type TEXT, status TEXT, statuscode TEXT, statusdesc TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyVehicles     		(  sysid integer primary key autoincrement, reg TEXT, id TEXT, mpoint TEXT,description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyVehicleCheck     	(  id integer primary key autoincrement, reg TEXT,  mileage TEXT,  tax TEXT,  horn TEXT,  tyres TEXT,  wheels TEXT,  lights TEXT,  wipers TEXT, checktype TEXT,  datestamp TEXT,  user TEXT,  state TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyMessages    			(  id integer primary key autoincrement, msgid TEXT, type TEXT,  date TEXT, time TEXT, msgfromid TEXT, msgfromname TEXT, msgtoid TEXT, msgtoname TEXT, msgsubject TEXT, msgtext TEXT,  expirydate TEXT, state TEXT);'+
					 'CREATE TABLE IF NOT EXISTS Assets     			(  type TEXT, id TEXT, eqart TEXT, eqtyp TEXT, shorttext TEXT,  address TEXT, workcenter TEXT);'+
					 'CREATE TABLE IF NOT EXISTS AssetClassVals     	(  type TEXT, id TEXT,  charact TEXT,  valuechar TEXT,  valueto TEXT, valueneutral TEXT, description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS AssetMeasurementPoints (  type TEXT, id TEXT,  mpoint TEXT,  description TEXT,  value TEXT);'+
					 'CREATE TABLE IF NOT EXISTS AssetInstalledEquip    (  type TEXT, id TEXT,  eqno TEXT,  description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS LogFile    			( id integer primary key autoincrement, datestamp TEXT, type TEXT, message TEXT);'+
					 'CREATE TABLE IF NOT EXISTS RefNotifprofile  		( id integer primary key autoincrement, scenario TEXT, profile TEXT, notif_type TEXT);'+
					 'CREATE TABLE IF NOT EXISTS RefCodeGroups  		( id integer primary key autoincrement, scenario TEXT, profile TEXT, catalog_type TEXT, code_cat_group TEXT, codegroup TEXT, codegroup_text TEXT);'+
					 'CREATE TABLE IF NOT EXISTS RefCodes  				( id integer primary key autoincrement, scenario TEXT, profile TEXT, code_cat_group TEXT, code TEXT, code_text TEXT);'+
					 'CREATE TABLE IF NOT EXISTS HRAbsence     			( id integer primary key autoincrement, requesteddate TEXT, startdate TEXT, enddate TEXT, type TEXT, days TEXT, status TEXT, comments TEXT);'+
					 
					 'CREATE TABLE IF NOT EXISTS HRTravel     			( id integer primary key autoincrement, requesteddate TEXT, startdate TEXT, enddate TEXT, travelfrom TEXT, travelto TEXT, status TEXT, comments TEXT);'+

					 
					 
					 'CREATE TABLE IF NOT EXISTS Survey     			( id integer primary key autoincrement, surveyid TEXT, name TEXT);'+
					 'CREATE TABLE IF NOT EXISTS SurveyGroup     		( id integer primary key autoincrement, surveyid TEXT, groupid TEXT, name TEXT, title TEXT);'+
					 'CREATE TABLE IF NOT EXISTS SurveyQuestion    		( id integer primary key autoincrement, surveyid TEXT, groupid TEXT, questionid TEXT, questiontype TEXT, defaultvalue TEXT, name TEXT, title TEXT, dependsonid TEXT, dependsonval TEXT);'+
					 'CREATE TABLE IF NOT EXISTS SurveySubQuestion  	( id integer primary key autoincrement, surveyid TEXT, groupid TEXT, questionid TEXT, subquestionid TEXT, subquestiontype TEXT, name TEXT, title TEXT, dependsonid TEXT, dependsonval TEXT);'+
					 'CREATE TABLE IF NOT EXISTS SurveyQuestionChildren ( id integer primary key autoincrement, surveyid TEXT, groupid TEXT, questionid TEXT, questionvalue TEXT, childquestions TEXT);'+
					 'CREATE TABLE IF NOT EXISTS FuncLocs			  	( id integer primary key autoincrement, flid TEXT, description TEXT, swerk TEXT, level TEXT, parentid TEXT, children TEXT);'+
					 'CREATE TABLE IF NOT EXISTS TSActivities		    ( id integer primary key autoincrement, code TEXT, skill TEXT,  subskill TEXT, description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS TSNPJobs			    ( id integer primary key autoincrement, jobno TEXT, subtype TEXT,  description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS TSData		    		( id integer primary key autoincrement, date TEXT, job TEXT, skill TEXT, activity TEXT, time TEXT, ot15 TEXT, ot20 TEXT);'+
					 'CREATE TABLE IF NOT EXISTS GASSurveyQ			    ( id integer primary key autoincrement, type TEXT, qno TEXT,  qtype TEXT, description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS GASSurveyA			    ( id integer primary key autoincrement, type TEXT, qno TEXT,  qkey TEXT, qvalue TEXT);'+
					 'CREATE TABLE IF NOT EXISTS GASSurveyMake		    ( id integer primary key autoincrement, make TEXT, description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS GASSurveyModel		    ( id integer primary key autoincrement, make TEXT, model TEXT, description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS GASSurvey			    ( id integer primary key autoincrement, orderno TEXT, opno TEXT, make TEXT, model TEXT, location TEXT, dv1 TEXT, dv2 TEXT, dv3 TEXT, dv4 TEXT, dv5 TEXT, dv6 TEXT, dv7 TEXT, dv8 TEXT, dv9 TEXT, dv10 TEXT, dv11 TEXT, dv12 TEXT, dv13 TEXT, dv14 TEXT, dv15 TEXT);'+
					 'CREATE TABLE IF NOT EXISTS GASSurveyHDR		    ( id integer primary key autoincrement, orderno TEXT, opno TEXT, date TEXT, signed TEXT, hv1 TEXT, hv2 TEXT, hv3 TEXT, hv4 TEXT, text1 TEXT, text2 TEXT, text3 TEXT);'+
					 'CREATE VIEW viewoperationstatus as SELECT orderno, opno, statusdesc FROM myuserstatus where type = "OV" GROUP BY orderno, opno Order by id desc ;'+
					 'CREATE VIEW viewprioritycodes as select myrefordertypes.scenario, myrefordertypes.type as ordertype, myrefordertypes.priorityprofile, myrefprioritytypes.priority as priority, myrefprioritytypes.description as prioritydesc from myrefordertypes left join myrefprioritytypes on myrefordertypes.priorityprofile = myrefprioritytypes.type where myrefordertypes.scenario = myrefprioritytypes.scenario;';
		html5sql.process(sqlstatement,
						 function(){
							
							emptyTables(type);
							
							
						 },
						 function(error, statement){
							 opMessage("Error: " + error.message + " when create processing " + statement);
							
							 
						 }        
				);


}
//*************************************************************************************************************************
//
//  Delete all Tables
//
//*************************************************************************************************************************
function dropTables() { 


		sqlstatement=	'DROP TABLE IF EXISTS MyOrders;'+
						'DROP TABLE IF EXISTS MyOperations;'+
						'DROP TABLE IF EXISTS MyOperationsSplit;'+
						'DROP TABLE IF EXISTS MyPartners;'+
						'DROP TABLE IF EXISTS MyAssets;'+
						'DROP TABLE IF EXISTS MyMaterials;'+
						'DROP TABLE IF EXISTS MyUserStatus;'+
						'DROP TABLE IF EXISTS MyOperationInfo;'+
						'DROP TABLE IF EXISTS MyNotifications;'+
						'DROP TABLE IF EXISTS MyItems;'+
						'DROP TABLE IF EXISTS MyCauses;'+
						'DROP TABLE IF EXISTS MyActivities;'+
						'DROP TABLE IF EXISTS MyTasks;'+
						'DROP TABLE IF EXISTS MyEffects;'+
						'DROP TABLE IF EXISTS MyStatus;'+
						'DROP TABLE IF EXISTS MyTimeConfs;'+
						'DROP TABLE IF EXISTS MyNewJobs;'+
						'DROP TABLE IF EXISTS MyWorkConfig;'+
						'DROP TABLE IF EXISTS MyRefUsers;'+
						'DROP TABLE IF EXISTS MyRefOrderTypes;'+
						'DROP TABLE IF EXISTS MyRefNotifTypes;'+
						'DROP TABLE IF EXISTS MyRefPriorityTypes;'+
						'DROP TABLE IF EXISTS MyRefUserStatusProfiles;'+
						'DROP TABLE IF EXISTS MyWorkSyncDets;'+
						'DROP TABLE IF EXISTS MyUserDets;'+
						'DROP TABLE IF EXISTS MyVehicles;'+
						'DROP TABLE IF EXISTS MyVehicleCheck;'+
						'DROP TABLE IF EXISTS MyMessages;'+
						'DROP TABLE IF EXISTS Assets;'+
						'DROP TABLE IF EXISTS LogFile;'+
						'DROP TABLE IF EXISTS AssetClassVals;'+
						'DROP TABLE IF AssetInstalledEquip;'+
						'DROP TABLE IF AssetMeasurementPoints;'+
						'DROP TABLE IF EXISTS RefNotifprofile;'+
						'DROP TABLE IF EXISTS RefCodeGroups;'+
						'DROP TABLE IF EXISTS RefCodes;'+
						'DROP TABLE IF EXISTS HRAbsence;'+	
						'DROP TABLE IF EXISTS HRTravel;'+	
						'DROP TABLE IF EXISTS Survey;'+	
						'DROP TABLE IF EXISTS SurveyGroup;'+
						'DROP TABLE IF EXISTS SurveyQuestion;'+
						'DROP TABLE IF EXISTS SurveySubQuestion;'+
						'DROP TABLE IF EXISTS SurveyQuestionChildren;'+
						'DROP TABLE IF EXISTS FuncLocs;'+
						'DROP TABLE IF EXISTS TSActivities;'+	
						'DROP TABLE IF EXISTS TSNPJobs;'+
						'DROP TABLE IF EXISTS TSData;'+
						
						'DROP TABLE IF EXISTS GASSurveyQ;'+	
						'DROP TABLE IF EXISTS GASSurveyA;'+
						'DROP TABLE IF EXISTS GASSurveyMake;'+
						'DROP TABLE IF EXISTS GASSurveyModel;'+
						'DROP TABLE IF EXISTS GASSurvey;'+
						'DROP TABLE IF EXISTS GASSurveyHDR;'+
						
						'DROP VIEW IF EXISTS viewoperationstatus;'+
						'DROP TABLE IF EXISTS viewprioritycodes;';

						html5sql.process(sqlstatement,
						 function(){
							 //alert("Success dropping Tables");
						 },
						 function(error, statement){
							
						 }        
				);
}
function emptyTables(type) { 
	

		sqlstatement=	'DELETE FROM  MyOrders;'+
						'DELETE FROM  MyOperations;'+
						'DELETE FROM  MyOperationsSplit;'+
						'DELETE FROM  MyPartners;'+
						'DELETE FROM  MyMaterials;'+
						'DELETE FROM  MyAssets;'+
						'DELETE FROM  MyUserStatus;'+
						'DELETE FROM  MyOperationInfo;'+
						'DELETE FROM  MyNotifications;'+
						'DELETE FROM  MyItems;'+
						'DELETE FROM  MyCauses;'+
						'DELETE FROM  MyActivities;'+
						'DELETE FROM  MyTasks;'+
						'DELETE FROM  MyEffects;'+
						'DELETE FROM  MyStatus;'+
						'DELETE FROM  MyTimeConfs;'+
						'DELETE FROM  MyNewJobs;'+
						'DELETE FROM  MyWorkConfig;'+
						'DELETE FROM  MyRefUsers;'+
						'DELETE FROM  MyRefOrderTypes;'+
						'DELETE FROM  MyRefNotifTypes;'+
						'DELETE FROM  MyRefPriorityTypes;'+
						'DELETE FROM  MyRefUserStatusProfiles;'+
						'DELETE FROM  MyWorkSyncDets;'+
						'DELETE FROM  MyUserDets;'+
						'DELETE FROM  MyVehicles;'+
						'DELETE FROM  MyVehicleCheck;'+
						'DELETE FROM  MyMessages;'+
						'DELETE FROM  Assets;'+
						'DELETE FROM  LogFile;'+
						'DELETE FROM  AssetClassVals;'+
						'DELETE FROM  AssetInstalledEquip;'+
						'DELETE FROM  AssetMeasurementPoints;'+
						'DELETE FROM  RefNotifprofile;'+
						'DELETE FROM  RefCodeGroups;'+
						'DELETE FROM  RefCodes;'+ 
						'DELETE FROM  HRAbsence;'+	
						'DELETE FROM  HRTravel;'+	
						'DELETE FROM  Survey;'+	
						'DELETE FROM  SurveyGroup;'+
						'DELETE FROM  SurveyQuestion;'+
						'DELETE FROM  SurveySubQuestion;'+
						'DELETE FROM  SurveyQuestionChildren;'+
						'DELETE FROM  FuncLocs;'+
						'DELETE FROM  TSActivities;'+	
						'DELETE FROM  TSNPJobs;'+
						'DELETE FROM  TSData;'+
						'DELETE FROM  GASSurveyQ;'+	
						'DELETE FROM  GASSurveyA;'+
						'DELETE FROM  GASSurveyMake;'+
						'DELETE FROM  GASSurveyModel;'+
						'DELETE FROM  GASSurvey;'+
						'DELETE FROM  GASSurveyHDR;';
						
						

						html5sql.process(sqlstatement,
						 function(){
							demoDataLoaded=type;
							//alert("0")
							SetConfigParam("TRACE", "ON");
							SetConfigParam("SYNC_REFERENCE_FREQUENCY", "8400000");
							SetConfigParam("SYNC_TRANSACTIONAL_FREQUENCY", "600000");
							SetConfigParam("SYNC_UPLOAD_FREQUENCY", "300");
							SetConfigParam("LASTSYNC_REFERENCE", "20130316170000");
							SetConfigParam("LASTSYNC_TRANSACTIONAL", "20130316224900");
							SetConfigParam("LASTSYNC_UPLOAD", "20130316214900");
							SetConfigParam("SERVERNAME", "http://elderberry.uk.logica.com:8083/sap/bc/bsp/sap/zorderlist/");
							requestDEMOData('TestData\\MySurveys.json');
							requestDEMOData('TestData\\MyOrdersData.json');
						
							requestDEMOData('TestData\\MyNotificationsData.json');
						
							requestDEMOData('TestData\\MyUsersData.json');
							
							requestDEMOData('TestData\\MyOrderObjectsData.json');	
							
							requestDEMOData('TestData\\MyRefData.json');
							
							requestDEMOData('TestData\\RefDataCodes.json');
							
							requestDEMOData('TestData\\funclocs.json');
							requestDEMOData('TestData\\MyVehiclesData.json');
						
							requestDEMOData('TestData\\GASSurvey.json');
						
							requestDEMOData('TestData\\GASSurveyHdr.json');
							requestDEMOData('TestData\\MyMessagesData.json');
							//
							requestDEMOData('TestData\\TimeSheetNPJobs.json');
							
							requestDEMOData('TestData\\TimeSheetActivities.json');
						
							
							
						
							CreateUser("MOBILED","AV54VSP", "MOBILED", "logica", "00059555");

						 },
						 function(error, statement){
							 
							 opMessage("Error: " + error.message + " when delete processing " + statement);
						 }        
				);
}
function resetTables() { 
	var sqlstatement="";

	sqlstatement=	'DELETE FROM  MyOrders;'+
					'DELETE FROM  MyOperations;'+
					'DELETE FROM  MyOperationsSplit;'+
					'DELETE FROM  MyPartners;'+
					'DELETE FROM  MyMaterials;'+
					'DELETE FROM  MyAssets;'+
					'DELETE FROM  MyUserStatus;'+
					'DELETE FROM  MyOperationInfo;'+
					'DELETE FROM  MyNotifications;'+
					'DELETE FROM  MyItems;'+
					'DELETE FROM  MyCauses;'+
					'DELETE FROM  MyActivities;'+
					'DELETE FROM  MyTasks;'+
					'DELETE FROM  MyEffects;'+
					'DELETE FROM  MyStatus;'+
					'DELETE FROM  MyTimeConfs;'+
					'DELETE FROM  MyNewJobs;'+
					'DELETE FROM  MyRefUsers;'+
					'DELETE FROM  MyRefOrderTypes;'+
					'DELETE FROM  MyRefNotifTypes;'+
					'DELETE FROM  MyRefPriorityTypes;'+
					'DELETE FROM  MyRefUserStatusProfiles;'+
					'DELETE FROM  MyWorkSyncDets;'+
					'DELETE FROM  MyVehicles;'+
					'DELETE FROM  MyVehicleCheck;'+
					'DELETE FROM  MyMessages;'+
					'DELETE FROM  Assets;'+
					'DELETE FROM  LogFile;'+
					'DELETE FROM  AssetClassVals;'+
					'DELETE FROM  AssetInstalledEquip;'+
					'DELETE FROM  AssetMeasurementPoints;'+
					'DELETE FROM  RefNotifprofile;'+
					'DELETE FROM  RefCodeGroups;'+
					'DELETE FROM  RefCodes;'+  
					'DELETE FROM  HRAbsence;'+
					'DELETE FROM  HRTravel;'+	
					'DELETE FROM  Survey;'+	
					'DELETE FROM  SurveyGroup;'+
					'DELETE FROM  SurveyQuestion;'+
					'DELETE FROM  SurveySubQuestion;'+
					'DELETE FROM  SurveyQuestionChildren;'+
					'DELETE FROM  FuncLocs;'+
					'DELETE FROM  TSActivities;'+	
					'DELETE FROM  TSNPJobs;'+
					'DELETE FROM  TSData;'+
					'DELETE FROM  GASSurveyQ;'+	
					'DELETE FROM  GASSurveyA;'+
					'DELETE FROM  GASSurveyMake;'+
					'DELETE FROM  GASSurveyModel;'+
					'DELETE FROM  GASSurvey;'+
					'DELETE FROM  GASSurveyHDR;';
					
					

					html5sql.process(sqlstatement,
					 function(){
						requestDEMOData('TestData\\GASSurvey.json');
						requestDEMOData('TestData\\GASSurveyHdr.json');
						requestDEMOData('TestData\\TimeSheetNPJobs.json');
						requestDEMOData('TestData\\TimeSheetActivities.json');
						requestDEMOData('TestData\\MySurveys.json');
						SetConfigParam('LASTSYNC_REFERENCE', "20120101010101");
						SetConfigParam('LASTSYNC_TRANSACTIONAL', "20120101010101");
						syncReference();
						syncTransactional();
						


					 },
					 function(error, statement){
						 opMessage("Error: " + error.message + " when delete processing " + statement);
					 }        
			);
}
function DeleteLog() { 
		html5sql.process("DELETE FROM LogFile",
						 function(){
							 //alert("Success Creating Tables");
						 },
						 function(error, statement){
							 opMessage("Error: " + error.message + " when processing " + statement);
						 }        
				);

}
function createDB(type){

		createTables(type);

		


}	


function requestDEMOData(page){
	
		opMessage("DEMOLoad "+page);
		
		$.getJSON(page,function(data,status){ 	
			
			if(page=='TestData\\MyOrdersData.json'){
				
				orderCB(data);
				
			}
			if(page=='TestData\\MyNotificationsData.json'){
				notificationCB(data);
			
			}
			if(page=='TestData\\MyUsersData.json'){
				userCB(data);
				
			}
			if(page=='TestData\\MyOrderObjectsData.json'){
				orderobjectsCB(data);
				
			}
			if(page=='TestData\\MyRefData.json'){
				refdataCB(data);
				
			}
			if(page=='TestData\\RefDataCodes.json'){
				refdatacodesCB(data);
				
			}		
			if(page=='TestData\\MyVehiclesData.json'){
				vehicleCB(data);
				
			}
			if(page=='TestData\\MyMessagesData.json'){
				messageCB(data);
				
			}	
			if(page=='TestData\\GASSurvey.json'){
				refgasCB(data);
				
			}
			if(page=='TestData\\GASSurveyHdr.json'){
				refgashdrCB(data);
				
			}
			if(page=='TestData\\funclocs.json'){
				refflocsCB(data);
				
			}
			if(page=='TestData\\TimeSheetNPJobs.json'){
				tsnpjobsCB(data);
			
			}
			if(page=='TestData\\TimeSheetActivities.json'){
				tsactivitiesCB(data);

			}
			if(page=='TestData\\MySurveys.json'){
				
				surveysCB(data);

			}
  });
}
function orderCB(MyOrders){
	
		opMessage("Doing Orders");
		//alert("total orders "+MyOrders.order.length)
		
		if(MyOrders.order.length>0){
			if(syncTransactionalDetsUpdated){
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+', Orders:'+String(MyOrders.order.length));
			}else{
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+'Orders:'+String(MyOrders.order.length));
			}
			opMessage("Deleting Existing Orders");
			sqlstatement = 	'DELETE FROM MyOrders;'+
							'DELETE FROM MyOperations;'+
							'DELETE FROM MyOperationsSplit;'+
							'DELETE FROM MyPartners;'+
							'DELETE FROM MyMaterials;'+
							'DELETE FROM MyAssets;'+
		
							'DELETE FROM MyTimeConfs;'+
							'DELETE FROM MyUserStatus;'+
							'DELETE FROM MyOperationInfo;'+
							'DELETE FROM MyStatus where state="SERVER";';
			
			html5sql.process(sqlstatement,
						 function(){
							 //alert("Success del Tables");
						 },
						 function(error, statement){
							 opMessage("Error: " + error.message + " when processing " + statement);
						 }        
				);
			opMessage("Loading "+MyOrders.order.length+" Orders");
		
	
			for(var cntx=0; cntx < MyOrders.order.length ; cntx++)
				{

				sqlstatement+='INSERT INTO MyOrders (orderno , shorttext , longtext , startdate ,  enddate ,contact , telno , type , priority , address ,workaddress, house, houseno, street, district, city, postcode, gis,  property, funcloc, equipment, propertygis, funclocgis, equipmentgis, notifno) VALUES ('+
					 '"'+MyOrders.order[cntx].orderno+ '","'+ MyOrders.order[cntx].shorttext + '","'+ MyOrders.order[cntx].longtext + '","'+ MyOrders.order[cntx].startdate + '","'+ MyOrders.order[cntx].enddate + '","'+MyOrders.order[cntx].contact+'",'+ 
					 '"'+MyOrders.order[cntx].telno + '","'+MyOrders.order[cntx].type + '","'+MyOrders.order[cntx].priority + '","'+MyOrders.order[cntx].address + '","'+MyOrders.order[cntx].workaddress+ '","'+MyOrders.order[cntx].house+'",'+ 
					 '"'+MyOrders.order[cntx].houseno+ '","'+MyOrders.order[cntx].street+ '","'+MyOrders.order[cntx].district+ '","'+MyOrders.order[cntx].city+ '","'+MyOrders.order[cntx].postcode+ '","'+MyOrders.order[cntx].gis+'",'+ 
					 '"'+MyOrders.order[cntx].property+  '","'+MyOrders.order[cntx].funcloc+  '","'+MyOrders.order[cntx].equipment+'",'+ 
					 '"'+MyOrders.order[cntx].propertygis+  '","'+MyOrders.order[cntx].funclocgis+  '","'+MyOrders.order[cntx].equipmentgis+ '","'+MyOrders.order[cntx].notifno+'");';
				//Loop and write operations to DB
				
	 			//opMessage("Loading "+MyOrders.order[cntx].operation.length+" Operations");

				for(var opscnt=0; opscnt < MyOrders.order[cntx].operation.length ; opscnt++)
					{	
					
					sqlstatement+='INSERT INTO MyOperations (orderno , opno, type , priority , shorttext , startdate, enddate, duration , status, apptstart, apptend) VALUES ('+
						 '"'+MyOrders.order[cntx].orderno+  '","'+ MyOrders.order[cntx].operation[opscnt].opno+  '","'+ MyOrders.order[cntx].operation[opscnt].type+  '","'+MyOrders.order[cntx].operation[opscnt].priority+  '",'+
						 '"'+MyOrders.order[cntx].operation[opscnt].shorttext+  '","'+ MyOrders.order[cntx].operation[opscnt].startdate+  '","'+ MyOrders.order[cntx].operation[opscnt].enddate+  '","'+  MyOrders.order[cntx].operation[opscnt].duration+  '",'+
						 '"'+MyOrders.order[cntx].operation[opscnt].status+  '","'+ MyOrders.order[cntx].operation[opscnt].apptstart+  '","'+ MyOrders.order[cntx].operation[opscnt].apptend+'");';
				
					}
				
	 			//opMessage("Loading "+MyOrders.order[cntx].opsplit.length+" Operations Split");
				

				for(var opscnt=0; opscnt < MyOrders.order[cntx].operationsplit.length ; opscnt++)
					{	
					
					sqlstatement+='INSERT INTO MyOperationsSplit (orderno , opno, assignedto, duration) VALUES ('+
						 '"'+MyOrders.order[cntx].orderno+  '","'+ MyOrders.order[cntx].operationsplit[opscnt].opno+  '","'+ MyOrders.order[cntx].operationsplit[opscnt].assignedto+  '","'+ MyOrders.order[cntx].operationsplit[opscnt].duration+'");';
				
					}
				//opMessage("Loading "+MyOrders.order[cntx].partner.length+" Partners");
			
				//Loop and write partners to DB
				for(var pcnt=0; pcnt < MyOrders.order[cntx].partner.length ; pcnt++)
					{	
					sqlstatement+='INSERT INTO MyPartners (orderno , id, type , name , address , postcode , telno, notifno) VALUES ('+ 
						'"'+MyOrders.order[cntx].orderno+  '","'+ MyOrders.order[cntx].partner[pcnt].id+  '","'+  MyOrders.order[cntx].partner[pcnt].type+  '","'+ MyOrders.order[cntx].partner[pcnt].name+  '",'+
						'"'+MyOrders.order[cntx].partner[pcnt].address+  '","'+  MyOrders.order[cntx].partner[pcnt].postcode+  '","'+ MyOrders.order[cntx].partner[pcnt].telno+  '","'+ ""+'");';
				}

			//Loop and write components to DB
				for(var pcnt=0; pcnt < MyOrders.order[cntx].component.length ; pcnt++)
					{	

					sqlstatement+='INSERT INTO Mymaterials (orderno , id, material , description , qty) VALUES ('+ 
						'"'+MyOrders.order[cntx].orderno+  '","'+ MyOrders.order[cntx].component[pcnt].item+  '","'+  MyOrders.order[cntx].component[pcnt].material+  '","'+
						MyOrders.order[cntx].component[pcnt].description+  '","'+ MyOrders.order[cntx].component[pcnt].quantity+  '");';
				}				
				
				
				//opMessage("Loading "+MyOrders.order[cntx].userstatus.length+" UserStatus");
				//Loop and write userstatus to DB
				for(var pcnt=0; pcnt < MyOrders.order[cntx].userstatus.length ; pcnt++)
					{	
					sqlstatement+='INSERT INTO MyUserStatus (type , orderno, opno , inact , status , statuscode , statusdesc) VALUES ('+
						'"'+MyOrders.order[cntx].userstatus[pcnt].type+  '","'+  MyOrders.order[cntx].userstatus[pcnt].orderno+  '","'+ MyOrders.order[cntx].userstatus[pcnt].opno+  '",'+
						'"'+MyOrders.order[cntx].userstatus[pcnt].inact+  '","'+  MyOrders.order[cntx].userstatus[pcnt].status+  '","'+  MyOrders.order[cntx].userstatus[pcnt].statuscode+  '",'+
						'"'+MyOrders.order[cntx].userstatus[pcnt].statusdesc+'");';
				}

				//opMessage("Loading "+MyOrders.order[cntx].operationinfo.length+" OperationInfo");
				//Loop and write userstatus to DB
				for(var pcnt=0; pcnt < MyOrders.order[cntx].operationinfo.length ; pcnt++)
					{	
					sqlstatement+='INSERT INTO MyOperationInfo (orderno, opno , type , value1 , value2) VALUES ('+
						'"'+MyOrders.order[cntx].operationinfo[pcnt].orderno+  '","'+  MyOrders.order[cntx].operationinfo[pcnt].opno+  '","'+  MyOrders.order[cntx].operationinfo[pcnt].type+  '",'+ 
						'"'+MyOrders.order[cntx].operationinfo[pcnt].value1+  '","'+  MyOrders.order[cntx].operationinfo[pcnt].value2+'");';
				}
				
				
				
				
				//Loop and write Assets to DB
				
	  
				//opMessage("Loading "+MyOrders.order[cntx].asset.length+" Assets");
				for(var acnt=0; acnt < MyOrders.order[cntx].asset.length ; acnt++)
					{
					if (MyOrders.order[cntx].asset[acnt].equipment.length>0){
						sqlstatement+='INSERT INTO MyAssets (orderno , id, type , name ) VALUES ('+
							'"'+MyOrders.order[cntx].orderno+  '","'+   MyOrders.order[cntx].asset[acnt].equipment+  '","'+   'EQ'+  '","'+   MyOrders.order[cntx].asset[acnt].equidescr+'");';
						}
						if (MyOrders.order[cntx].asset[acnt].funcloc.length>0){
						sqlstatement+='INSERT INTO MyAssets (orderno , id, type , name ) VALUES ('+ 
							'"'+MyOrders.order[cntx].orderno+  '","'+   MyOrders.order[cntx].asset[acnt].funcloc+  '","'+  'FL'+  '","'+   MyOrders.order[cntx].asset[acnt].funclocdesc+'");';
						}
				}
				//Loop and write TConfs to DB
				
	  
				//opMessage("Loading "+MyOrders.order[cntx].tconf.length+" TimeConfs");
			
				for(var acnt=0; acnt < MyOrders.order[cntx].tconf.length ; acnt++)
					{	
					if(MyOrders.order[cntx].tconf[acnt].description=="Travel"){
						tcType = "Travel";
						tcDesc="";
					}else{
						tcType = "Work";
						tcDesc=MyOrders.order[cntx].tconf[acnt].description;
					}
					if(MyOrders.order[cntx].tconf[acnt].final==""){
						tcFinal="";
					}else{
						tcFinal="Yes";
					}
					sqlstatement+='INSERT INTO MyTimeConfs (orderno , opno,type, confno , description , date , time , enddate, endtime, duration, empid, final,datestamp, user, state ) VALUES ('+
						'"'+MyOrders.order[cntx].orderno+  '","'+   MyOrders.order[cntx].tconf[acnt].activity+  '","'+   tcType+  '","'+   MyOrders.order[cntx].tconf[acnt].confno+  '","'+  tcDesc+  '","'+  MyOrders.order[cntx].tconf[acnt].date+  '","'+  MyOrders.order[cntx].tconf[acnt].time+  '",'+ 
						'"'+MyOrders.order[cntx].tconf[acnt].enddate+  '","'+  MyOrders.order[cntx].tconf[acnt].endtime+  '","'+  MyOrders.order[cntx].tconf[acnt].duration+  '","'+  MyOrders.order[cntx].tconf[acnt].empid+  '","'+  tcFinal+  '","","","");';
	

					}


			
			}

html5sql.process(sqlstatement,
						 function(){
							 //alert("Success inserted Orders Tables");
						 },
						 function(error, statement){
							 opMessage("Error: " + error.message + " when processing " + statement);
						 }        
				);			
			
		}
	


}
function objectsCB(Objects){
opMessage("Callback objects triggured");

		if(Objects.object.length>0){
			if(syncTransactionalDetsUpdated){
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+', Objects:'+String(Objects.object.length));
			}else{
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+'Objects:'+String(Objects.object.length));
			}
			opMessage("Deleting Existing Ref Assets");
			sqlstatement = 	'DELETE FROM Assets;';
			html5sql.process(sqlstatement,
						 function(){
							 //alert("Success Creating Tables");
						 },
						 function(error, statement){
							 opMessage("Error: " + error.message + " when processing " + statement);
						 }        
				);		
			sqlstatement='';	
			opMessage("Loading "+Objects.object.length+" Ref Assets");
			for(var cntx=0; cntx < Objects.object.length ; cntx++)
				{
				
				sqlstatement+='INSERT INTO Assets ( id, type , eqart, eqtyp, shorttext, address, workcenter ) VALUES ('+ 
						'"'+Objects.object[cntx].id+  '","'+  Objects.object[cntx].type+  '","'+  Objects.object[cntx].eqart+  '","'+ 
						    Objects.object[cntx].eqtyp+  '","'+ Objects.object[cntx].shorttext+  '","'+ Objects.object[cntx].address+  '","'+ Objects.object[cntx].swerk+'");';
					
				}
				
			html5sql.process(sqlstatement,
							 function(){
								 //alert("Success - Finished Loading Orders");
							 },
							 function(error, statement){
								 opMessage("Error: " + error.message + " when processing " + statement);
							 }        
			);			  
	



		}
}
function notificationCB(MyNotifications){
var sqlstatement;
opMessage("Callback Notifications triggured");


	if(MyNotifications.notification.length>0){
			if(syncTransactionalDetsUpdated){
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+', MyNotifications:'+String(MyNotifications.notification.length));
			}else{
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+'MyNotifications:'+String(MyNotifications.notification.length));
			}	
			opMessage("Deleting Existing Notifications");
			sqlstatement = 	'DELETE FROM MyNotifications;'+
							'DELETE FROM MyTasks;'+
							'DELETE FROM MyItems;'+
							'DELETE FROM MyCauses;'+
							'DELETE FROM MyActivities;'+
							'DELETE FROM MyEffects;';

			html5sql.process(sqlstatement,
						 function(){
							 //alert("Success Creating Tables");
						 },
						 function(error, statement){
							 //alert("Error: " + error.message + " when processing " + statement);
						 }        
				);		
			opMessage("Loading "+MyNotifications.notification.length+" Notifications");
			sqlstatement='';	

			for(var cntx=0; cntx < MyNotifications.notification.length ; cntx++)
				{
			

				sqlstatement+='INSERT INTO MyNotifications (notifno , shorttext , longtext , startdate , priority , type, funcloc, equipment, orderno, reportedon , reportedby , plant, funclocgis, equipmentgis, cattype, pgroup, pcode, grouptext, codetext) VALUES ( '+ 
					'"'+MyNotifications.notification[cntx].notifno +'",'+
					'"'+MyNotifications.notification[cntx].shorttext+'",'+ 
					'"'+MyNotifications.notification[cntx].longtext +'",'+ 
					'"'+MyNotifications.notification[cntx].startdate+'",'+ 
					'"'+MyNotifications.notification[cntx].priority+'",'+
					'"'+MyNotifications.notification[cntx].type+'",'+
					'"'+MyNotifications.notification[cntx].funcloc +'",'+ 
					'"'+MyNotifications.notification[cntx].equipment +'",'+
					'"'+MyNotifications.notification[cntx].orderno+'",'+
					'"'+MyNotifications.notification[cntx].reportedon +'",'+
					'"'+MyNotifications.notification[cntx].reportedby +'",'+
					'"'+MyNotifications.notification[cntx].plant+'",'+
					'"'+MyNotifications.notification[cntx].funclocgis +'",'+ 
					'"'+MyNotifications.notification[cntx].equipmentgis+'",'+
					'"'+MyNotifications.notification[cntx].cattype+'",'+
					'"'+MyNotifications.notification[cntx].pgroup +'",'+
					'"'+MyNotifications.notification[cntx].pcode+'",'+
					'"'+MyNotifications.notification[cntx].pgrouptext+'",'+ 
					'"'+MyNotifications.notification[cntx].pcodetext+'");';
					//Loop and write Items to DB
	

					opMessage("Loading "+MyNotifications.notification[cntx].task.length+" Tasks");
					for(var tcnt=0; tcnt < MyNotifications.notification[cntx].task.length ; tcnt++)
						{	

						sqlstatement+='INSERT INTO MyTasks (notifno , item_id , task_text , task_cat_typ , task_codegrp , task_code , txt_taskgrp ,txt_taskcd , plnd_start_date , plnd_start_time, plnd_end_date, plnd_end_time, sla_end_date, sla_end_time, longtext, complete, status) VALUES ( '+  
							'"'+MyNotifications.notification[cntx].notifno +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].id +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].task_text +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].task_cat_typ +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].task_codegrp +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].task_code +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].txt_taskgrp +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].txt_taskcd +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].plnd_start_date +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].plnd_start_time +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].plnd_end_date +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].plnd_end_time +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].sla_end_date +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].sla_end_time +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].longtext +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].complete +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].status +'");';
				
						}
						
					opMessage("Loading "+MyNotifications.notification[cntx].effect.length+" Effect");
					for(var ecnt=0; ecnt < MyNotifications.notification[cntx].effect.length ; ecnt++)
						{	

						sqlstatement+='INSERT INTO MyEffects (notifno , item_id , task_id, effect_cat_typ , effect_codegrp , effect_code , txt_effectgrp ,txt_effectcd , value) VALUES (  '+
							 '"'+MyNotifications.notification[cntx].notifno+'",'+
							 '"'+MyNotifications.notification[cntx].effect[ecnt].id+'",'+
							 '"'+MyNotifications.notification[cntx].effect[ecnt].task+'",'+
							 '"'+MyNotifications.notification[cntx].effect[ecnt].effect_cat_typ+'",'+
							 '"'+MyNotifications.notification[cntx].effect[ecnt].effect_codegrp+'",'+
							 '"'+MyNotifications.notification[cntx].effect[ecnt].effect_code+'",'+
							 '"'+MyNotifications.notification[cntx].effect[ecnt].txt_effectgrp+'",'+
							 '"'+MyNotifications.notification[cntx].effect[ecnt].txt_effectcd+'",'+
							 '"'+MyNotifications.notification[cntx].effect[ecnt].value+'");';
						}
	
					opMessage("Loading "+MyNotifications.notification[cntx].item.length+" Items");
					for(var icnt=0; icnt < MyNotifications.notification[cntx].item.length ; icnt++)
						{	
				
						sqlstatement+='INSERT INTO MyItems (notifno , item_id , descript , d_cat_typ , d_codegrp , d_code , dl_cat_typ , dl_codegrp , dl_code , stxt_grpcd , txt_probcd , txt_grpcd, txt_objptcd,  status, long_text) VALUES  (  '+
							 '"'+MyNotifications.notification[cntx].notifno +'",'+
							 '"'+MyNotifications.notification[cntx].item[icnt].id+'",'+ 
							 '"'+MyNotifications.notification[cntx].item[icnt].description+'",'+
							 '"'+MyNotifications.notification[cntx].item[icnt].d_cat_typ+'",'+
							 '"'+MyNotifications.notification[cntx].item[icnt].d_codegrp+'",'+
							 '"'+MyNotifications.notification[cntx].item[icnt].d_code+'",'+
							 '"'+MyNotifications.notification[cntx].item[icnt].dl_cat_typ+'",'+
							 '"'+MyNotifications.notification[cntx].item[icnt].dl_codegrp+'",'+
							 '"'+MyNotifications.notification[cntx].item[icnt].dl_code+'",'+
						
							 '"'+MyNotifications.notification[cntx].item[icnt].stxt_grpcd+'",'+
							 '"'+MyNotifications.notification[cntx].item[icnt].txt_prodcd+'",'+
							 '"'+MyNotifications.notification[cntx].item[icnt].txt_grpcd+'",'+
							 '"'+MyNotifications.notification[cntx].item[icnt].txt_objptcd+  '","S","");';

						}
					//Loop and write Causes to DB
						
					opMessage("Loading "+MyNotifications.notification[cntx].cause.length+" Causes");
					for(var ccnt=0; ccnt < MyNotifications.notification[cntx].cause.length ; ccnt++)
						{	

						sqlstatement+='INSERT INTO MyCauses (notifno , item_id , cause_id, cause_text , cause_cat_typ , cause_codegrp , cause_code , txt_causegrp , txt_causecd ,  status, long_text) VALUES ( '+ 
							  '"'+MyNotifications.notification[cntx].notifno+'",'+
							  '"'+MyNotifications.notification[cntx].cause[ccnt].id+'",'+
							  '"'+MyNotifications.notification[cntx].cause[ccnt].cause_key+'",'+
							  '"'+MyNotifications.notification[cntx].cause[ccnt].causetext+'",'+
							  '"'+MyNotifications.notification[cntx].cause[ccnt].cause_cat_typ+'",'+
							  '"'+MyNotifications.notification[cntx].cause[ccnt].cause_codegrp+'",'+ 
							  '"'+MyNotifications.notification[cntx].cause[ccnt].cause_code+'",'+
							  '"'+MyNotifications.notification[cntx].cause[ccnt].cause_txt_causegrp+'",'+
							  '"'+MyNotifications.notification[cntx].cause[ccnt].cause_txt_causecd+  '","S","");';
						}
					//Loop and write Items to DB
					
					opMessage("Loading "+MyNotifications.notification[cntx].activity.length+" Activities");
					for(var acnt=0; acnt < MyNotifications.notification[cntx].activity.length ; acnt++)
						{	

						sqlstatement+='INSERT INTO MyActivities (notifno , item_id , task_id, act_text , act_cat_typ , act_codegrp , act_code ,txt_actgrp, txt_actcd ,start_date , start_time , end_date , end_time,   status, act_id, long_text) VALUES ( '+ 
							  '"'+MyNotifications.notification[cntx].notifno+'",'+
							  '"'+MyNotifications.notification[cntx].activity[acnt].id+'",'+ 
							  '"'+MyNotifications.notification[cntx].activity[acnt].act_key+'",'+ 
							  '"'+MyNotifications.notification[cntx].activity[acnt].acttext+'",'+
							  '"'+MyNotifications.notification[cntx].activity[acnt].act_cat_typ+'",'+
							  '"'+MyNotifications.notification[cntx].activity[acnt].act_codegrp+'",'+ 
							  '"'+MyNotifications.notification[cntx].activity[acnt].act_code+'",'+ 
							  '"'+MyNotifications.notification[cntx].activity[acnt].txt_actgrp+'",'+
							  '"'+MyNotifications.notification[cntx].activity[acnt].txt_actcd+'",'+
							  '"'+MyNotifications.notification[cntx].activity[acnt].start_date+'",'+
							  '"'+MyNotifications.notification[cntx].activity[acnt].start_time+'",'+ 
							  '"'+MyNotifications.notification[cntx].activity[acnt].end_date+'",'+
							  '"'+MyNotifications.notification[cntx].activity[acnt].end_time+  '","S","","");';
						}
						
						

				}
			//("alert updateing Texts");
			html5sql.process(sqlstatement,
							 function(transaction, results, rowsArray){
								html5sql.process("select * from MyNotifications",
												 function(transaction, results, rowsArray){
													 for (var n = 0; n < rowsArray.length; n++) {
														nitem = rowsArray[n];
														//alert("select  CODEGROUP_TEXT from refcodegroups where catalog_type = '"+nitem.cattype+"' and codegroup = '"+nitem.pgroup+"' ORDER BY CODEGROUP_TEXT ASC LIMIT 1")
														html5sql.process("select  CODEGROUP_TEXT from refcodegroups where catalog_type = '"+nitem.cattype+"' and codegroup = '"+nitem.pgroup+"' ORDER BY CODEGROUP_TEXT ASC LIMIT 1",
																		 function(transaction, results, rowsArray1){
																			 for (var n = 0; n < rowsArray1.length; n++) {
																				if(rowsArray1.length>0){
																					//alert("update  MyNotifications set pgrouptext = '"+rowsArray1[0].codegroup_text+"' where notifno = '"+nitem.notifno+"'")
																					html5sql.process("update  MyNotifications set grouptext = '"+rowsArray1[0].codegroup_text+"' where notifno = '"+nitem.notifno+"'",
																									 function(transaction, results, rowsArray2){
																										 
																									 },
																									 function(error, statement){
																										 opMessage("Error: " + error.message + " when processing " + statement);
																									 }        
																					);
																				}
																			 }
																		 },
																		 function(error, statement){
																			 opMessage("Error: " + error.message + " when processing " + statement);
																		 }        
														);	
														


														html5sql.process("select CODE_TEXT from refcodes where code_cat_group = '"+nitem.cattype+nitem.pgroup+"' and code = '"+nitem.pcode+"' ORDER BY CODE_TEXT ASC LIMIT 1",
																		 function(transaction, results, rowsArray3){
																			 for (var n = 0; n < rowsArray3.length; n++) {
																				if(rowsArray3.length>0){
																					//alert("update  MyNotifications set pcodetext = '"+rowsArray3[0].code_text+"' where notifno = '"+nitem.notifno+"'")
																					html5sql.process("update  MyNotifications set codetext = '"+rowsArray3[0].code_text+"' where notifno = '"+nitem.notifno+"'",
																									 function(transaction, results, rowsArray4){
																										 
																									 },
																									 function(error, statement){
																										 opMessage("Error: " + error.message + " when processing " + statement);
																									 }        
																					);
																				}
																			 }
																		 },
																		 function(error, statement){
																			 opMessage("Error: " + error.message + " when processing " + statement);
																		 }        
														);														
													 }
												 },
												 function(error, statement){
													 opMessage("Error: " + error.message + " when processing " + statement);
												 }        
								);									 
							 },
							 function(error, statement){
								 opMessage("Error: " + error.message + " when processing " + statement);
							 }        
			);	
	}
}		
function sapCB(MySAP){
	
var sqlstatement="";
opMessage("Callback sapCB triggured");


	


	
	if(MySAP.message.length>0){
		
			opMessage("Processing Update Response: ");
//Handle Notification Create Response
			if (MySAP.message[0].type=="createnotification"){
				opMessage("-->Type= "+MySAP.message[0].type);
				opMessage("-->row= "+MySAP.message[0].recno);
				opMessage("-->Message= "+MySAP.message[0].message);
				opMessage("-->NotifNo= "+MySAP.message[0].notifno);

	
					sqlstatement+="UPDATE MyNewJobs SET state = '"+ MySAP.message[0].recno+"' WHERE id='"+ MySAP.message[0].notifno+"';";
					

		
			}
//Handle Vehicle Defect Response
			if (MySAP.message[0].type=="fileupload"){
//alert("File Uploaded response");
			}		
//Handle Vehicle Defect Response
			if (MySAP.message[0].type=="createvehicledefect"){
				opMessage("-->Message= "+MySAP.message[0].message);
				opMessage("-->NotifNo= "+MySAP.message[0].notifno);
			
				if(MySAP.message[0].message=="Success"){
					
					
		
						sqlstatement+="delete from MyNewJobs WHERE id='"+MySAP.message[0].recno+"';";
						
					}
		
			}	
//Handle Time Confirmation Create Response			
			if (MySAP.message[0].type=="createtconf"){
				//alert(MySAP.message[0].type+":"+MySAP.message[0].confno+":"+MySAP.message[0].recno)
				opMessage("-->Type= "+MySAP.message[0].type);
				opMessage("-->confno= "+MySAP.message[0].confno);
				if(MySAP.message[0].confno!="0000000000"){

					
		
						sqlstatement+="UPDATE MyTimeConfs SET confno = 'SERVER' WHERE id='"+MySAP.message[0].recno+"';";
						

					}
		
			}
//Handle Status Update Response
			if (MySAP.message[0].type=="updatestatus"){
				//alert("-->UpdateStatus"+MySAP.message[0].orderno+":"+MySAP.message[0].opno+":"+MySAP.message[0].message+":"+MySAP.message[0].recno);
				opMessage("-->UpdateStatus");
				opMessage("-->Orderno= "+MySAP.message[0].orderno);
				opMessage("-->Opno= "+MySAP.message[0].opno);
				opMessage("-->Message= "+MySAP.message[0].message);
				if(MySAP.message[0].message=="Status successfully changed"){

						
						sqlstatement+="delete from MyStatus WHERE id='"+MySAP.message[0].recno + "';";
			
					}
		
			}	
//Handle Create Notification Response
			if (MySAP.message[0].type=="createnotification"){
				//alert("-->Create Notification"+MySAP.message[0].notifno+":"+MySAP.message[0].message+":"+MySAP.message[0].recno+":"+MySAP.message[0].sapmessage);
				opMessage("-->Create Notification");
				opMessage("-->NotifNo= "+MySAP.message[0].notifno);
				opMessage("-->Message= "+MySAP.message[0].message);
				if(MySAP.message[0].message=="Success"){

						sqlstatement+="UPDATE MyNotifications SET notifno = '"+MySAP.message[0].notifno+"' WHERE id='"+MySAP.message[0].recno+"';";
			

			
					}
		
			}			
			if (MySAP.message[0].type=="updatemessagereadstatus"){
				
				opMessage("-->UpdateMessage Read");
				opMessage("-->ID= "+MySAP.message[0].id);
				opMessage("-->Message= "+MySAP.message[0].message);
				if(MySAP.message[0].message=="Success"){

			
		
						sqlstatement+="UPDATE MyMessages SET state = '1' WHERE id='"+MySAP.message[0].id + "';";
						
						
			
					}
		
			}	
			if (MySAP.message[0].type=="messagesend"){
				opMessage("-->UpdateMessage Sent");
				opMessage("-->ID= "+MySAP.message[0].id);
				opMessage("-->Message= "+MySAP.message[0].message);
				if(MySAP.message[0].message=="Success"){

			
		
						sqlstatement+="UPDATE MyMessages SET state = 'SENT' WHERE id="+MySAP.message[0].id + ";";
						
						
			
					}
		
			}
			html5sql.process(sqlstatement,
						 function(){
							 //alert("Success Creating Tables");
						 },
						 function(error, statement){
							 
							 opMessage("Error: " + error.message + " when processing " + statement);
						 }        
				);	
	}
}		
function getFlocs(){
	
	$.getJSON('MyFuncloc.json',function(Funcloc){ 
		var sqlstatement="";

		opMessage("Loading "+Funcloc.funcloc.length+" Functional Locations");
		for(var cntx=0; cntx < Funcloc.funcloc.length ; cntx++)
			{	
			sqlstatement+='INSERT INTO Assets (type , id , shorttext , name , city , street, postcode ) VALUES ('+ 
				'"FL",' + 
				'"'+Funcloc.funcloc[cntx].id +'",'+ 
				'"'+Funcloc.funcloc[cntx].shorttext +'",'+  
				'"'+Funcloc.funcloc[cntx].name +'",'+ 
				'"'+Funcloc.funcloc[cntx].city +'",'+ 
				'"'+Funcloc.funcloc[cntx].street +'",'+ 
				'"'+Funcloc.funcloc[cntx].postcod+'");';
				//Loop and write Tasks to DB

				opMessage("Loading "+Funcloc.funcloc[cntx].classval.length+" Class Vals");
				for(var opscnt=0; opscnt < Funcloc.funcloc[cntx].classval.length ; opscnt++)
					{	
					
					sqlstatement+='INSERT INTO AssetClassVals (type , id, charact , valuechar , valueto , valueneutral , description) VALUES ('+ 
						'"FL",' + 
						 '"'+Funcloc.funcloc[cntx].id +'",'+ 
						 '"'+Funcloc.funcloc[cntx].classval[opscnt].charact +'",'+ 
						 '"'+Funcloc.funcloc[cntx].classval[opscnt].valuechar +'",'+ 
						 '"'+Funcloc.funcloc[cntx].classval[opscnt].valueto +'",'+ 
						 '"'+Funcloc.funcloc[cntx].classval[opscnt].valueneutral +'",'+ 
						 '"'+Funcloc.funcloc[cntx].classval[opscnt].description+'");';
				
				}
				

			}
			html5sql.process(sqlstatement,
				 function(){
					 //alert("Success - Finished Loading Orders");
				 },
				 function(error, statement){
					 opMessage("Error: " + error.message + " when processing " + statement);
				 }        
			);	


	});
	
	

		
}
function refflocsCB(Funcloc){
	

	var sqlstatement="";

	opMessage("Loading "+Funcloc.funcloc.length+" Reference Functional Locations");
			if(syncTransactionalDetsUpdated){
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+', Funcloc:'+String(Funcloc.funcloc.length));
			}else{
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+'Funcloc:'+String(Funcloc.funcloc.length));
			}
	for(var cntx=0; cntx < Funcloc.funcloc.length ; cntx++)
		{	
		fllevel=((Funcloc.funcloc[cntx].id).match(/-/g) || []).length;
		if(fllevel=="0"){
			parentid="";
			}else{		
			parentid=(Funcloc.funcloc[cntx].id).substring(0,(Funcloc.funcloc[cntx].id).lastIndexOf("-"));
			}
		childcnt=cntx+1;
		if(childcnt<Funcloc.funcloc.length)
			{
			fllevelchild=((Funcloc.funcloc[childcnt].id).match(/-/g) || []).length;
			if(fllevelchild=="0"){
				parentidchild="";
				}else{		
				parentidchild=(Funcloc.funcloc[childcnt].id).substring(0,(Funcloc.funcloc[childcnt].id).lastIndexOf("-"));
				}
			if(parentidchild==Funcloc.funcloc[cntx].id)
				{
				children=1;
				}else{
				children=0;
				}
			}else{
				Children=0;
			}
	
		sqlstatement+='INSERT INTO FuncLocs (flid , description , swerk , level , parentid , children ) VALUES ('+ 
			'"'+Funcloc.funcloc[cntx].id +'",'+ 
			'"'+Funcloc.funcloc[cntx].shorttext +'",'+  
			'"'+Funcloc.funcloc[cntx].swerk +'",'+ 		
			'"'+fllevel +'",'+  //Works out the level by number of Hyphens
			'"'+parentid+'",' + // Gets the Parent Id as before last hyphen
			'"'+children+'");';

			

		}
		html5sql.process(sqlstatement,
			 function(){
			opMessage("Flocs inserted and now we do the Parent ID bit");
			
					},
					
			 function(error, statement){
				 opMessage("Error: " + error.message + " when processing " + statement);
			 }        
		);	







	
}

function refgasCB(Survey){


		var sqlstatement="";
		
		opMessage("Loading "+Survey.QUESTION.length+" Reference Gas Survey Questions");
		for(var cntx=0; cntx < Survey.QUESTION.length ; cntx++)
			{	

			sqlstatement+='INSERT INTO GASSurveyQ (type , qno , qtype , description) VALUES ('+ 
				'"Q",'+ 
				'"'+Survey.QUESTION[cntx].KEY +'",'+  
				'"'+Survey.QUESTION[cntx].TYPE +'",'+ 		
				'"'+Survey.QUESTION[cntx].LABEL +'");';
			
			if (Survey.QUESTION[cntx].TYPE=="LB")
				{
				opMessage("Loading "+Survey.QUESTION[cntx].ANSWER.length+" Answers");
				for(var opscnt=0; opscnt < Survey.QUESTION[cntx].ANSWER.length ; opscnt++)
					{	
					
					sqlstatement+='INSERT INTO GASSurveyA (type , qno, qkey , qvalue) VALUES ('+ 
						 '"Q",'+ 
						 '"'+ Survey.QUESTION[cntx].KEY+'",'+ 
						 '"'+ Survey.QUESTION[cntx].ANSWER[opscnt].KEY+'",'+  
						 '"'+ Survey.QUESTION[cntx].ANSWER[opscnt].VALUE+'");' ;
					}
				}//End of LB Build
				else
				{
				sqlstatement+='INSERT INTO GASSurveyA (type , qno, qkey , qvalue) VALUES ('+ 
					 '"Q",'+ 
					 '"'+ Survey.QUESTION[cntx].KEY+'",'+ 
					 '" ",'+  
					 '" ");' ;	
				}
			if (Survey.QUESTION[cntx].TYPE=="LDB")
				{
				//alert (Survey.QUESTION[cntx].LABEL+" - "+Survey.QUESTION[cntx].ANSWER.length)

				opMessage("Loading "+Survey.QUESTION[cntx].ANSWER.length+" Answers");
				for(var opscnt=0; opscnt < Survey.QUESTION[cntx].ANSWER.length ; opscnt++)
					{	
					if (Survey.QUESTION[cntx].LABEL=="Make") 
						{
						sqlstatement+='INSERT INTO GASSurveyMake (make , description) VALUES ('+ 
							 '"'+ Survey.QUESTION[cntx].ANSWER[opscnt].KEY+'",'+  
							 '"'+ Survey.QUESTION[cntx].ANSWER[opscnt].VALUE+'");' ;
						}
					if (Survey.QUESTION[cntx].LABEL=="Model") 
						{
					    var res = Survey.QUESTION[cntx].ANSWER[opscnt].VALUE.split("-");
						sqlstatement+='INSERT INTO GASSurveyModel (make , model, description) VALUES ('+ 
							 '"'+res[0]+'",'+  
							 '"'+ Survey.QUESTION[cntx].ANSWER[opscnt].KEY+'",'+ 
							 '"'+res[1]+'");' ;
						}
					if (Survey.QUESTION[cntx].LABEL=="Model") {
						if (opscnt>600) {
							//alert (Survey.QUESTION[cntx].ANSWER[opscnt].VALUE)
							opscnt = 10000;
							}
						} 
					}
				}//End of LDB Build
			}
			//alert(sqlstatement)
 			html5sql.process(sqlstatement,
				 function(){
					opMessage("Flocs inserted and now we do the Parent ID bit");
						//alert("good")
						},
						
				 function(error, statement){
					 opMessage("Error: " + error.message + " when processing " + statement);
					 //alert("bad")
				 }        
			);	 

}
function refgashdrCB(Survey){
	

	var sqlstatement="";

	opMessage("Loading "+Survey.QUESTION.length+" Reference Gas Survey Header Questions");
	for(var cntx=0; cntx < Survey.QUESTION.length ; cntx++)
		{

		sqlstatement+='INSERT INTO GASSurveyQ (type , qno , qtype , description) VALUES ('+ 
			'"H",'+ 
			'"'+Survey.QUESTION[cntx].KEY +'",'+  
			'"'+Survey.QUESTION[cntx].TYPE +'",'+ 		
			'"'+Survey.QUESTION[cntx].LABEL +'");';
		
		if (Survey.QUESTION[cntx].TYPE=="LB")
			{
			opMessage("Loading "+Survey.QUESTION[cntx].ANSWER.length+" Answers");
			for(var opscnt=0; opscnt < Survey.QUESTION[cntx].ANSWER.length ; opscnt++)
				{	
				
				sqlstatement+='INSERT INTO GASSurveyA (type , qno, qkey , qvalue) VALUES ('+ 
					 '"H",'+ 
					 '"'+ Survey.QUESTION[cntx].KEY+'",'+ 
					 '"'+ Survey.QUESTION[cntx].ANSWER[opscnt].KEY+'",'+  
					 '"'+ Survey.QUESTION[cntx].ANSWER[opscnt].VALUE+'");' ;
				}
			}//End of LB Build
			else
			{
			sqlstatement+='INSERT INTO GASSurveyA (type , qno, qkey , qvalue) VALUES ('+ 
				 '"H",'+ 
				 '"'+ Survey.QUESTION[cntx].KEY+'",'+ 
				 '" ",'+  
				 '" ");' 	;
			}
		}
//alert(sqlstatement)
 		html5sql.process(sqlstatement,
			 function(){
			opMessage("Flocs inserted and now we do the Parent ID bit");
			
					},
					
			 function(error, statement){
				 opMessage("Error: " + error.message + " when processing " + statement);
			 }        
		);	 







	
}


function getEquips(){	

	$.getJSON('MyEquipment.json',function(Equipment){ 
		var sqlstatement="";

		opMessage("Loading "+Equipment.equipment.length+" Equipment");
		for(var cntx=0; cntx < Equipment.equipment.length ; cntx++)
			{	
			sqlstatement+='INSERT INTO Assets (type , id , shorttext , name , city , street, postcode ) VALUES ('+ 
				'"EQ",'+ 
				'"'+ Equipment.equipment[cntx].id +'",'+ 
				'"'+ Equipment.equipment[cntx].shorttext +'",'+ 
				'"'+ Equipment.equipment[cntx].name +'",'+ 
				'"'+ Equipment.equipment[cntx].city +'",'+ 
				'"'+ Equipment.equipment[cntx].street +'",'+ 
				'"'+ Equipment.equipment[cntx].postcode+'");' ;
				//Loop and write Tasks to DB

				opMessage("Loading "+Equipment.equipment[cntx].classval.length+" Class Vals");
				for(var opscnt=0; opscnt < Equipment.equipment[cntx].classval.length ; opscnt++)
					{	
					
					sqlstatement+='INSERT INTO AssetClassVals (type , id, charact , valuechar , valueto , valueneutral , description) VALUES ('+ 
						 '"EQ",'+ 
						 '"'+ Equipment.equipment[cntx].id+'",'+ 
						 '"'+ Equipment.equipment[cntx].classval[opscnt].charact+'",'+  
						 '"'+ Equipment.equipment[cntx].classval[opscnt].valuechar+'",'+ 
						 '"'+ Equipment.equipment[cntx].classval[opscnt].valueto+'",'+ 
						 '"'+ Equipment.equipment[cntx].classval[opscnt].valueneutral+'",'+  
						 '"'+ Equipment.equipment[cntx].classval[opscnt].description+'");' ;
				
					}
				

			}
			html5sql.process(sqlstatement,
				 function(){
					 //alert("Success - Finished Loading Orders");
				 },
				 function(error, statement){
					 opMessage("Error: " + error.message + " when processing " + statement);
				 }        
			);


	});
}
function userCB(MyUsers){
var sqlstatement="";		

	if(MyUsers.user.length>0){
			if(syncReferenceDetsUpdated){
				localStorage.setItem('LastSyncReferenceDetails',localStorage.getItem('LastSyncReferenceDetails')+', Users:'+String(MyUsers.user.length));
			}else{
				localStorage.setItem('LastSyncReferenceDetails',localStorage.getItem('LastSyncReferenceDetails')+'Users:'+String(MyUsers.user.length));
			}

			opMessage("Deleting Existing Users");
			sqlstatement+='DELETE FROM MyRefUsers;';
			opMessage("Loading"+MyUsers.user.length+" Existing Users");
			for(var cntx=0; cntx < MyUsers.user.length ; cntx++)
				{	

				sqlstatement+='INSERT INTO MyRefUsers (userid , scenario , plant , workcenter , plannergroup , plannergroupplant, storagegroup, storageplant, partner, partnerrole, funclocint, funcloc, compcode, employeeno, equipment, firstname, lastname, telno ) VALUES ('+ 
					'"'+MyUsers.user[cntx].userid +'",'+  
					'"'+MyUsers.user[cntx].scenario +'",'+   
					'"'+MyUsers.user[cntx].plant +'",'+   
					'"'+MyUsers.user[cntx].workcenter +'",'+  
					'"'+MyUsers.user[cntx].plannergroup +'",'+  
					'"'+MyUsers.user[cntx].plannergroupplant +'",'+   
					'"'+MyUsers.user[cntx].storagegroup +'",'+  
					'"'+MyUsers.user[cntx].storageplant +'",'+   
					'"'+MyUsers.user[cntx].partner +'",'+  
					'"'+MyUsers.user[cntx].partnerrole +'",'+  
					'"'+MyUsers.user[cntx].funclocint +'",'+  
					'"'+MyUsers.user[cntx].funcloc +'",'+  
					'"'+MyUsers.user[cntx].compcode +'",'+  
					'"'+MyUsers.user[cntx].employeeno +'",'+  
					'"'+MyUsers.user[cntx].equipment +'",'+  
					'"'+MyUsers.user[cntx].firstname +'",'+  
					'"'+MyUsers.user[cntx].lastname+'",'+  
					'"'+MyUsers.user[cntx].telno+'");';
					
					

				}	

			html5sql.process(sqlstatement,
				 function(){
					 //alert("Success - Finished Loading Orders");
				 },
				 function(error, statement){
					 opMessage("Error: " + error.message + " when processing " + statement);
				 }        
			);


	}
}
function vehicleCB(MyVehicles){
var sqlstatement="";	

	if(MyVehicles.vehicle.length>0){
		
			if(syncReferenceDetsUpdated){
				localStorage.setItem('LastSyncReferenceDetails',localStorage.getItem('LastSyncReferenceDetails')+', Vehicles:'+String(MyVehicles.vehicle.length));
			}else{
				localStorage.setItem('LastSyncReferenceDetails',localStorage.getItem('LastSyncReferenceDetails')+'Vehicles:'+String(MyVehicles.vehicle.length));
			}
			opMessage("Deleting Existing Vehicles");
			sqlstatement+='DELETE FROM MyVehicles;';
			opMessage("Loading"+MyVehicles.vehicle.length+" Vehicles");
			for(var cntx=0; cntx < MyVehicles.vehicle.length ; cntx++)
				{	

				sqlstatement+='INSERT INTO MyVehicles (id , reg , description , mpoint ) VALUES ( '+
					'"'+MyVehicles.vehicle[cntx].vehicle +'",'+ 
					'"'+MyVehicles.vehicle[cntx].reg +'",'+ 
					'"'+MyVehicles.vehicle[cntx].description+'",'+ 
					'"'+MyVehicles.vehicle[cntx].mpoint+'");';
					
					

				}		
			html5sql.process(sqlstatement,
				 function(){
					 //alert("Success - Finished Loading Orders");
				 },
				 function(error, statement){
					 opMessage("Error: " + error.message + " when processing " + statement);
				 }        
			);


	}
}
function messageCB(MyMessages){
var sqlstatement="";


	if(MyMessages.messages.length>0){
			if(syncTransactionalDetsUpdated){
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+', Messages:'+String(MyMessages.messages.length));
			}else{
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+'Messages:'+String(MyMessages.messages.length));
			}

			opMessage("Deleting Existing Messages");
			sqlstatement+='DELETE FROM MyMessages where msgfromid <> "SENTMSG";';
			opMessage("Loading"+MyMessages.messages.length+" Messages");
            //alert("Loading"+MyMessages.messages.length+" Messages");
			for(var cntx=0; cntx < MyMessages.messages.length ; cntx++)
				{	

				 sqlstatement+='INSERT INTO MyMessages (msgid, type , date , time , msgfromid, msgfromname, msgtoid, msgtoname, msgsubject, msgtext, expirydate, state ) VALUES ('+ 
					'"'+MyMessages.messages[cntx].id +'",'+  
					'"'+MyMessages.messages[cntx].type +'",'+  
					'"'+MyMessages.messages[cntx].date +'",'+ 
					'"'+MyMessages.messages[cntx].time +'",'+ 
					'"'+MyMessages.messages[cntx].fromid +'",'+ 
					'"'+MyMessages.messages[cntx].fromname +'",'+ 
					'"'+MyMessages.messages[cntx].toid +'",'+ 
					'"'+MyMessages.messages[cntx].toname +'",'+ 
					'"'+MyMessages.messages[cntx].description +'",'+ 
					'"'+MyMessages.messages[cntx].body+'",'+  
					'"'+MyMessages.messages[cntx].expirydate+'",'+
					'"'+MyMessages.messages[cntx].read+'");'  ;

				}
					
			html5sql.process(sqlstatement,
				 function(){
					 //alert("Success - Finished Loading Messages");
				 },
				 function(error, statement){
					 //opMessage("Error: " + error.message + " when processing " + statement);
					 //alert("Error: " + error.message + " when processing " + statement);
				 }        
			);


	}
}
function tsnpjobsCB(jobs){
var sqlstatement="";		

	if(jobs.NPJOBSRECORD.length>0){


			opMessage("Deleting Existing TS NP Jobs");
			sqlstatement+='DELETE FROM TSNPJobs;';
			opMessage("Loading"+jobs.NPJOBSRECORD.length+" TS NPJobs");
			for(var cntx=0; cntx < jobs.NPJOBSRECORD.length ; cntx++)
				{	

				sqlstatement+='INSERT INTO TSNPJobs (jobno , subtype , description ) VALUES ('+ 
					'"'+jobs.NPJOBSRECORD[cntx].JOBNO +'",'+  
					'"'+jobs.NPJOBSRECORD[cntx].SUBTYPE+'",'+  
					'"'+jobs.NPJOBSRECORD[cntx].DESC+'");' ;
					
					

				}		
			html5sql.process(sqlstatement,
				 function(){
					 //alert("Success - Finished Loading Orders");
				 },
				 function(error, statement){
					 opMessage("Error: " + error.message + " when processing " + statement);
				 }        
			);


	}
}
function tsactivitiesCB(activities){
var sqlstatement="";		

	if(activities.ACTIVITYRECORD.length>0){


			opMessage("Deleting Existing TS Activities");
			sqlstatement+='DELETE FROM TSActivities;';
			opMessage("Loading"+activities.ACTIVITYRECORD.length+" TS Activities");
			for(var cntx=0; cntx < activities.ACTIVITYRECORD.length ; cntx++)
				{	

				sqlstatement+='INSERT INTO TSActivities (code , skill , subskill, description ) VALUES ('+ 
					'"'+activities.ACTIVITYRECORD[cntx].CODE +'",'+  
					'"'+activities.ACTIVITYRECORD[cntx].SKILL+'",'+ 
					'"'+activities.ACTIVITYRECORD[cntx].SUBSKILL+'",'+  					
					'"'+activities.ACTIVITYRECORD[cntx].DESC+'");' ;
					
					

				}		
			html5sql.process(sqlstatement,
				 function(){
					 //alert("Success - Finished Loading Orders");
				 },
				 function(error, statement){
					 opMessage("Error: " + error.message + " when processing " + statement);
				 }        
			);


	}
}
function orderobjectsCB1(MyObjects){
}
function orderobjectsCB(MyObjects){
var sqlstatement="";		

	if(MyObjects.orderobjects.length>0){

			if(syncTransactionalDetsUpdated){
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+', Order Objects:'+String(MyObjects.orderobjects.length));
			}else{
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+'Order Objects:'+String(MyObjects.orderobjects.length));
			}
			opMessage("Deleting Existing Assets");
			sqlstatement+='DELETE FROM Assets;';
			sqlstatement+='DELETE FROM AssetClassVals;';
			sqlstatement+='DELETE FROM AssetMeasurementPoints;';
			sqlstatement+='DELETE FROM AssetInstalledEquip;';
			opMessage("Loading "+MyObjects.orderobjects.length+" Assets");
			for(var cntx=0; cntx <   MyObjects.orderobjects.length ; cntx++){
				objtype=MyObjects.orderobjects[cntx].objtype;
				objid=MyObjects.orderobjects[cntx].objid;
				objshorttext=MyObjects.orderobjects[cntx].shorttext; 
				objaddress=MyObjects.orderobjects[cntx].address;
				objswerk=MyObjects.orderobjects[cntx].swerk;

				sqlstatement+='INSERT INTO Assets (type , id , shorttext , address, workcenter ) VALUES ("'+objtype+'","'+  objid+'","'+ objshorttext+'","'+ objaddress+'","'+ objswerk+'");';
				//Loop and write Classvals to DB

				// opMessage("Loading "+MyObjects.orderobjects[cntx].classval.length+" Class Vals");
				
				// for(var opscnt=0; opscnt < MyObjects.orderobjects[cntx].classval.length ; opscnt++)
					// {	
					
					// sqlstatement+='INSERT INTO AssetClassVals (type , id, charact , valuechar , valueto , valueneutral , description) VALUES ('+ 
						// '"'+objtype+'",'+
						 // '"'+objid+'",'+
						 // '"'+MyObjects.orderobjects[cntx].classval[opscnt].charact+'",'+
						 // '"'+MyObjects.orderobjects[cntx].classval[opscnt].valuechar+'",'+
						 // '"'+MyObjects.orderobjects[cntx].classval[opscnt].valueto+'",'+
						 // '"'+MyObjects.orderobjects[cntx].classval[opscnt].valueneutralv 
						 // '"'+MyObjects.orderobjects[cntx].classval[opscnt].description+'");'
				
					// }
				//Loop and write Measurement Points to DB

				// opMessage("Loading "+MyObjects.orderobjects[cntx].measpoint.length+" Mesurement Points");
				
				// for(var opscnt=0; opscnt < MyObjects.orderobjects[cntx].measpoint.length ; opscnt++)
					// {	
					
					// sqlstatement+='INSERT INTO AssetMeasurementPoints (type , id, mpoint  , description) VALUES ( '+
						// '"'+objtype+'",'+
						 // '"'+objid+'",'+
						 // '"'+MyObjects.orderobjects[cntx].measpoint[opscnt].mpoint+'",'+ 
						 // '"'+MyObjects.orderobjects[cntx].measpoint[opscnt].description+'");'
				
					// }
			
				//Loop and write Installed Equipment to DB

				// opMessage("Loading "+MyObjects.orderobjects[cntx].installedquip.length+" Installed Equipment");
				
				// for(var opscnt=0; opscnt < MyObjects.orderobjects[cntx].installedquip.length ; opscnt++)
					// {	
					
					// sqlstatement+='INSERT INTO AssetInstalledEquip (type , id, eqno , description) VALUES ( '+
						// '"'+objtype+'",'+
						 // '"'+objid+'",'+
						 // '"'+MyObjects.orderobjects[cntx].installedquip[opscnt].eqno+'",'+ 
						 // '"'+MyObjects.orderobjects[cntx].installedquip[opscnt].type+'");'
				
					// }
				

			}	
					//alert(sqlstatement);			
			html5sql.process(sqlstatement,
				 function(){
					 //alert("Success - Finished Loading Orders");
				 },
				 function(error, statement){
					 opMessage("Error: " + error.message + " when processing " + statement);
				 }        
			);


	}
}
	
function refdataCB(MyReference){
var sqlstatement="";
opMessage("Callback Reference Data triggured");
	    
	if(MyReference.scenario.length>0){
			if(syncReferenceDetsUpdated){
				localStorage.setItem('LastSyncReferenceDetails',localStorage.getItem('LastSyncReferenceDetails')+', Scenarios:'+String(MyReference.scenario.length));
			}else{
				localStorage.setItem('LastSyncReferenceDetails',localStorage.getItem('LastSyncReferenceDetails')+'Scenarios:'+String(MyReference.scenario.length));
			}
			opMessage("Deleting Existing Reference Data");
			sqlstatement+='DELETE FROM MyRefOrderTypes;';
			sqlstatement+='DELETE FROM MyRefNotifTypes;';
			sqlstatement+='DELETE FROM MyRefPriorityTypes;';
			sqlstatement+='DELETE FROM MyRefUserStatusProfiles;';
			for(var cntx=0; cntx < MyReference.scenario.length ; cntx++)
				{	
				opMessage("Loading Scenario "+MyReference.scenario[cntx].scenario + " Reference Data");

					//Loop and write ordertypes to DB

					opMessage("Loading "+MyReference.scenario[cntx].ordertype.length+" Order Types");
					for(var opscnt=0; opscnt < MyReference.scenario[cntx].ordertype.length ; opscnt++)
						{	
					
						sqlstatement+='INSERT INTO MyRefOrderTypes (scenario, type , description, statusprofile ,opstatusprofile ,priorityprofile) VALUES ('+
							 '"'+MyReference.scenario[cntx].scenario+'",'+
							 '"'+MyReference.scenario[cntx].ordertype[opscnt].type+'",'+
							 '"'+MyReference.scenario[cntx].ordertype[opscnt].description+'",'+
							 '"'+MyReference.scenario[cntx].ordertype[opscnt].statusprofile+'",'+
							 '"'+MyReference.scenario[cntx].ordertype[opscnt].opstatusprofile+'",'+
							 '"'+MyReference.scenario[cntx].ordertype[opscnt].priorityprofile+'");';
						}
						//Loop and write notiftypes to DB


						opMessage("Loading "+MyReference.scenario[cntx].notiftype.length+" Notif Types");
						for(var opscnt=0; opscnt < MyReference.scenario[cntx].notiftype.length ; opscnt++)
							{	
							
							sqlstatement+='INSERT INTO MyRefNotifTypes (scenario , type , description , statusprofile,	taskstatusprofile , priority_type ) VALUES  ('+
								 '"'+MyReference.scenario[cntx].scenario+'",'+
								 '"'+MyReference.scenario[cntx].notiftype[opscnt].type+'",'+
								 '"'+MyReference.scenario[cntx].notiftype[opscnt].description+'",'+
								 '"'+MyReference.scenario[cntx].notiftype[opscnt].statusprofile+'",'+
								 '"'+MyReference.scenario[cntx].notiftype[opscnt].taskstatusprofile+'",'+
								 '"'+MyReference.scenario[cntx].notiftype[opscnt].priority_type+'");';
						}
							

							//Loop and write prioritytypes to DB

						opMessage("Loading "+MyReference.scenario[cntx].prioritytype.length+" Priority Types");
						for(var opscnt=0; opscnt < MyReference.scenario[cntx].prioritytype.length ; opscnt++)
							{	
							
							sqlstatement+='INSERT INTO MyRefPriorityTypes (scenario, type , priority, description ) VALUES  ('+
								 '"'+MyReference.scenario[cntx].scenario+'",'+
								 '"'+MyReference.scenario[cntx].prioritytype[opscnt].type+'",'+
								 '"'+MyReference.scenario[cntx].prioritytype[opscnt].priority+'",'+
								 '"'+MyReference.scenario[cntx].prioritytype[opscnt].description+'");';
							
							}
						//Loop and write prioritytypes to DB
						opMessage("Loading "+MyReference.scenario[cntx].userstatus.length+" Status Profiles");
						for(var opscnt=0; opscnt < MyReference.scenario[cntx].userstatus.length ; opscnt++)
							{	
									
							sqlstatement+='INSERT INTO MyRefUserStatusProfiles (scenario, type , status, statuscode, statusdesc ) VALUES  ('+
									 '"'+MyReference.scenario[cntx].scenario+'",'+
									 '"'+MyReference.scenario[cntx].userstatus[opscnt].type+'",'+
									 '"'+MyReference.scenario[cntx].userstatus[opscnt].status+'",'+
									 '"'+MyReference.scenario[cntx].userstatus[opscnt].statuscode+'",'+
									 '"'+MyReference.scenario[cntx].userstatus[opscnt].statusdesc +'");';
							
							}			


					
				
			}
			html5sql.process(sqlstatement,
				 function(){
					 //alert("Success - Finished Loading Orders");
				
				 },
				 function(error, statement){
					 opMessage("Error: " + error.message + " when processing " + statement);
				 }        
			);	


	}
}
function refdatacodesCB(MyReference){
var sqlstatement="";


opMessage("Callback Reference Data Codes triggured");

	if(MyReference.catprofile.length>0){
			if(syncReferenceDetsUpdated){
				localStorage.setItem('LastSyncReferenceDetails',localStorage.getItem('LastSyncReferenceDetails')+', CatProfiles:'+String(MyReference.catprofile.length));
			}else{
				localStorage.setItem('LastSyncReferenceDetails',localStorage.getItem('LastSyncReferenceDetails')+'CatProfiles:'+String(MyReference.catprofile.length));
			}
			opMessage("Deleting Existing Reference Data");
			sqlstatement+='DELETE FROM RefNotifprofile;';
			sqlstatement+='DELETE FROM RefCodeGroups;';
			sqlstatement+='DELETE FROM RefCodes;';
			sqlstatement1="";
			//alert(MyReference.catprofile.length)
			html5sql.process(sqlstatement,
				 function(){
					
						sqlstatement='';
						rcgcnt=0;
						for(var cntx=0; cntx < MyReference.catprofile.length ; cntx++)
							{	
							
							sqlstatement+='INSERT INTO RefNotifprofile (scenario, profile , notif_type ) VALUES ('+
									 '"'+MyReference.catprofile[cntx].scenario+'",'+
									 '"'+MyReference.catprofile[cntx].notifcat_profile+'",'+
									 '"'+MyReference.catprofile[cntx].notifcat_type+'");';
								
								

								//Loop and write codegroups to DB
								
								sqlstatement+=prepLogMessage("Loading "+MyReference.catprofile[cntx].notifcat_profile+MyReference.catprofile[cntx].codegroup.length)+";";
								for(var opscnt=0; opscnt < MyReference.catprofile[cntx].codegroup.length ; opscnt++)
								{
									sqlstatement+='INSERT INTO RefCodeGroups (scenario, profile , catalog_type , code_cat_group , codegroup , codegroup_text  ) VALUES  ('+
										'"'+MyReference.catprofile[cntx].scenario+'",'+
										 '"'+MyReference.catprofile[cntx].notifcat_profile+'",'+
										 '"'+MyReference.catprofile[cntx].codegroup[opscnt].catalog_type+'",'+
										 '"'+MyReference.catprofile[cntx].codegroup[opscnt].code_cat_group+'",'+
										 '"'+MyReference.catprofile[cntx].codegroup[opscnt].codegroup+'",'+
										 '"'+MyReference.catprofile[cntx].codegroup[opscnt].codegroup_text+'");';
									
									
									//Loop and write codes to DB
									
									sqlstatement+=prepLogMessage("Loading "+MyReference.catprofile[cntx].codegroup[opscnt].codes.length+" Codes")+";";
									for(var ccnt=0; ccnt < MyReference.catprofile[cntx].codegroup[opscnt].codes.length ; ccnt++)
										{	
										x=MyReference.catprofile[cntx].codegroup[opscnt].codes[ccnt].code_text.replace(/'/g, "");;
										x=x.replace("\/", "");;
										x=x.replace(/&/g, "");;
										sqlstatement+='INSERT INTO RefCodes (scenario, profile , code_cat_group , code , code_text ) VALUES  ('+
											 '"'+MyReference.catprofile[cntx].scenario+'",'+
											 '"'+MyReference.catprofile[cntx].notifcat_profile+'",'+
											 '"'+MyReference.catprofile[cntx].codegroup[opscnt].code_cat_group+'",'+
											 '"'+MyReference.catprofile[cntx].codegroup[opscnt].codes[ccnt].code+'",'+
											 '"'+x+'");';
										}
								
									}
								}				 

										
			html5sql.process(sqlstatement,
				 function(){
					// alert("Success - Finished Loading Survey Data");
				 },
				 function(error, statement){
					 //alert("Error: " + error.message + " when processing " + statement);
				 }        
			);		
					rcgcnt=0;
				 },
				 function(error, statement){
					 opMessage("Error: " + error.message + " when processing " + statement);
				 }        
			);	
	


	};
}






function surveysCB(data){
	var sqlstatement="";
	var ret = [];
	var dependson;
	
	opMessage("Callback Surveys triggured");
	
		if(data.Surveys.length>0){

				opMessage("Deleting Existing Reference Data");
			
				sqlstatement+='DELETE FROM Survey;';
				sqlstatement+='DELETE FROM SurveyGroup;';
				sqlstatement+='DELETE FROM SurveyQuestion;';
				sqlstatement+='DELETE FROM SurveySubQuestion;';
				sqlstatement+='DELETE FROM  SurveyQuestionChildren;';
				sqlstatement1="";
			
				html5sql.process(sqlstatement,
					 function(){
						
							sqlstatement='';
							rcgcnt=0;
							for(var cntx=0; cntx < data.Surveys.length ; cntx++)
								{	
								
								sqlstatement+='INSERT INTO Survey (surveyid, name ) VALUES ('+
										 '"'+data.Surveys[cntx].SurveyID+'",'+
										 '"'+data.Surveys[cntx].SurveyName+'");';
								for(var cntg=0; cntg < data.Surveys[cntx].Group.length ; cntg++)
									{	
									
									sqlstatement+='INSERT INTO SurveyGroup (surveyid, groupid, name, title ) VALUES ('+
											 '"'+data.Surveys[cntx].SurveyID+'",'+
											 '"'+data.Surveys[cntx].Group[cntg].GroupID+'",'+
											 '"'+data.Surveys[cntx].Group[cntg].GroupName+'",'+
											 '"'+data.Surveys[cntx].Group[cntg].GroupDescription+'");';

									
									for(var cntq=0; cntq < data.Surveys[cntx].Group[cntg].Question.length ; cntq++)
										{	
										dependson=data.Surveys[cntx].Group[cntg].Question[cntq].QuestionDependsOn+": : ";
										ret=dependson.split(':');
										sqlstatement+='INSERT INTO SurveyQuestion (surveyid, groupid, questionid, questiontype, defaultvalue, name, title, dependsonid, dependsonval) VALUES ('+
												 '"'+data.Surveys[cntx].SurveyID+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].GroupID+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].Question[cntq].QuestionID+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].Question[cntq].QuestionType+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].Question[cntq].QuestionDefaultValue+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].Question[cntq].QuestionName+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].Question[cntq].QuestionText+'",'+
												 '"'+ret[0]+'",'+	
												 '"'+ret[1]+'");';
										for(var cntsq=0; cntsq < data.Surveys[cntx].Group[cntg].Question[cntq].SubQuestion.length ; cntsq++)
										{	
										dependson=data.Surveys[cntx].Group[cntg].Question[cntq].SubQuestion[cntsq].SubQuestionDependsOn+": : ";
										ret=dependson.split(':');
										sqlstatement+='INSERT INTO SurveySubQuestion (surveyid, groupid, questionid, subquestionid, subquestiontype, name, title, dependsonid, dependsonval) VALUES ('+
												 '"'+data.Surveys[cntx].SurveyID+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].GroupID+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].Question[cntq].QuestionID+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].Question[cntq].SubQuestion[cntsq].SubQuestionID+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].Question[cntq].SubQuestion[cntsq].SubQuestionType+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].Question[cntq].SubQuestion[cntsq].SubQuestionName+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].Question[cntq].SubQuestion[cntsq].SubQuestionText+'",'+
												 '"'+ret[0]+'",'+	
												 '"'+ret[1]+'");';
											
											

											}																	
											

											}										
										

										}
								
								
								
									

									}				 

										
								html5sql.process(sqlstatement,
									 function(){
										//alert("Success - Finished Loading Survey Data");
									 },
									 function(error, statement){
										 //alert("Error: " + error.message + " when processing " + statement);
									 }        
								);	
				BuildQuestionChildren();
				},	
				 function(error, statement){
					 //alert("Error: " + error.message + " when processing " + statement);
				 }        
			);		

	}
	
}
function BuildQuestionChildren(){
	var sqlstatement="";
	var sqlstatement1="";
	var question = " ";
	var questionchildren='';
	var questionvalue="";
	
	opMessage("Building Survey Question Children");

			
				sqlstatement='Select * from SurveyQuestion where dependsonid > 0 order by dependsonid';

				html5sql.process(sqlstatement,
						function(transaction, results, rowsArray){
							if( rowsArray.length > 0) {
								for (var n = 0; n < rowsArray.length; n++) {
									item = rowsArray[n];
									//alert(item.questionid+"-"+item.name);
								
									if (item.dependsonid != question){
										if (question != ' '){								
										
											sqlstatement1+='INSERT INTO surveyquestionchildren (surveyid , groupid, questionid, questionvalue, childquestions ) VALUES ("'+
												item.surveyid+'", "'+item.groupid+'", "'+question+'", "'+questionvalue+'", "'+questionchildren+'");';
										}

									question=item.dependsonid;
									questionvalue=item.dependsonval;
									questionchildren =item.questionid;	
									}else{
										questionchildren += ":"+item.questionid;	
									}

									
								}
								
								
								html5sql.process(sqlstatement1,
										function(transaction, results, rowsArray){
											

										},
										 function(error, statement){
											 window.console&&console.log("Error: " + error.message + " when processing " + statement);
										 }   
									);									
					
							}

						},
						 function(error, statement){
							 window.console&&console.log("Error: " + error.message + " when processing " + statement);
						 }   
					);	

	
	
}
