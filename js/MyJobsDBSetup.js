var objtype="";	
var objid="";	
var objshorttext="";	
var objaddress="";	
var objswerk="";		

var SAPServerPrefix="";
var SAPServerSuffix="";	

var parTrace= "ON";
var syncDetsSet=false;

var MyMessages = 
	
		{
			"msg":
				[
					{"type": "SM", "date": "2013-01-01", "time": "09:00", "msgfrom": "", "msgto": "ostridgep", "msgtext": "SAP will be going down on Wednesday evening", "state": "S"},
						{"type": "IM", "date": "2013-01-01", "time": "09:00", "msgfrom": "Fred Smith", "msgto": "ostridgep", "msgtext": "Hi Paul;", "state": "S"},
							{"type": "OM", "date": "2013-01-01", "time": "09:00", "msgfrom": "Paul Ostridge", "msgto": "ostridgep", "msgtext": "I need a new hammer", "state": "S"},
								{"type": "IM", "date": "2013-01-01", "time": "09:00", "msgfrom": "George Martin", "msgto": "ostridgep", "msgtext": "Team Briefing cancelled", "state": "S"},
									{"type": "IM", "date": "2013-01-01", "time": "09:00", "msgfrom": "Harru Hudson", "msgto": "ostridgep", "msgtext": "Meet you at the Red Lion", "state": "S"},
										{"type": "IM", "date": "2013-01-01", "time": "09:00", "msgfrom": "Lee Evans", "msgto": "ostridgep", "msgtext": "Good News Worcester beat Wasps", "state": "S"}

				]
		};
function requestSAPData(page,params){
	opMessage(SAPServerPrefix+page+SAPServerSuffix+params);
	var myurl=SAPServerPrefix+page+SAPServerSuffix+params;
	//alert(myurl);
   $.getJSON(myurl);
}
function sendSAPData(page){
	opMessage(page);

   $.getJSON(page);
}

function opMessage(msg){



	opLog(msg);


}
function opLog(msg){

nowd=getDate();
nowt=getTime();
dtstamp=nowd+nowt;
parTrace=localStorage.getItem('TRACE');
var sqlstatement='INSERT INTO LogFile (datestamp , type, message ) VALUES ("'+dtstamp+'","I","'+ msg+'");'
	if (parTrace=='ON'){
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
				traceState= rowsArray[0].paramvalue
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

function SetLocalStorage(){

html5sql.process(
    ["SELECT * from MyWorkConfig "],
    function(transaction, results, rowsArray){
      for(var i = 0; i < rowsArray.length; i++){
        //each row in the rowsArray represents a row retrieved from the database
        var id = rowsArray[i].ID;
        var Title = rowsArray[i].Title;
        var mYear = rowsArray[i].mYear;
        console.log("Retrieved Milestone: "+id+" - "+Title+" "+mYear);
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
localStorage.setItem(paramName, paramValue);

			
	html5sql.process(
		["SELECT * from MyWorkConfig where paramname = '"+paramName+"'"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				sqlstatement="UPDATE MyWorkConfig SET paramvalue = '"+paramValue+"' WHERE paramname = '"+paramName+"';"
				}else{
				sqlstatement="INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('"+paramName+"','"+paramValue+"');"
				}
			html5sql.process(sqlstatement,
			 function(){
				 //alert("Success dropping Tables");
			 },
			 function(error, statement){
				opMessage("Error: " + error.message + " when SetConfigParam processing " + statement);
			 }        
			)
		},
		function(error, statement){
		 opMessage("Error: " + error.message + " when SetConfigParam processing " + statement);          
		}
	);
}		
function SetAllConfigParam(p1,v1,p2,v2,p3,v3,p4,v4,p5,v5){
	SetConfigParam(p1,v1)
	SetConfigParam(p2,v2)
	SetConfigParam(p3,v3)
	SetConfigParam(p4,v4)
	SetConfigParam(p5,v5)
}
//*************************************************************************************************************************
//
//  User Maintenance Functions
//
//*************************************************************************************************************************
function CreateUser(muser, u, p){

	opMessage("Creating User "+muser+":"+u+":"+p);
	html5sql.process("INSERT INTO MyUserDets (mobileuser , user, password ) VALUES ('"+muser+"','" +u+"','" + p+"');",
	 function(){
		 //alert("Success dropping Tables");
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
			
	if (paramName=='LASTSYNC_REFERENCE'){
		localStorage.setItem('LastSyncReference',paramValue);

	}
	if (paramName=='LASTSYNC_TRANSACTIONAL'){
		localStorage.setItem('LastSyncTransactional',paramValue);

	}
	if (paramName=='LASTSYNC_UPLOAD'){
		localStorage.setItem('LastSyncUpload',paramValue);

	}	
	html5sql.process(
		["SELECT * from MyWorkConfig where paramname = '"+paramName+"'"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				sqlstatement="UPDATE MyWorkConfig SET paramvalue = '"+paramValue+"' WHERE paramname = '"+paramName+"';"
				}else{
				sqlstatement="INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('"+paramName+"','"+paramValue+"');"
				}
			html5sql.process(sqlstatement,
			 function(){
				 //alert("Success dropping Tables");
			 },
			 function(error, statement){
				opMessage("Error: " + error.message + " when Last Sync Update processing " + statement);
			 }        
			)
		},
		function(error, statement){
		 opMessage("Error: " + error.message + " when Last Sync Update processing " + statement);          
		}
	);




}

function syncTransactional(){


	if (!CheckSyncInterval('TRANSACTIONAL')){return; }
	opMessage("Synchronizing Transactional Data");
	
	html5sql.process(
		["SELECT * from MyUserDets"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				SAPServerSuffix="?jsonCallback=?&sap-client=700&sap-user="+rowsArray[0].user+"&sap-password="+rowsArray[0].password+"&username="+rowsArray[0].mobileuser;
			
				html5sql.process("SELECT * from MyWorkConfig where paramname = 'SERVERNAME'",
					function(transaction, results, rowsArray){
						if( rowsArray.length > 0) {
									SetLastSyncDetails("LASTSYNC_TRANSACTIONAL");
									SAPServerPrefix=$.trim(rowsArray[0].paramvalue);

									requestSAPData("Orders.htm"," ");
									requestSAPData("Notifications.htm"," ");
								
									requestSAPData("OrdersObjects.htm"," ");
						 }
						 
					},
					function(error, statement){
						opMessage("Error: " + error.message + " when syncTransactional processing " + statement); 
					}
				)
			}
		},
		function(error, statement){
		 opMessage("Error: " + error.message + " when syncTransactional processing " + statement);          
		}
	);
	

	
	
	
	

}
function syncUpload(){

var newDets="";
syncDetsSet=false;
	if (!CheckSyncInterval('UPLOAD')){return; }
	opMessage("Synchronizing Upload Data");
	
	html5sql.process(
		["SELECT * from MyUserDets"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				SAPServerSuffix="?jsonCallback=?&sap-client=700&sap-user="+rowsArray[0].user+"&sap-password="+rowsArray[0].password
			
				html5sql.process("SELECT * from MyNewJobs where state = 'NEW'",
					function(transaction, results, rowsArray){
						if( rowsArray.length > 0) {
							if(!syncDetsSet){
								syncDetsSet=true;
								SetLastSyncDetails("LASTSYNC_UPLOAD");
								
								}
							item = rowsArray[0];

							newDets='&TYPE='+item['type']+'&STARTDATE='+item['date']+'&STARTTIME='+item['time']+'&SHORTTEXT='+item['shorttext']+'&LONGTEXT='+item['longtext']+'&RECNO='+item['id'];
							opMessage("NewJob Details="+newDets);
							SAPServerPrefix=$.trim(localStorage.getItem('ServerName'));
							
							sendSAPData(SAPServerPrefix+"createnotification.htm"+SAPServerSuffix+newDets);
						 }
						 
					},
					function(error, statement){
						opMessage("Error: " + error.message + " when syncTransactional processing " + statement); 
					}
				)
				html5sql.process("SELECT * from MyTimeConfs where confno = 'NEW'",
					function(transaction, results, rowsArray){
						opMessage("done NEWTCONF Select");
						opMessage("NewTconf = "+rowsArray.length);
						if( rowsArray.length > 0) {
								if(!syncDetsSet){
									syncDetsSet=true;
									SetLastSyncDetails("LASTSYNC_UPLOAD");
									
									}
								item = rowsArray[0];

								newDets='&ORDERNO='+item['orderno']+'&OPNO='+item['opno']+'&REASON='+item['description']+'&TIME='+item['duration']+'&USER='+item['user']+'&RECNO='+item['id'];
								opMessage("NewTconf Details="+newDets);
								SAPServerPrefix=$.trim(localStorage.getItem('ServerName'));
								
								sendSAPData(SAPServerPrefix+"createtconf.htm"+SAPServerSuffix+newDets);
						 }
						 
					},
					function(error, statement){
						opMessage("Error: " + error.message + " when syncTransactional processing " + statement); 
					}
				)	

				
				html5sql.process("SELECT * from MyStatus where state = 'NEW'",
					function(transaction, results, rowsArray){
						opMessage("done NEWStatus Select");
						opMessage("NewStatus = "+rowsArray.length);
						if( rowsArray.length > 0) {
							if(!syncDetsSet){
								syncDetsSet=true;
								SetLastSyncDetails("LASTSYNC_UPLOAD");
								
								}

							item = rowsArray[0];

							newDets='&ORDERNO='+item['orderno']+'&OPNO='+item['opno']+'&STATUS='+item['status']+'&STSMA='+item['stsma']+'&RECNO='+item['id'];
							opMessage("Newstatus Details="+newDets);
							SAPServerPrefix=$.trim(localStorage.getItem('ServerName'));
							
							sendSAPData(SAPServerPrefix+"UpdateStatus.htm"+SAPServerSuffix+newDets);
						 }
						 
					},
					function(error, statement){
						opMessage("Error: " + error.message + " when syncTransactional processing " + statement); 
					}
				)				
				
				
				
				
			}
		},
		function(error, statement){
		 opMessage("Error: " + error.message + " when syncTransactional processing " + statement);          
		}
	);
	

	
	
	
	

}

function syncReference(){


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
							SAPServerPrefix=$.trim(rowsArray[0].paramvalue);
							
							opMessage("Sending SAP Request for Ref Data");	

							requestSAPData("RefData.htm"," ");
							requestSAPData("RefDataCodes.htm","&SCENARIO=MAMDEMOLG");
							requestSAPData("Users.htm"," ");
							//requestSAPData("Objects.htm"," ");
							requestSAPData("Vehicles.htm"," ");
						 }
						 
					},
					function(error, statement){
						opMessage("Error: " + error.message + " when syncTransactional processing " + statement); 
					}
				)
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

var TypeName=""
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

	return TypeName

}
function updateSurveys(id, name, type, description,datestamp)
{


	html5sql.process("UPDATE Surveys SET name = '"+name+"', type = '"+type+"', description = '"+description+"', datecreated = '"+datestamp+"' where id = '"+id+"';", 
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when Last Sync Update processing " + statement);
	 }        
	)	
}
function updateSurveysDetail(detailid, group, sortseq,name,type,description,defaultval, next, attribute1,attribute2,attribute3,attribute4)
{
	html5sql.process("UPDATE SurveysDetail SET groupcode =  '"+group+"', sortseq =  '"+sortseq+"',  name =  '"+name+"',  type =  '"+type+"',  description = '"+description+"',  defaultval =  '"+defaultval+"',  next =  '"+next+"',  attribute1 =  '"+attribute1+"', attribute2 =  '"+attribute2+"', attribute3 =  '"+attribute3+"', attribute4  '"+attribute4+"' where id = '"+detailid+"' ",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when updateSurveysDetail processing " + statement);
	 }        
	)	
}

function deleteAllSurveys(id)
{

	html5sql.process(	"DELETE FROM Surveys where id = '"+id+"';"+
						"DELETE FROM SurveysDetail where surveyid = '"+id+"' "+
						"DELETE FROM SurveysDetailAnswers where surveyid = '"+id+"';",
		 function(){
			 //alert("Success dropping Tables");
		 },
		 function(error, statement){
			opMessage("Error: " + error.message + " when deleteAllSurveys processing " + statement);
		 }        
	)	
}
function deleteAllSurveysDetail(id)
{


	html5sql.process(	"DELETE FROM SurveysDetail where id = '"+id+"' "+
						"DELETE FROM SurveysDetailAnswers where detailid = '"+id+"';",
		 function(){
			 //alert("Success dropping Tables");
		 },
		 function(error, statement){
			opMessage("Error: " + error.message + " when deleteAllSurveysDetail processing " + statement);
		 }        
	)	
}
function createSurveys(name,type,description,datecreated)
{


	html5sql.process("INSERT INTO  Surveys (name , type, description , datecreated) VALUES ("+
					 "'"+name+"','"+type+"','"+description+"','"+datecreated+"');'"	,
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when createSurveysDetailAnswers processing " + statement);
	 }        
	)
}
function createSurveysDetail(surveyid, group, sortseq,name,type,description,defaultval, next, attribute1,attribute2,attribute3,attribute4)
{
						
	html5sql.process("INSERT INTO  SurveysDetail (surveyid, groupcode, sortseq, name , type, description , defaultval, next, attribute1,attribute2,attribute3,attribute3) VALUES ("+
					 "'"+surveyid+"','"+group+"','"+sortseq+"','"+name+"','"+type+"','"+ description+ "','"+defaultval+"','"+next+"','"+attribute1+"','"+attribute2+"','"+attribute3+"','"+ attribute3+"');'"	,
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when createSurveysDetail processing " + statement);
	 }        
	)
}
function createSurveysDetailAnswers(surveyid,detailid,answertype,answercode,description, defaultval)
{

	html5sql.process("INSERT INTO  SurveysDetailAnswers (surveyid,detailid,answertype,answercode,description, defaultval) VALUES ("+
					 "'"+surveyid+"','"+detailid+"','"+answertype+"','"+answercode+"','"+description+"','"+ defaultval+"');'"	,
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when createSurveysDetailAnswers processing " + statement);
	 }        
	)
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
	)	
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
	)
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
	)
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
	)
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
	)
}

function updateOperationStatus(orderno, opno, status)
{

	html5sql.process(
		["SELECT status from MyOperations where orderno = '"+orderno+"' and opno='"+opno+"'"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				html5sql.process("UPDATE MyOperations SET status = '"+newstatus+"' where orderno = '"+orderno+"' and opno='"+opno+"'",
				 function(){
					 //alert("Success dropping Tables");
				 },
				 function(error, statement){
					opMessage("Error: " + error.message + " when updateOperationStatus processing " + statement);
				 }        
				)
			}
		},
		function(error, statement){
		 opMessage("Error: " + error.message + " when updateOperationStatus processing " + statement);          
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
	)
}
function createNotification(type,priority,group,code,grouptext,codetext,description,details,startdate,funcloc,equipment)
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
	)
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
	)
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
	)
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
	)
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
	)
}
//*************************************************************************************************************************
//
//  Create Database Tables
//
//*************************************************************************************************************************
function createTables() { 




	//opMessage("Creating The Tables");	
        
		sqlstatement='CREATE TABLE IF NOT EXISTS MyOrders     			( orderno TEXT, shorttext TEXT, longtext TEXT, startdate TEXT, enddate TEXT, contact TEXT,   telno TEXT,    type TEXT, priority TEXT, address TEXT, workaddress TEXT, house TEXT, houseno TEXT, street TEXT, district TEXT, city TEXT, postcode TEXT,gis TEXT, property TEXT, funcloc TEXT, equipment TEXT, propertygis TEXT, funclocgis TEXT, equipmentgis TEXT, notifno TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyOperations 			( orderno TEXT, opno TEXT,      type TEXT,     priority TEXT,  shorttext TEXT, startdate TEXT, enddate TEXT, duration TEXT, status TEXT, apptstart TEXT, apptend TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyPartners   			( orderno TEXT, notifno TEXT, id TEXT,        type TEXT,     name TEXT,      address TEXT,   postcode TEXT, telno TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyAssets     			( orderno TEXT, id TEXT,        type TEXT,     name TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyUserStatus     		( type TEXT, orderno TEXT, opno TEXT, inact TEXT, status TEXT, statuscode TEXT, statusdesc TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyOperationInfo     	( orderno TEXT, opno TEXT, type TEXT, value1 TEXT, value2 TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyNotifications     	( id integer primary key autoincrement, notifno TEXT, shorttext TEXT, longtext TEXT,  pgroup TEXT, pcode TEXT, grouptext TEXT, codetext TEXT, startdate TEXT, type TEXT, priority TEXT, funcloc TEXT,   equipment TEXT, orderno TEXT, reportedon TEXT,   reportedby TEXT, plant TEXT, funclocgis TEXT,   equipmentgis TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyItems     			( id integer primary key autoincrement, notifno TEXT, item_id TEXT, descript TEXT, d_cat_typ TEXT, d_codegrp TEXT, d_code TEXT, dl_cat_typ TEXT, dl_codegrp TEXT, dl_code TEXT, long_text TEXT, stxt_grpcd TEXT ,txt_probcd TEXT  ,txt_grpcd TEXT , txt_objptcd TEXT, status TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyCauses      			( id integer primary key autoincrement, notifno TEXT, item_id TEXT, cause_id TEXT, cause_text TEXT, cause_cat_typ TEXT, cause_codegrp TEXT, cause_code TEXT, long_text TEXT, txt_causegrp TEXT, txt_causecd TEXT, status TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyActivities     		( id integer primary key autoincrement, notifno TEXT, task_id TEXT, item_id TEXT,  act_id TEXT, act_text TEXT, act_cat_typ TEXT, act_codegrp TEXT, act_code TEXT,  start_date TEXT, start_time TEXT ,end_date TEXT  ,end_time TEXT , long_text TEXT, txt_actgrp TEXT, txt_actcd TEXT, status TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyTasks      			( id integer primary key autoincrement, notifno TEXT, item_id TEXT, task_text TEXT, task_cat_typ TEXT, task_codegrp TEXT, task_code TEXT, txt_taskgrp TEXT, txt_taskcd TEXT, plnd_start_date TEXT, plnd_start_time TEXT ,plnd_end_date TEXT  ,plnd_end_time TEXT , sla_end_date TEXT  ,sla_end_time TEXT , longtext TEXT, complete TEXT, status TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyEffects      		( id integer primary key autoincrement, notifno TEXT, item_id TEXT, task_id TEXT, effect_cat_typ TEXT, effect_codegrp TEXT, effect_code TEXT, txt_effectgrp TEXT, txt_effectcd TEXT, value TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyStatus     			( id integer primary key autoincrement, orderno TEXT, opno TEXT, stsma TEXT, status TEXT, statusdesc, state TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyTimeConfs     		( id integer primary key autoincrement, orderno TEXT, opno TEXT, confno TEXT, type TEXT, description TEXT, date TEXT, time TEXT, enddate TEXT, endtime TEXT,duration TEXT, datestamp TEXT,  user TEXT,  empid TEXT, final TEXT, state TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyNewJobs     			( id integer primary key autoincrement, type TEXT, shorttext TEXT, longtext TEXT, description TEXT, date TEXT, time TEXT, funcloc TEXT, equipment TEXT, cattype TEXT, activitycodegroup TEXT, activitycode TEXT, activitytext TEXT, prioritytype TEXT, priority TEXT, reportedby TEXT, state TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyWorkConfig     		( paramname TEXT, paramvalue TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyWorkSyncDets    		( lastsync TEXT, comments   TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyUserDets             ( mobileuser TEXT, user TEXT, password TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyRefUsers    			(  userid TEXT, scenario TEXT, plant TEXT, workcenter TEXT, plannergroup TEXT, plannergroupplant TEXT, storagegroup TEXT, storageplant TEXT, partner TEXT, partnerrole TEXT, funclocint TEXT, funcloc TEXT, compcode TEXT, employeeno TEXT, equipment TEXT, firstname TEXT, lastname TEXT, telno TEXT);'+													
					 'CREATE TABLE IF NOT EXISTS MyRefOrderTypes     	(  scenario TEXT, type TEXT, description TEXT, statusprofile TEXT, opstatusprofile TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyRefNotifTypes     	(  scenario TEXT, type TEXT, description TEXT, statusprofile TEXT, taskstatusprofile TEXT,priority_type TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyRefPriorityTypes     (  scenario TEXT, type TEXT, priority TEXT, description TEXT);'+
				  	 'CREATE TABLE IF NOT EXISTS MyRefUserStatusProfiles(  scenario TEXT, type TEXT, status TEXT, statuscode TEXT, statusdesc TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyVehicles     		(  reg TEXT, id TEXT, mpoint TEXT,description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyVehicleCheck     	(  reg TEXT,  mileage TEXT,  tax TEXT,  horn TEXT,  tyres TEXT,  wheels TEXT,  lights TEXT,  wipers TEXT, checktype TEXT,  datestamp TEXT,  user TEXT,  state TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyMessages    			(  type TEXT,  date TEXT, time TEXT, msgfrom TEXT, msgto TEXT, msgtext TEXT, state TEXT);'+
					 'CREATE TABLE IF NOT EXISTS Assets     			(  type TEXT, id TEXT, eqart TEXT, eqtyp TEXT, shorttext TEXT,  address TEXT, workcenter TEXT);'+
					 'CREATE TABLE IF NOT EXISTS AssetClassVals     	(  type TEXT, id TEXT,  charact TEXT,  valuechar TEXT,  valueto TEXT, valueneutral TEXT, description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS AssetMeasurementPoints (  type TEXT, id TEXT,  mpoint TEXT,  description TEXT,  value TEXT);'+
					 'CREATE TABLE IF NOT EXISTS AssetInstalledEquip    (  type TEXT, id TEXT,  eqno TEXT,  description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS LogFile    			( datestamp TEXT, type TEXT, message TEXT);'+
					 'CREATE TABLE IF NOT EXISTS RefNotifprofile  		( scenario TEXT, profile TEXT, notif_type TEXT);'+
					 'CREATE TABLE IF NOT EXISTS RefCodeGroups  		( scenario TEXT, profile TEXT, catalog_type TEXT, code_cat_group TEXT, codegroup TEXT, codegroup_text TEXT);'+
					 'CREATE TABLE IF NOT EXISTS RefCodes  				( scenario TEXT, profile TEXT, code_cat_group TEXT, code TEXT, code_text TEXT);'+
					 'CREATE TABLE IF NOT EXISTS Surveys     			( id integer primary key autoincrement, name TEXT, type TEXT, datecreated TEXT, description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS SurveysDetail     		( id integer primary key autoincrement, surveyid TEXT, groupcode TEXT, sortseq TEXT, type TEXT, name TEXT, description TEXT, defaultval TEXT, next TEXT, attribute1 TEXT, attribute2 TEXT, attribute3 TEXT, attribute4 TEXT);'+
					 'CREATE TABLE IF NOT EXISTS SurveysDetailAnswers  	( id integer primary key autoincrement, surveyid TEXT, detailid TEXT, answertype TEXT, answercode TEXT, description TEXT, defaultval TEXT)'
		CreateUser("demo","demo", "demo");

		html5sql.process(sqlstatement,
						 function(){
							// alert("Success Creating Tables");
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
opMessage("Dropping The Tables");

		sqlstatement=	'DROP TABLE IF EXISTS MyOrders;'+
						'DROP TABLE IF EXISTS MyOperations;'+
						'DROP TABLE IF EXISTS MyPartners;'+
						'DROP TABLE IF EXISTS MyAssets;'+
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
						'DROP TABLE IF EXISTS Surveys;'+	
						'DROP TABLE IF EXISTS SurveysDetail;'+
						'DROP TABLE IF EXISTS SurveysDetailAnswers;'

						html5sql.process(sqlstatement,
						 function(){
							 //alert("Success dropping Tables");
						 },
						 function(error, statement){
							opMessage("Error: " + error.message + " when drop processing " + statement);
						 }        
				);
}
function emptyTables() { 
opMessage("Emptying The Tables");
		sqlstatement=	'DELETE FROM  MyOrders;'+
						'DELETE FROM  MyOperations;'+
						'DELETE FROM  MyPartners;'+
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
						'DELETE FROM  Surveys;'+	
						'DELETE FROM  SurveysDetail;'+
						'DELETE FROM  SurveysDetailAnswers;'

						html5sql.process(sqlstatement,
						 function(){
							 //alert("Success deleting Tables");
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
function createDB(){

		createTables();

		emptyTables();
	
		SetConfigParam("TRACE", "ON");
		SetConfigParam("SYNC_REFERENCE_FREQUENCY", "8400000");
		SetConfigParam("SYNC_TRANSACTIONAL_FREQUENCY", "600000");
		SetConfigParam("SYNC_UPLOAD_FREQUENCY", "300000");
		SetConfigParam("LASTSYNC_REFERENCE", "20130316170000");
		SetConfigParam("LASTSYNC_TRANSACTIONAL", "20130316224900");
		SetConfigParam("LASTSYNC_UPLOAD", "20130316214900");
		SetConfigParam("SERVERNAME", "http://elderberry.uk.logica.com:8083/sap/bc/bsp/sap/zorderlist/");

		requestDEMOData('TestData\\MyOrdersData.json');
		requestDEMOData('TestData\\MyNotificationsData.json');
		requestDEMOData('TestData\\MyUsersData.json');
		requestDEMOData('TestData\\MyOrderObjectsData.json');	
		requestDEMOData('TestData\\MyRefData.json');
		requestDEMOData('TestData\\RefDataCodes.json');
		//requestDEMOData('TestData\\MyVehiclesData.json');
		//requestDEMOData('TestData\\MyMessagesData.json');

}	


function requestDEMOData(page){
		opMessage("DEMOLoad "+page);
	
		$.getJSON(page,function(data){ 	
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
		
  });
}
function orderCB(MyOrders){
		opMessage("Doing Orders");

		if(MyOrders.order.length>0){
			opMessage("Deleting Existing Orders");
			sqlstatement = 	'DELETE FROM MyOrders;'+
							'DELETE FROM MyOperations;'+
							'DELETE FROM MyPartners;'+
							'DELETE FROM MyAssets;'+
		
							'DELETE FROM MyTimeConfs;'+
							'DELETE FROM MyUserStatus;'+
							'DELETE FROM MyOperationInfo;'+
							'DELETE FROM MyStatus where state="SERVER";'
			
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
					 '"'+MyOrders.order[cntx].propertygis+  '","'+MyOrders.order[cntx].funclocgis+  '","'+MyOrders.order[cntx].equipmentgis+ '","'+MyOrders.order[cntx].notifno+'");'
				//Loop and write operations to DB
				
	 			//opMessage("Loading "+MyOrders.order[cntx].operation.length+" Operations");
			
				for(var opscnt=0; opscnt < MyOrders.order[cntx].operation.length ; opscnt++)
					{	
					
					sqlstatement+='INSERT INTO MyOperations (orderno , opno, type , priority , shorttext , startdate, enddate, duration , status, apptstart, apptend) VALUES ('+
						 '"'+MyOrders.order[cntx].orderno+  '","'+ MyOrders.order[cntx].operation[opscnt].opno+  '","'+ MyOrders.order[cntx].operation[opscnt].type+  '","'+MyOrders.order[cntx].operation[opscnt].priority+  '",'+
						 '"'+MyOrders.order[cntx].operation[opscnt].shorttext+  '","'+ MyOrders.order[cntx].operation[opscnt].startdate+  '","'+ MyOrders.order[cntx].operation[opscnt].enddate+  '","'+  MyOrders.order[cntx].operation[opscnt].duration+  '",'+
						 '"'+MyOrders.order[cntx].operation[opscnt].status+  '","'+ MyOrders.order[cntx].operation[opscnt].apptstart+  '","'+ MyOrders.order[cntx].operation[opscnt].apptend+'");'
				
				}
				 

				//opMessage("Loading "+MyOrders.order[cntx].partner.length+" Partners");
				
				//Loop and write partners to DB
				for(var pcnt=0; pcnt < MyOrders.order[cntx].partner.length ; pcnt++)
					{	
					sqlstatement+='INSERT INTO MyPartners (orderno , id, type , name , address , postcode , telno, notifno) VALUES ('+ 
						'"'+MyOrders.order[cntx].orderno+  '","'+ MyOrders.order[cntx].partner[pcnt].id+  '","'+  MyOrders.order[cntx].partner[pcnt].type+  '","'+ MyOrders.order[cntx].partner[pcnt].name+  '",'+
						'"'+MyOrders.order[cntx].partner[pcnt].address+  '","'+  MyOrders.order[cntx].partner[pcnt].postcode+  '","'+ MyOrders.order[cntx].partner[pcnt].telno+  '","'+ ""+'");'
				}
				
				
				
				//opMessage("Loading "+MyOrders.order[cntx].userstatus.length+" UserStatus");
				//Loop and write userstatus to DB
				for(var pcnt=0; pcnt < MyOrders.order[cntx].userstatus.length ; pcnt++)
					{	
					sqlstatement+='INSERT INTO MyUserStatus (type , orderno, opno , inact , status , statuscode , statusdesc) VALUES ('+
						'"'+MyOrders.order[cntx].userstatus[pcnt].type+  '","'+  MyOrders.order[cntx].userstatus[pcnt].orderno+  '","'+ MyOrders.order[cntx].userstatus[pcnt].opno+  '",'+
						'"'+MyOrders.order[cntx].userstatus[pcnt].inact+  '","'+  MyOrders.order[cntx].userstatus[pcnt].status+  '","'+  MyOrders.order[cntx].userstatus[pcnt].statuscode+  '",'+
						'"'+MyOrders.order[cntx].userstatus[pcnt].statusdesc+'");'
				}

				//opMessage("Loading "+MyOrders.order[cntx].operationinfo.length+" OperationInfo");
				//Loop and write userstatus to DB
				for(var pcnt=0; pcnt < MyOrders.order[cntx].operationinfo.length ; pcnt++)
					{	
					sqlstatement+='INSERT INTO MyOperationInfo (orderno, opno , type , value1 , value2) VALUES ('+
						'"'+MyOrders.order[cntx].operationinfo[pcnt].orderno+  '","'+  MyOrders.order[cntx].operationinfo[pcnt].opno+  '","'+  MyOrders.order[cntx].operationinfo[pcnt].type+  '",'+ 
						'"'+MyOrders.order[cntx].operationinfo[pcnt].value1+  '","'+  MyOrders.order[cntx].operationinfo[pcnt].value2+'");'
				}
				
				
				
				
				//Loop and write Assets to DB
				
	  
				//opMessage("Loading "+MyOrders.order[cntx].asset.length+" Assets");
				for(var acnt=0; acnt < MyOrders.order[cntx].asset.length ; acnt++)
					{
					if (MyOrders.order[cntx].asset[acnt].equipment.length>0){
						sqlstatement+='INSERT INTO MyAssets (orderno , id, type , name ) VALUES ('+
							'"'+MyOrders.order[cntx].orderno+  '","'+   MyOrders.order[cntx].asset[acnt].equipment+  '","'+   'EQ'+  '","'+   MyOrders.order[cntx].asset[acnt].equidescr+'");'
						}else if (MyOrders.order[cntx].asset[acnt].funcloc.length>0){
						sqlstatement+='INSERT INTO MyAssets (orderno , id, type , name ) VALUES ('+ 
							'"'+MyOrders.order[cntx].orderno+  '","'+   MyOrders.order[cntx].asset[acnt].funcloc+  '","'+  'FL'+  '","'+   MyOrders.order[cntx].asset[acnt].funclocdesc+'");'
						}
				}
				//Loop and write TConfs to DB
				
	  
				//opMessage("Loading "+MyOrders.order[cntx].tconf.length+" TimeConfs");
			
				for(var acnt=0; acnt < MyOrders.order[cntx].tconf.length ; acnt++)
					{	
					sqlstatement+='INSERT INTO MyTimeConfs (orderno , opno,type, confno , description , date , time , enddate, endtime, duration, empid, final,datestamp, user, state ) VALUES ('+
						'"'+MyOrders.order[cntx].orderno+  '","'+   MyOrders.order[cntx].tconf[acnt].activity+  '","'+   MyOrders.order[cntx].tconf[acnt].type+  '","'+   MyOrders.order[cntx].tconf[acnt].confno+  '","'+  MyOrders.order[cntx].tconf[acnt].description+  '","'+  MyOrders.order[cntx].tconf[acnt].date+  '","'+  MyOrders.order[cntx].tconf[acnt].time+  '",'+ 
						'"'+MyOrders.order[cntx].tconf[acnt].enddate+  '","'+  MyOrders.order[cntx].tconf[acnt].endtime+  '","'+  MyOrders.order[cntx].tconf[acnt].duration+  '","'+  MyOrders.order[cntx].tconf[acnt].empid+  '","'+  MyOrders.order[cntx].tconf[acnt].final+  '","","","");'
	

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

			opMessage("Deleting Existing Ref Assets");
			sqlstatement = 	'DELETE FROM Assets;'
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
						    Objects.object[cntx].eqtyp+  '","'+ Objects.object[cntx].shorttext+  '","'+ Objects.object[cntx].address+  '","'+ Objects.object[cntx].swerk+'");'
					
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
	
			opMessage("Deleting Existing Notifications");
			sqlstatement = 	'DELETE FROM MyNotifications;'+
							'DELETE FROM MyTasks;'+
							'DELETE FROM MyItems;'+
							'DELETE FROM MyCauses;'+
							'DELETE FROM MyActivities;'+
							'DELETE FROM MyEffects;'

			html5sql.process(sqlstatement,
						 function(){
							 //alert("Success Creating Tables");
						 },
						 function(error, statement){
							 alert("Error: " + error.message + " when processing " + statement);
						 }        
				);		
			opMessage("Loading "+MyNotifications.notification.length+" Notifications");
			sqlstatement='';	

			for(var cntx=0; cntx < MyNotifications.notification.length ; cntx++)
				{
			
				//alert(MyNotifications.notification[cntx].pgroup);
				sqlstatement+='INSERT INTO MyNotifications (notifno , shorttext , longtext , startdate , priority , type, funcloc, equipment, orderno, reportedon , reportedby , plant, funclocgis, equipmentgis, pgroup, pcode, grouptext, codetext) VALUES ( '+ 
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
					'"'+MyNotifications.notification[cntx].pgroup +'",'+
					'"'+MyNotifications.notification[cntx].pcode+'",'+
					'"'+MyNotifications.notification[cntx].pgrouptext+'",'+ 
					'"'+MyNotifications.notification[cntx].pcodetext+'");'
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
							 '"'+MyNotifications.notification[cntx].task[tcnt].status +'");'
				
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
							 '"'+MyNotifications.notification[cntx].effect[ecnt].value+'");'
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
							 '"'+MyNotifications.notification[cntx].item[icnt].txt_objptcd+  '","S","");'

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
							  '"'+MyNotifications.notification[cntx].cause[ccnt].cause_txt_causecd+  '","S","");'
						}
					//Loop and write Items to DB
					
					opMessage("Loading "+MyNotifications.notification[cntx].activity.length+" Activities");
					for(var acnt=0; acnt < MyNotifications.notification[cntx].activity.length ; acnt++)
						{	

						sqlstatement+='INSERT INTO MyActivities (notifno , item_id , task_id, act_text , act_cat_typ , act_codegrp , act_code ,txt_actgrp, txt_actcd ,start_date , start_time , end_date , end_time,   status, act_id, long_text) VALUES ( '+ 
							  '"'+MyNotifications.notification[cntx].notifno+'",'+
							  '"'+MyNotifications.notification[cntx].activity[acnt].id+'",'+ 
							  '"'+MyNotifications.notification[cntx].activity[acnt].task_id+'",'+ 
							  '"'+MyNotifications.notification[cntx].activity[acnt].acttext+'",'+
							  '"'+MyNotifications.notification[cntx].activity[acnt].act_cat_typ+'",'+
							  '"'+MyNotifications.notification[cntx].activity[acnt].act_codegrp+'",'+ 
							  '"'+MyNotifications.notification[cntx].activity[acnt].act_code+'",'+ 
							  '"'+MyNotifications.notification[cntx].activity[acnt].txt_actgrp+'",'+
							  '"'+MyNotifications.notification[cntx].activity[acnt].txt_actcd+'",'+
							  '"'+MyNotifications.notification[cntx].activity[acnt].start_date+'",'+
							  '"'+MyNotifications.notification[cntx].activity[acnt].start_time+'",'+ 
							  '"'+MyNotifications.notification[cntx].activity[acnt].end_date+'",'+
							  '"'+MyNotifications.notification[cntx].activity[acnt].end_time+  '","S","","");'
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
function sapCB(MySAP){
	
var sqlstatement;
opMessage("Callback sapCB triggured");


	


	
	if(MySAP.message.length>0){
		
			opMessage("Processing Update Response: ");

			if (MySAP.message[0].type=="createnotification"){
				opMessage("-->Type= "+MySAP.message[0].type);
				opMessage("-->row= "+MySAP.message[0].recno);
				opMessage("-->Message= "+MySAP.message[0].message);
				opMessage("-->NotifNo= "+MySAP.message[0].notifno);

	
					sqlstatement+="UPDATE MyNewJobs SET state = '"+ MySAP.message[0].recno+"' WHERE id='"+ MySAP.message[0].notifno+"';"
					

		
			}
			if (MySAP.message[0].type=="createnotification"){
				opMessage("-->Type= "+MySAP.message[0].type);
				opMessage("-->confno= "+MySAP.message[0].confno);
				if(MySAP.message[0].confno!="0000000000"){

					
		
						sqlstatement+="UPDATE MyTimeConfs SET state = 'SERVER' WHERE id='"+MySAP.message[0].recno+"';"
						

					}
		
			}			

			if (MySAP.message[0].type=="updatestatus"){
				opMessage("-->UpdateStatus");
				opMessage("-->Orderno= "+MySAP.message[0].orderno);
				opMessage("-->Opno= "+MySAP.message[0].opno);
				opMessage("-->Message= "+MySAP.message[0].message);
				if(MySAP.message[0].message=="Status successfully changed"){

			
		
						sqlstatement+="UPDATE MyStatus SET state = 'SERVER' WHERE orderno='"+MySAP.message[0].orderno+"' and opno = '" + MySAP.message[0].opno + "';"
						
			
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
function getMessages(){
var sqlstatement="";		

		sqlstatement+='DELETE FROM MyMessages;'
		opMessage("Loading "+MyMessages.message.length+" Messages");
		for(var cntx=0; cntx <   MyMessages.message.length ; cntx++)
			{	

			sqlstatement+='INSERT INTO MyMessages (type, date, time, msgfrom, msgto, msgtext, state ) VALUES ('+ 
				'"'+ MyMessages.message[cntx].type +'","'+ MyMessages.message[cntx].date +'","'+ MyMessages.message[cntx].time  +'","'+ MyMessages.message[cntx].msgfrom +'","'+  	MyMessages.message[cntx].msgto  +'","'+ MyMessages.message[cntx].msgtext  +'","'+  	MyMessages.message[cntx].state +'");'
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
				'"'+ Equipment.equipment[cntx].postcode+'");' 
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
						 '"'+ Equipment.equipment[cntx].classval[opscnt].description+'");' 
				
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
					'"'+MyUsers.user[cntx].telno+'");'
					
					

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


			opMessage("Deleting Existing Vehicles");
			sqlstatement+='DELETE FROM MyVehicles;'
			opMessage("Loading"+MyVehicles.vehicle.length+" Vehicles");
			for(var cntx=0; cntx < MyVehicles.vehicle.length ; cntx++)
				{	

				sqlstatement+='INSERT INTO MyVehicles (id , reg , description , mpoint ) VALUES ( '+
					'"'+MyVehicles.vehicle[cntx].vehicle +'",'+ 
					'"'+MyVehicles.vehicle[cntx].reg +'",'+ 
					'"'+MyVehicles.vehicle[cntx].description+'",'+ 
					'"'+MyVehicles.vehicle[cntx].mpoint+'");'
					
					

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

	if(MyMessages.message.length>0){


			opMessage("Deleting Existing Messages");
			sqlstatement+='DELETE FROM MyMessages;'
			opMessage("Loading"+MyMessages.message.length+" Messages");
			for(var cntx=0; cntx < MyMessages.message.length ; cntx++)
				{	

				sqlstatement+='INSERT INTO MyMessages (type , date , time , msgfrom, msgto, msgtext, state ) VALUES ('+ 
					'"'+MyMessages.message[cntx].type +'",'+  
					'"'+MyMessages.message[cntx].date +'",'+ 
					'"'+MyMessages.message[cntx].time +'",'+ 
					'"'+MyMessages.message[cntx].msgfrom +'",'+ 
					'"'+MyMessages.message[cntx].msgto +'",'+ 
					'"'+MyMessages.message[cntx].msgtext+'",'+  
					'"'+MyMessages.message[cntx].state+'");' 
					
					

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


			opMessage("Deleting Existing Assets");
			sqlstatement+='DELETE FROM Assets;'
			sqlstatement+='DELETE FROM AssetClassVals;'
			sqlstatement+='DELETE FROM AssetMeasurementPoints;'
			sqlstatement+='DELETE FROM AssetInstalledEquip;'
			opMessage("Loading "+MyObjects.orderobjects.length+" Assets");
			for(var cntx=0; cntx <   MyObjects.orderobjects.length ; cntx++){
				objtype=MyObjects.orderobjects[cntx].objtype;
				objid=MyObjects.orderobjects[cntx].objid;
				objshorttext=MyObjects.orderobjects[cntx].shorttext; 
				objaddress=MyObjects.orderobjects[cntx].address;
				objswerk=MyObjects.orderobjects[cntx].swerk;

				sqlstatement+='INSERT INTO Assets (type , id , shorttext , address, workcenter ) VALUES ("'+objtype+'","'+  objid+'","'+ objshorttext+'","'+ objaddress+'","'+ objswerk+'");'
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

			opMessage("Deleting Existing Reference Data");
			sqlstatement+='DELETE FROM MyRefOrderTypes;'
			sqlstatement+='DELETE FROM MyRefNotifTypes;'
			sqlstatement+='DELETE FROM MyRefPriorityTypes;'
			sqlstatement+='DELETE FROM MyRefUserStatusProfiles;'
			for(var cntx=0; cntx < MyReference.scenario.length ; cntx++)
				{	
				opMessage("Loading Scenario "+MyReference.scenario[cntx].scenario + " Reference Data");

					//Loop and write ordertypes to DB

					opMessage("Loading "+MyReference.scenario[cntx].ordertype.length+" Order Types");
					for(var opscnt=0; opscnt < MyReference.scenario[cntx].ordertype.length ; opscnt++)
						{	
						sqlstatement+='INSERT INTO MyRefOrderTypes (scenario, type , description, statusprofile ,opstatusprofile ) VALUES ('+
							 '"'+MyReference.scenario[cntx].scenario+'",'+
							 '"'+MyReference.scenario[cntx].ordertype[opscnt].type+'",'+
							 '"'+MyReference.scenario[cntx].ordertype[opscnt].description+'",'+
							 '"'+MyReference.scenario[cntx].ordertype[opscnt].statusprofile+'",'+
							 '"'+MyReference.scenario[cntx].ordertype[opscnt].opstatusprofile+'");'

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
								 '"'+MyReference.scenario[cntx].notiftype[opscnt].priority_type+'");'
						}
							

							//Loop and write prioritytypes to DB

						opMessage("Loading "+MyReference.scenario[cntx].prioritytype.length+" Priority Types");
						for(var opscnt=0; opscnt < MyReference.scenario[cntx].prioritytype.length ; opscnt++)
							{	
							
							sqlstatement+='INSERT INTO MyRefPriorityTypes (scenario, type , priority, description ) VALUES  ('+
								 '"'+MyReference.scenario[cntx].scenario+'",'+
								 '"'+MyReference.scenario[cntx].prioritytype[opscnt].type+'",'+
								 '"'+MyReference.scenario[cntx].prioritytype[opscnt].priority+'",'+
								 '"'+MyReference.scenario[cntx].prioritytype[opscnt].description+'");'
							
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
									 '"'+MyReference.scenario[cntx].userstatus[opscnt].statusdesc +'");'
							
							}			


					
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
var sqlstatement1=""
opMessage("Callback Reference Data Codes triggured");
var cntx=0;
	if(MyReference.catprofile.length>0){

			opMessage("Deleting Existing Reference Data");
			sqlstatement+='DELETE FROM RefNotifprofile;'
			sqlstatement+='DELETE FROM RefCodeGroups;'
			sqlstatement+='DELETE FROM RefCodes;'
			html5sql.process(sqlstatement,
				 function(){
					 //alert("Success - Finished Loading Orders");
				 },
				 function(error, statement){
					 opMessage("Error: " + error.message + " when processing " + statement);
				 }        
			);	
			for(var cntx=0; cntx < MyReference.catprofile.length ; cntx++)
				{	
				//alert(MyReference.catprofile[cntx].scenario)
				sqlstatement='INSERT INTO RefNotifprofile (scenario, profile , notif_type ) VALUES ('+
						 '"'+MyReference.catprofile[cntx].scenario+'",'+
						 '"'+MyReference.catprofile[cntx].notifcat_profile+'",'+
						 '"'+MyReference.catprofile[cntx].notifcat_type+'");'
					
					

					//Loop and write codegroups to DB

					opMessage("Loading "+MyReference.catprofile[cntx].notifcat_profile);
					for(var opscnt=0; opscnt < MyReference.catprofile[cntx].codegroup.length ; opscnt++)
						{	
						
						sqlstatement+='INSERT INTO RefCodeGroups (scenario, profile , catalog_type , code_cat_group , codegroup , codegroup_text  ) VALUES  ('+
							'"'+MyReference.catprofile[cntx].scenario+'",'+
							 '"'+MyReference.catprofile[cntx].notifcat_profile+'",'+
							 '"'+MyReference.catprofile[cntx].codegroup[opscnt].catalog_type+'",'+
							 '"'+MyReference.catprofile[cntx].codegroup[opscnt].code_cat_group+'",'+
							 '"'+MyReference.catprofile[cntx].codegroup[opscnt].codegroup+'",'+
							 '"'+MyReference.catprofile[cntx].codegroup[opscnt].codegroup_text+'");'
					
						
					//Loop and write codes to DB
						//alert(MyReference.catprofile[cntx].codegroup[opscnt].codes.length)
						opMessage("Loading "+MyReference.catprofile[cntx].codegroup[opscnt].codes.length+" Codes");
						sqlstatement1=""
						for(var ccnt=0; ccnt < MyReference.catprofile[cntx].codegroup[opscnt].codes.length ; ccnt++)
							{	
							x=MyReference.catprofile[cntx].codegroup[opscnt].codes[ccnt].code_text.replace(/'/g, "
							");;
							x=x.replace("\/", "");;
							x=x.replace(/&/g, "");;
							sqlstatement+='INSERT INTO RefCodes (scenario, profile , code_cat_group , code , code_text ) VALUES  ('+
								 '"'+MyReference.catprofile[cntx].scenario+'",'+
							 	 '"'+MyReference.catprofile[cntx].notifcat_profile+'",'+
								 '"'+MyReference.catprofile[cntx].codegroup[opscnt].code_cat_group+'",'+
								 '"'+MyReference.catprofile[cntx].codegroup[opscnt].codes[ccnt].code+'",'+
								 '"'+x+'");'
							}
							// alert(sqlstatement1)
							 // html5sql.process(sqlstatement1,
								  // function(){

								 // },
								 // function(error, statement){
									 // opMessage("Error: " + error.message + " when processing " + statement);
								 // }        
							// );	
								
						}
					//Loop and write prioritytypes to DB
			//alert(sqlstatement)


			}	
			html5sql.process(sqlstatement,
				 function(){
					 //alert("Success - Finished Loading Orders");
				 },
				 function(error, statement){
					 opMessage("Error: " + error.message + " when processing " + statement);
				 }        
			);	
		//createSurveyData();


	};
}
function createSurveyData()
{
var sqlstatement="";

//Survey Creaate Data

sqlstatement+="INSERT INTO Surveys (name, type, datecreated, description) VALUES ('Survey2', 'SurveyExtra', '20140804 130443', 'Survey2 Description');"
//SurveyDetail Creaate Data

sqlstatement+="INSERT INTO SurveysDetail (surveyid, groupcode, sortseq, type, name, description, defaultval, next, attribute1, attribute2, attribute3, attribute4) VALUES ( '1', '-2', '', '1', 'Group1', 'Is This a Secure Location?', 'Yes', '2', '', '', '', '');"
sqlstatement+="INSERT INTO SurveysDetail (surveyid, groupcode, sortseq, type, name, description, defaultval, next, attribute1, attribute2, attribute3, attribute4) VALUES ( '1', '1', '', '2', 'What is the Condition of the Gate?', 'What is the Condition of the Gate?', '', '3', '', '', '', '');"
sqlstatement+="INSERT INTO SurveysDetail (surveyid, groupcode, sortseq, type, name, description, defaultval, next, attribute1, attribute2, attribute3, attribute4) VALUES ('1', '1', '', '1', 'What is The Fence Made of?', 'What is The Fence Made of?', '', '4', '', '', '', '');"
sqlstatement+="INSERT INTO SurveysDetail (surveyid, groupcode, sortseq, type, name, description, defaultval, next, attribute1, attribute2, attribute3, attribute4) VALUES ( '1', '1', '', '4', 'How Many Gates are there?', 'How Many Gates are there?', '', '5', '', '', '', '');"
sqlstatement+="INSERT INTO SurveysDetail (surveyid, groupcode, sortseq, type, name, description, defaultval, next, attribute1, attribute2, attribute3, attribute4) VALUES ('1', '-1', '', '2', 'Is there a Car Park?', 'Is there a Car Park?', '', '6', '', '', '', '');"
sqlstatement+="INSERT INTO SurveysDetail (surveyid, groupcode, sortseq, type, name, description, defaultval, next, attribute1, attribute2, attribute3, attribute4) VALUES ( '1', '-2', '', '10', 'Office', 'Is There a Office?', 'No', '7', '', '', '', '');"
sqlstatement+="INSERT INTO SurveysDetail (surveyid, groupcode, sortseq, type, name, description, defaultval, next, attribute1, attribute2, attribute3, attribute4) VALUES ( '1', '6', '', '2', 'Type of Building?', 'Type of Building?', '', '8', '', '', '', '');"
sqlstatement+="INSERT INTO SurveysDetail (surveyid, groupcode, sortseq, type, name, description, defaultval, next, attribute1, attribute2, attribute3, attribute4) VALUES ( '1', '6', '', '4', 'How many People Work here?', '', '', '9', '', '', '', '');"
sqlstatement+="INSERT INTO SurveysDetail (surveyid, groupcode, sortseq, type, name, description, defaultval, next, attribute1, attribute2, attribute3, attribute4) VALUES ( '1', '6', '', '2', 'is there Internet Access?', '', '', '10', '', '', '', '');"
sqlstatement+="INSERT INTO SurveysDetail (surveyid, groupcode, sortseq, type, name, description, defaultval, next, attribute1, attribute2, attribute3, attribute4) VALUES ( '1', '6', '', '6', 'What Type of Generator is on Site?', 'What Type of Generator is on Site?', '', '11', '', '', '', '');"
sqlstatement+="INSERT INTO SurveysDetail (surveyid, groupcode, sortseq, type, name, description, defaultval, next, attribute1, attribute2, attribute3, attribute4) VALUES ( '1', '-1', '', '5', 'Any Other Comments?', 'Any Other Comments?', '', '-1', '', '', '', '');"
//SurveyDetailAnswers Creaate Data

sqlstatement+="INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '7', '2', '', '1', 'Needs replacing', '');"
sqlstatement+="INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '2', '', '2', 'Needs maintenance', '');"
sqlstatement+="INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '2', '', '3', 'No Problem', '');"
sqlstatement+="INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '3', '', '1', 'Wood', '');"
sqlstatement+="INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '3', '', '2', 'Metal', '');"
sqlstatement+="INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '5', '', 'Yes', 'Yes', '');"
sqlstatement+="INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '5', '', 'No', 'No', '');"
sqlstatement+="INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '7', '', 'Brick', 'Brick Built', '');"
sqlstatement+="INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '7', '', 'Wood', 'Wood Built', '');"
sqlstatement+="INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '9', '', 'Yes', 'Yes', '');"
sqlstatement+="INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '9', '', 'No', 'No', '');"
sqlstatement+="INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '10', '', 'KV100', 'KV100', '');"
sqlstatement+="INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '10', '', 'MP333', 'MP333', '');"
sqlstatement+="INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '10', '', 'AB123', 'AB123', '');"
sqlstatement+="INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '10', '', 'VV777', 'VV777', '');"
			html5sql.process(sqlstatement,
				 function(){
					 //alert("Success - Finished Loading Orders");
				 },
				 function(error, statement){
					 opMessage("Error: " + error.message + " when processing " + statement);
				 }        
			);	
 $.magnificPopup.close();
}