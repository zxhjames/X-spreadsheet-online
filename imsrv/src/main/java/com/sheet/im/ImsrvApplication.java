package com.sheet.im;

import com.sheet.im.server.MasterNettyServer;
import com.sheet.im.server.SlaveNettyServer;
import io.netty.channel.ChannelFuture;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.net.InetSocketAddress;

@SpringBootApplication
public class ImsrvApplication implements CommandLineRunner {
    @Value("${server.host}")
    private String host;
    @Value("${server.port}")
    private int port;
    @Value("${server.master.port}")
    private int masterPort;
    @Value("${server.mode}")
    private int serverMode;
    @Autowired
    private MasterNettyServer writerServer;
    @Autowired
    private SlaveNettyServer readServer;


    public static void main(String[] args) {
        SpringApplication.run(ImsrvApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        if (serverMode == 0) {
            System.out.println("启动master>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            InetSocketAddress address = new InetSocketAddress(host, port);
            ChannelFuture channelFuture = writerServer.bing(address);
            Runtime.getRuntime().addShutdownHook(new Thread(() -> writerServer.destroy()));
            channelFuture.channel().closeFuture().syncUninterruptibly();
        } else {
            System.out.println("启动slave>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            InetSocketAddress address = new InetSocketAddress(host, port);
            ChannelFuture channelFuture = readServer.bind(address,masterPort);
            Runtime.getRuntime().addShutdownHook(new Thread(() -> readServer.destroy()));
            channelFuture.channel().closeFuture().syncUninterruptibly();
        }

    }

}
