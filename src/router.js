import authRoutes from './routes/authRoutes'
import customerRoutes from './routes/customerRoutes'
import ticketRoutes from './routes/ticketRoutes'
import dataRoutes from './routes/dataRoutes'

const router = (app) => {
    app.use('/api/auth',  authRoutes);
    app.use('/api/customer',  customerRoutes);
    app.use('/api/ticket',  ticketRoutes);
    app.use('/api/data',  dataRoutes);
};

export default router;
