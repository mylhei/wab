package com.le.wab;

import com.google.gson.Gson;

import java.net.URLDecoder;
import java.util.ArrayList;

/**
 * Created by leiyao on 16/7/7.
 */
public class AliOrderBean {
    public String buyer_id;
    public String extre;
    public String bc_trace;
    public String paid_fee;
    public String shop_title;
    public boolean is_eticket;
    public String create_order_time;
    public String order_id;
    public String order_status;
    public String seller_nick;
    public ArrayList<Auction_Info> auction_infos;

    public String json;

    public static AliOrderBean getOrderCreated(String json) {
        try {
            Gson gson = new Gson();
            AliOrderBean order = gson.fromJson(json, AliOrderBean.class);
            order.json = json;
            if (!order.bc_trace.equals("")) {
                order.bc_trace = URLDecoder.decode(order.bc_trace, "Unicode");
            }
            return order;
        } catch (Exception e) {
            e.printStackTrace();

        }

        return new AliOrderBean();
    }

    @Override
    public String toString() {
        return this.json;
    }
}
