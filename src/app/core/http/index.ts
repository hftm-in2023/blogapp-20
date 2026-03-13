import { loggingInterceptor } from './logging';
import { cookieInterceptor } from './cookie';

const coreInterceptors = [loggingInterceptor, cookieInterceptor];
export default coreInterceptors;
