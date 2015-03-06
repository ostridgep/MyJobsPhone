var objtype="";	
var objid="";	
var objshorttext="";	
var objaddress="";	
var objswerk="";		

var SAPServerPrefix="";
var SAPServerSuffix="";	

var parTrace= "ON";
var syncDetsSet=false;
var SQLStatement="";




// Cordova is ready



function showLoading(msgText)
{

    $.mobile.loading( "show", {
            text: msgText,
            textVisible: true
    });
}
function hideLoading()
{

    $.mobile.loading( "hide" );
}







function errorCB(err) {
alert("SQLErroe: "+err.code+" message"+err)
    OpMessage("SQLErroe: "+err.code+" message"+err);
}

function successCB() {
    alert("success!");
}
function opMessageToScreen(Type,msg){



$( "<div style='text-align:center;border:1px solid'  class='"+Type+"'><BR><h3>"+msg+"</h3></div>" )
  .css({ "display": "block",  "opacity": 0.96, "top": $(window).scrollTop() + 100 })
  

  .appendTo( "body" )
  .delay( 800 )
  .fadeOut( 2000, function() {
    $( this ).remove();
  });

}
function isEven(value) {
return (value%2 == 0);
}  








function getURLParameters(paramName) 
{
        var sURL = window.document.URL.toString();  
    if (sURL.indexOf("?") > 0)
    {
       var arrParams = sURL.split("?");         
       var arrURLParams = arrParams[1].split("&");      
       var arrParamNames = new Array(arrURLParams.length);
       var arrParamValues = new Array(arrURLParams.length);     
       var i = 0;
       for (i=0;i<arrURLParams.length;i++)
       {
        var sParam =  arrURLParams[i].split("=");
        arrParamNames[i] = sParam[0];
        if (sParam[1] != "")
            arrParamValues[i] = unescape(sParam[1]);
        else
            arrParamValues[i] = "No Value";
       }

       for (i=0;i<arrURLParams.length;i++)
       {
                if(arrParamNames[i] == paramName){
            //alert("Param:"+arrParamValues[i]);
                return arrParamValues[i];
             }
       }
       return "No Parameters Found";
    }

}
function CreateUser(muser, u, p){

db.transaction(function(tx) {

				
				tx.executeSql("INSERT INTO MyUserDets (mobileuser , user, password ) VALUES (?, ?, ?)", [muser, u, p]);
				opMessage("Creating User "+muser+":"+u+":"+p);
				//alert("Creating User"+fname+":"+u+":"+p);
				

	});


}

function ChangeUserPW(muser, u, p){

db.transaction(function(tx) {

				tx.executeSql("UPDATE MyUserDets set password = ? Where user = '"+u+"'", [p]);
				opMessage("Changing User "+muser+" to New Password "+p);
			
				

	});


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
function parseDate(input){
input=input+"          ";
//alert (input.substr(0,4)+"/"+input.substr(4,2)+"/"+input.substr(6,2)+" "+input.substr(8,2)+":"+input.substr(10,2));
 return new Date(input.substr(0,4), input.substr(4,2)-1, input.substr(6,2), // months are 0-based
                 input.substr(8,2), input.substr(10,2));

}


function SetLastSyncDetails(paramName){
nowd=getDate();
nowt=getTime();
paramValue=nowd+nowt;



				
				if (paramName=='LASTSYNC_REFERENCE'){
					localStorage.setItem('LastSyncReference',paramValue);
			
				}
				if (paramName=='LASTSYNC_TRANSACTIONAL'){
					localStorage.setItem('LastSyncTransactional',paramValue);
			
				}
				if (paramName=='LASTSYNC_UPLOAD'){
					localStorage.setItem('LastSyncUpload',paramValue);
			
				}	
//alert(paramName+"-"+paramValue);
db.transaction(function(tx) {
	tx.executeSql("SELECT * from MyWorkConfig where paramname = '"+paramName+"'", [], function(tx, result) {
			//alert("SELECT * from MyWorkConfig where paramname = '"+paramName+"'");
			if( result.rows.length> 0) {
			   tx.executeSql("UPDATE MyWorkConfig SET paramvalue = ? WHERE paramname = '"+paramName+"'", [paramValue]);
				
				//alert("UPDATE MyWorkConfig SET paramvalue = ? WHERE paramname = '"+paramName+"'");
				}else{
				tx.executeSql('INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES (?, ?)', [paramName,paramValue]);
				//alert('INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES (?, ?)'+paramName+"-"+paramValue);	
		
				}
			
		});
	});


}
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

db.transaction(function(tx) {
	 tx.executeSql("UPDATE Surveys SET name = ?, type = ?, description = ? , datecreated = ? where id = '"+id+"' ", [name, type, description,datestamp])

	});
}
function updateSurveysDetail(detailid, group, sortseq,name,type,description,defaultval, next, attribute1,attribute2,attribute3,attribute4)
{

		
db.transaction(function(tx) {
	tx.executeSql("UPDATE SurveysDetail SET groupcode = ?, sortseq = ?, name = ? , type = ?, description = ? , defaultval = ?, next = ?, attribute1 = ?,attribute2 = ?,attribute3 = ?,attribute4 = ? where id = '"+detailid+"' ",

						[group, sortseq, name, type, description,defaultval, next, attribute1,attribute2,attribute3,attribute4]);
	});
}

function deleteAllSurveys(id)
{

db.transaction(function(tx) {
	 tx.executeSql("DELETE FROM Surveys where id = '"+id+"' ")
	 tx.executeSql("DELETE FROM SurveysDetail where surveyid = '"+id+"' ")
	 tx.executeSql("DELETE FROM SurveysDetailAnswers where surveyid = '"+id+"' ")
	});
}
function deleteAllSurveysDetail(id)
{

db.transaction(function(tx) {

	 tx.executeSql("DELETE FROM SurveysDetail where id = '"+id+"' ")
	 tx.executeSql("DELETE FROM SurveysDetailAnswers where detailid = '"+id+"' ")
	});
}
function updateOrderEquipment(orderno, property, funcloc, equipment)
{

db.transaction(function(tx) {
	 tx.executeSql("UPDATE MyOrders SET property = ?, funcloc = ?, equipment = ?  where orderno = '"+orderno+"' ", [property,funcloc,equipment])

	});
}
function updateTaskLongText(id,longtext)
{

db.transaction(function(tx) {
	 tx.executeSql("UPDATE MyTasks SET longtext = ? where id = '"+id+"' ", [longtext])

	});
}
function updateOrderAddress(orderno, house, houseno, street, district, city, postcode, workaddress)
{

db.transaction(function(tx) {
	 tx.executeSql("UPDATE MyOrders SET house = ?, houseno = ?, street = ?, district = ?, city = ?, postcode = ?, workaddress= ? where orderno = '"+orderno+"' ", [house, houseno, street, district, city, postcode, workaddress])

	});
}
function updateNotifLatLong(notifno, fname, latlong)
{
res=notifno.split("|");

//alert("UPDATE MyNotifications SET "+fname+" = ? where notifno = '"+notifno+"' ");
db.transaction(function(tx) {
	 tx.executeSql("UPDATE MyNotifications SET "+fname+" = ? where id = '"+res[1]+"' ", [latlong])

	});
}
function updateOrderLatLong(orderno, fname, latlong)
{

db.transaction(function(tx) {
	 tx.executeSql("UPDATE MyOrders SET "+fname+" = ? where orderno = '"+orderno+"' ", [latlong])

	});
}

function updateOperationStatus(orderno, opno, status)
{

db.transaction(function(tx) {
	tx.executeSql("SELECT status from MyOperations where orderno = '"+orderno+"' and opno='"+opno+"'", [], function(tx, result) {
			//alert("SELECT * from MyWorkConfig where paramname = '"+paramName+"'");
			if( result.rows.length> 0) {
				item = result.rows.item(0);
				var newstatus = item['status']+", "+status;

			   tx.executeSql("UPDATE MyOperations SET status = ? where orderno = '"+orderno+"' and opno='"+opno+"'", [newstatus]);
			   }
			
		});
	});
}
function createSurveys(name,type,description,datecreated)
{
		
db.transaction(function(tx) {
	tx.executeSql('INSERT INTO  Surveys (name , type, description , datecreated) VALUES (?, ?, ?, ?)', 
						[name, type, description, datecreated]);
	});
}
function createSurveysDetail(surveyid, group, sortseq,name,type,description,defaultval, next, attribute1,attribute2,attribute3,attribute4)
{
		
db.transaction(function(tx) {
	tx.executeSql('INSERT INTO  SurveysDetail (surveyid, groupcode, sortseq, name , type, description , defaultval, next, attribute1,attribute2,attribute3,attribute4) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
						[surveyid, group, sortseq, name, type, description,defaultval, next, attribute1,attribute2,attribute3,attribute4]);
	});
}
function createSurveysDetailAnswers(surveyid,detailid,answertype,answercode,description, defaultval)
{
		
db.transaction(function(tx) {
	tx.executeSql('INSERT INTO  SurveysDetailAnswers (surveyid,detailid,answertype,answercode,description, defaultval) VALUES (?, ?, ?, ?, ?, ?)', 
						[surveyid,detailid,answertype,answercode,description, defaultval]);
	});
}
function createTConf(order,opno,empid,type,startdate,starttime,enddate,endtime,duration,finalconf,comments)
{
	
db.transaction(function(tx) {

	tx.executeSql('INSERT INTO  MyTimeConfs (orderno , opno,type, confno , description , date , time , enddate, endtime, duration, empid, final , datestamp, user, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
						[order,opno, type, "NEW", comments,startdate,starttime,enddate,endtime,duration,empid,finalconf,getDate+" "+getTime(), localStorage.getItem("MobileUser"), ""]);
		alert("Created Task");	
	});
}
function createNotification(type,priority,group,code,grouptext,codetext,description,details,startdate,funcloc,equipment)
{
var ReportedpOn=getDate()+" "+getTime();
var ReportedBy=localStorage.getItem("MobileUser");
db.transaction(function(tx) {

	tx.executeSql('INSERT INTO  MyNotifications (notifno , type, startdate, shorttext, longtext , priority , pgroup , pcode , grouptext, codetext, funcloc, equipment, reportedby, reportedon, plant , orderno, funclocgis, equipmentgis) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
						["NEW", type,  startdate, description, details, priority, group, code, grouptext, codetext,funcloc, equipment, ReportedBy, ReportedpOn, "", "", "", ""]);
	});
}
function createTask(notifno,groupcd,codecd, grouptext, codetext, description)
{

			
db.transaction(function(tx) {
	tx.executeSql('INSERT INTO MyTasks (notifno , item_id, task_codegrp , task_code , txt_taskgrp, txt_taskcd , task_text, task_cat_typ, plnd_start_date, plnd_start_time, plnd_end_date, plnd_end_time, sla_end_date, sla_end_time, longtext, complete, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
						[notifno, "NEW", groupcd,codecd, grouptext, codetext, description, "", getDate(), getTime(), "", "", getDate(), getTime(), "", "", ""]);
	} );
}


function createActivity(notifno,task,groupcd,codecd, grouptext, codetext, description)
{

				
db.transaction(function(tx) {
	tx.executeSql('INSERT INTO MyActivities (notifno ,task_id, item_id, act_codegrp , act_code , txt_actgrp, txt_actcd , act_text, act_id, act_cat_typ, start_date, start_time, end_date, end_time, long_text, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
						[notifno, task, "NEW", groupcd,codecd, grouptext, codetext, description, "", "", getDate(), getTime(), "", "", "", ""]);
	});
}
function createEffect(notifno,groupcd,codecd, grouptext, codetext, description)
{

				
db.transaction(function(tx) {
	tx.executeSql('INSERT INTO MyEffects (notifno , item_id, effect_codegrp , effect_code , txt_effectgrp, txt_effectcd , value, task_id, effect_cat_typ ) VALUES (?,  ?, ?, ?, ?, ?, ?, ?, ?)', 
						[notifno,  "NEW", groupcd,codecd, grouptext, codetext, description, "", ""]);
	});
}
function createCause(notifno,groupcd,codecd, grouptext, codetext, description)
{

				
db.transaction(function(tx) {
	tx.executeSql('INSERT INTO MyCauses (notifno , item_id, cause_codegrp , cause_code , txt_causegrp, txt_causecd , cause_text , cause_id, cause_cat_typ, long_text, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
						[notifno,  "NEW", groupcd, codecd, grouptext, codetext, description, "", "", "", ""]);
	});
}
function SetLocalStorage(){
			db.transaction(function(tx) {

		tx.executeSql("SELECT * from MyWorkConfig ", [], function(tx, result) {
			
			for (var i = 0; i < result.rows.length; i++) {
				item = result.rows.item(i);
				if (item['paramname']=='SERVERNAME'){
					localStorage.setItem('ServerName',item['paramvalue']);
					
				}
				if (item['paramname']=='SYNC_REFERENCE_FREQUENCY'){
					localStorage.setItem('SyncReferenceFrequency',item['paramvalue']);
			
				}
				if (item['paramname']=='SYNC_TRANSACTIONAL_FREQUENCY'){
					localStorage.setItem('SyncTransactionalFrequency',item['paramvalue']);
			
				}
				if (item['paramname']=='SYNC_UPLOAD_FREQUENCY'){
					localStorage.setItem('SyncUploadFrequency',item['paramvalue']);
			
				}			

				if (item['paramname']=='LASTSYNC_REFERENCE'){
					localStorage.setItem('LastSyncReference',item['paramvalue']);
			
				}
				if (item['paramname']=='LASTSYNC_TRANSACTIONAL'){
					localStorage.setItem('LastSyncTransactional',item['paramvalue']);
			
				}
				if (item['paramname']=='LASTSYNC_UPLOAD'){
					localStorage.setItem('LastSyncUpload',item['paramvalue']);
			
				}			
				if (item['paramname']=='TRACE'){
					localStorage.setItem('Trace',item['paramvalue']);
			
				}	
			}

		});
	});		
}
function syncTransactional(){


	if (!CheckSyncInterval('TRANSACTIONAL')){return; }
	opMessage("Synchronizing Transactional Data");
	db.transaction(function(tx) {
		tx.executeSql("SELECT * from MyUserDets", [], function(tx, result) {
		
				if( result.rows.length> 0) {
					item = result.rows.item(0);
					SAPServerSuffix="?jsonCallback=?&sap-client=700&sap-user="+item['user']+"&sap-password="+item['password']+"&username="+item['mobileuser'];
					tx.executeSql("SELECT * from MyWorkConfig where paramname = 'SERVERNAME'", [], function(tx, result) {
			
						if( result.rows.length> 0) {
							item = result.rows.item(0);
							SetLastSyncDetails("LASTSYNC_TRANSACTIONAL");
							SAPServerPrefix=$.trim(item['paramvalue']);

							requestSAPData("Orders.htm"," ");
							requestSAPData("Notifications.htm"," ");
						
							requestSAPData("OrdersObjects.htm"," ");

						}

		
					});
		
				}
		});

	});
}
function syncUpload(){


var newDets="";
syncDetsSet=false;



	if (!CheckSyncInterval('UPLOAD')){return; }
	opMessage("Synchronizing Upload Data");
	db.transaction(function(tx) {
		tx.executeSql("SELECT * from MyUserDets", [], function(tx, result) {
				opMessage("Synchronizing Upload Data");
				if( result.rows.length> 0) {
					item = result.rows.item(0);
					SAPServerSuffix="?jsonCallback=?&sap-client=700&sap-user="+item['user']+"&sap-password="+item['password'];
					opMessage("xx"+SAPServerSuffix);
					tx.executeSql("SELECT * from MyNewJobs where state = 'NEW'", [], function(tx, result) {
						opMessage("done NEWJOBS Select");
						opMessage("NewJobs = "+result.rows.length);
						if( result.rows.length> 0) {
							if(!syncDetsSet){
								syncDetsSet=true;
								SetLastSyncDetails("LASTSYNC_UPLOAD");
								
								}
							item = result.rows.item(0);

							newDets='&TYPE='+item['type']+'&STARTDATE='+item['date']+'&STARTTIME='+item['time']+'&SHORTTEXT='+item['shorttext']+'&LONGTEXT='+item['longtext']+'&RECNO='+item['id'];
							opMessage("NewJob Details="+newDets);
							SAPServerPrefix=$.trim(localStorage.getItem('ServerName'));
							
							sendSAPData(SAPServerPrefix+"createnotification.htm"+SAPServerSuffix+newDets);
						}
						tx.executeSql("SELECT * from MyTimeConfs where confno = 'NEW'", [], function(tx, result) {
							opMessage("done NEWTCONF Select");
							opMessage("NewTconf = "+result.rows.length);
							if( result.rows.length> 0) {
								if(!syncDetsSet){
									syncDetsSet=true;
									SetLastSyncDetails("LASTSYNC_UPLOAD");
									
									}
								item = result.rows.item(0);

								newDets='&ORDERNO='+item['orderno']+'&OPNO='+item['opno']+'&REASON='+item['description']+'&TIME='+item['duration']+'&USER='+item['user']+'&RECNO='+item['id'];
								opMessage("NewTconf Details="+newDets);
								SAPServerPrefix=$.trim(localStorage.getItem('ServerName'));
								
								sendSAPData(SAPServerPrefix+"createtconf.htm"+SAPServerSuffix+newDets);
							}

							tx.executeSql("SELECT * from MyStatus where state = 'NEW'", [], function(tx, result) {
								opMessage("done NEWStatus Select");
								opMessage("NewStatus = "+result.rows.length);
								if( result.rows.length> 0) {
									if(!syncDetsSet){
										syncDetsSet=true;
										SetLastSyncDetails("LASTSYNC_UPLOAD");
										
										}

									item = result.rows.item(0);

									newDets='&ORDERNO='+item['orderno']+'&OPNO='+item['opno']+'&STATUS='+item['status']+'&STSMA='+item['stsma']+'&RECNO='+item['id'];
									opMessage("Newstatus Details="+newDets);
									SAPServerPrefix=$.trim(localStorage.getItem('ServerName'));
									
									sendSAPData(SAPServerPrefix+"UpdateStatus.htm"+SAPServerSuffix+newDets);
								}
			
							});
						});
					});
				}
		});

	});
}

function syncReference(){



	if (!CheckSyncInterval('REFERENCE')){return; }
	
opMessage("Synchronizing Reference Data");
	db.transaction(function(tx) {
		tx.executeSql("SELECT * from MyUserDets", [], function(tx, result) {
		
				if( result.rows.length> 0) {
					item = result.rows.item(0);
					SAPServerSuffix="?jsonCallback=?&sap-client=700&sap-user="+item['user']+"&sap-password="+item['password']+"&username="+item['mobileuser'];
					tx.executeSql("SELECT * from MyWorkConfig where paramname = 'SERVERNAME'", [], function(tx, result) {
			
						if( result.rows.length> 0) {
							SetLastSyncDetails("LASTSYNC_REFERENCE");
							item = result.rows.item(0);
							SAPServerPrefix=$.trim(item['paramvalue']);
							opMessage("Sending SAP Request for Ref Data");	

							requestSAPData("RefData.htm"," ");
							requestSAPData("RefDataCodes.htm","&SCENARIO=MAMDEMOLG");
							requestSAPData("Users.htm"," ");
							//requestSAPData("Objects.htm"," ");
							requestSAPData("Vehicles.htm"," ");
						}

		
					});
		
				}
		});

	});
}
function GetConfigParam(paramName){


	db.transaction(function(tx) {

		tx.executeSql("SELECT * from MyWorkConfig where paramname = '"+paramName+"'", [], function(tx, result) {

			if( result.rows.length> 0) {
				item = result.rows.item(0);
				if (paramName == "TRACE"){
					parTrace=item['paramvalue'];
					}
				
				}
			
		});
	});

}
function SetConfigParam(paramName, paramValue){
localStorage.setItem(paramName, paramValue);
db.transaction(function(tx) {
	tx.executeSql("SELECT * from MyWorkConfig where paramname = '"+paramName+"'", [], function(tx, result) {
			//alert("SELECT * from MyWorkConfig where paramname = '"+paramName+"'");
			if( result.rows.length> 0) {
			   tx.executeSql("UPDATE MyWorkConfig SET paramvalue = ? WHERE paramname = '"+paramName+"'", [paramValue]);
				
				//alert("UPDATE MyWorkConfig SET paramvalue = ? WHERE paramname = '"+paramName+"'");
				}else{
				tx.executeSql('INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES (?, ?)', [paramName,paramValue]);
				//alert('INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES (?, ?)'+paramName+"-"+paramValue);	
		
				}
			
		});
	});
}		

function SetAllConfigParam(p1,v1,p2,v2,p3,v3,p4,v4,p5,v5){
alert(p1+p2)
db.transaction(function(tx) {
alert("SELECT * from MyWorkConfig where paramname = '"+p1+"'");
	tx.executeSql("SELECT * from MyWorkConfig where paramname = '"+p1+"'", [], function(tx, result) {
	alert("xx")
			if( result.rows.length> 0) {
			    tx.executeSql("UPDATE MyWorkConfig SET paramvalue = ? WHERE paramname = '"+p1+"'", [v1]);
				}else{
				tx.executeSql('INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES (?, ?)', [p1,v1]);		
				}
			localStorage.setItem(p1, v1);
			alert(p1)
			tx.executeSql("SELECT * from MyWorkConfig where paramname = '"+p2+"'", [], function(tx, result) {
				if( result.rows.length> 0) {
				   tx.executeSql("UPDATE MyWorkConfig SET paramvalue = ? WHERE paramname = '"+p2+"'", [v2]);
					}else{
					tx.executeSql('INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES (?, ?)', [p2,v2]);		
					}
				localStorage.setItem(p2, v2);
				alert(p2)
				tx.executeSql("SELECT * from MyWorkConfig where paramname = '"+p3+"'", [], function(tx, result) {
					if( result.rows.length> 0) {
					   tx.executeSql("UPDATE MyWorkConfig SET paramvalue = ? WHERE paramname = '"+p3+"'", [v3]);
						}else{
						tx.executeSql('INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES (?, ?)', [p3,v3]);		
						}
					localStorage.setItem(p3, v3);
					alert(p3)
					tx.executeSql("SELECT * from MyWorkConfig where paramname = '"+p4+"'", [], function(tx, result) {
						if( result.rows.length> 0) {
						   tx.executeSql("UPDATE MyWorkConfig SET paramvalue = ? WHERE paramname = '"+p4+"'", [v4]);
							}else{
							tx.executeSql('INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES (?, ?)', [p4,v4]);		
							}
						localStorage.setItem(p4, v4);
						alert(p4)
						tx.executeSql("SELECT * from MyWorkConfig where paramname = '"+p5+"'", [], function(tx, result) {
							if( result.rows.length> 0) {
							   tx.executeSql("UPDATE MyWorkConfig SET paramvalue = ? WHERE paramname = '"+p5+"'", [v5]);
								}else{
								tx.executeSql('INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES (?, ?)', [p5,v5]);		
								}
							localStorage.setItem(p5, v5);
							alert(p5)
						});
					});
				});
			});
		});
	});
}
function zeroFill1(x){
    return (x < 10) ? ("0" + x) : x;   
}			
function getDate()	{			
				var currentdate = new Date(); 
	return zeroFill1(currentdate.getFullYear().toString()) + zeroFill1((currentdate.getMonth()+1).toString() ) + zeroFill1(currentdate.getDate().toString());

}
function getTime()	{			
				var currentdate = new Date(); 
    x1=zeroFill1( currentdate.getHours()).toString();
          x2=zeroFill1(currentdate.getMinutes()).toString();
    x3=zeroFill1( currentdate.getSeconds()).toString();
	return x1+x2+x3;

}
function getDateStamp(){
nowd=getDate();
nowt=getTime();
dtstamp=nowd+nowt;
return dtstamp;
}
function formatDateTime(dt){

var formatteddt="";
formatteddt=dt.substring(6,8)+"-"+dt.substring(4,6)+"-"+dt.substring(0,4)+" "+dt.substring(8,10)+":"+dt.substring(10,12)+":"+dt.substring(12,14);
return formatteddt;
}
function showMessage(msg){
	sap.m.MessageToast.show(msg);



}
function opLog(msg){

nowd=getDate();
nowt=getTime();
dtstamp=nowd+nowt;
parTrace=localStorage.getItem('TRACE');

	//if (parTrace=='ON'){
			db.transaction(function(tx) {
				tx.executeSql('INSERT INTO LogFile (datestamp , type, message ) VALUES (?, ?, ?)', [dtstamp, 'I' , msg]);				
			});

	//}

}	
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

		

//DB Functions


  var dataset;
function opMessage(msg){



	opLog(msg);

}
function onError(tx, error) {
        //alert(error.message);
}		
function createDB(type){





	

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
   
$.ajaxSetup({
    async: false
});
requestDEMOData('TestData\\MyOrdersData.json');

requestDEMOData('TestData\\MyNotificationsData.json');

requestDEMOData('TestData\\MyUsersData.json');

requestDEMOData('TestData\\MyOrderObjectsData.json');	

requestDEMOData('TestData\\MyRefData.json');

requestDEMOData('TestData\\RefDataCodes.json');

//requestDEMOData('TestData\\MyVehiclesData.json');

//requestDEMOData('TestData\\MyMessagesData.json');
$.ajaxSetup({
    async: true
});

}	

function createTables() { 




	opMessage("Creating The Tables");	
        db.transaction(function(tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyOrders     			( orderno TEXT, shorttext TEXT, longtext TEXT, startdate TEXT, enddate TEXT, contact TEXT,   telno TEXT,    type TEXT, priority TEXT, address TEXT, workaddress TEXT, house TEXT, houseno TEXT, street TEXT, district TEXT, city TEXT, postcode TEXT,gis TEXT, property TEXT, funcloc TEXT, equipment TEXT, propertygis TEXT, funclocgis TEXT, equipmentgis TEXT, notifno TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyOperations 			( orderno TEXT, opno TEXT,      type TEXT,     priority TEXT,  shorttext TEXT, startdate TEXT, enddate TEXT, duration TEXT, status TEXT, apptstart TEXT, apptend TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyPartners   			( orderno TEXT, notifno TEXT, id TEXT,        type TEXT,     name TEXT,      address TEXT,   postcode TEXT, telno TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyAssets     			( orderno TEXT, id TEXT,        type TEXT,     name TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyUserStatus     		( type TEXT, orderno TEXT, opno TEXT, inact TEXT, status TEXT, statuscode TEXT, statusdesc TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyOperationInfo     	( orderno TEXT, opno TEXT, type TEXT, value1 TEXT, value2 TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyNotifications     	( id integer primary key autoincrement, notifno TEXT, shorttext TEXT, longtext TEXT,  pgroup TEXT, pcode TEXT, grouptext TEXT, codetext TEXT, startdate TEXT, type TEXT, priority TEXT, funcloc TEXT,   equipment TEXT, orderno TEXT, reportedon TEXT,   reportedby TEXT, plant TEXT, funclocgis TEXT,   equipmentgis TEXT)');
		
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyItems     			( id integer primary key autoincrement, notifno TEXT, item_id TEXT, descript TEXT, d_cat_typ TEXT, d_codegrp TEXT, d_code TEXT, dl_cat_typ TEXT, dl_codegrp TEXT, dl_code TEXT, long_text TEXT, stxt_grpcd TEXT ,txt_probcd TEXT  ,txt_grpcd TEXT , txt_objptcd TEXT, status TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyCauses      		( id integer primary key autoincrement, notifno TEXT, item_id TEXT, cause_id TEXT, cause_text TEXT, cause_cat_typ TEXT, cause_codegrp TEXT, cause_code TEXT, long_text TEXT, txt_causegrp TEXT, txt_causecd TEXT, status TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyActivities     		( id integer primary key autoincrement, notifno TEXT, task_id TEXT, item_id TEXT,  act_id TEXT, act_text TEXT, act_cat_typ TEXT, act_codegrp TEXT, act_code TEXT,  start_date TEXT, start_time TEXT ,end_date TEXT  ,end_time TEXT , long_text TEXT, txt_actgrp TEXT, txt_actcd TEXT, status TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyTasks      			( id integer primary key autoincrement, notifno TEXT, item_id TEXT, task_text TEXT, task_cat_typ TEXT, task_codegrp TEXT, task_code TEXT, txt_taskgrp TEXT, txt_taskcd TEXT, plnd_start_date TEXT, plnd_start_time TEXT ,plnd_end_date TEXT  ,plnd_end_time TEXT , sla_end_date TEXT  ,sla_end_time TEXT , longtext TEXT, complete TEXT, status TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyEffects      		( id integer primary key autoincrement, notifno TEXT, item_id TEXT, task_id TEXT, effect_cat_typ TEXT, effect_codegrp TEXT, effect_code TEXT, txt_effectgrp TEXT, txt_effectcd TEXT, value TEXT)');

		
		
		
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyStatus     			( id integer primary key autoincrement, orderno TEXT, opno TEXT, stsma TEXT, status TEXT, statusdesc, state TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyTimeConfs     		( id integer primary key autoincrement, orderno TEXT, opno TEXT, confno TEXT, type TEXT, description TEXT, date TEXT, time TEXT, enddate TEXT, endtime TEXT,duration TEXT, datestamp TEXT,  user TEXT,  empid TEXT, final TEXT, state TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyNewJobs     		( id integer primary key autoincrement, type TEXT, shorttext TEXT, longtext TEXT, description TEXT, date TEXT, time TEXT, funcloc TEXT, equipment TEXT, cattype TEXT, activitycodegroup TEXT, activitycode TEXT, activitytext TEXT, prioritytype TEXT, priority TEXT, reportedby TEXT, state TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyWorkConfig     		( paramname TEXT, paramvalue TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyWorkSyncDets    		( lastsync TEXT, comments   TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyUserDets              ( mobileuser TEXT, user TEXT, password TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyRefUsers    			(  userid TEXT, scenario TEXT, plant TEXT, workcenter TEXT, plannergroup TEXT, plannergroupplant TEXT, storagegroup TEXT, storageplant TEXT, partner TEXT, partnerrole TEXT, funclocint TEXT, funcloc TEXT, compcode TEXT, employeeno TEXT, equipment TEXT, firstname TEXT, lastname TEXT, telno TEXT)');														
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyRefOrderTypes     	(  scenario TEXT, type TEXT, description TEXT, statusprofile TEXT, opstatusprofile TEXT)');
	    tx.executeSql('CREATE TABLE IF NOT EXISTS MyRefNotifTypes     	(  scenario TEXT, type TEXT, description TEXT, statusprofile TEXT, taskstatusprofile TEXT,priority_type TEXT)');

		tx.executeSql('CREATE TABLE IF NOT EXISTS MyRefPriorityTypes     	(  scenario TEXT, type TEXT, priority TEXT, description TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyRefUserStatusProfiles (  scenario TEXT, type TEXT, status TEXT, statuscode TEXT, statusdesc TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyVehicles     			(  reg TEXT, id TEXT, mpoint TEXT,description TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyVehicleCheck     		(  reg TEXT,  mileage TEXT,  tax TEXT,  horn TEXT,  tyres TEXT,  wheels TEXT,  lights TEXT,  wipers TEXT, checktype TEXT,  datestamp TEXT,  user TEXT,  state TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS MyMessages    			( id TEXT, type TEXT,  date TEXT, time TEXT, msgfromid TEXT, msgfromname TEXT, msgtoid TEXT, msgtoname TEXT, msgsubject TEXT, msgtext TEXT, state TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS Assets     			(  type TEXT, id TEXT, eqart TEXT, eqtyp TEXT, shorttext TEXT,  address TEXT, workcenter TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS AssetClassVals     			(  type TEXT, id TEXT,  charact TEXT,  valuechar TEXT,  valueto TEXT, valueneutral TEXT, description TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS AssetMeasurementPoints     			(  type TEXT, id TEXT,  mpoint TEXT,  description TEXT,  value TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS AssetInstalledEquip     			(  type TEXT, id TEXT,  eqno TEXT,  description TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS LogFile    		( datestamp TEXT, type TEXT, message TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS RefNotifprofile  		( scenario TEXT, profile TEXT, notif_type TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS RefCodeGroups  		( scenario TEXT, profile TEXT, catalog_type TEXT, code_cat_group TEXT, codegroup TEXT, codegroup_text TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS RefCodes  		( scenario TEXT, profile TEXT, code_cat_group TEXT, code TEXT, code_text TEXT)');
		
		tx.executeSql('CREATE TABLE IF NOT EXISTS Surveys     			( id integer primary key autoincrement, name TEXT, type TEXT, datecreated TEXT, description TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS SurveysDetail     	( id integer primary key autoincrement, surveyid TEXT, groupcode TEXT, sortseq TEXT, type TEXT, name TEXT, description TEXT, defaultval TEXT, next TEXT, attribute1 TEXT, attribute2 TEXT, attribute3 TEXT, attribute4 TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS SurveysDetailAnswers  ( id integer primary key autoincrement, surveyid TEXT, detailid TEXT, answertype TEXT, answercode TEXT, description TEXT, defaultval TEXT)');
		CreateUser("MOBILED","mobiled", "logica");
        });

}
function dropTables() { 
opMessage("Dropping The Tables");

    db.transaction(function(tx) {

	 tx.executeSql('DROP TABLE IF EXISTS MyOrders');
	  tx.executeSql('DROP TABLE  IF EXISTS MyOperations');
	  tx.executeSql('DROP TABLE  IF EXISTS MyPartners');
	  tx.executeSql('DROP TABLE  IF EXISTS MyAssets');
	  tx.executeSql('DROP TABLE  IF EXISTS MyUserStatus');
		  	  	  tx.executeSql('DROP TABLE  IF EXISTS MyOperationInfo');
	  tx.executeSql('DROP TABLE  IF EXISTS MyNotifications');
	  tx.executeSql('DROP TABLE  IF EXISTS MyItems');
 tx.executeSql('DROP TABLE  IF EXISTS MyCauses');
  tx.executeSql('DROP TABLE  IF EXISTS MyActivities');
   tx.executeSql('DROP TABLE  IF EXISTS MyTasks');
    tx.executeSql('DROP TABLE  IF EXISTS MyEffects');

	  tx.executeSql('DROP TABLE  IF EXISTS MyStatus');
	  tx.executeSql('DROP TABLE IF EXISTS MyTimeConfs');
	  tx.executeSql('DROP TABLE IF EXISTS MyNewJobs');
	  tx.executeSql('DROP TABLE IF EXISTS MyWorkConfig');
	  tx.executeSql('DROP TABLE IF EXISTS MyRefUsers');

	  tx.executeSql('DROP TABLE IF EXISTS MyRefOrderTypes');
	  	  tx.executeSql('DROP TABLE IF EXISTS MyRefNotifTypes');
  	  tx.executeSql('DROP TABLE  IF EXISTS MyRefPriorityTypes');
	  tx.executeSql('DROP TABLE IF EXISTS MyRefUserStatusProfiles');
	  tx.executeSql('DROP TABLE IF EXISTS MyWorkSyncDets');
	  tx.executeSql('DROP TABLE IF EXISTS MyUserDets');
	  tx.executeSql('DROP TABLE IF EXISTS MyVehicles');
	  tx.executeSql('DROP TABLE IF EXISTS MyVehicleCheck');
	  tx.executeSql('DROP TABLE IF EXISTS MyMessages');
	  tx.executeSql('DROP TABLE IF EXISTS Assets');
	  tx.executeSql('DROP TABLE IF EXISTS LogFile');
	  tx.executeSql('DROP TABLE IF EXISTS AssetClassVals');
	  	  tx.executeSql('DROP FROM AssetInstalledEquip');
	   tx.executeSql('DROP FROM AssetMeasurementPoints');
	  tx.executeSql('DROP TABLE IF EXISTS RefNotifprofile');
	  tx.executeSql('DROP TABLE IF EXISTS RefCodeGroups');
	  tx.executeSql('DROP TABLE IF EXISTS RefCodes');
	  
	  tx.executeSql('DROP TABLE IF EXISTS Surveys');	
	  tx.executeSql('DROP TABLE IF EXISTS SurveysDetail');
	  tx.executeSql('DROP TABLE IF EXISTS SurveysDetailAnswers');
    });

}
function emptyTables() { 
opMessage("Emptying The Tables");
	
     db.transaction(function(tx) {

	 tx.executeSql('DELETE FROM  MyOrders');
	  tx.executeSql('DELETE FROM  MyOperations');
	  tx.executeSql('DELETE FROM  MyPartners');
	  tx.executeSql('DELETE FROM  MyAssets');
	  	  tx.executeSql('DELETE FROM  MyUserStatus');
		  	  	  tx.executeSql('DELETE FROM  MyOperationInfo');
	  tx.executeSql('DELETE FROM  MyNotifications');
	  tx.executeSql('DELETE FROM  MyItems');
 tx.executeSql('DELETE FROM  MyCauses');
  tx.executeSql('DELETE FROM  MyActivities');
   tx.executeSql('DELETE FROM  MyTasks');
    tx.executeSql('DELETE FROM  MyEffects');

	  tx.executeSql('DELETE FROM  MyStatus');
	  tx.executeSql('DELETE FROM  MyTimeConfs');
	  tx.executeSql('DELETE FROM  MyNewJobs');
	  tx.executeSql('DELETE FROM  MyWorkConfig');
	  tx.executeSql('DELETE FROM  MyRefUsers');

	  tx.executeSql('DELETE FROM  MyRefOrderTypes');
	  	  tx.executeSql('DELETE FROM  MyRefNotifTypes');
  	  tx.executeSql('DELETE FROM  MyRefPriorityTypes');
	  tx.executeSql('DELETE FROM  MyRefUserStatusProfiles');
	  tx.executeSql('DELETE FROM  MyWorkSyncDets');
	  tx.executeSql('DELETE FROM  MyUserDets');
	  tx.executeSql('DELETE FROM  MyVehicles');
	  tx.executeSql('DELETE FROM  MyVehicleCheck');
	  tx.executeSql('DELETE FROM  MyMessages');
	  tx.executeSql('DELETE FROM  Assets');
	  tx.executeSql('DELETE FROM  LogFile');
	  tx.executeSql('DELETE FROM  AssetClassVals');
	  	  tx.executeSql('DROP FROM AssetInstalledEquip');
	   tx.executeSql('DROP FROM AssetMeasurementPoints');
	  tx.executeSql('DELETE FROM  RefNotifprofile');
	  tx.executeSql('DELETE FROM  RefCodeGroups');
	  tx.executeSql('DELETE FROM  RefCodes');
	  
	  tx.executeSql('DELETE FROM  Surveys');	
	  tx.executeSql('DELETE FROM  SurveysDetail');
	  tx.executeSql('DELETE FROM  SurveysDetailAnswers');
    });
}	
	
function DeleteLog() { 
opMessage("Emptying The Log Table");
	db.transaction(function(tx) {

			tx.executeSql('DELETE FROM LogFile');
			

       });

}			
function onSuccess(tx, success) {
        //alert(success.message);
}		

		

// variable to hold request
var request;
// bind to the submit event of our form




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
function orderCB(MyOrders){
	opMessage("Doing Orders");

	if(MyOrders.order.length>0){
		db.transaction(function(tx) {
			opMessage("Deleting Existing Orders");
			tx.executeSql('DELETE FROM MyOrders');
			tx.executeSql('DELETE FROM MyOperations');
			tx.executeSql('DELETE FROM MyPartners');
			tx.executeSql('DELETE FROM MyAssets');
		
			tx.executeSql('DELETE FROM MyTimeConfs');
			tx.executeSql('DELETE FROM MyUserStatus');
			tx.executeSql('DELETE FROM MyOperationInfo');
			tx.executeSql('DELETE FROM MyStatus where state="SERVER"');
			opMessage("Loading "+MyOrders.order.length+" Orders");
			
			for(var cntx=0; cntx < MyOrders.order.length ; cntx++)
				{
				
				tx.executeSql('INSERT INTO MyOrders (orderno , shorttext , longtext , startdate ,  enddate ,contact , telno , type , priority , address ,workaddress, house, houseno, street, district, city, postcode, gis,  property, funcloc, equipment, propertygis, funclocgis, equipmentgis, notifno) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
					[MyOrders.order[cntx].orderno , MyOrders.order[cntx].shorttext , MyOrders.order[cntx].longtext , MyOrders.order[cntx].startdate ,  MyOrders.order[cntx].enddate ,MyOrders.order[cntx].contact ,
					 MyOrders.order[cntx].telno , MyOrders.order[cntx].type , MyOrders.order[cntx].priority , MyOrders.order[cntx].address , MyOrders.order[cntx].workaddress, MyOrders.order[cntx].house,
					 MyOrders.order[cntx].houseno, MyOrders.order[cntx].street, MyOrders.order[cntx].district, MyOrders.order[cntx].city, MyOrders.order[cntx].postcode, MyOrders.order[cntx].gis,
					 MyOrders.order[cntx].property,  MyOrders.order[cntx].funcloc,  MyOrders.order[cntx].equipment, 
					 MyOrders.order[cntx].propertygis,  MyOrders.order[cntx].funclocgis,  MyOrders.order[cntx].equipmentgis, MyOrders.order[cntx].notifno]);
				//Loop and write operations to DB
				;
	 			opMessage("Loading "+MyOrders.order[cntx].operation.length+" Operations");
			
				for(var opscnt=0; opscnt < MyOrders.order[cntx].operation.length ; opscnt++)
					{	
					
					tx.executeSql('INSERT INTO MyOperations (orderno , opno, type , priority , shorttext , startdate, enddate, duration , status, apptstart, apptend) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
						[MyOrders.order[cntx].orderno, MyOrders.order[cntx].operation[opscnt].opno, MyOrders.order[cntx].operation[opscnt].type,MyOrders.order[cntx].operation[opscnt].priority,
						 MyOrders.order[cntx].operation[opscnt].shorttext, MyOrders.order[cntx].operation[opscnt].startdate, MyOrders.order[cntx].operation[opscnt].enddate, MyOrders.order[cntx].operation[opscnt].duration, 
						 MyOrders.order[cntx].operation[opscnt].status, MyOrders.order[cntx].operation[opscnt].apptstart, MyOrders.order[cntx].operation[opscnt].apptend]);
				
				}
				 

				opMessage("Loading "+MyOrders.order[cntx].partner.length+" Partners");
				
				//Loop and write partners to DB
				for(var pcnt=0; pcnt < MyOrders.order[cntx].partner.length ; pcnt++)
					{	
					tx.executeSql('INSERT INTO MyPartners (orderno , id, type , name , address , postcode , telno, notifno) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
						[MyOrders.order[cntx].orderno, MyOrders.order[cntx].partner[pcnt].id, MyOrders.order[cntx].partner[pcnt].type,MyOrders.order[cntx].partner[pcnt].name,
						MyOrders.order[cntx].partner[pcnt].address, MyOrders.order[cntx].partner[pcnt].postcode, MyOrders.order[cntx].partner[pcnt].telno,""]);
				}
				
				
				
				opMessage("Loading "+MyOrders.order[cntx].userstatus.length+" UserStatus");
				//Loop and write userstatus to DB
				for(var pcnt=0; pcnt < MyOrders.order[cntx].userstatus.length ; pcnt++)
					{	
					tx.executeSql('INSERT INTO MyUserStatus (type , orderno, opno , inact , status , statuscode , statusdesc) VALUES (?, ?, ?, ?, ?, ?, ?)', 
						[MyOrders.order[cntx].userstatus[pcnt].type, MyOrders.order[cntx].userstatus[pcnt].orderno,MyOrders.order[cntx].userstatus[pcnt].opno,
						MyOrders.order[cntx].userstatus[pcnt].inact, MyOrders.order[cntx].userstatus[pcnt].status, MyOrders.order[cntx].userstatus[pcnt].statuscode,
						MyOrders.order[cntx].userstatus[pcnt].statusdesc]);
				}

				opMessage("Loading "+MyOrders.order[cntx].operationinfo.length+" OperationInfo");
				//Loop and write userstatus to DB
				for(var pcnt=0; pcnt < MyOrders.order[cntx].operationinfo.length ; pcnt++)
					{	
					tx.executeSql('INSERT INTO MyOperationInfo (orderno, opno , type , value1 , value2) VALUES (?, ?, ?, ?, ?)', 
						[MyOrders.order[cntx].operationinfo[pcnt].orderno, MyOrders.order[cntx].operationinfo[pcnt].opno, MyOrders.order[cntx].operationinfo[pcnt].type, 
						MyOrders.order[cntx].operationinfo[pcnt].value1, MyOrders.order[cntx].operationinfo[pcnt].value2]);
				}
				
				
				
				
				//Loop and write Assets to DB
				
	  
				opMessage("Loading "+MyOrders.order[cntx].asset.length+" Assets");
				for(var acnt=0; acnt < MyOrders.order[cntx].asset.length ; acnt++)
					{
					if (MyOrders.order[cntx].asset[acnt].equipment.length>0){
						tx.executeSql('INSERT INTO MyAssets (orderno , id, type , name ) VALUES (?, ?, ?, ?)', 
							[MyOrders.order[cntx].orderno, MyOrders.order[cntx].asset[acnt].equipment, 'EQ', MyOrders.order[cntx].asset[acnt].equidescr]);
						}else if (MyOrders.order[cntx].asset[acnt].funcloc.length>0){
						tx.executeSql('INSERT INTO MyAssets (orderno , id, type , name ) VALUES (?, ?, ?, ?)', 
							[MyOrders.order[cntx].orderno, MyOrders.order[cntx].asset[acnt].funcloc, 'FL', MyOrders.order[cntx].asset[acnt].funclocdesc]);
						}
				}
				//Loop and write TConfs to DB
				
	  
				opMessage("Loading "+MyOrders.order[cntx].tconf.length+" TimeConfs");
				for(var acnt=0; acnt < MyOrders.order[cntx].tconf.length ; acnt++)
					{	
					tx.executeSql('INSERT INTO MyTimeConfs (orderno , opno,type, confno , description , date , time , enddate, endtime, duration, empid, final,datestamp, user, state ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
						[MyOrders.order[cntx].orderno, MyOrders.order[cntx].tconf[acnt].activity, MyOrders.order[cntx].tconf[acnt].type, MyOrders.order[cntx].tconf[acnt].confno,MyOrders.order[cntx].tconf[acnt].description,MyOrders.order[cntx].tconf[acnt].date,MyOrders.order[cntx].tconf[acnt].time,
						MyOrders.order[cntx].tconf[acnt].enddate,MyOrders.order[cntx].tconf[acnt].endtime,MyOrders.order[cntx].tconf[acnt].duration,MyOrders.order[cntx].tconf[acnt].empid,MyOrders.order[cntx].tconf[acnt].final,"","",""]);
				}
	//	tx.executeSql('CREATE TABLE IF NOT EXISTS MyTimeConfs     		( orderno TEXT, opno TEXT, confno TEXT, type TEXT, description TEXT, date TEXT, time TEXT, duration TEXT, datestamp TEXT,  user TEXT,  state TEXT)');

			}
			console.log("Finished Orders");
		});


	}
}
function objectsCB(Objects){
opMessage("Callback objects triggured");
		if(Objects.object.length>0){
			db.transaction(function(tx) {
				opMessage("Deleting Existing Ref Assets");
				tx.executeSql('DELETE FROM Assets');
			
				opMessage("Loading "+Objects.object.length+" Ref Assets");
				for(var cntx=0; cntx < Objects.object.length ; cntx++)
					{
					
					tx.executeSql('INSERT INTO Assets ( id, type , eqart, eqtyp, shorttext, address, workcenter ) VALUES (?, ?, ?, ?, ?, ?, ?)', 
							[Objects.object[cntx].id, Objects.object[cntx].type, Objects.object[cntx].eqart, Objects.object[cntx].eqtyp,Objects.object[cntx].shorttext,Objects.object[cntx].address,Objects.object[cntx].swerk]);
						
					}
					
					
		  
			console.log("Finished objects");		
			});


		}
}

function notificationCB(MyNotifications){
	


	
	if(MyNotifications.notification.length>0){
		db.transaction(function(tx) {
			opMessage("Deleting Existing Notifications");
			tx.executeSql('DELETE FROM MyNotifications');
			tx.executeSql('DELETE FROM MyTasks');
			tx.executeSql('DELETE FROM MyItems');
			tx.executeSql('DELETE FROM MyCauses');
			tx.executeSql('DELETE FROM MyActivities');
			tx.executeSql('DELETE FROM MyEffects');
			opMessage("Loading "+MyNotifications.notification.length+" Notifications");
			
			for(var cntx=0; cntx < MyNotifications.notification.length ; cntx++)
				{
				//alert(MyNotifications.notification[cntx].pgroup);
				tx.executeSql('INSERT INTO MyNotifications (notifno , shorttext , longtext , startdate , priority , type, funcloc, equipment, orderno, reportedon , reportedby , plant, funclocgis, equipmentgis, pgroup, pcode, grouptext, codetext) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
					[MyNotifications.notification[cntx].notifno , 
					MyNotifications.notification[cntx].shorttext , 
					MyNotifications.notification[cntx].longtext , 
					MyNotifications.notification[cntx].startdate , 
					MyNotifications.notification[cntx].priority ,
					MyNotifications.notification[cntx].type,
					MyNotifications.notification[cntx].funcloc , 
					MyNotifications.notification[cntx].equipment ,
					MyNotifications.notification[cntx].orderno, 
					MyNotifications.notification[cntx].reportedon , 
					MyNotifications.notification[cntx].reportedby ,
					MyNotifications.notification[cntx].plant,
					MyNotifications.notification[cntx].funclocgis , 
					MyNotifications.notification[cntx].equipmentgis, 
					MyNotifications.notification[cntx].pgroup ,
					MyNotifications.notification[cntx].pcode,
					MyNotifications.notification[cntx].pgrouptext , 
					MyNotifications.notification[cntx].pcodetext]);
					//Loop and write Items to DB
					

					opMessage("Loading "+MyNotifications.notification[cntx].task.length+" Tasks");
					for(var tcnt=0; tcnt < MyNotifications.notification[cntx].task.length ; tcnt++)
						{	

						tx.executeSql('INSERT INTO MyTasks (notifno , item_id , task_text , task_cat_typ , task_codegrp , task_code , txt_taskgrp ,txt_taskcd , plnd_start_date , plnd_start_time, plnd_end_date, plnd_end_time, sla_end_date, sla_end_time, longtext, complete, status) VALUES ( ?,  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
							[MyNotifications.notification[cntx].notifno,
							 MyNotifications.notification[cntx].task[tcnt].id, 

							 MyNotifications.notification[cntx].task[tcnt].task_text,
							 MyNotifications.notification[cntx].task[tcnt].task_cat_typ,
							 MyNotifications.notification[cntx].task[tcnt].task_codegrp, 
							 MyNotifications.notification[cntx].task[tcnt].task_code, 
							 MyNotifications.notification[cntx].task[tcnt].txt_taskgrp, 
							 MyNotifications.notification[cntx].task[tcnt].txt_taskcd,
							 MyNotifications.notification[cntx].task[tcnt].plnd_start_date,
							 MyNotifications.notification[cntx].task[tcnt].plnd_start_time, 
							 MyNotifications.notification[cntx].task[tcnt].plnd_end_date, 
							 MyNotifications.notification[cntx].task[tcnt].plnd_end_time, 
							 MyNotifications.notification[cntx].task[tcnt].sla_end_date,
							 MyNotifications.notification[cntx].task[tcnt].sla_end_time, 
							 MyNotifications.notification[cntx].task[tcnt].longtext,
							 MyNotifications.notification[cntx].task[tcnt].complete, 
							 MyNotifications.notification[cntx].task[tcnt].status]);
						}
					opMessage("Loading "+MyNotifications.notification[cntx].effect.length+" Effect");
					for(var ecnt=0; ecnt < MyNotifications.notification[cntx].effect.length ; ecnt++)
						{	

						tx.executeSql('INSERT INTO MyEffects (notifno , item_id , task_id, effect_cat_typ , effect_codegrp , effect_code , txt_effectgrp ,txt_effectcd , value) VALUES (  ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
							[MyNotifications.notification[cntx].notifno,
							 MyNotifications.notification[cntx].effect[ecnt].id, 
							  MyNotifications.notification[cntx].effect[ecnt].task, 

							 MyNotifications.notification[cntx].effect[ecnt].effect_cat_typ,
							 MyNotifications.notification[cntx].effect[ecnt].effect_codegrp, 
							 MyNotifications.notification[cntx].effect[ecnt].effect_code, 
							 MyNotifications.notification[cntx].effect[ecnt].txt_effectgrp, 
							 MyNotifications.notification[cntx].effect[ecnt].txt_effectcd,
							 MyNotifications.notification[cntx].effect[ecnt].value]);
						}

					opMessage("Loading "+MyNotifications.notification[cntx].item.length+" Items");
					for(var icnt=0; icnt < MyNotifications.notification[cntx].item.length ; icnt++)
						{	
				
						tx.executeSql('INSERT INTO MyItems (notifno , item_id , descript , d_cat_typ , d_codegrp , d_code , dl_cat_typ , dl_codegrp , dl_code , stxt_grpcd , txt_probcd , txt_grpcd, txt_objptcd,  status, long_text) VALUES (?, ?,  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
							[MyNotifications.notification[cntx].notifno,
							 MyNotifications.notification[cntx].item[icnt].id, 
							 MyNotifications.notification[cntx].item[icnt].description,
							 MyNotifications.notification[cntx].item[icnt].d_cat_typ,
							 MyNotifications.notification[cntx].item[icnt].d_codegrp, 
							 MyNotifications.notification[cntx].item[icnt].d_code, 
							 MyNotifications.notification[cntx].item[icnt].dl_cat_typ,
							 MyNotifications.notification[cntx].item[icnt].dl_codegrp, 
							 MyNotifications.notification[cntx].item[icnt].dl_code, 
						
							 MyNotifications.notification[cntx].item[icnt].stxt_grpcd,
							 MyNotifications.notification[cntx].item[icnt].txt_prodcd,
							 MyNotifications.notification[cntx].item[icnt].txt_grpcd,
							 MyNotifications.notification[cntx].item[icnt].txt_objptcd,  'S', ""]);

						}
					//Loop and write Causes to DB
					
					opMessage("Loading "+MyNotifications.notification[cntx].cause.length+" Causes");
					for(var ccnt=0; ccnt < MyNotifications.notification[cntx].cause.length ; ccnt++)
						{	

						tx.executeSql('INSERT INTO MyCauses (notifno , item_id , cause_id, cause_text , cause_cat_typ , cause_codegrp , cause_code , txt_causegrp , txt_causecd ,  status, long_text) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
							[MyNotifications.notification[cntx].notifno,
							 MyNotifications.notification[cntx].cause[ccnt].id, 
							 MyNotifications.notification[cntx].cause[ccnt].cause_key, 
							 MyNotifications.notification[cntx].cause[ccnt].causetext,
							 MyNotifications.notification[cntx].cause[ccnt].cause_cat_typ,
							 MyNotifications.notification[cntx].cause[ccnt].cause_codegrp, 
							 MyNotifications.notification[cntx].cause[ccnt].cause_code, 
							 MyNotifications.notification[cntx].cause[ccnt].cause_txt_causegrp,
							 MyNotifications.notification[cntx].cause[ccnt].cause_txt_causecd,  'S', ""]);
						}
					//Loop and write Items to DB
					
					opMessage("Loading "+MyNotifications.notification[cntx].activity.length+" Activities");
					for(var acnt=0; acnt < MyNotifications.notification[cntx].activity.length ; acnt++)
						{	

						tx.executeSql('INSERT INTO MyActivities (notifno , item_id , task_id, act_text , act_cat_typ , act_codegrp , act_code ,txt_actgrp, txt_actcd ,start_date , start_time , end_date , end_time,   status, act_id, long_text) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
							[MyNotifications.notification[cntx].notifno,
							 MyNotifications.notification[cntx].activity[acnt].id, 
							 MyNotifications.notification[cntx].activity[acnt].task_id, 
							 MyNotifications.notification[cntx].activity[acnt].acttext,
							 MyNotifications.notification[cntx].activity[acnt].act_cat_typ,
							 MyNotifications.notification[cntx].activity[acnt].act_codegrp, 
							 MyNotifications.notification[cntx].activity[acnt].act_code, 
							 MyNotifications.notification[cntx].activity[acnt].txt_actgrp,
							 MyNotifications.notification[cntx].activity[acnt].txt_actcd, 
							 MyNotifications.notification[cntx].activity[acnt].start_date, 
							 MyNotifications.notification[cntx].activity[acnt].start_time, 
							 MyNotifications.notification[cntx].activity[acnt].end_date,
							 MyNotifications.notification[cntx].activity[acnt].end_time,'S',"", ""]);
						}
						
						
						
				}

console.log("Finished notifs");
		});
	}
}		
function sapCB(MySAP){
	


	
	if(MySAP.message.length>0){
		
			opMessage("Processing Update Response: ");

			if (MySAP.message[0].type=="createnotification"){
				opMessage("-->Type= "+MySAP.message[0].type);
				opMessage("-->row= "+MySAP.message[0].recno);
				opMessage("-->Message= "+MySAP.message[0].message);
				opMessage("-->NotifNo= "+MySAP.message[0].notifno);
				db.transaction(function(tx) {
	
					tx.executeSql("UPDATE MyNewJobs SET state = ? WHERE id='"+MySAP.message[0].recno+"'", [MySAP.message[0].notifno]);
					
					});
		
			}
			if (MySAP.message[0].type=="createnotification"){
				opMessage("-->Type= "+MySAP.message[0].type);
				opMessage("-->confno= "+MySAP.message[0].confno);
				if(MySAP.message[0].confno!="0000000000"){

					db.transaction(function(tx) {
		
						tx.executeSql("UPDATE MyTimeConfs SET state = 'SERVER' WHERE id='"+MySAP.message[0].recno+"'");
						
						});
					}
		
			}			

			if (MySAP.message[0].type=="updatestatus"){
				opMessage("-->UpdateStatus");
				opMessage("-->Orderno= "+MySAP.message[0].orderno);
				opMessage("-->Opno= "+MySAP.message[0].opno);
				opMessage("-->Message= "+MySAP.message[0].message);
				if(MySAP.message[0].message=="Status successfully changed"){

					db.transaction(function(tx) {
		
						tx.executeSql("UPDATE MyStatus SET state = 'SERVER' WHERE orderno='"+MySAP.message[0].orderno+"' and opno = '" + MySAP.message[0].opno + "'");
						
						});
					}
		
			}			


	}
}		

function getFlocs(){
	
	$.getJSON('MyFuncloc.json',function(Funcloc){ 
		db.transaction(function(tx) {

		opMessage("Loading "+Funcloc.funcloc.length+" Functional Locations");
		for(var cntx=0; cntx < Funcloc.funcloc.length ; cntx++)
			{	
			tx.executeSql('INSERT INTO Assets (type , id , shorttext , name , city , street, postcode ) VALUES ( ?, ?, ?, ?, ?, ?, ?)', 
				['FL' , 
				Funcloc.funcloc[cntx].id , 
				Funcloc.funcloc[cntx].shorttext , 
				Funcloc.funcloc[cntx].name , 
				Funcloc.funcloc[cntx].city ,
				Funcloc.funcloc[cntx].street ,
				Funcloc.funcloc[cntx].postcode]);
				//Loop and write Tasks to DB

				opMessage("Loading "+Funcloc.funcloc[cntx].classval.length+" Class Vals");
				for(var opscnt=0; opscnt < Funcloc.funcloc[cntx].classval.length ; opscnt++)
					{	
					
					tx.executeSql('INSERT INTO AssetClassVals (type , id, charact , valuechar , valueto , valueneutral , description) VALUES (?, ?, ?, ?, ?, ?, ?)', 
						['FL',
						 Funcloc.funcloc[cntx].id,
						 Funcloc.funcloc[cntx].classval[opscnt].charact, 
						 Funcloc.funcloc[cntx].classval[opscnt].valuechar,
						 Funcloc.funcloc[cntx].classval[opscnt].valueto,
						 Funcloc.funcloc[cntx].classval[opscnt].valueneutral, 
						 Funcloc.funcloc[cntx].classval[opscnt].description]);
				
				}
				

			}
		});

	});
	
	

		
}	
function getMessages(){
	

	db.transaction(function(tx) {

		tx.executeSql('DELETE FROM MyMessages');
		opMessage("Loading "+MyMessages.message.length+" Messages");
		for(var cntx=0; cntx <   MyMessages.message.length ; cntx++)
			{	

			tx.executeSql('INSERT INTO MyMessages (id, type, date, time, msgfromid, msgfromname, msgtoid, msgtoname, msgsubject, msgtext, state ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
				[MyMessages.message[cntx].id ,MyMessages.message[cntx].type , MyMessages.message[cntx].date , MyMessages.message[cntx].time , MyMessages.message[cntx].msgfromid ,
				MyMessages.message[cntx].msgfromname ,MyMessages.message[cntx].msgtoid ,  MyMessages.message[cntx].msgtoname ,MyMessages.message[cntx].msgsubject ,  
				MyMessages.message[cntx].msgtext , 	MyMessages.message[cntx].state]);
			}

	
	
	});
		
}				
function getEquips(){	
	$.getJSON('MyEquipment.json',function(Equipment){ 
		db.transaction(function(tx) {

		opMessage("Loading "+Equipment.equipment.length+" Equipment");
		for(var cntx=0; cntx < Equipment.equipment.length ; cntx++)
			{	
			tx.executeSql('INSERT INTO Assets (type , id , shorttext , name , city , street, postcode ) VALUES ( ?, ?, ?, ?, ?, ?, ?)', 
				['EQ' , 
				Equipment.equipment[cntx].id , 
				Equipment.equipment[cntx].shorttext , 
				Equipment.equipment[cntx].name , 
				Equipment.equipment[cntx].city ,
				Equipment.equipment[cntx].street ,
				Equipment.equipment[cntx].postcode]);
				//Loop and write Tasks to DB

				opMessage("Loading "+Equipment.equipment[cntx].classval.length+" Class Vals");
				for(var opscnt=0; opscnt < Equipment.equipment[cntx].classval.length ; opscnt++)
					{	
					
					tx.executeSql('INSERT INTO AssetClassVals (type , id, charact , valuechar , valueto , valueneutral , description) VALUES (?, ?, ?, ?, ?, ?, ?)', 
						['EQ',
						 Equipment.equipment[cntx].id,
						 Equipment.equipment[cntx].classval[opscnt].charact, 
						 Equipment.equipment[cntx].classval[opscnt].valuechar,
						 Equipment.equipment[cntx].classval[opscnt].valueto,
						 Equipment.equipment[cntx].classval[opscnt].valueneutral, 
						 Equipment.equipment[cntx].classval[opscnt].description]);
				
					}
				

			}
		});

	});
}
function userCB(MyUsers){
		

	if(MyUsers.user.length>0){

		db.transaction(function(tx) {
			opMessage("Deleting Existing Users");
			tx.executeSql('DELETE FROM MyRefUsers');
			opMessage("Loading"+MyUsers.user.length+" Existing Users");
			for(var cntx=0; cntx < MyUsers.user.length ; cntx++)
				{	

				tx.executeSql('INSERT INTO MyRefUsers (userid , scenario , plant , workcenter , plannergroup , plannergroupplant, storagegroup, storageplant, partner, partnerrole, funclocint, funcloc, compcode, employeeno, equipment, firstname, lastname, telno ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )', 
					[MyUsers.user[cntx].userid , 
					MyUsers.user[cntx].scenario , 
					MyUsers.user[cntx].plant , 
					MyUsers.user[cntx].workcenter ,
					MyUsers.user[cntx].plannergroup , 
					MyUsers.user[cntx].plannergroupplant , 
					MyUsers.user[cntx].storagegroup ,			
					MyUsers.user[cntx].storageplant , 
					MyUsers.user[cntx].partner , 
					MyUsers.user[cntx].partnerrole ,
					MyUsers.user[cntx].funclocint , 
					MyUsers.user[cntx].funcloc , 
					MyUsers.user[cntx].compcode ,
					MyUsers.user[cntx].employeeno , 
					MyUsers.user[cntx].equipment ,
					MyUsers.user[cntx].firstname , 
					MyUsers.user[cntx].lastname,
					MyUsers.user[cntx].telno]);
					
					

				}		
console.log("Finished users");
		});

	}
}
function vehicleCB(MyVehicles){
		

	if(MyVehicles.vehicle.length>0){

		db.transaction(function(tx) {
			opMessage("Deleting Existing Vehicles");
			tx.executeSql('DELETE FROM MyVehicles');
			opMessage("Loading"+MyVehicles.vehicle.length+" Vehicles");
			for(var cntx=0; cntx < MyVehicles.vehicle.length ; cntx++)
				{	

				tx.executeSql('INSERT INTO MyVehicles (id , reg , description , mpoint ) VALUES ( ?, ?, ?, ? )', 
					[MyVehicles.vehicle[cntx].vehicle , 
					MyVehicles.vehicle[cntx].reg , 
					MyVehicles.vehicle[cntx].description , 
					MyVehicles.vehicle[cntx].mpoint]);
					
					

				}		
console.log("Finished vehicles");
		});

	}
}
function messageCB(MyMessages){
		

	if(MyMessages.message.length>0){

		db.transaction(function(tx) {
			opMessage("Deleting Existing Messages");
			tx.executeSql('DELETE FROM MyMessages');
			opMessage("Loading"+MyMessages.message.length+" Messages");
			for(var cntx=0; cntx < MyMessages.message.length ; cntx++)
				{	

				tx.executeSql('INSERT INTO MyMessages (type , date , time , msgfrom, msgto, msgtext, state ) VALUES ( ?, ?, ?, ?, ?, ?, ? )', 
					[MyMessages.message[cntx].type , 
					MyMessages.message[cntx].date , 
					MyMessages.message[cntx].time , 
					MyMessages.message[cntx].msgfrom , 
					MyMessages.message[cntx].msgto , 
					MyMessages.message[cntx].msgtext , 
					MyMessages.message[cntx].state]);
					
					

				}		
console.log("Finished messages");
		});

	}
}
function orderobjectsCB(MyObjects){
}
function orderobjectsCB1(MyObjects){
	

	if(MyObjects.orderobjects.length>0){

		db.transaction(function(tx) {
			opMessage("Deleting Existing Assets");
			tx.executeSql('DELETE FROM Assets');
			tx.executeSql('DELETE FROM AssetClassVals');
			tx.executeSql('DELETE FROM AssetMeasurementPoints');
			tx.executeSql('DELETE FROM AssetInstalledEquip');
			opMessage("Loading "+MyObjects.orderobjects.length+" Assets");
			for(var cntx=0; cntx <   MyObjects.orderobjects.length ; cntx++){
				objtype=MyObjects.orderobjects[cntx].objtype;
				objid=MyObjects.orderobjects[cntx].objid;
				objshorttext=MyObjects.orderobjects[cntx].shorttext; 
				objaddress=MyObjects.orderobjects[cntx].address;
				objswerk=MyObjects.orderobjects[cntx].swerk;

				tx.executeSql('INSERT INTO Assets (type , id , shorttext , address, workcenter ) VALUES (?, ?, ?, ?, ? )', [objtype, objid, objshorttext, objaddress, objswerk]);
				//Loop and write Classvals to DB

				opMessage("Loading "+MyObjects.orderobjects[cntx].classval.length+" Class Vals");
				
				for(var opscnt=0; opscnt < MyObjects.orderobjects[cntx].classval.length ; opscnt++)
					{	
					
					tx.executeSql('INSERT INTO AssetClassVals (type , id, charact , valuechar , valueto , valueneutral , description) VALUES (?, ?, ?, ?, ?, ?, ?)', 
						[objtype,
						 objid,
						 MyObjects.orderobjects[cntx].classval[opscnt].charact, 
						 MyObjects.orderobjects[cntx].classval[opscnt].valuechar,
						 MyObjects.orderobjects[cntx].classval[opscnt].valueto,
						 MyObjects.orderobjects[cntx].classval[opscnt].valueneutral, 
						 MyObjects.orderobjects[cntx].classval[opscnt].description]);
				
					}
//Loop and write Measurement Points to DB

				opMessage("Loading "+MyObjects.orderobjects[cntx].measpoint.length+" Mesurement Points");
				
				for(var opscnt=0; opscnt < MyObjects.orderobjects[cntx].measpoint.length ; opscnt++)
					{	
					
					tx.executeSql('INSERT INTO AssetMeasurementPoints (type , id, mpoint  , description) VALUES ( ?, ?, ?, ?)', 
						[objtype,
						 objid,
						 MyObjects.orderobjects[cntx].measpoint[opscnt].mpoint, 
 
						 MyObjects.orderobjects[cntx].measpoint[opscnt].description]);
				
					}
			
				//Loop and write Installed Equipment to DB

				opMessage("Loading "+MyObjects.orderobjects[cntx].installedquip.length+" Installed Equipment");
				
				for(var opscnt=0; opscnt < MyObjects.orderobjects[cntx].installedquip.length ; opscnt++)
					{	
					
					tx.executeSql('INSERT INTO AssetInstalledEquip (type , id, eqno , description) VALUES ( ?, ?, ?, ?)', 
						[objtype,
						 objid,
						 MyObjects.orderobjects[cntx].installedquip[opscnt].eqno, 
 
						 MyObjects.orderobjects[cntx].installedquip[opscnt].type]);
				
					}
				

			}		
console.log("Finished Ordersobjects");
		});

	}
}	
function refdataCB(MyReference){
opMessage("Callback Reference Data triggured");
	    
	if(MyReference.scenario.length>0){
		db.transaction(function(tx) {
			opMessage("Deleting Existing Reference Data");
			tx.executeSql('DELETE FROM MyRefOrderTypes');
			tx.executeSql('DELETE FROM MyRefNotifTypes');
			tx.executeSql('DELETE FROM MyRefPriorityTypes');
			tx.executeSql('DELETE FROM MyRefUserStatusProfiles');
			for(var cntx=0; cntx < MyReference.scenario.length ; cntx++)
				{	
				opMessage("Loading Scenario "+MyReference.scenario[cntx].scenario + " Reference Data");

					//Loop and write ordertypes to DB

					opMessage("Loading "+MyReference.scenario[cntx].ordertype.length+" Order Types");
					for(var opscnt=0; opscnt < MyReference.scenario[cntx].ordertype.length ; opscnt++)
						{	
						tx.executeSql('INSERT INTO MyRefOrderTypes (scenario, type , description, statusprofile ,opstatusprofile ) VALUES (?,?,?,?,?)', 
							[MyReference.scenario[cntx].scenario,
							 MyReference.scenario[cntx].ordertype[opscnt].type,
							 MyReference.scenario[cntx].ordertype[opscnt].description,
							 MyReference.scenario[cntx].ordertype[opscnt].statusprofile,
							 MyReference.scenario[cntx].ordertype[opscnt].opstatusprofile],function(tx, result){
                                        console.log("Success");
                                    }, function(tx, e){
                                        console.error("Error:" + e.message)
                                    });
						opMessage("Loading "+MyReference.scenario[cntx].ordertype[opscnt].type +":"+
						MyReference.scenario[cntx].ordertype[opscnt].description+":"+
							 MyReference.scenario[cntx].ordertype[opscnt].statusprofile+":"+
							 MyReference.scenario[cntx].ordertype[opscnt].opstatusprofile);
						}
						//Loop and write notiftypes to DB


						opMessage("Loading "+MyReference.scenario[cntx].notiftype.length+" Notif Types");
						for(var opscnt=0; opscnt < MyReference.scenario[cntx].notiftype.length ; opscnt++)
							{	
							
							tx.executeSql('INSERT INTO MyRefNotifTypes (scenario , type , description , statusprofile,	taskstatusprofile , priority_type ) VALUES (?, ?, ?, ?, ?,?)', 
								[MyReference.scenario[cntx].scenario,
								 MyReference.scenario[cntx].notiftype[opscnt].type,
								 MyReference.scenario[cntx].notiftype[opscnt].description,
								 MyReference.scenario[cntx].notiftype[opscnt].statusprofile,
								 MyReference.scenario[cntx].notiftype[opscnt].taskstatusprofile,
								 MyReference.scenario[cntx].notiftype[opscnt].priority_type],function(tx, result){
                                        console.log("Success");
                                    }, function(tx, e){
                                        console.error("Error:" + e.message)
                                    });
						}
							

							//Loop and write prioritytypes to DB

						opMessage("Loading "+MyReference.scenario[cntx].prioritytype.length+" Priority Types");
						for(var opscnt=0; opscnt < MyReference.scenario[cntx].prioritytype.length ; opscnt++)
							{	
							
							tx.executeSql('INSERT INTO MyRefPriorityTypes (scenario, type , priority, description ) VALUES ( ?, ?, ?, ?)', 
								[MyReference.scenario[cntx].scenario,
								 MyReference.scenario[cntx].prioritytype[opscnt].type,
								 MyReference.scenario[cntx].prioritytype[opscnt].priority,
								 MyReference.scenario[cntx].prioritytype[opscnt].description],function(tx, result){
                                        console.log("Success");
                                    }, function(tx, e){
                                        console.error("Error:" + e.message)
                                    });
							
							}
						//Loop and write prioritytypes to DB
						opMessage("Loading "+MyReference.scenario[cntx].userstatus.length+" Status Profiles");
						for(var opscnt=0; opscnt < MyReference.scenario[cntx].userstatus.length ; opscnt++)
							{	
									
							tx.executeSql('INSERT INTO MyRefUserStatusProfiles (scenario, type , status, statuscode, statusdesc ) VALUES ( ?, ?, ?, ?, ?)', 
									[MyReference.scenario[cntx].scenario,
									 MyReference.scenario[cntx].userstatus[opscnt].type,
									 MyReference.scenario[cntx].userstatus[opscnt].status,
									 MyReference.scenario[cntx].userstatus[opscnt].statuscode,
									 MyReference.scenario[cntx].userstatus[opscnt].statusdesc],function(tx, result){
                                        console.log("Success");
                                    }, function(tx, e){
                                        console.error("Error:" + e.message)
                                    });
							
							}			
						opMessage("Checking No of OTypes");		
						tx.executeSql('SELECT count(*) total FROM MyRefOrderTypes', [], function(tx, result) {
						
										if(result.rows.length>0) {
											item = result.rows.item(0);
											opMessage("Total Order Types"+item['total']);
											
										}

						});
						opMessage("Checking No of NTypes");		
						tx.executeSql('SELECT count(*) total FROM MyRefNotifTypes', [], function(tx, result) {
						
										if(result.rows.length>0) {
											item = result.rows.item(0);
											opMessage("Total Order Types"+item['total']);
											
										}

						});
						
					opMessage("RefData Loading Complete 4");
					
				}
		console.log("Finished refdata");		
		});

	}
}


// the txn callbacks
function _insertSuccess(tx,r){
  app.util.printToConsole('txn successful');
  if (r){
    app.util.printToConsole(r);
  }
}

function _insertFailure(tx,e){
  // e in this case is always undefined
  app.util.printToConsole('txn failed - ' + (e ? e.message : 'no err msg available'));
}		

function refdatacodesCB(MyReference){
opMessage("Callback Reference Data Codes triggured");
var cntx=0;
	if(MyReference.catprofile.length>0){
		db.transaction(function(tx) {
			opMessage("Deleting Existing Reference Data");
			tx.executeSql('DELETE FROM RefNotifprofile');
			tx.executeSql('DELETE FROM RefCodeGroups');
			tx.executeSql('DELETE FROM RefCodes');
			for(var cntx=0; cntx < MyReference.catprofile.length ; cntx++)
				{	
				tx.executeSql('INSERT INTO RefNotifprofile (scenario, profile , notif_type ) VALUES (?, ?, ?)', 
						[MyReference.catprofile[cntx].scenario,
						 MyReference.catprofile[cntx].notifcat_profile,
						 MyReference.catprofile[cntx].notifcat_type]);
					
					

					//Loop and write codegroups to DB

					opMessage("Loading "+MyReference.catprofile[cntx].notifcat_profile);
					for(var opscnt=0; opscnt < MyReference.catprofile[cntx].codegroup.length ; opscnt++)
						{	
						
						tx.executeSql('INSERT INTO RefCodeGroups (scenario, profile , catalog_type , code_cat_group , codegroup , codegroup_text  ) VALUES (?, ?, ?, ?, ?, ?)', 
							[MyReference.catprofile[cntx].scenario,
							 MyReference.catprofile[cntx].notifcat_profile,
							 MyReference.catprofile[cntx].codegroup[opscnt].catalog_type,
							 MyReference.catprofile[cntx].codegroup[opscnt].code_cat_group,
							 MyReference.catprofile[cntx].codegroup[opscnt].codegroup,
							 MyReference.catprofile[cntx].codegroup[opscnt].codegroup_text]);
					
						
					//Loop and write codes to DB

						opMessage("Loading "+MyReference.catprofile[cntx].codegroup[opscnt].codes.length+" Codes");
						for(var ccnt=0; ccnt < MyReference.catprofile[cntx].codegroup[opscnt].codes.length ; ccnt++)
							{	
							
							tx.executeSql('INSERT INTO RefCodes (scenario, profile , code_cat_group , code , code_text ) VALUES ( ?, ?, ?, ?, ?)', 
								[MyReference.catprofile[cntx].scenario,
							 	 MyReference.catprofile[cntx].notifcat_profile,
								 MyReference.catprofile[cntx].codegroup[opscnt].code_cat_group,
								 MyReference.catprofile[cntx].codegroup[opscnt].codes[ccnt].code,
								 MyReference.catprofile[cntx].codegroup[opscnt].codes[ccnt].code_text]);
						
							}	
						}
					//Loop and write prioritytypes to DB
			}	
			console.log("Finished refdatacode");
		createSurveyData();
		});

	};
}

function getTraceState(){
//alert(paramName+"-"+paramValue);

traceState="OFF";
xtraceState="";
	db.transaction(function(tx) {
		tx.executeSql("SELECT * from MyWorkConfig where paramname = 'TRACE'", [], function(tx, result) {
				
				if( result.rows.length> 0) {
					item = result.rows.item(0);
					traceState=item['paramvalue'];
				
					}
				localStorage.setItem('Trace',traceState);
				$('#traceState').val(traceState); 	
				$('#traceState').selectmenu('refresh', true);
		});
	});

}



function createSurveyData()
{

db.transaction(function(tx) {
//Survey Creaate Data

	 tx.executeSql("INSERT INTO Surveys (name, type, datecreated, description) VALUES ('Survey2', 'SurveyExtra', '20140804 130443', 'Survey2 Description')")
//SurveyDetail Creaate Data

tx.executeSql("INSERT INTO SurveysDetail (surveyid, groupcode, sortseq, type, name, description, defaultval, next, attribute1, attribute2, attribute3, attribute4) VALUES ( '1', '-2', '', '1', 'Group1', 'Is This a Secure Location?', 'Yes', '2', '', '', '', '')")
tx.executeSql("INSERT INTO SurveysDetail (surveyid, groupcode, sortseq, type, name, description, defaultval, next, attribute1, attribute2, attribute3, attribute4) VALUES ( '1', '1', '', '2', 'What is the Condition of the Gate?', 'What is the Condition of the Gate?', '', '3', '', '', '', '')")
tx.executeSql("INSERT INTO SurveysDetail (surveyid, groupcode, sortseq, type, name, description, defaultval, next, attribute1, attribute2, attribute3, attribute4) VALUES ('1', '1', '', '1', 'What is The Fence Made of?', 'What is The Fence Made of?', '', '4', '', '', '', '')")
tx.executeSql("INSERT INTO SurveysDetail (surveyid, groupcode, sortseq, type, name, description, defaultval, next, attribute1, attribute2, attribute3, attribute4) VALUES ( '1', '1', '', '4', 'How Many Gates are there?', 'How Many Gates are there?', '', '5', '', '', '', '')")
tx.executeSql("INSERT INTO SurveysDetail (surveyid, groupcode, sortseq, type, name, description, defaultval, next, attribute1, attribute2, attribute3, attribute4) VALUES ('1', '-1', '', '2', 'Is there a Car Park?', 'Is there a Car Park?', '', '6', '', '', '', '')")
tx.executeSql("INSERT INTO SurveysDetail (surveyid, groupcode, sortseq, type, name, description, defaultval, next, attribute1, attribute2, attribute3, attribute4) VALUES ( '1', '-2', '', '10', 'Office', 'Is There a Office?', 'No', '7', '', '', '', '')")
tx.executeSql("INSERT INTO SurveysDetail (surveyid, groupcode, sortseq, type, name, description, defaultval, next, attribute1, attribute2, attribute3, attribute4) VALUES ( '1', '6', '', '2', 'Type of Building?', 'Type of Building?', '', '8', '', '', '', '')")
tx.executeSql("INSERT INTO SurveysDetail (surveyid, groupcode, sortseq, type, name, description, defaultval, next, attribute1, attribute2, attribute3, attribute4) VALUES ( '1', '6', '', '4', 'How many People Work here?', '', '', '9', '', '', '', '')")
tx.executeSql("INSERT INTO SurveysDetail (surveyid, groupcode, sortseq, type, name, description, defaultval, next, attribute1, attribute2, attribute3, attribute4) VALUES ( '1', '6', '', '2', 'is there Internet Access?', '', '', '10', '', '', '', '')")
tx.executeSql("INSERT INTO SurveysDetail (surveyid, groupcode, sortseq, type, name, description, defaultval, next, attribute1, attribute2, attribute3, attribute4) VALUES ( '1', '6', '', '6', 'What Type of Generator is on Site?', 'What Type of Generator is on Site?', '', '11', '', '', '', '')")
tx.executeSql("INSERT INTO SurveysDetail (surveyid, groupcode, sortseq, type, name, description, defaultval, next, attribute1, attribute2, attribute3, attribute4) VALUES ( '1', '-1', '', '5', 'Any Other Comments?', 'Any Other Comments?', '', '-1', '', '', '', '')")
//SurveyDetailAnswers Creaate Data

tx.executeSql("INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '7', '2', '', '1', 'Needs replacing', '')")
tx.executeSql("INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '2', '', '2', 'Needs maintenance', '')")
tx.executeSql("INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '2', '', '3', 'No Problem', '')")
tx.executeSql("INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '3', '', '1', 'Wood', '')")
tx.executeSql("INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '3', '', '2', 'Metal', '')")
tx.executeSql("INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '5', '', 'Yes', 'Yes', '')")
tx.executeSql("INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '5', '', 'No', 'No', '')")
tx.executeSql("INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '7', '', 'Brick', 'Brick Built', '')")
tx.executeSql("INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '7', '', 'Wood', 'Wood Built', '')")
tx.executeSql("INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '9', '', 'Yes', 'Yes', '')")
tx.executeSql("INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '9', '', 'No', 'No', '')")
tx.executeSql("INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '10', '', 'KV100', 'KV100', '')")
tx.executeSql("INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '10', '', 'MP333', 'MP333', '')")
tx.executeSql("INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '10', '', 'AB123', 'AB123', '')")
tx.executeSql("INSERT INTO SurveysDetailAnswers ( surveyid, detailid, answertype, answercode, description, defaultval) VALUES ( '1', '10', '', 'VV777', 'VV777', '')")

 $.magnificPopup.close();
	});
}