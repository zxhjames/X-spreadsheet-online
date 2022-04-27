package com.sheet.im.server;

import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.codec.DelimiterBasedFrameDecoder;
import io.netty.handler.codec.Delimiters;
import io.netty.handler.codec.LineBasedFrameDecoder;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler;
import io.netty.handler.codec.string.StringDecoder;
import io.netty.handler.codec.string.StringEncoder;
import io.netty.handler.stream.ChunkedWriteHandler;
import io.netty.util.CharsetUtil;

import java.nio.charset.Charset;

/**
 * @program: netty-4-user-guide-demos-master
 * @description:
 * @author: 占翔昊
 * @create 2022-04-25 16:52
 **/
public class MasterInitializer extends ChannelInitializer<SocketChannel> {

    /**
     *  Websocket连接
     * @param ch
     * @throws Exception
     */
    @Override
    public void initChannel(SocketChannel ch) throws Exception {//（2）
        ChannelPipeline pipeline = ch.pipeline();

//        pipeline.addLast(new DelimiterBasedFrameDecoder(4096, Delimiters.lineDelimiter()));
//        pipeline.addLast(new StringEncoder(CharsetUtil.UTF_8));
//        pipeline.addLast(new StringDecoder(CharsetUtil.UTF_8));
//        pipeline.addLast(new DistributeSendHandler());


        pipeline.addLast(new HttpServerCodec());
        pipeline.addLast(new HttpObjectAggregator(64*1024));
        pipeline.addLast(new ChunkedWriteHandler());
        pipeline.addLast(new WebSocketServerProtocolHandler("/ws"));
        pipeline.addLast(new MasterWebsocketHandler()); // 加入tcp连接

    }


}
