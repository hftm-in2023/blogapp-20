import { loggingInterceptor } from './logging';

const coreInterceptors = [/*correlationInterceptor*/ loggingInterceptor];
export default coreInterceptors;
