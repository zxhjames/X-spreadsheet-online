package com.sheet.im.cache;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

import java.util.LinkedList;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @program: netty-4-user-guide-demos-master
 * @description:
 * @author: 占翔昊
 * @create 2022-04-26 16:43
 **/

public class SyncronizeCache {
    private ConcurrentHashMap<String, LinkedList<OperatorTimeStamp>> cache;

    public SyncronizeCache() {
        this.cache = new ConcurrentHashMap<>();
    }

    public ConcurrentHashMap<String, LinkedList<OperatorTimeStamp>> getCache() {
        return cache;
    }

    public LinkedList<OperatorTimeStamp> getCache(String ip) {
        return cache.get(ip);
    }

    public boolean hasIP(String ip) {
        return cache.containsKey(ip);
    }

    public void putCache(String ip, LinkedList<OperatorTimeStamp> op) {
        this.cache.put(ip,op);
    }


}
