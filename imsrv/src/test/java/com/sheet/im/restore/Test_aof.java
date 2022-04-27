package com.sheet.im.restore;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.ByteBufAllocator;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.*;
import java.nio.channels.FileChannel;

/**
 * @program: netty-4-user-guide-demos-master
 * @description:
 * @author: 占翔昊
 * @create 2022-04-26 20:37
 **/
@SpringBootTest
public class Test_aof {
    private Logger log = LoggerFactory.getLogger(Test_aof.class);
    private static final String AOF_PATH = System.getProperty("user.dir") + "/aof.txt";
    @Test
    public void test_save() {
        ByteBuf buf = ByteBufAllocator.DEFAULT.directBuffer();
        buf.writeBytes("hello".getBytes());
        String AOF_PATH = "aof.txt";
        File file = new File(System.getProperty("user.dir") + "/" + AOF_PATH);
        log.warn("开始写入aof>>>>>>>> " + file.getPath());
        FileOutputStream fs = null;
        try {
            fs = new FileOutputStream(file,true);
            FileChannel fc = fs.getChannel();
            fc.write(buf.nioBuffers());
            fc.close();
            fs.flush();
            fs.close();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (fs != null) {
                try {
                    fs.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        log.warn("写入aof成功>>>>>>>>");
    }

    @Test
    public void test_aof2() throws IOException {
        RandomAccessFile randomAccessFile = new RandomAccessFile(AOF_PATH,"rw");
        for (int i=0;i<100;++i) {
            long fileSize = randomAccessFile.length();
            randomAccessFile.seek(fileSize);
            randomAccessFile.writeBytes("hello" + "\n");
        }
        randomAccessFile.close();
    }
}
