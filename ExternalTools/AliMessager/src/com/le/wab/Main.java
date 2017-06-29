package com.le.wab;

import com.taobao.api.internal.tmc.Message;
import com.taobao.api.internal.tmc.MessageHandler;
import com.taobao.api.internal.tmc.MessageStatus;
import com.taobao.api.internal.tmc.TmcClient;
import com.taobao.api.internal.toplink.LinkException;
import com.taobao.api.request.TmcMessagesConfirmRequest;
import com.taobao.api.response.TmcMessagesConfirmResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

public class Main {
    public static void main(String[] args) throws LinkException, InterruptedException {
        if (args.length > 0) {
            Conf.API_URL = args[0];
        }

        final Logger logger = LogManager.getLogger(Main.class.getName());
        logger.warn("API:" + Conf.API_URL);
        final TmcClient client = new TmcClient(Conf.APP_KEY, Conf.APP_SECERTY, "default");//请求地址sdk默认已经封装
        client.setMessageHandler(new MessageHandler() {
            public void onMessage(Message message, MessageStatus status) {
                try {
                    System.out.println("============" + System.currentTimeMillis());
                    String topic = message.getTopic();
                    String content = message.getContent();
                    System.out.println(topic);
                    System.out.println(message);

                    switch (topic) {
                        case Conf.Order_Success:
                            AliOrderBean aliOrderBean = AliOrderBean.getOrderCreated(content);
                            try {
                                logger.error(topic + "\t" + aliOrderBean.toString());
                                if (aliOrderBean.bc_trace.contains("ark.letv.com")) {
                                    String trace_url = aliOrderBean.bc_trace + "&check=0";
                                    HttpUtils.sendGet(trace_url, null);
                                }
                            } catch (Exception e) {
                                e.printStackTrace();
                            }

                            break;
                        case Conf.Order_Created:
                        case Conf.Order_Return_Success:
                        case Conf.Order_Trade_Closed:
                        case Conf.Order_Trade_PaidDone:
                            aliOrderBean = AliOrderBean.getOrderCreated(content);
                            logger.warn(topic + "\t" + aliOrderBean.toString());
                            break;
                        default:
                            logger.info(topic + "\t" + content);
                            MessageBean messageBean = new MessageBean(topic, content);
                            HttpUtils.sendPost(Conf.API_URL, messageBean.toString());
                            break;
                    }
                    TmcMessagesConfirmRequest cReq=new TmcMessagesConfirmRequest();
                    cReq.setGroupName("default");
                    cReq.setsMessageIds(String.valueOf(message.getId()));

                    // 默认不抛出异常则认为消息处理成功
                } catch (Exception e) {
                    e.printStackTrace();
                    status.fail();// 消息处理失败回滚，服务端需要重发
                }
            }
        });

        client.connect();
        System.out.println("client is online " + client.isOnline());
//        MessageBean messageBean = new MessageBean("taobao_tae_ItemPriceChange","{\"timestamp\":\"2016-06-30 15:22:49\",\"data_id\":\"23387178-43818085419\",\"item_id\":\"43818085419\",\"item_info\":{\"location\":\"韩国\",\"sku_infos\":[],\"shop_name\":\"小静海淘屋\",\"post_for_free\":\"false\",\"title\":\"innisfree悦诗风吟天然植物精华真萃鲜润原汁补水美白保湿面膜\",\"price\":\"9.00\",\"cart_support\":\"true\",\"quantity\":\"79\",\"seller_type\":\"taobao\",\"in_sale\":\"true\",\"seller_nick\":\"guojinghlj0822\",\"img_urls\":[\"http://img.alicdn.com/bao/uploaded/i4/TB1ROIjHXXXXXblXFXXXXXXXXXX_!!0-item_pic.jpg\"]}}");
//        HttpUtils.sendPost(Conf.API_URL,messageBean.toString());

//        String json = "{\"buyer_id\":\"AAGx9PUDACZkdD1y3IswWgeI\",\"extre\":\"\",\"bc_trace\":\"http%3A%2F%2Fark.letv.com%2Ft%3Fmid%3D427291%26rt%3D1%26oid%3D72164%26im%3D1%26t%3D1467801638%26data%3D14%252C1156110000%252C11%252C11a5674c5c364520810cc0bc0787ec13_1467801634484%252C5948%252C%252C%252C%252C1%252C0%252Cletv%252C%252C0%252C1467801637764%252C%252C%252C%252C%252C%252C1467801637764%252C0%26s%3Df098\",\"paid_fee\":\"19.00\",\"shop_title\":\"小静海淘屋\",\"is_eticket\":false,\"create_order_time\":\"2016-07-07+10:32:45\",\"order_id\":\"2055489629133138\",\"order_status\":\"7\",\"seller_nick\":\"guojinghlj0822\",\"auction_infos\":[{\"detail_order_id\":\"2055489629133138\",\"auction_id\":\"AAGr9PUAACZkdD1y3IEWrckU\",\"real_pay\":\"19.00\",\"auction_pict_url\":\"i4/TB1ROIjHXXXXXblXFXXXXXXXXXX_!!0-item_pic.jpg\",\"auction_title\":\"innisfree悦诗风吟天然植物精华真萃鲜润原汁补水美白保湿面膜\",\"auction_amount\":\"1\"}]}";

//        AliOrderBean orderCreated = AliOrderBean.getOrderCreated(json);
//        System.out.println(orderCreated.toString());

//        while (true){
//            logger.warn("i'm warn");
//            logger.warn("i'm warn");
//            logger.error("i'm error");
//            Thread.sleep(1000L);
//        }
//        try {
//            System.out.print(URLDecoder.decode("microservice:isv\u003dletv\u0026mid\u003dTHPL","Unicode"));
//        } catch (UnsupportedEncodingException e) {
//            e.printStackTrace();
//        }
        Thread.sleep(64000000L);

    }
}
