package com.le.wab;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

/**
 * Created by leiyao on 16/6/30.
 */
public class MessageBean {
    public String topic;
    public String message;

    public MessageBean(String topic, String message) {
        this.topic = topic;
        this.message = message;
    }

    @Override
    public String toString() {
        try {
            return "topic=" + this.topic + "&message=" + URLEncoder.encode(this.message,"UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return null;
    }
}
