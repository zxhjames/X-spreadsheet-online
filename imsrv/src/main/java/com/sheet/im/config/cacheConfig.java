package com.sheet.im.config;

import com.sheet.im.cache.SyncronizeCache;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @program: netty-4-user-guide-demos-master
 * @description:
 * @author: 占翔昊
 * @create 2022-04-26 18:54
 **/

@Configuration
public class cacheConfig {
    @Bean
    protected SyncronizeCache newCache() {
        SyncronizeCache cache = new SyncronizeCache();
        return cache;
    }
}
