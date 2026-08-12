import redisClient from "../config/RedisConfig.js";


const setValue = async (key, value, explorerexpirySeconds = null) => { 
    if(explorerexpirySeconds){
        await redisClient.set(key,value,{EX:explorerexpirySeconds});
    }
    else{
        await redisClient.set(key,value);
    }
};


const getValue = async(key)=>{
    const response = await redisClient.get(key);
    return response;
};


const deleteValue = async (key) => {
    const response =  await redisClient.del(key);
    return response;
};


const exists = async (key) => {
    const response =  await redisClient.exists(key);
    return response;
};


export {setValue,getValue,deleteValue,exists};