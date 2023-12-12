const passport = require('passport');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const authRouter = require('./auth');
const todoRouter = require('./todo');

module.exports = (app) => {
    const swaggerOptions = {
        definition: {
            openapi: '3.0.0',
            info: {
            title: 'Express Todo Application',
            version: '1.0.0'
            },
            servers:[
                {
                    url: "http://localhost:5000",
                    description: "Local server"
            }, {
                url: "https://express-todo-mway.onrender.com",
                description: "Dev server"
                }
            ],
            components:{
                securitySchemes: {
                    bearerAuth:{
                        type: 'apiKey',
                        name: 'Authorization',
                        in: 'header',
                        description: 'Bearer Token'
                    }
                }

            }
        },
        apis: ['./docs/*.yml']
    };
    const openapiSpecification = swaggerJsdoc(swaggerOptions)
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

    app.use(cors());
    app.use('/api/auth', authRouter);
    app.use('/api/todos', [passport.authenticate('bearer', {session: false})], todoRouter);
};
