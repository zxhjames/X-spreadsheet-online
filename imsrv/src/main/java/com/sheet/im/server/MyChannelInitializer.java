package com.sheet.im.server;

import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.codec.LineBasedFrameDecoder;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler;
import io.netty.handler.codec.string.StringDecoder;
import io.netty.handler.codec.string.StringEncoder;
import io.netty.handler.stream.ChunkedWriteHandler;
import org.springframework.web.HttpRequestHandler;

import java.nio.charset.Charset;

/**
 * @program: netty-4-user-guide-demos-master
 * @description:
 * @author: 占翔昊
 * @create 2022-04-25 16:52
 **/
public class MyChannelInitializer extends ChannelInitializer<SocketChannel> {


    /**
     *  TCP连接
     * @param channel
     */
//    @Override
//    protected void initChannel(SocketChannel channel) {
//        // 基于换行符号
//        channel.pipeline().addLast(new LineBasedFrameDecoder(1024));
//        // 解码转String，注意调整自己的编码格式GBK、UTF-8
//        channel.pipeline().addLast(new StringDecoder(Charset.forName("GBK")));
//        // 解码转String，注意调整自己的编码格式GBK、UTF-8
//        channel.pipeline().addLast(new StringEncoder(Charset.forName("GBK")));
//        // 在管道中添加我们自己的接收数据实现方法
//        channel.pipeline().addLast(new MyServerHandler());
//    }

    /**
     *  Websocket连接
     * @param ch
     * @throws Exception
     */
    @Override
    public void initChannel(SocketChannel ch) throws Exception {//（2）
        ChannelPipeline pipeline = ch.pipeline();

        pipeline.addLast(new HttpServerCodec());
        pipeline.addLast(new HttpObjectAggregator(64*1024));
        pipeline.addLast(new ChunkedWriteHandler());
        pipeline.addLast(new WebSocketServerProtocolHandler("/ws"));
        pipeline.addLast(new WebsocketHandler());
    }


}
