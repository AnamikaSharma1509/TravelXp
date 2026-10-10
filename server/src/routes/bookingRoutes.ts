import { Router } from 'express';
import { BookingController } from '../controllers/bookingController';

const router = Router();

router.post('/flights/search', BookingController.searchFlights);
router.post('/trains/search', BookingController.searchTrains);
router.post('/buses/search', BookingController.searchBuses);
router.post('/hotels/search', BookingController.searchHotels);
router.post('/experiences/search', BookingController.searchExperiences);
router.get('/providers', BookingController.getProviders);

export default router;
