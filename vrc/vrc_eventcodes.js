$j = jQuery.noConflict();

let outputDiv = $j("#vrcOutput")
let epPublic = "https://d1qeon7qw4jcrw.cloudfront.net/vrc";
let epSandbox = "https://d1qeon7qw4jcrw.cloudfront.net/vrc_sandbox";

//load public json data
 let loadPubData = function () {
        eventNameSet = new Set()
        eventCodeSet = new Set()
        //eventNameMap = new Map()
        eventNameList = []
        eventNameArray = []

        $j.ajax({
		   type: 'GET',
		   url: epPublic,
		   dataType: 'html',
			success: function(data) {
				vrcPublicData = JSON.parse(data);
				//store description data in variable    
                $j.each(vrcPublicData, function (key, events) {
                    $j.each(events, function(key,value){
                       // console.log(eventNameMap)
                      // eventNameMap.set(value.offer_desc+"",""+value.tm_event_name)
                       eventNameSet.add(value.offer_desc)
                       eventCodeSet.add(value.tm_event_name)
                       eventNameList.push((value.offer_desc.replace(/\s/g, ''))+"*"+value.tm_event_name)
                    })
                })
          // console.log(eventNameMap)
			},
			error: function (xhr, ajaxOptions, thrownError) { //
			    alert("data didn't load")
			}
           
		});
        setTimeout(buildPublicHeaders, 500) 
        setTimeout(buildPublicList, 1000) 
    }
 //load public json data
 let loadSandboxData = function () {
        eventNameSbSet = new Set()
        eventCodeSbSet = new Set()
        //eventNameMap = new Map()
        eventNameSbList = []
        eventNameSbArray = []

        $j.ajax({
		   type: 'GET',
		   url: epSandbox,
		   dataType: 'html',
			success: function(data) {
				vrcSandboxData = JSON.parse(data); 
				//store description data in variable    
                $j.each(vrcSandboxData, function (key, events) {
                    $j.each(events, function(key,value){
                       //console.log(eventNameMap)
                       //eventNameMap.set(value.offer_desc+"",""+value.tm_event_name)
                       eventNameSbSet.add(value?.offer_desc);
                       eventCodeSbSet.add(value?.tm_event_name)
                       eventNameSbList.push((value.offer_desc.replace(/\s/g, ''))+"*"+value.tm_event_name)
                    })
                })
          // console.log(eventNameMap)
			},
			error: function (xhr, ajaxOptions, thrownError) { //
                alert("data didn't load")
			   
			}
           
		});
        setTimeout(buildSandboxHeaders, 500) 
        setTimeout(buildSandboxList, 1000) 
    }
 //build headers      
let buildPublicHeaders = function(){
   let eventNameArray = Array.from(eventNameSet)  
    //go through event name list
    $j.each(eventNameArray, function (key, value){
        let eventName = value;
        let eventNameNs = value.replace(/\s/g, '');
        //create a header list
        let vrcHeader = $j('<div class="vrcDataObj" data-eventname="'+eventNameNs+'"><h3>'+eventName+'</h3><p id="'+eventNameNs+'" ></p></div>')
        outputDiv.append(vrcHeader);
        })

  } 
let buildSandboxHeaders = function(){
   let eventNameArray = Array.from(eventNameSbSet)  
    //go through event name list
    $j.each(eventNameArray, function (key, value){
        let eventName = value;
        let eventNameNs = value.replace(/\s/g, '');
        //create a header list
        let vrcHeader = $j('<div class="vrcDataSbObj" data-eventname="'+eventNameNs+'"><h3>'+eventName+'</h3><p id="'+eventNameNs+'" ></p></div>')
       
        if(!eventNameNs){
           //donothing
        }else{
            outputDiv.append(vrcHeader);
        }
        })

  }  
//build and output data  
let buildPublicList = function(){
    //go through the header list
	$j('.vrcDataObj').each(function () {
       let headerName = $j(this).data('eventname')
       let targetDiv = $j(this).children("p")
     //go through event data
    $j.each(vrcPublicData, function (key, events) {
                  $j.each(events, function(key,value){
                     let eventName = value.offer_desc;
                     let eventNameNs = value.offer_desc.replace(/\s/g, '');
                     let eventID = ","+value.tm_event_name;
                     if(headerName === eventNameNs){
                        document.getElementById(headerName).innerHTML += eventID//.toString();
                       // targetDiv.append(eventID);
                     }
                    })
             })
  } )
}
let buildSandboxList = function(){
    //go through the header list
	$j('.vrcDataSbObj').each(function () {
       let headerName = $j(this).data('eventname')
       let targetDiv = $j(this).children("p")
     //go through event data
    $j.each(vrcSandboxData, function (key, events) {
                  $j.each(events, function(key,value){
                     let eventName = value.offer_desc;
                     let eventNameNs = value.offer_desc.replace(/\s/g, '');
                     let eventID = ","+value.tm_event_name;
                     if(headerName === eventNameNs){
                        document.getElementById(headerName).innerHTML += eventID//.toString();
                       // targetDiv.append(eventID);
                     }
                    })
             })
  } )
}
//on click for pub
    $j(document).on('click', "#vrcDataLive", function () {
    loadingAnimation();
    resetAllData();
    loadPubData();

    });
  //on click for sb
  $j(document).on('click', "#vrcDataSb", function () {
    loadingAnimation();
    resetAllData();
    loadSandboxData();

    });  
//reset the data 
let resetAllData = function(){
    vrcPublicData = "";
    vrcSandboxData = "";
    $j(".vrcDataObj").remove(0)
    $j(".vrcDataSbObj").remove(0)
}
//play loading animation
let loadingAnimation = function(){
    $j(".vrcDataLbWrap").fadeIn(500).css("display","flex")
   //setTimeout(hideAnimation, 3000) 
   setTimeout(() => {$j(".vrcDataLbWrap").fadeOut(500)}, 3000)
}
