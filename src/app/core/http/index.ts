import { loggingInterceptor } from './logging';
import { correlationInterceptor } from './correlation';

const coreInterceptors = [correlationInterceptor, loggingInterceptor];
export default coreInterceptors;
