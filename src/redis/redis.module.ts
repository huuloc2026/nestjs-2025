import { Module } from "@nestjs/common";
import { CacheModule } from '@nestjs/cache-manager';
@Module({
    imports: [
        CacheModule.register({
            isGlobal: true,
            useFactory: async () => ({
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                ttl: 1000,
            }),
        }),

    ],
    exports: [RedisModule]
})
export class RedisModule {}
