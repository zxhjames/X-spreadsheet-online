package com.sheet.im.server;

import com.sheet.im.config.GlobalChannelMap;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.util.concurrent.GlobalEventExecutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
/**
 * @program: netty-4-user-guide-demos-master
 * @description:
 * @author: 占翔昊
 * @create 2022-04-27 15:43
 **/

@Component
public class DistributeSendHandler extends SimpleChannelInboundHandler<String> {
    private static final Logger log = LoggerFactory.getLogger(DistributeSendHandler.class);
    private GlobalChannelMap gm;
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, String s) throws Exception {
         log.info("slave收到了>>>>>>>>>>>>>>>>>>>" + s);
    }

    @Override
    public void handlerAdded(ChannelHandlerContext ctx) throws Exception {
        log.info(">>>>>>>>>>>>DistributeSendHandler  channelId:{} 连接",ctx.channel().remoteAddress().toString() + " 加入");
        gm.add(ctx.channel().remoteAddress().toString(),ctx.channel());
    }
    @Override
    public void handlerRemoved(ChannelHandlerContext ctx)  {
        log.info(">>>>>>>>>>>>>DistributeSendHandler  channelId:{} 关闭了",ctx.channel().remoteAddress().toString()+" 通道");
        gm.remove(ctx.channel().remoteAddress().toString());
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        ctx.writeAndFlush("Slave服务器收到第一条信息");
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        log.error(">>>>>>>>发送异常：{}",cause.getMessage());
        cause.printStackTrace();
        ctx.close();
    }
}
