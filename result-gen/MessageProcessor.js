const axios = require('axios');
const formatemonthyear = (inputDate) =>{
  const [month, year] = inputDate.split('-');
  const dateObject = new Date(`${month}-01-${year}`);
  const formattedDate = dateObject.toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  // Manually add the hyphen between the formatted month and year
  const convertedDate = `${formattedDate.substr(0, 3)}-${formattedDate.substr(4)}`;
  
  return convertedDate.toUpperCase();
}
class MessageProcessor {
    constructor(consumer) {
      this.consumer = consumer;
    }
  
    processMessage= async (topic, partition, message)=> {
      // console.log([`Received message on topic ${topic}, partition ${partition}`, message]);
      try {
        // console.log(message.data)
        var reqobj = message.data
        const {progress_id, endpoint, campus, year_id, year_name, suc, attendance, examresult, layout_html_file, section_id} = reqobj
        // Use await to wait for the response before processing the next message
        var insert_result = await axios.post(endpoint, reqobj);
        // console.log(insert_result.data);
        insert_result.data.progress_id = progress_id
        var curdate = new Date()
        curdate =  ('00' + curdate.getDate()).slice(-2)+ '-' +
                ('00' + (curdate.getMonth()+1)).slice(-2) + '-' +
                curdate.getFullYear()
        insert_result.data.file_path = "/"+year_name+"/"+campus+"/"+suc
        insert_result.data.campus_name = campus
        insert_result.data.file_name = suc+"-"+curdate
        insert_result.data.year_name = year_name
        // console.log(insert_result.data)
        // console.log(process.env.BASE_API+"examresultstateboard/create");
        var finalres = await axios.post(process.env.BASE_API+"examresultstateboard/create", insert_result.data);
        // console.log(finalres.data)
        // console.log(finalres.data[0].student_info[0].year_name)
        var pdfgenobj = {
          "url": process.env.REPORT_LAYOUT+layout_html_file+"?id="+finalres.data[0]._id,
          "path": "/"+year_name+"/"+campus+"/"+suc,
          "format": "A4",
          "filename": suc+"-"+curdate,
          "pageNumbers": false,
          "headerLeft" :"",
          "headerRight" :"",
          "margin":{
                      "top": 0,
                      "right": 0,
                      "bottom": 0,
                      "left": 0
                  }
        }
        // console.log(pdfgenobj)
        await axios.post(process.env.PDF_API+'url2pdf/', pdfgenobj)
      } catch (error) {
        console.error("Error processing message:", error);
      }
      
    }
  }
  
  module.exports = MessageProcessor;
  