var app = angular.module('correctionApp', []);

app.controller('homectrl', function ($http, $scope, $sce, $location,$window) {


    const payrollapi = "https://analysis.aditya.ac.in/staff/api";
    const fastapi = "https://analysis.aditya.ac.in/staff/ep2";
    const analysisapi = 'https://apis.aditya.ac.in/analysis';

    

   // const payrollapi = "http://10.30.1.21:4602/api";
    //const fastapi = "http://10.70.9.31:7999";
    // const analysisapi = 'http://10.60.1.9:3006'


    var urlParams = new URLSearchParams(window.location.search);
    $scope.branch = urlParams.get("branch");
    $scope.code = urlParams.get("code");

    
    if (!localStorage.getItem('logindata')) {
        $http.get(payrollapi + '/employeemaster/getempbypaycode/' + $scope.code).then(function (response) {
            // // console.log(1)
            if (response && response.data) {
                $scope.empuniquecode = response.data[0];
                localStorage.setItem('logindata', JSON.stringify(response.data[0]));
                $scope.invalidOtp = null;
            } else {
                $scope.invalidOtp = "Employee paycode not found";
                localStorage.removeItem('logindata');
            }
        })
    } else {

        $scope.empuniquecode = JSON.parse(localStorage.getItem('logindata'));
        // // console.log($scope.empuniquecode)
    }

    $scope.loading = true;
    $scope.onLoading = function () {
        console.log(`${fastapi}/getalloteddata/` + $scope.branch + `/` + $scope.code)
        $http.get(`${fastapi}/getalloteddata/` + $scope.branch + `/` + $scope.code).then(function (data) {
        //    console.log(data.data)
        
        // // console.log(data)
            if (data.data.length > 0) {
                localStorage.setItem(`${$scope.code}_blukdata`, JSON.stringify(data.data))
                $scope.emp_blukdata = data.data;
                $scope.process_data(data.data)
            } else {
                $scope.overall_emp_data = [];
                $scope.selected_class = 'New';
                $scope.loading = false;
            }

        })
    }
    
    $scope.process_data = function(dt){
        $scope.overall_emp_data = [];
        $scope.joined_list = [];
        $scope.interested_list = [];
        $scope.pending_list = [];
        $scope.other_list = [];
        dt.forEach(item => {
            if (item.LatestStatus === "Interested") {
                $scope.interested_list.push(item);
            }else if (item.LatestStatus === "Joined") {
                $scope.joined_list.push(item);
            } else if (!item.LatestStatus) { 
                $scope.pending_list.push(item);
            } else {
                $scope.other_list.push(item);
            }
        });

        // // console.log($scope.pending_list)
        // // console.log($scope.interested_list)
        // // console.log($scope.other_list)
        // // console.log($scope.joined_list)

        $scope.overall_emp_data.push(...$scope.pending_list);
        $scope.selected_class = 'New';
        $scope.loading = false;
    }

    setInterval(() => {
        $scope.$apply(() => {
            $scope.onLoading();
        });
    }, 30 * 60 * 1000);
    

    
    if (!localStorage.getItem(`${$scope.code}_blukdata`)) {
        $scope.onLoading();
    }else{
        $scope.emp_blukdata = JSON.parse(localStorage.getItem(`${$scope.code}_blukdata`));
        // console.log($scope.emp_blukdata)
        if($scope.emp_blukdata.length > 0){
            $scope.process_data($scope.emp_blukdata)
        }else{
            $scope.onLoading();
        }
    }


    $scope.selected_student = null;
    $scope.viewDetails = function (x) {
        $window.location.href = "tel:+91" + x.Mobile; 
        $scope.selected_student = angular.copy(x);
    };

    $scope.editDetails = function (x) {
        $scope.selected_student = angular.copy(x);
    };
    $scope.callDetails = function (x) {
        $window.location.href = "tel:+91" + x.Mobile; 
    };

    $scope.backToList = function () {
        $scope.selected_student = null;
        $scope.get_pending_list()
    };

    $scope.selected_student = null;
    $scope.show_update = 0;
    $scope.updateStatus = function () {
        $scope.show_update = 1;
        // Get current date and time
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';

        hours = hours % 12;
        hours = hours ? hours : 12; // 0 becomes 12
        minutes = minutes < 10 ? '0' + minutes : minutes;

        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}${ampm}`;
        // // console.log("Formatted Date:", formattedDate);

        // Validate required fields before submitting
        if (!$scope.selected_student.LatestStatus || !$scope.selected_student.Remarks) {
            alert("Status/Remarks Not Empty");
            return;
        }

        // Prepare the data object for submission
        //console.log($scope.selected_student)

        var obj = {
            "filename": $scope.branch,
            "phone_number": $scope.selected_student.Mobile,
            "paycode": $scope.selected_student.Paycode,
            "faculty_name": $scope.selected_student.FacultyName,
            "latest_status": $scope.selected_student.LatestStatus,
            "latest_update": formattedDate,
            "remarks": $scope.selected_student.Remarks || "",
            "course": $scope.selected_student.course
        };
        

        // // console.log("Data to be sent to backend:", obj);

        // Confirm submission
        if (confirm("Are you sure you want to submit?")) {

            whatsappobj={
                "data": {
                    "messaging_product": "whatsapp",
                    "to": "91"+$scope.selected_student.Mobile,
                    "type": "template",
                    "template": {
                        "name": "adc_enq",
                        "language": {
                            "code": "en"
                        },
                        "components": [
                            {
                                "type": "header",
                                "parameters": [
                                    {
                                        "type": "image",
                                        "image": {
                                            "link": "https://analysis.aditya.ac.in/uploads/whatsapp/adc.jpg"
                                        }
                                    }
                                ]
                            },
                            {
                                "type": "body",
                                "parameters": [
                                    {
                                        "type": "text",
                                        "text": $scope.selected_student.Name
                                    },
                                    {
                                        "type": "text",
                                        "text": $scope.selected_student.course != '' ? $scope.selected_student.course : ""
                                    },
                                    {
                                        "type": "text",
                                        "text": $scope.empuniquecode.empName +', '+$scope.empuniquecode.mobileNo
                                    },
                                    {
                                        "type": "text",
                                        "text": $scope.empuniquecode.campusName
                                    },
                                    {
                                        "type": "text",
                                        "text": "https://aditya.ac.in/degree/brochure/"
                                    }
                                ]
                            },
                            {
                                "type": "button",
                                "sub_type": "url",
                                "index": "0",
                                "parameters": [
                                    {
                                        "type": "text",
                                        "text": "/degree/"
                                    }
                                ]
                            }
                        ]
                    }
                }
            }

            $http.post(`https://apis.aditya.ac.in/kafka/producer/whatsapp`, whatsappobj).then(function (data) {


                   // $http.post(`${fastapi}/update-status`, obj).then(function (response) {
                   var leadobj={
                    "data":obj
                   }
                    $http.post(`https://apis.aditya.ac.in/kafka/producer/leadstatusupdate`, leadobj).then(function (response) {

                        for(var i=0; i<$scope.emp_blukdata.length; i++){
                            if($scope.emp_blukdata[i].Mobile == $scope.selected_student.Mobile){
                                $scope.emp_blukdata[i].LatestStatus =  $scope.selected_student.LatestStatus
                                $scope.emp_blukdata[i].LatestUpdate =  formattedDate
                                $scope.emp_blukdata[i].Remarks =  $scope.selected_student.Remarks || ""
                                $scope.emp_blukdata[i].interestedcourse =  $scope.selected_student.course
                                break
                            }

                        }
                        // console.log($scope.emp_blukdata)                        
                        localStorage.setItem(`${$scope.code}_blukdata`, JSON.stringify($scope.emp_blukdata))
                        $scope.process_data($scope.emp_blukdata)

                      //  if (response.data.message == 'Updated') {
                            $scope.show_update = 0;
                            alert("Data Submitted successfully...!");
                            //$scope.selected_student = null;
                            location.reload();
                      //  }
        
                    }).catch(function (error) {
                        console.error("Error updating employee data:", error);
                        if (error.response) {
                            // // console.log("Error Response Data:", error.response.data);
                        }
                    });

                });
        }else{
            $scope.show_update = 0;
        }

        // Reset selected employee after update
    };

    $scope.courses_list = [];
    $scope.show_course = 0;
    $scope.get_courses = function () {        
        if ($scope.selected_student.LatestStatus == 'Interested') {
            $scope.show_course = 1;
            $http.get(`${analysisapi}/master/maincourse?inst_id=` + $scope.empuniquecode.instId).then(function (data) {
                // // console.log(data.data)
                $scope.courses_list = data.data.filter(e=>e.admcourse==1)
            })
        } else {
            $scope.show_course = 0;
            $scope.selected_student.course = "";
            $scope.courses_list = []
        }
    }

    $scope.get_joined_list = function () {    
        $scope.student_search = ""; 
        $scope.overall_emp_data = [];
        $scope.overall_emp_data.push(...$scope.joined_list);
        $scope.selected_class = 'joined';
    }

    $scope.get_pending_list = function () {    
        $scope.student_search = ""; 
        $scope.overall_emp_data = [];
        $scope.overall_emp_data.push(...$scope.pending_list);
        $scope.selected_class = 'New';
    }

    $scope.get_others_list = function () {
        $scope.student_search = "";
        $scope.overall_emp_data = [];
        $scope.overall_emp_data.push(...$scope.other_list);
        $scope.selected_class = 'others';
    }

    $scope.get_interested_list = function () {    
        $scope.student_search = "";    
        $scope.overall_emp_data = [];
        $scope.overall_emp_data.push(...$scope.interested_list);
        $scope.selected_class = 'interested';
    }
});
app.filter('camelCase', function () {
    return function (input) {
        if (!input) return '';
        return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    };
});
