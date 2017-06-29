package com.le.wab;

/**
 * Created by leiyao on 16/6/30.
 */
public class Conf {
    public static String API_URL = "http://127.0.0.1:3000/goods/notification";
    public static final String APP_KEY = "23387178";
    public static final String APP_SECERTY = "9a49e5cdf956667c950a546c42c1cd8e";

    public static final String ARK_DOMAIN = "ark.letv.com";
    /**
     * 订单创建
     */
    public static final String Order_Created = "taobao_tae_BaichuanTradeCreated";
    /**
     * 交易成功
     */
    public static final String Order_Success = "taobao_tae_BaichuanTradeSuccess";
    /**
     * 付款成功
     */
    public static final String Order_Trade_PaidDone = "taobao_tae_BaichuanTradePaidDone";
    /**
     * 退款成功
     */
    public static final String Order_Return_Success = "taobao_tae_BaichuanTradeRefundSuccess";
    /**
     * 交易关闭
     */
    public static final String Order_Trade_Closed = "taobao_tae_BaichuanTradeClosed";

}
