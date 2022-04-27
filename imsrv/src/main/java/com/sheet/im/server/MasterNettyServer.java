package com.sheet.im.server;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.net.InetSocketAddress;

@Component("masterNettyServer")
public class MasterNettyServer {

    private Logger logger = LoggerFactory.getLogger(MasterNettyServer.class);

    //配置服务端NIO线程组
    private final EventLoopGroup parentGroup = new NioEventLoopGroup(); //NioEventLoopGroup extends MultithreadEventLoopGroup Math.max(1, SystemPropertyUtil.getInt("io.netty.eventLoopThreads", NettyRuntime.availableProcessors() * 2));
    private final EventLoopGroup childGroup = new NioEventLoopGroup();
    private Channel channel;

    public ChannelFuture bing(InetSocketAddress address) {
        ChannelFuture channelFuture = null;
        try {
            ServerBootstrap b = new ServerBootstrap();
            b.group(parentGroup, childGroup)
                    .channel(NioServerSocketChannel.class)    //非阻塞模式
                    .option(ChannelOption.SO_BACKLOG, 128)          // (5)
                    .childOption(ChannelOption.SO_KEEPALIVE, true) //
                    .childHandler(new MasterInitializer());
            /**
             *  childOption的含义以及使用的场景
             *  1. SO_BACKLOG 对应的是tcp/ip协议listen中的backlog参数，用于初始化服务端可连接队列
             */
            channelFuture = b.bind(address).sync();
            channel = channelFuture.channel();
        } catch (Exception e) {
            logger.error(e.getMessage());
        } finally {
            if (null != channelFuture && channelFuture.isSuccess()) {
                logger.info("master服务启动>>>>>>>>>>>>>>>");
            } else {
                logger.error("master服务出错>>>>>>>>>>>>>>>");
            }
        }
        return channelFuture;
    }

    public void destroy() {
        if (null == channel) return;
        channel.close();
        parentGroup.shutdownGracefully();
        childGroup.shutdownGracefully();
    }

    public Channel getChannel() {
        return channel;
    }

}