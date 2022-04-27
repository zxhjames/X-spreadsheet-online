package com.sheet.im.cache;

import sun.lwawt.macosx.CTextPipe;

import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @program: netty-4-user-guide-demos-master
 * @description:
 * @author: 占翔昊
 * @create 2022-04-26 16:46
 **/
public class OperatorTimeStamp {
    private Integer version;
    private String text;
    private LocalDateTime localDateTime;
    public OperatorTimeStamp(int v,String t,LocalDateTime l) {
        this.version = v;
        this.text = t;
        this.localDateTime = l;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public LocalDateTime getLocalDateTime() {
        return localDateTime;
    }

    public void setLocalDateTime(LocalDateTime localDateTime) {
        this.localDateTime = localDateTime;
    }
}
