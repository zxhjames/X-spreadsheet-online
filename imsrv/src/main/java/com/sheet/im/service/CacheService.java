package com.sheet.im.service;

import com.sheet.im.cache.OperatorTimeStamp;
import com.sheet.im.cache.SyncronizeCache;
import org.apache.tomcat.jni.Local;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedList;

/**
 * @program: netty-4-user-guide-demos-master
 * @description:
 * @author: 占翔昊
 * @create 2022-04-26 16:55
 **/

@Service
public class CacheService {

    private SyncronizeCache cache = new SyncronizeCache();

    public String getCache(String ip) {
        if (!cache.hasIP(ip)) {
            return null;
        }
        return cache.getCache(ip).getLast().getText();
    }

    public void  saveCache(String ip,String text) {
        LocalDateTime dateTime = LocalDateTime.now();
        if (!cache.hasIP(ip)) {
            LinkedList<OperatorTimeStamp> cacheList = new LinkedList<>();
            OperatorTimeStamp op = new OperatorTimeStamp(0,text,dateTime);
            cacheList.add(op);
            cache.putCache(ip,cacheList);
        } else {
            int version = cache.getCache(ip).getLast().getVersion();
            LinkedList<OperatorTimeStamp> cacheList = cache.getCache(ip);
            cacheList.add(new OperatorTimeStamp(version+1,text,dateTime));
            cache.putCache(ip,cacheList);
        }
    }

    public LinkedList<OperatorTimeStamp> getHistory(String ip) {
        if (!cache.hasIP(ip)) {
            return null;
        }
        return cache.getCache(ip);
    }
}
