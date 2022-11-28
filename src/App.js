import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import React, { useState } from 'react'
import { flatMapDeep, flattenDeep, includes } from "lodash";
import { saveAs } from "file-saver";
function App() {
  // Load the module
  var to_json = require('xmljson').to_json;
  const [XML, setXML] = useState([]);
  const [xls, setxls] = useState([]);
  let myJson = [];
  let myxlsJson = [];
  let csvArray = [];

  function myExport(data,dataxls){
    let myxlsJsonTemp = dataxls.split("\n");
    for (let i = 0; i < myxlsJsonTemp.length; i++) {
      myxlsJson.push(myxlsJsonTemp[i].split(","));
    }
    console.log(myxlsJson);
    to_json(data, function (error, data2) {
      myJson = data2['map']['npc'];
      console.log(Object.keys(myJson).length);
      for (let i = 0; i < Object.keys(myJson).length; i++) {
        for (let j = 0; j < myxlsJson.length; j++) {
          if (myJson[i]['$']['id'] === myxlsJson[j][0]) {
            csvArray.push(myJson[i]['$']['name'] + "," + myJson[i]['$']['id'] + "," + myxlsJson[j][2]);
          }
        }
        console.log(myJson[i]);
      }
      console.log(csvArray);
    });
    let myCSV = 
        "Name,NPC ID,NPC Level\n"+
          flatMapDeep (csvArray.map((item) => {
            const line = `${item}`;
            return [line];
            }) 
            ).join("\n");
            let blob = new Blob(["\ufeff"+myCSV], { type: "text/plain;charset=utf-8" });
            saveAs(blob, `export.csv`);
   }
   

  function handleXML(){
    class haveTwoData {
      myExportWhenDataExist() {
        if (this.data1 && this.data2) {
          myExport(this.data1,this.data2);
        }
      }
      setData1(data1) {
        this.data1 = data1;
        this.myExportWhenDataExist();
      }
      setData2(data2) {
        this.data2 = data2;
        this.myExportWhenDataExist();
      }
  }

    haveTwoData = new haveTwoData();
    if (XML.length === 0 || xls.length === 0) {
      alert("No files selected");
      return;
    }
    else {
    const file = XML[0];
        let reader = new FileReader();
        reader.onload = function (e) {
        const data = e.target.result;
        haveTwoData.setData1(data);
    };
    reader.readAsText(file,"GB2312");

    const filexls = xls[0];
        let readerxls = new FileReader();
        readerxls.onload = function (e) {
        const dataxls = e.target.result;
        haveTwoData.setData2(dataxls);
    };
    readerxls.readAsText(filexls,"GB2312");
    }
  }

  
  return (
    <div className="App" class="text-center">
      <h1 class="alert alert-primary" role="alert">怀旧征途地图小怪匹配工具</h1>
      请选择XML文件: <input class="btn btn-warning" id="fileInput" type="file" multiple onChange={(e) => setXML(e.target.files)}/>
      <br/><br/>
      请选择xls文件: <input class="btn btn-warning" id="fileInput" type="file" multiple onChange={(e) => setxls(e.target.files)}/>
      <br/><br/>
      <button class="btn btn-success" type="button" onClick={handleXML}>导出Excel</button>
    </div>
  )
}

export default App