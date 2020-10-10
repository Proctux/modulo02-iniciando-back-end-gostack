import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ListProviderDayAvailability from '../controllers/ProviderDayAvailabilityController';
import ListProviderMonthAvailability from '../controllers/ProviderMonthAvailabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerDayAvailabilityController = new ListProviderDayAvailability();
const providerMonthAvailabilityController = new ListProviderMonthAvailability();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);
providersRouter.get('/:provider_id/day-availability', providerDayAvailabilityController.index)
providersRouter.get('/:provider_id/month-availability', providerMonthAvailabilityController.index)

export default providersRouter;