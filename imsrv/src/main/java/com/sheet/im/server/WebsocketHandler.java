package com.sheet.im.server;

import com.sheet.im.cache.OperatorTimeStamp;
import com.sheet.im.cache.SyncronizeCache;
import com.sheet.im.service.CacheService;
import com.sheet.im.service.ScheduledService;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.ByteBufAllocator;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandler;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketFrame;
import io.netty.util.concurrent.ImmediateEventExecutor;
import io.netty.util.concurrent.ScheduledFuture;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.nio.ByteBuffer;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.concurrent.TimeUnit;

/**
 * @program: netty-4-user-guide-demos-master
 * @description:
 * @author: 占翔昊
 * @create 2022-04-26 15:49
 **/
@Component
public class WebsocketHandler extends SimpleChannelInboundHandler<TextWebSocketFrame> {
    private static final Logger log = LoggerFactory.getLogger(WebsocketHandler.class);
    private CacheService cacheService = new CacheService();
    private final ChannelGroup channels = new DefaultChannelGroup(ImmediateEventExecutor.INSTANCE);// channel组
    private Integer bgSaveTime = 3; // 每隔3s进行数据备份
    private ByteBuf buf = Unpooled.buffer(1024); // 使用了操作系统的缓存区
    private ByteBuf buffer = Unpooled.buffer(1024,1024 * 5);
    private ScheduledService scheduledService = new ScheduledService();
    // master handler负责三个功能: 1.写缓存，2.写日志文件 3. 数据备份给从结点服务器
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, TextWebSocketFrame msg) throws Exception {
        //通知客户端链消息发送成功
        String str = "服务端收到：" +ctx.channel().remoteAddress().toString() + "的信息, " +  new Date() + " " + msg.text() + "\r\n";
        log.info(str);
        cacheService.saveCache(ctx.channel().remoteAddress().toString(), msg.text());
        ctx.writeAndFlush(str);
        buffer.writeBytes("PUT ".getBytes()).writeBytes(ctx.channel().remoteAddress().toString().getBytes())
                .writeBytes(" ".getBytes())
                .writeBytes(msg.text().getBytes());
        // todo bgSave线程静默写入日志
        ctx.channel().eventLoop().schedule(new Runnable() {
            @Override
            public void run() {
                scheduledService.bgSave(buffer);
            }
        },bgSaveTime,TimeUnit.SECONDS);


        // todo 分发消息给其他从结点
        ctx.channel().eventLoop().submit(new Runnable() {
            @Override
            public void run() {
                scheduledService.distributeSend(ctx);
            }
        });

        // 文件备份线程会每隔3s将缓冲区中的指令写入到文件中，然后清除缓存
        // 节点广播线程会将每次发送的请求分发给其他worker节点
//        LinkedList<OperatorTimeStamp> history = cacheService.getHistory(ctx.channel().remoteAddress().toString()) ;
//        Iterator<OperatorTimeStamp> iter = history.iterator();
//        while (iter.hasNext()) {
//            OperatorTimeStamp op = iter.next();
//            log.info(op.getVersion() + " " + op.getText() + " " + op.getLocalDateTime().toString());
//        }
    }

    @Override
    public void handlerAdded(ChannelHandlerContext ctx) throws Exception {
        log.info(">>>>>>>>>>>> channelId:{} 连接",ctx.channel().remoteAddress().toString() + " 加入");
    }
    @Override
    public void handlerRemoved(ChannelHandlerContext ctx)  {
        log.info(">>>>>>>>>>>>> channelId:{} 关闭了",ctx.channel().remoteAddress().toString()+" 通道");
    }
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        log.error(">>>>>>>>发送异常：{}",cause.getMessage());
        cause.printStackTrace();
        ctx.close();
    }
}
