import authRouter from './auth-routes.js';

export default (app) => {
    app.use('/users', authRouter);
}