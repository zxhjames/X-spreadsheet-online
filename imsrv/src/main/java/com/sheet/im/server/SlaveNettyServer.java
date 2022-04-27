package com.sheet.im.server;

import io.netty.bootstrap.Bootstrap;
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioSocketChannel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.net.InetSocketAddress;

/**
 * @program: netty-4-user-guide-demos-master
 * @description:
 * @author: 占翔昊
 * @create 2022-04-27 10:56
 **/
@Component("slaveNettyServer")
public class SlaveNettyServer {
    private Logger logger = LoggerFactory.getLogger(SlaveNettyServer.class);

    private final EventLoopGroup group = new NioEventLoopGroup();
    private Channel channel;

    public ChannelFuture bind(InetSocketAddress address,int masterPort) {
        ChannelFuture channelFuture = null;
        Bootstrap bootstrap = new Bootstrap();
        bootstrap.group(group).channel(NioSocketChannel.class)
                .option(ChannelOption.SO_KEEPALIVE,true)
                .handler(new SlaveInitializer());
        try {
            channelFuture = bootstrap.connect("127.0.0.1",masterPort).sync();
            channel = channelFuture.channel();

        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            if (channelFuture != null && channelFuture.isSuccess()) {
                logger.info("slave服务启动>>>>>>>>>>>>");
            } else {
                logger.error("slave服务出错>>>>>>>>>>>.");
            }
        }
        return channelFuture;
    }

    public void destroy() {
        if (channel == null) return ;
        channel.close();
        group.shutdownGracefully();
    }
}
