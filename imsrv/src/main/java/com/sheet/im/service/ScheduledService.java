package com.sheet.im.service;

import com.sheet.im.config.GlobalChannelMap;
import io.netty.buffer.ByteBuf;
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.group.ChannelGroup;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.util.CharsetUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.ByteBuffer;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @program: netty-4-user-guide-demos-master
 * @description: 异步任务
 * @author: 占翔昊
 * @create 2022-04-26 20:02
 **/
@Component
public class ScheduledService{
    // nio 异步刷盘
    private static final String AOF_PATH = System.getProperty("user.dir") + "/aof.txt";
    private static final boolean appendable = true;
    private static final Logger log = LoggerFactory.getLogger(ScheduledService.class);
    private static RandomAccessFile randomAccessFile;

    static {
        try {
            randomAccessFile = new RandomAccessFile(AOF_PATH,"rw");
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }

    // 离线保存aof文件
    public void bgSave(ByteBuf buf) {
        log.warn("开始写入aof>>>>>>>>");
        try {
            randomAccessFile.seek(randomAccessFile.length());
            randomAccessFile.writeBytes(buf.toString(CharsetUtil.UTF_8)+"\n");
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (buf.capacity() > 1024 * 5) {
            log.warn("缓冲区已满，开始清理>>>>>>>>>>>>>");
            buf.clear();
        }
        log.warn("写入aof成功>>>>>>>>");

    }

    // 将写命令备份到其他从结点上
    public void distributeSend(ChannelHandlerContext ctx, TextWebSocketFrame msg, GlobalChannelMap channels) {
        // todo 定时将消息发送到其他结点上
        for (String k : GlobalChannelMap.getChannelPool().keySet()) {
            if (!k.equals(ctx.channel().remoteAddress().toString())) {
                log.info(msg.text());
                //ctx.writeAndFlush(msg.text().getBytes());
            }
        }
    }
}
