const MY_CONFIG = {
    PORT: 5001,
    MONGO_DATA_STRING: 'mongodb://spdf_dev:cl.spdf@144.202.126.128:27017/spdf?authSource=test&readPreference=primary&appname=MongoDB%20Compass&ssl=false',
    MONGO_SESSION_STRING: 'mongodb://spdf_user:cl.spdf@144.202.126.128:27017/user?authSource=user&readPreference=primary&appname=MongoDB%20Compass&ssl=false',
    // MONGO_DATA_STRING: 'mongodb://localhost:27017/test?readPreference=primary&authSource=admin&appname=MongoDB%20Compass&ssl=false',
    // MONGO_SESSION_STRING: 'mongodb://localhost:27017/test?readPreference=primary&authSource=admin&appname=MongoDB%20Compass&ssl=false',
    
    COOKIE_SECRET: 'baixiongzai',
    COOKIE_MAXAGE: 1000 * 60 * 60 * 24, // timeout set at 24 hours
};

module.exports = MY_CONFIG;