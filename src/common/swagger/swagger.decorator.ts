import { ApiTags } from '@nestjs/swagger';

export const ApiController = (tag: string) => {
    return (target: any) => {
        ApiTags(tag)(target);
        // ApiBearerAuth('access-token')(target);
        // ApiHeader({ name: 'ApiToken', required: true, description: 'API Token for access' })(target);
    };
};
