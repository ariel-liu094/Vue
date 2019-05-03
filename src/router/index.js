import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/components/pages/Login";
import Dashboard from "@/components/Dashboard";
import Products from "@/components/pages/Products";
import orders from "@/components/pages/orders";
import coupons from "@/components/pages/coupons";

import Shappingboard from "@/components/Shappingboard";
import Shappingfooter from "@/components/Shappingfooter";
import ShappingCart from "@/components/pages/ShappingCart";
import ShappingProducts from "@/components/pages/ShappingProducts";
import Checkout from "@/components/pages/Checkout";
import PayOrder from "@/components/pages/PayOrder";

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: "*",
      redirect: "login"
    },
    {
      name: "login", //元件呈現名稱
      path: "/login", //對應虛擬路徑
      component: Login //對應元件
    },
    {
      name: "Dashboard", //元件呈現名稱
      path: "/admin", //對應虛擬路徑
      component: Dashboard, //對應元件
      children: [
        {
          name: "products", //元件呈現名稱
          path: "products", //對應虛擬路徑
          component: Products, //對應元件
          meta: { requiresAuth: true }
        },
        {
          name: "orders", //元件呈現名稱
          path: "orders", //對應虛擬路徑
          component: orders, //對應元件
          meta: { requiresAuth: true }
        },
        {
          name: "coupons", //元件呈現名稱
          path: "coupons", //對應虛擬路徑
          component: coupons, //對應元件
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      name: "Shappingboard", //商品版
      path: "/", //對應虛擬路徑
      // component: Shappingboard, //對應元件
      components: {
        default: Shappingboard,
        footer: Shappingfooter
      },
      children: [
        {
          name: "ShappingCart", //商品總頁面
          path: "shappingcart", //對應虛擬路徑
          component: ShappingCart //對應元件
        },
        {
          name: "ShappingProducts", //被選到商品頁面
          path: "shappingproducts/:id", //對應虛擬路徑
          component: ShappingProducts //對應元件
        },
        {
          name: "Checkout", //會員結帳填單頁面
          path: "checkout", //對應虛擬路徑
          component: Checkout //對應元件
        },
        {
          name: "PayOrder", //確認結帳頁面
          path: "payorder/:orderId", //對應虛擬路徑
          component: PayOrder //對應元件
        }
      ]
    }
  ]
});
