<template>
  <div>
    <ShappingHeader :newcart="cartproducts.carts" @del="getCart()"></ShappingHeader>

    <div class="container main-contant py-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <h1 class="text-center mb-3 text-secondary">購物清單</h1>

          <h4 class="text-center my-4">購買資訊</h4>
          <form @submit.prevent="payOrder">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>商品名稱</th>
                  <th width="100">數量</th>
                  <th width="100">小計</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,id) in order.products" :key="id">
                  <td class="align-middle">{{item.product.title }}</td>
                  <td class="align-middle">{{item.qty}} {{item.product.unit}}</td>
                  <td
                    class="align-middle text-right"
                    v-if="item.final_totall !== item.total"
                  >{{item.final_total | currency}}</td>
                  <td class="align-middle text-right" v-else>{{item.total | currency}}</td>
                </tr>
                <tr>
                  <td colspan="2" class="text-right">合計</td>
                  <td class="text-right">
                    <strong>{{order.total | currency}}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
            <hr>
            <h4 class="text-center my-4">個人資料</h4>
            <table class="table">
              <tbody>
                <tr>
                  <th width="200">Email</th>
                  <td>{{order.user.email}}</td>
                </tr>
                <tr>
                  <th>姓名</th>
                  <td>{{order.user.name}}</td>
                </tr>
                <tr>
                  <th>電話</th>
                  <td>{{order.user.tel}}</td>
                </tr>
                <tr>
                  <th>地址</th>
                  <td>{{order.user.address}}</td>
                </tr>
                <tr>
                  <th>付款狀態</th>
                  <td>
                    <span v-if="!order.is_paid ">尚未付款</span>
                    <span v-else class="text-success">付款完成</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="text-right" v-if="order.is_paid ===false">
              <button class="btn btn-danger">確認付款去</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ShappingHeader from "../ShappingHeader";
export default {
  data() {
    return {
      orderId: "",
      cartproducts: {},
      order: {
        products: {},
        user: {}
      }
    };
  },
  components: {
    ShappingHeader
    // ShappingBanner
  },
  methods: {
    //取得購買品項與購買人資訊
    getOrder() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order/${
        vm.orderId
      }`;
      this.$http.get(api).then(res => {
        vm.order = res.data.order;
        console.log(res.data);
      });
    },
    payOrder() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/pay/${
        vm.orderId
      }`;
      this.$http.post(api).then(res => {
        if (res.data.success) {
          alert("付款完成");
          vm.getOrder();
        }
      });
    }
  },
  created() {
    this.orderId = this.$route.params.orderId;
    this.getOrder();
    // console.log(this.orderId);
  }
};
</script>