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
      console.log([`Received message on topic ${topic}, partition ${partition}`, message]);
      try {
        var reqobj = message.data
        // console.log(reqobj)
        const {institute, year_id, campus, exam_id, exam_date, exam_name, student_id, suc_code,student_name, section, section_id, class_name, roll_no,father_name, exam_result, attendance_from_date, attendance_to_date, progress_id} = message.data.stdData
        var curdate = new Date()
        curdate =  ('00' + curdate.getDate()).slice(-2)+ '-' +
                ('00' + (curdate.getMonth()+1)).slice(-2) + '-' +
                curdate.getFullYear()     

        // var attendanceobj = {
        //   "student_id": suc_code, year_id, section_id, attendance_from_date, attendance_to_date
        // }
        //student attedance in between dates
        // var stdattendance = await axios.post(process.env.ANALYSIS_API+"/student/rangeattendance", attendanceobj);

        var exam_result_arr = [
          {
              "examid": exam_id,
              "examname": exam_name,
              "examdate": exam_date,
              "examresultinfo": exam_result
          }
        ]  
        var file_path = "/"+year_id+"/"+campus+"/"+suc_code
        var file_name = suc_code+"-"+curdate
        var student_info = [{institute, year_id, campus, student_id, suc_code,student_name, father_name, section, section_id, class_name, roll_no}]
        
        if(message.data.stdData.term_aditional_marks){
          var term_aditional_marks = message.data.stdData.term_aditional_marks;
        } else {
          var term_aditional_marks = []
        }
        var examresobj = {
          progress_id, year_name:year_id, campus_name:campus, student_info, student_attendance:[attendance_from_date, attendance_to_date], term_aditional_marks, exam_result:exam_result_arr, file_path, file_name
        } 
        // console.log(examresobj)
        //exam result insert
        await axios.post(process.env.BASE_API+"examresultstateboard/create", examresobj);
        reqobj.path = file_path;
        reqobj.filename = file_name;
        // Use await to wait for the response before processing the next message
        await axios.post(process.env.PDF_API+'url2pdf/', reqobj);

        var statusobj = {
          year_id, campus, exam_id, suc_code, report_generated:true
        }
        //pdf generated status update
        await axios.post(process.env.BASE_API+"exammarks/updatestdpdfstatus", statusobj);
        
      } catch (error) {
        console.error("Error processing message:", error);
      }
      
    }
  }
  
  module.exports = MessageProcessor;
  