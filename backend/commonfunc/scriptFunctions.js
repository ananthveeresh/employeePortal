module.exports = function() { 
    this.analysisapi = ()=>{
        let analysis = 'http://10.70.3.135:3006/api/';
        // const analysisApi = 'http://10.60.1.9:3006/api/';
        return analysis;
    }

    this.payrollapi = ()=>{
        let payroll = 'http://10.30.1.21:4602/api/';
        return payroll;
    }
}