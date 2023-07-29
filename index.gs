// 設定安全碼
const config = { 
  channelAccessToken: "",
  channelSecret: "",
  fireport:"1Wu41nX_rqNy3J9A5V0iZQYacCyEISdp1", //消防栓csv檔案   https://drive.google.com/file/d/1Wu41nX_rqNy3J9A5V0iZQYacCyEISdp1/view?usp=share_link
  sendimg:""  //傳送圖片壓日期 權限csv檔案 (可空白)

}
const porttype =["地上式單口式","地上打倒安全式(單口)","地上式雙口式","地上打倒安全式(雙口)","地下式單口式","地下式雙口式"]


function botEcho(reToken, userMsg) {
	var url = 'https://api.line.me/v2/bot/message/reply';
	var opt = {
		'headers': {
			'Content-Type': 'application/json; charset=UTF-8',
			'Authorization': 'Bearer ' + config.channelAccessToken,
		},
		'method': 'post',
		'payload': JSON.stringify({
				'replyToken': reToken,
				'messages': userMsg
				})
	};
	var res = UrlFetchApp.fetch(url, opt);
	return res;
}

function doPost(e) { 
  const event = JSON.parse(e.postData.contents).events[0];
  const reToken = event.replyToken;
  
	if (typeof reToken === 'undefined') return;

  if (event.type === "message") {

    const message = event.message;
  
    if (message.type == "text" && message.text === "冰塊查詢")
    {
       showtime (event);
    }
    if (message.type == "text" && message.text.split(' ')[0].toLocaleLowerCase() === 'twd97'){
      let getxy=twd97_to_latlng(message.text.split(' ')[1],message.text.split(' ')[2]);
      getmessandlocation(event,getxy.lat,getxy.lng);

    }
    if (message.type == "text" && message.text.split(' ')[0] === '經緯'){
      if(message.text.split(' ')[1].split("度").length>1){
        let first1 = message.text.split(' ')[1].split("度")[0];
        let second1 = message.text.split(' ')[1].split("度")[1].split("分")[0];
        let third1 = message.text.split(' ')[1].split("度")[1].split("分")[1].split("秒")[0];
        let lng = (parseFloat(third1)/60+parseFloat(second1))/60+parseFloat(first1);
        let first2 = message.text.split(' ')[2].split("度")[0];
        let second2 = message.text.split(' ')[2].split("度")[1].split("分")[0];
        let third2 = message.text.split(' ')[2].split("度")[1].split("分")[1].split("秒")[0];
        let lat = (parseFloat(third2)/60+parseFloat(second2))/60+parseFloat(first2);
        getmessandlocation(event,lat,lng);
      }else{
        getmessandlocation(event,message.text.split(' ')[1],message.text.split(' ')[2]);
      }
    }
    
    if (message.type == "location")
    {
      getnear(reToken,message.latitude,message.longitude);
    } 
    if (message.type == "file")
    {
      getmessagecontent(event,message.id);
    } 
    if (message.type == "image"){
      gopic(event);
    }
  }
  if (event.type === "postback"){
    const postback = event.postback;

    if (postback.data.split("&")[0]=== "getfirst"){
      getnear(reToken,postback.data.split("&")[1],postback.data.split("&")[2]);
    }
    
    if (postback.data.split("&")[0]=== "more"){
      showmore(event,postback.data.split("&")[1],postback.data.split("&")[2]);
    }
    
    if (postback.data.split("&")[0]=== "消防栓地圖"){
      showmap (event,postback.data.split("&")[1],postback.data.split("&")[2],postback.data.split("&")[3],postback.data.split("&")[4]);
    }
    
      
    if (postback.data === "說明")
    {
      info (event);
    }
    if(postback.data==="作者"){
      auther(event);
    }
    if(postback.data==='picstart'){
      changepic(event);
    }
  }
  

	//return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e){
          return HtmlService.createHtmlOutputFromFile('openstreetmap');

}

//系統顯示
let showtime =  (event) => {
  botEcho (event.replyToken, [
    {
      "type": "flex",
      "altText": "冰塊消防栓查詢系統",
      "contents": { "type": "carousel",
        "contents": [
          {
            "type": "bubble",
            "size": "nano",
            "header": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "使用說明",
                  "color": "#ffffff",
                  "align": "start",
                  "size": "md",
                  "gravity": "center"
                }
              ],
              "backgroundColor": "#27D190",
              "paddingTop": "19px",
              "paddingAll": "12px",
              "paddingBottom": "16px"
            },
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "height": "sm",
                      "action": {
                        "type": "postback",
                        "label": "說明",
                        "data": "說明"
                      },
                      "style": "secondary"
                    }
                  ],
                  "flex": 1
                }
              ]
            },
            "styles": { "footer": { "separator": false } }
          },
          {
            "type": "bubble",
            "size": "nano",
            "header": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "處理",
                  "color": "#ffffff",
                  "align": "start",
                  "size": "md",
                  "gravity": "center"
                }
              ],
              "backgroundColor": "#2593FA",
              "paddingTop": "19px",
              "paddingAll": "12px",
              "paddingBottom": "16px"
            },
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "height": "sm",
                      "action": {
                        "type": "uri",
                        "label": "消防栓資料維護",
                        "uri": "https://drive.google.com/file/d/1Wu41nX_rqNy3J9A5V0iZQYacCyEISdp1/view?usp=share_link"
                      },
                      "style": "secondary"
                    }
                  ],
                  "flex": 1
                },
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "height": "sm",
                      "action": {
                        "type": "postback",
                        "label": "傳圖",
                        "data": "picstart"
                      },
                      "style": "secondary"
                    }
                  ],
                  "flex": 1
                }
              ],
              "spacing": "md",
              "paddingAll": "12px"
            },
            "styles": { "footer": { "separator": false } }
          },
          {
            "type": "bubble",
            "size": "nano",
            "header": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "作者",
                  "color": "#ffffff",
                  "align": "start",
                  "size": "md",
                  "gravity": "center"
                }
              ],
              "backgroundColor": "#F77C59",
              "paddingTop": "19px",
              "paddingAll": "12px",
              "paddingBottom": "16px"
            },
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "height": "sm",
                      "action": {
                        "type": "uri",
                        "label": "抖內",
                        "uri": "https://p.ecpay.com.tw/8E29ABF"
                      },
                      "style": "secondary"
                    }
                  ],
                  "flex": 1
                },
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "height": "sm",
                      "action": {
                        "type": "postback",
                        "label": "作者",
                        "data": "作者"
                      },
                      "style": "secondary"
                    }
                  ],
                  "flex": 1
                }
              ],
              "spacing": "md",
              "paddingAll": "12px"
            },
            "styles": { "footer": { "separator": false } }
          }
        ] }
    }
  ]);
}


//說明
let info = (event) => {
  botEcho (event.replyToken, [{ type: "text",
    text: `
    直接傳   [定位]
      取得周圍消防栓位置

    直接傳   [圖片(檔案方式)]
      取得壓 EXIF 浮水印之照片
      若無 EXIF 則壓目前時間
      (限制JPEG、PNG)

    先於「維護」啟動圖片壓時間
    直接傳 [圖片]
      壓目前時間

    輸入[TWD 0000.00 0000.00]
      取得地圖座標

    輸入[經緯 23.0000 120.0000]
      取得地圖座標

    輸入[經緯 120度00分00秒 23度00分00秒]
      取得地圖座標

      
    或輸入   [冰塊查詢]
    ` }]);
}

//作者
let auther = (event) =>{
  botEcho (event.replyToken, [{ type: "text",
    text: `
   作者：
    安安我是冰塊
    可以私訊我 製作有趣的東西
    盡量小且便利（不清楚也可以問問看）
    若我喜歡可以免費ＸＤ 
    不過我會放抖內按鈕
    此程式希望協助到各位
    
    信箱:wl00161839@gmail.com
    ` }]);
}
 //修改浮水印權限
let changepic=async (event) =>{
  let testfile=await  DriveApp.getFileById(config.sendimg);
  var fileBlob =await testfile.getBlob();
  var alldata =await fileBlob.getDataAsString().split("\r\n");
  var having=false;
  var alldatacheck="";
  
  if(event.source.type==='user'){
    for(let i=0;i< alldata.length;i++){
      if(alldata[i]===event.source.userId){
        having=true;
        continue;
      }
      if(i==(alldata.length-1)){
        alldatacheck+=alldata[i];
      }else{
        alldatacheck+=alldata[i]+"\r\n";
      }
    }
    if(!having){
      alldatacheck+="\r\n"+event.source.userId;
      testfile.setContent(alldatacheck);
      botEcho(event.replyToken,[{ type: "text",text: `成功開啟` }]);
    }
  }else if(event.source.type==='group'){
    for(let i=0;i< alldata.length;i++){
      if(alldata[i]===event.source.groupId){
        having=true;
        continue;
      }
      if(i==(alldata.length-1)){
        alldatacheck+=alldata[i];
      }else{
        alldatacheck+=alldata[i]+"\r\n";
      }
    }
    if(!having){
      alldatacheck+="\r\n"+event.source.groupId;
      testfile.setContent(alldatacheck);
      botEcho(event.replyToken,[{ type: "text",text: `成功開啟` }]);
    }
  }
  if(having){
    testfile.setContent(alldatacheck);
    botEcho(event.replyToken,[{ type: "text",text: `成功關閉` }]);
  }
}

//確認權限
let gopic=async (event) =>{
  let testfile=await  DriveApp.getFileById(config.sendimg);
  var fileBlob =await testfile.getBlob();
  var alldata =await fileBlob.getDataAsString().split("\r\n");
  
  for(let i=0;i< alldata.length;i++){
    if(event.source.type==='user'){
      if(alldata[i]===event.source.userId){
         getmessagecontent(event,event.message.id);
      }
    }else if(event.source.type==='group'){
      if(alldata[i]===event.source.groupId){
         getmessagecontent(event,event.message.id);
      }
    }  
  }
}



//轉為map訊息
let showmap = (event,x,y,name,type)=>{
  botEcho(event.replyToken, [
      {
          type: 'location',
          title: type,
          address: name,
          latitude: x,
          longitude: y
      }
    ]
  );
}


//取得最近十筆
let getnear =async (replytoken,x,y)=>{

  let testfile=await  DriveApp.getFileById(config.fireport);
  var fileBlob =await testfile.getBlob();
  var alldata =await fileBlob.getDataAsString().split("\r\n");
  let longlist=[[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0]];


  for(let i in alldata){
    let datacontent= alldata[i].split(",");
    let getlatlng= twd97_to_latlng(datacontent[2],datacontent[3]);
    let getlinelong= getline(x,y,getlatlng.lat,getlatlng.lng);
    if(longlist[0][0]==0){
      longlist[0][0]=getlinelong;
      longlist[0][1]=getlatlng.lat;
      longlist[0][2]=getlatlng.lng;
      longlist[0][3]=datacontent[0]+datacontent[1];
      longlist[0][4]=porttype[datacontent[4]];
      longlist[0][5]=datacontent[4];
      longlist.sort();
    }
    else if(longlist[9][0]>getlinelong ){
      longlist[9][0]=getlinelong;
      longlist[9][1]=getlatlng.lat;
      longlist[9][2]=getlatlng.lng;
      longlist[9][3]=datacontent[0]+datacontent[1];
      longlist[9][4]=porttype[datacontent[4]];
      longlist[9][5]=datacontent[4];
      longlist.sort();
    }
  }
  let map=[];
  map.push({a:Math.round(x*100000)/100000,b:Math.round(y*100000)/100000,c:6});
  for(let i=0;i<10;i++){
      map.push({a:Math.round(longlist[i][1]*100000)/100000,b:Math.round(longlist[i][2]*100000)/100000,c:longlist[i][5]});
  }
  let show="map="+encodeURI(JSON.stringify(map));
  let nearport=longlist;
  botEcho(replytoken, [{
        "type": "flex",
        "altText": "消防栓",
        "contents": { "type": "carousel",
          "contents": [
            {
              "type": "bubble",
              "size": "nano",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "顯示更多",
                    "color": "#ffffff",
                    "align": "start",
                    "size": "md",
                    "gravity": "center"
                  }
                ],
                "backgroundColor": "#27D190",
                "paddingTop": "19px",
                "paddingAll": "12px",
                "paddingBottom": "16px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "postback",
                          "label": "更多",
                          "data": `more&${x}&${y}`
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  },{
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "uri",
                          "label": "標記地圖",
                          "uri": "https://script.google.com/macros/s/AKfycbyywRZqSmvHGnsdbFADVxwwq8PH5z4weqvZm86SzI89dy43QKhO2R0Xeb77DepNADCUKw/exec?"+show
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  }  
                ],
                "spacing": "md",
                "paddingAll": "12px"
              },
              "styles": { "footer": { "separator": false } }
            },
            {
              "type": "bubble",
              "size": "nano",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "No-1",
                    "color": "#ffffff",
                    "align": "start",
                    "size": "md",
                    "gravity": "center"
                  }
                ],
                "backgroundColor": "#27D190",
                "paddingTop": "19px",
                "paddingAll": "1px",
                "paddingBottom": "16px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": `${nearport[0][4]}`
                  },

                  {
                    "type": "text",
                    "text": `${Math.round(((nearport[0][0])*111)*1000)} 公尺`

                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "postback",
                          "label": "顯示地圖",
                          "data": `消防栓地圖&${nearport[0][1]}&${nearport[0][2]}&No-1&${nearport[0][4]}`
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  }
                  
                ],
                "spacing": "md",
                "paddingAll": "12px"
              },
              "styles": { "footer": { "separator": false } }
            },
            {
              "type": "bubble",
              "size": "nano",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "No-2",
                    "color": "#ffffff",
                    "align": "start",
                    "size": "md",
                    "gravity": "center"
                  }
                ],
                "backgroundColor": "#2593FA",
                "paddingTop": "19px",
                "paddingAll": "12px",
                "paddingBottom": "16px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": `${nearport[1][4]}`
                  },

                  {
                    "type": "text",
                    "text": `${Math.round(((nearport[1][0])*111)*1000)} 公尺`
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "postback",
                          "label": "顯示地圖",
                          "data": `消防栓地圖&${nearport[1][1]}&${nearport[1][2]}&No-2&${nearport[1][4]}`
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  }
                ],
                "spacing": "md",
                "paddingAll": "12px"
              },
              "styles": { "footer": { "separator": false } }
            },
            {
              "type": "bubble",
              "size": "nano",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  
                  {
                    "type": "text",
                    "text": "No-3",
                    "color": "#ffffff",
                    "align": "start",
                    "size": "md",
                    "gravity": "center"
                  }
                ],
                "backgroundColor": "#F77C59",
                "paddingTop": "19px",
                "paddingAll": "12px",
                "paddingBottom": "16px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": `${nearport[2][4]}`
                  },

                  {
                    "type": "text",
                    "text": `${Math.round(((nearport[2][0])*111)*1000)} 公尺`
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "postback",
                          "label": "顯示地圖",
                          "data": `消防栓地圖&${nearport[2][1]}&${nearport[2][2]}&No-3&${nearport[2][4]}`
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  }
                ],
                "spacing": "md",
                "paddingAll": "12px"
              },
              "styles": { "footer": { "separator": false } }
            },
            {
              "type": "bubble",
              "size": "nano",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "No-4",
                    "color": "#ffffff",
                    "align": "start",
                    "size": "md",
                    "gravity": "center"
                  }
                ],
                "backgroundColor": "#27D190",
                "paddingTop": "19px",
                "paddingAll": "12px",
                "paddingBottom": "16px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": `${nearport[3][4]}`
                  },
                  {
                    "type": "text",
                    "text": `${Math.round(((nearport[3][0])*111)*1000)} 公尺`
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "postback",
                          "label": "顯示地圖",
                          "data": `消防栓地圖&${nearport[3][1]}&${nearport[3][2]}&No-4&${nearport[3][4]}`
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  }
                ],
                "spacing": "md",
                "paddingAll": "12px"
              },
              "styles": { "footer": { "separator": false } }
            },
            {
              "type": "bubble",
              "size": "nano",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "No-5",
                    "color": "#ffffff",
                    "align": "start",
                    "size": "md",
                    "gravity": "center"
                  }
                ],
                "backgroundColor": "#2593FA",
                "paddingTop": "19px",
                "paddingAll": "12px",
                "paddingBottom": "16px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": `${nearport[4][4]}`
                  },

                  {
                    "type": "text",
                    "text": `${Math.round(((nearport[4][0])*111)*1000)} 公尺`
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "postback",
                          "label": "顯示地圖",
                          "data": `消防栓地圖&${nearport[4][1]}&${nearport[4][2]}&No-5&${nearport[4][4]}`
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  }
                ],
                "spacing": "md",
                "paddingAll": "12px"
              },
              "styles": { "footer": { "separator": false } }
            },
            {
              "type": "bubble",
              "size": "nano",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "No-6",
                    "color": "#ffffff",
                    "align": "start",
                    "size": "md",
                    "gravity": "center"
                  }
                ],
                "backgroundColor": "#F77C59",
                "paddingTop": "19px",
                "paddingAll": "12px",
                "paddingBottom": "16px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": `${nearport[5][4]}`
                  },
                
                  {
                    "type": "text",
                    "text": `${Math.round(((nearport[5][0])*111)*1000)} 公尺`
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "postback",
                          "label": "顯示地圖",
                          "data": `消防栓地圖&${nearport[5][1]}&${nearport[5][2]}&No-6&${nearport[5][4]}`
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  }
                ],
                "spacing": "md",
                "paddingAll": "12px"
              },
              "styles": { "footer": { "separator": false } }
            },
            {
              "type": "bubble",
              "size": "nano",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "No-7",
                    "color": "#ffffff",
                    "align": "start",
                    "size": "md",
                    "gravity": "center"
                  }
                ],
                "backgroundColor": "#27D190",
                "paddingTop": "19px",
                "paddingAll": "12px",
                "paddingBottom": "16px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": `${nearport[6][4]}`
                  },
              
                  {
                    "type": "text",
                    "text": `${Math.round(((nearport[6][0])*111)*1000)} 公尺`
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "postback",
                          "label": "顯示地圖",
                          "data": `消防栓地圖&${nearport[6][1]}&${nearport[6][2]}&No-7&${nearport[6][4]}`
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  }
                ],
                "spacing": "md",
                "paddingAll": "12px"
              },
              "styles": { "footer": { "separator": false } }
            },
            {
              "type": "bubble",
              "size": "nano",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "No-8",
                    "color": "#ffffff",
                    "align": "start",
                    "size": "md",
                    "gravity": "center"
                  }
                ],
                "backgroundColor": "#2593FA",
                "paddingTop": "19px",
                "paddingAll": "12px",
                "paddingBottom": "16px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": `${nearport[7][4]}`
                  },
              
                  {
                    "type": "text",
                    "text": `${Math.round(((nearport[7][0])*111)*1000)} 公尺`
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "postback",
                          "label": "顯示地圖",
                          "data": `消防栓地圖&${nearport[7][1]}&${nearport[7][2]}&No-8&${nearport[7][4]}`
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  }
                ],
                "spacing": "md",
                "paddingAll": "12px"
              },
              "styles": { "footer": { "separator": false } }
            },
            {
              "type": "bubble",
              "size": "nano",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "No-9",
                    "color": "#ffffff",
                    "align": "start",
                    "size": "md",
                    "gravity": "center"
                  }
                ],
                "backgroundColor": "#F77C59",
                "paddingTop": "19px",
                "paddingAll": "12px",
                "paddingBottom": "16px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": `${nearport[8][4]}`
                  },
                
                  {
                    "type": "text",
                    "text": `${Math.round(((nearport[8][0])*111)*1000)} 公尺`
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "postback",
                          "label": "顯示地圖",
                          "data": `消防栓地圖&${nearport[8][1]}&${nearport[8][2]}&No-9&${nearport[8][4]}`
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  }
                ],
                "spacing": "md",
                "paddingAll": "12px"
              },
              "styles": { "footer": { "separator": false } }
            },
            {
              "type": "bubble",
              "size": "nano",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "No-10",
                    "color": "#ffffff",
                    "align": "start",
                    "size": "md",
                    "gravity": "center"
                  }
                ],
                "backgroundColor": "#27D190",
                "paddingTop": "19px",
                "paddingAll": "12px",
                "paddingBottom": "16px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": `${nearport[9][4]}`
                  },
              
                  {
                    "type": "text",
                    "text": `${Math.round(((nearport[9][0])*111)*1000)} 公尺`
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "postback",
                          "label": "顯示地圖",
                          "data": `消防栓地圖&${nearport[9][1]}&${nearport[9][2]}&No-10&${nearport[9][4]}`
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  }
                ],
                "spacing": "md",
                "paddingAll": "12px"
              },
              "styles": { "footer": { "separator": false } }
            }
          ] }
      }
    ]
  );

}

//再取得更多
let showmore = async (event,x,y)=>{

  let testfile= DriveApp.getFileById(config.fireport);
  var fileBlob = testfile.getBlob();
  var alldata = fileBlob.getDataAsString().split("\r\n");
  let longlist=[[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0],[0,0,0,"","",0]];

  for(let i in alldata){
    let datacontent=alldata[i].split(",");
    let getlatlng=twd97_to_latlng(datacontent[2],datacontent[3]);
    let getlinelong=getline(x,y,getlatlng.lat,getlatlng.lng);
    if(longlist[0][0]==0){
      longlist[0][0]=getlinelong;
      longlist[0][1]=getlatlng.lat;
      longlist[0][2]=getlatlng.lng;
      longlist[0][3]=datacontent[0]+datacontent[1];
      longlist[0][4]=porttype[datacontent[4]];
      longlist[0][5]=datacontent[4];
      longlist.sort();
    }
    else if(longlist[19][0]>getlinelong ){
      longlist[19][0]=getlinelong;
      longlist[19][1]=getlatlng.lat;
      longlist[19][2]=getlatlng.lng;
      longlist[19][3]=datacontent[0]+datacontent[1];
      longlist[19][4]=porttype[datacontent[4]];
      longlist[19][5]=datacontent[4];

      longlist.sort();
    }
  }
  let map=[];
    map.push({a:Math.round(x*100000)/100000,b:Math.round(y*100000)/100000,c:6});
  for(let i=10;i<20;i++){
      map.push({a:Math.round(longlist[i][1]*100000)/100000,b:Math.round(longlist[i][2]*100000)/100000,c:longlist[i][5]});
  }
  let show="map="+encodeURI(JSON.stringify(map));
  let moreport= longlist;

  botEcho(event.replyToken, [{
        "type": "flex",
        "altText": "消防栓",
        "contents": { "type": "carousel",
          "contents": [
            {
              "type": "bubble",
              "size": "nano",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "顯示更多",
                    "color": "#ffffff",
                    "align": "start",
                    "size": "md",
                    "gravity": "center"
                  }
                ],
                "backgroundColor": "#27D190",
                "paddingTop": "19px",
                "paddingAll": "12px",
                "paddingBottom": "16px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "uri",
                          "label": "標記地圖",
                          "uri": "https://script.google.com/macros/s/AKfycbyywRZqSmvHGnsdbFADVxwwq8PH5z4weqvZm86SzI89dy43QKhO2R0Xeb77DepNADCUKw/exec?"+show
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  }  
                ],
                "spacing": "md",
                "paddingAll": "12px"
              },
              "styles": { "footer": { "separator": false } }
            },
            {
              "type": "bubble",
              "size": "nano",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "No-11",
                    "color": "#ffffff",
                    "align": "start",
                    "size": "md",
                    "gravity": "center"
                  }
                ],
                "backgroundColor": "#27D190",
                "paddingTop": "19px",
                "paddingAll": "12px",
                "paddingBottom": "16px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": `${moreport[10][4]}`
                  },
                 
                  {
                    "type": "text",
                    "text": `${Math.round(((moreport[10][0])*111)*1000)} 公尺`
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "postback",
                          "label": "顯示地圖",
                          "data": `消防栓地圖&${moreport[10][1]}&${moreport[10][2]}&No-11&${moreport[10][4]}`
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  }
                ],
                "spacing": "md",
                "paddingAll": "12px"
              },
              "styles": { "footer": { "separator": false } }
            },
            {
              "type": "bubble",
              "size": "nano",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "No-12",
                    "color": "#ffffff",
                    "align": "start",
                    "size": "md",
                    "gravity": "center"
                  }
                ],
                "backgroundColor": "#2593FA",
                "paddingTop": "19px",
                "paddingAll": "12px",
                "paddingBottom": "16px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": `${moreport[11][4]}`
                  },
                
                  {
                    "type": "text",
                    "text": `${Math.round(((moreport[11][0])*111)*1000)} 公尺`
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "postback",
                          "label": "顯示地圖",
                          "data": `消防栓地圖&${moreport[11][1]}&${moreport[11][2]}&No-12&${moreport[11][4]}`
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  }
                ],
                "spacing": "md",
                "paddingAll": "12px"
              },
              "styles": { "footer": { "separator": false } }
            },
            {
              "type": "bubble",
              "size": "nano",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  
                  {
                    "type": "text",
                    "text": "No-13",
                    "color": "#ffffff",
                    "align": "start",
                    "size": "md",
                    "gravity": "center"
                  }
                ],
                "backgroundColor": "#F77C59",
                "paddingTop": "19px",
                "paddingAll": "12px",
                "paddingBottom": "16px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": `${moreport[12][4]}`
                  },
                 
                  {
                    "type": "text",
                    "text": `${Math.round(((moreport[12][0])*111)*1000)} 公尺`
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "postback",
                          "label": "顯示地圖",
                          "data": `消防栓地圖&${moreport[12][1]}&${moreport[12][2]}&No-13&${moreport[12][4]}`
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  }
                ],
                "spacing": "md",
                "paddingAll": "12px"
              },
              "styles": { "footer": { "separator": false } }
            },
            {
              "type": "bubble",
              "size": "nano",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "No-14",
                    "color": "#ffffff",
                    "align": "start",
                    "size": "md",
                    "gravity": "center"
                  }
                ],
                "backgroundColor": "#27D190",
                "paddingTop": "19px",
                "paddingAll": "12px",
                "paddingBottom": "16px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": `${moreport[13][4]}`
                  },
                 
                  {
                    "type": "text",
                    "text": `${Math.round(((moreport[13][0])*111)*1000)} 公尺`
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "postback",
                          "label": "顯示地圖",
                          "data": `消防栓地圖&${moreport[13][1]}&${moreport[13][2]}&No-14&${moreport[13][4]}`
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  }
                ],
                "spacing": "md",
                "paddingAll": "12px"
              },
              "styles": { "footer": { "separator": false } }
            },
            {
              "type": "bubble",
              "size": "nano",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "No-15",
                    "color": "#ffffff",
                    "align": "start",
                    "size": "md",
                    "gravity": "center"
                  }
                ],
                "backgroundColor": "#2593FA",
                "paddingTop": "19px",
                "paddingAll": "12px",
                "paddingBottom": "16px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": `${moreport[14][4]}`
                  },
               
                  {
                    "type": "text",
                    "text": `${Math.round(((moreport[14][0])*111)*1000)} 公尺`
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "postback",
                          "label": "顯示地圖",
                          "data": `消防栓地圖&${moreport[14][1]}&${moreport[14][2]}&No-15&${moreport[14][4]}`
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  }
                ],
                "spacing": "md",
                "paddingAll": "12px"
              },
              "styles": { "footer": { "separator": false } }
            },
            {
              "type": "bubble",
              "size": "nano",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "No-16",
                    "color": "#ffffff",
                    "align": "start",
                    "size": "md",
                    "gravity": "center"
                  }
                ],
                "backgroundColor": "#F77C59",
                "paddingTop": "19px",
                "paddingAll": "12px",
                "paddingBottom": "16px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": `${moreport[15][4]}`
                  },
             
                  {
                    "type": "text",
                    "text": `${Math.round(((moreport[15][0])*111)*1000)} 公尺`
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "postback",
                          "label": "顯示地圖",
                          "data": `消防栓地圖&${moreport[15][1]}&${moreport[15][2]}&No-16&${moreport[15][4]}`
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  }
                ],
                "spacing": "md",
                "paddingAll": "12px"
              },
              "styles": { "footer": { "separator": false } }
            },{
              "type": "bubble",
              "size": "nano",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "No-17",
                    "color": "#ffffff",
                    "align": "start",
                    "size": "md",
                    "gravity": "center"
                  }
                ],
                "backgroundColor": "#27D190",
                "paddingTop": "19px",
                "paddingAll": "12px",
                "paddingBottom": "16px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": `${moreport[16][4]}`
                  },
                
                  {
                    "type": "text",
                    "text": `${Math.round(((moreport[16][0])*111)*1000)} 公尺`
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "postback",
                          "label": "顯示地圖",
                          "data": `消防栓地圖&${moreport[16][1]}&${moreport[16][2]}&No-17&${moreport[16][4]}`
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  }
                ],
                "spacing": "md",
                "paddingAll": "12px"
              },
              "styles": { "footer": { "separator": false } }
            },
            {
              "type": "bubble",
              "size": "nano",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "No-18",
                    "color": "#ffffff",
                    "align": "start",
                    "size": "md",
                    "gravity": "center"
                  }
                ],
                "backgroundColor": "#2593FA",
                "paddingTop": "19px",
                "paddingAll": "12px",
                "paddingBottom": "16px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": `${moreport[17][4]}`
                  },
                 
                  {
                    "type": "text",
                    "text": `${Math.round(((moreport[17][0])*111)*1000)} 公尺`
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "postback",
                          "label": "顯示地圖",
                          "data": `消防栓地圖&${moreport[17][1]}&${moreport[17][2]}&No-18&${moreport[17][4]}`
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  }
                ],
                "spacing": "md",
                "paddingAll": "12px"
              },
              "styles": { "footer": { "separator": false } }
            },
            {
              "type": "bubble",
              "size": "nano",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "No-19",
                    "color": "#ffffff",
                    "align": "start",
                    "size": "md",
                    "gravity": "center"
                  }
                ],
                "backgroundColor": "#F77C59",
                "paddingTop": "19px",
                "paddingAll": "12px",
                "paddingBottom": "16px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": `${moreport[18][4]}`
                  },
                
                  {
                    "type": "text",
                    "text": `${Math.round(((moreport[18][0])*111)*1000)} 公尺`
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "postback",
                          "label": "顯示地圖",
                          "data": `消防栓地圖&${moreport[18][1]}&${moreport[18][2]}&No-19&${moreport[18][4]}`
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  }
                ],
                "spacing": "md",
                "paddingAll": "12px"
              },
              "styles": { "footer": { "separator": false } }
            }

          ] }
      }
      ]);
}



//取得兩點直線距離
function  getline(x,y,$x,$y){
  return (((x-$x)**2)+((y-$y)**2))**(1/2);
}

//將台灣定位方式轉為經緯度
function twd97_to_latlng($x, $y) {
  var pow = Math.pow, M_PI = Math.PI;
  var sin = Math.sin, cos = Math.cos, tan = Math.tan;
  var $a = 6378137.0, $b = 6356752.314245;
  var $lng0 = 121 * M_PI / 180, $k0 = 0.9999, $dx = 250000, $dy = 0;
  var $e = pow((1 - pow($b, 2) / pow($a, 2)), 0.5);

  $x -= $dx;
  $y -= $dy;

  var $M = $y / $k0;

  var $mu = $M / ($a * (1.0 - pow($e, 2) / 4.0 - 3 * pow($e, 4) / 64.0 - 5 * pow($e, 6) / 256.0));
  var $e1 = (1.0 - pow((1.0 - pow($e, 2)), 0.5)) / (1.0 + pow((1.0 - pow($e, 2)), 0.5));

  var $J1 = (3 * $e1 / 2 - 27 * pow($e1, 3) / 32.0);
  var $J2 = (21 * pow($e1, 2) / 16 - 55 * pow($e1, 4) / 32.0);
  var $J3 = (151 * pow($e1, 3) / 96.0);
  var $J4 = (1097 * pow($e1, 4) / 512.0);

  var $fp = $mu + $J1 * sin(2 * $mu) + $J2 * sin(4 * $mu) + $J3 * sin(6 * $mu) + $J4 * sin(8 * $mu);

  var $e2 = pow(($e * $a / $b), 2);
  var $C1 = pow($e2 * cos($fp), 2);
  var $T1 = pow(tan($fp), 2);
  var $R1 = $a * (1 - pow($e, 2)) / pow((1 - pow($e, 2) * pow(sin($fp), 2)), (3.0 / 2.0));
  var $N1 = $a / pow((1 - pow($e, 2) * pow(sin($fp), 2)), 0.5);

  var $D = $x / ($N1 * $k0);

  var $Q1 = $N1 * tan($fp) / $R1;
  var $Q2 = (pow($D, 2) / 2.0);
  var $Q3 = (5 + 3 * $T1 + 10 * $C1 - 4 * pow($C1, 2) - 9 * $e2) * pow($D, 4) / 24.0;
  var $Q4 = (61 + 90 * $T1 + 298 * $C1 + 45 * pow($T1, 2) - 3 * pow($C1, 2) - 252 * $e2) * pow($D, 6) / 720.0;
  var $lat = $fp - $Q1 * ($Q2 - $Q3 + $Q4);

  var $Q5 = $D;
  var $Q6 = (1 + 2 * $T1 + $C1) * pow($D, 3) / 6;
  var $Q7 = (5 - 2 * $C1 + 28 * $T1 - 3 * pow($C1, 2) + 8 * $e2 + 24 * pow($T1, 2)) * pow($D, 5) / 120.0;
  var $lng = $lng0 + ($Q5 - $Q6 + $Q7) / cos($fp);

  $lat = ($lat * 180) / M_PI;
  $lng = ($lng * 180) / M_PI;

  return {
    lat: $lat,
    lng: $lng
  };
}

//將經緯度轉成tile
async function latlng_to_tile(x,y){

  let lon = parseFloat(y);
  let  lat = parseFloat(x);
  let  zoom = 17;
  let  n = 2 ** zoom;

  let  xtile = n * ((lon + 180) / 360);
  let  ytile = n * (1 - (Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI)) / 2;

  return {
    mapx: Math.floor(xtile),
    mapy: Math.floor(ytile),
    imgx: Math.floor(xtile%1*256),
    imgy: Math.floor(ytile%1*256),
  };

}

//取得地圖照片
async function getimgfromopenstreet(event,x,y){
  let getimg= await latlng_to_tile(x,y)
  var res = await UrlFetchApp.fetch("https://a.tile.openstreetmap.org/17/"+getimg.mapx+"/"+getimg.mapy+".png");
  const imageBlob = await res.getBlob();
  let folder=DriveApp.createFolder("icecubesTemp");
  let filename = {
    title: "imgaddtext",
    "parents": [{'id':folder.getId()}],
  };
  file = Drive.Files.insert(filename, imageBlob);

  const starttext = {
    left: (getimg.imgx-30)<1?1:(getimg.imgx-30),
    top: (getimg.imgy-30)<1?1:(getimg.imgy-30),
    height:20,
    width:20
  };
  const object = {
    title: filename.title, // Title of created Slides.
    width: { unit: "pixel", size: parseInt("256") },
    height: { unit: "pixel", size:  parseInt("256")},
  };
   const presentationId = DocsServiceApp.createNewSlidesWithPageSize(object);
  const s = SlidesApp.openById(presentationId);
  const slide = s.getSlides()[0];
  slide.insertImage(imageBlob);
 
  //正式
  slide
    .insertShape(SlidesApp.ShapeType.STAR_12, starttext.left, starttext.top, starttext.width,  starttext.height);
   
  s.saveAndClose();
  const obj = Slides.Presentations.Pages.getThumbnail(
    presentationId,
    slide.getObjectId(),
    {
      "thumbnailProperties.thumbnailSize": "LARGE",
      "thumbnailProperties.mimeType": "PNG",
    }
  );
  const imgurl = obj.contentUrl.replace(/=s\d+/, "=s" + 256);
  
  botEcho(event.replyToken,[{
        "type": "image",
        "originalContentUrl": imgurl,
        "previewImageUrl": imgurl,
        "animated": true
      }]);
  var file2 = DriveApp.getFileById(presentationId);
  file2.moveTo(folder);
  Drive.Files.remove(file.getId());
  Drive.Files.remove(file2.getId());
  Drive.Files.remove(folder.getId());

}

//取得照片並浮水印回傳
async function  getmessagecontent(event,messageId){
  var url = `https://api-data.line.me/v2/bot/message/${messageId}/content`;
	var opt = {
		'headers': {
			'Authorization': 'Bearer ' + config.channelAccessToken,
		},
		'method': 'get'
	};
	var res = await UrlFetchApp.fetch(url, opt);
  const imageBlob = await res.getBlob();
  let folder=DriveApp.createFolder("icecubesTemp");
  let filename = {
    title: "imgaddtext",
    "parents": [{'id':folder.getId()}],
  };

  file = Drive.Files.insert(filename, imageBlob);
  if(typeof file.mimeType ==='undefined' || (!file.mimeType.toLocaleLowerCase().includes("image/jpeg") && !file.mimeType.toLocaleLowerCase().includes("image/png"))){
    Drive.Files.remove(file.getId());
    return;
  }
  let location_longitude="";
  let location_latitude="";
  let photo_date="";
  if(typeof file.imageMediaMetadata.location==='undefined'){
    let nowtime=new Date();
    photo_date=(nowtime.getFullYear()+"-"+
      ((parseInt(nowtime.getMonth())+1)<10?"0"+(parseInt(nowtime.getMonth())+1):(parseInt(nowtime.getMonth())+1))+"-"+
      (parseInt(nowtime.getDate())<10?"0"+nowtime.getDate():nowtime.getDate())+" "+
      (parseInt(nowtime.getHours())<10?"0"+nowtime.getHours():nowtime.getHours())+":"+
      (parseInt(nowtime.getMinutes())<10?"0"+nowtime.getMinutes():nowtime.getMinutes())+":"+
      (parseInt(nowtime.getSeconds())<10?"0"+nowtime.getSeconds():nowtime.getSeconds()));
  }else{
    location_longitude="+"+(file.imageMediaMetadata.location.longitude+"").substring(0,9);
    location_latitude="+"+(file.imageMediaMetadata.location.latitude+"").substring(0,8);
    photo_date=(file.imageMediaMetadata.date+"").substring(0,10).replace(":","-").replace(":","-")+(file.imageMediaMetadata.date+"").substring(10);
  }
  
  //設定文字位置大小
  const locationtext = {
    text: location_longitude+" "+location_latitude,
    left: 10,
    top: 200,
    height: 60,
    width:1000,
    fontSize: 30,
  };

  const timetext = {
    text: ""+photo_date,
    left: 10,
    top: 140,
    height: 60,
    width:1000,
    fontSize: 30,
  };

  const object = {
    title: filename.title, // Title of created Slides.
    width: { unit: "pixel", size: parseInt(file.imageMediaMetadata.width) },
    height: { unit: "pixel", size:  parseInt(file.imageMediaMetadata.height)},
  };

  const presentationId = DocsServiceApp.createNewSlidesWithPageSize(object);
  const s = SlidesApp.openById(presentationId);
  const slide = s.getSlides()[0];
  slide.insertImage(imageBlob);
  //加陰影
   slide
    .insertTextBox(timetext.text, timetext.left+2, timetext.top+2, timetext.width,  timetext.height)
    .getText()
    .getTextStyle()
    .setForegroundColor(150,150,150)
    .setFontSize(timetext.fontSize);
  slide
    .insertTextBox(locationtext.text, locationtext.left+2, locationtext.top+2, locationtext.width,  locationtext.height)
    .getText()
    .getTextStyle()
    .setForegroundColor(150,150,150)
    .setFontSize(locationtext.fontSize);
  //正式
 
  slide
    .insertTextBox(timetext.text, timetext.left, timetext.top, timetext.width,  timetext.height)
    .getText()
    .getTextStyle()
    .setForegroundColor(255,255,255)
    .setFontSize(timetext.fontSize);
  slide
    .insertTextBox(locationtext.text, locationtext.left, locationtext.top, locationtext.width,  locationtext.height)
    .getText()
    .getTextStyle()
    .setForegroundColor(255,255,255)
    .setFontSize(locationtext.fontSize);
   
  s.saveAndClose();

  const obj = Slides.Presentations.Pages.getThumbnail(
    presentationId,
    slide.getObjectId(),
    {
      "thumbnailProperties.thumbnailSize": "LARGE",
      "thumbnailProperties.mimeType": "PNG",
    }
  );

  const imgurl = obj.contentUrl.replace(/=s\d+/, "=s" + parseInt(file.imageMediaMetadata.width));

  botEcho(event.replyToken,[{
        "type": "image",
        "originalContentUrl": imgurl,
        "previewImageUrl": imgurl,
        "animated": true
      }]);
  var file2 = DriveApp.getFileById(presentationId);
  file2.moveTo(folder);
  Drive.Files.remove(file.getId());
  Drive.Files.remove(file2.getId());
  Drive.Files.remove(folder.getId());
}

function getmessandlocation(event,lat,lng){
  botEcho(event.replyToken, [{
        "type": "flex",
        "altText": "選擇",
        "contents": { "type": "carousel",
          "contents": [
            {
              "type": "bubble",
              "size": "nano",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "取得消防栓",
                    "color": "#ffffff",
                    "align": "start",
                    "size": "md",
                    "gravity": "center"
                  }
                ],
                "backgroundColor": "#27D190",
                "paddingTop": "19px",
                "paddingAll": "12px",
                "paddingBottom": "16px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "postback",
                          "label": "取得消防栓",
                          "data": `getfirst&${lat}&${lng}`
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  }
                ],
                "spacing": "md",
                "paddingAll": "12px"
              },
              "styles": { "footer": { "separator": false } }
            },{
              "type": "bubble",
              "size": "nano",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "地圖",
                    "color": "#ffffff",
                    "align": "start",
                    "size": "md",
                    "gravity": "center"
                  }
                ],
                "backgroundColor": "#2593FA",
                "paddingTop": "19px",
                "paddingAll": "12px",
                "paddingBottom": "16px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "button",
                        "height": "sm",
                        "action": {
                          "type": "postback",
                          "label": "顯示地圖",
                          "data": `消防栓地圖&${lat}&${lng}&標記&經緯度：${lat.toString().substring(0,8)} , ${lng.toString().substring(0,9)}`
                        },
                        "style": "secondary"
                      }
                    ],
                    "flex": 1
                  }
                ],
                "spacing": "md",
                "paddingAll": "12px"
              },
              "styles": { "footer": { "separator": false } }
            }
            
          ] }
        }]);

}


