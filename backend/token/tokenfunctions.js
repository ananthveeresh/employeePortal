module.exports = function() { 

    this.createToken = async (email) =>{

        token= sha512(email +'|'+ "APISKEETSSFSFS");
        return { "token": token, "expiry":new Date().getDate()}

    }

    this.validateToken = async (obj) =>{
        
        token = sha512(obj.email +'|'+ "APISKEETSSFSFS");
      
        if(obj.token==token){
            return { "status": 200,"result": 'Valid user' }
        }else{
            return { "status": 400,"result": 'Not a valid user' }
        }
        
    }

}