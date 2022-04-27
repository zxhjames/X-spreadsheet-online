package com.sheet.im.config;

import io.netty.channel.Channel;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;

/**
 * @program: netty-4-user-guide-demos-master
 * @description:
 * @author: 占翔昊
 * @create 2022-04-27 15:55
 **/
public class GlobalChannelMap {
    static ConcurrentHashMap<String, Channel> ChannelPool = new ConcurrentHashMap<>();

    public static ConcurrentHashMap<String, Channel> getChannelPool() {
        return ChannelPool;
    }

    public static void setChannelPool(ConcurrentHashMap<String, Channel> channelPool) {
        ChannelPool = channelPool;
    }

    public static void add(String ip, Channel ch) {
        ChannelPool.put(ip,ch);
    }

    public static void remove(String ip) {
        ChannelPool.remove(ip);
    }
}
