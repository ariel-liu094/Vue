<template>
  <div>
    <ShappingHeader :newcart="cartproducts.carts" @del="getCart()"></ShappingHeader>
    <div class="container main-contant py-5">
      <h1 class="text-center mb-3 text-secondary">輸入訂單資料</h1>
      <section class="row justify-content-center mt-5">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header" id="headingOne">
              <h6 class="mb-0 d-flex align-items-center">
                <a class="cartList-set" data-toggle="collapse" href="#collapseOne">
                  顯示購物車細節
                  <i class="fa fa-angle-down" aria-hidden="true"></i>
                </a>
                <span class="h3 ml-auto mb-0 text-dark">{{cartproducts.final_total | currency}}</span>
              </h6>
            </div>
          </div>
          <div id="collapseOne" class="collapse mt-3">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th width="30"></th>
                  <th>商品名稱</th>
                  <th width="100">數量</th>
                  <th width="80">小計</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cartproducts.carts" :key="item.id">
                  <td class="align-middle text-center">
                    <a
                      href="#removeModal"
                      class="btn btn-outline-danger btn-sm"
                      data-toggle="modal"
                      data-title="刪除 "
                      @click="delProduct(item.id)"
                    >
                      <i class="far fa-trash-alt"></i>
                    </a>
                  </td>
                  <td class="align-middle">
                    {{item.product.title}}
                    <div class="text-success" v-if="item.coupon">已套用優惠券</div>
                  </td>

                  <td class="align-middle">{{item.qty}} {{item.product.unit}}</td>
                  <td class="align-middle text-right">{{item.total | currency}}</td>
                </tr>

                <tr>
                  <td colspan="3" class="text-right">合計</td>
                  <td class="text-right">
                    <strong>{{cartproducts.total | currency}}</strong>
                  </td>
                </tr>

                <tr v-if=" cartproducts.final_total !== cartproducts.total">
                  <td colspan="3" class="text-right text-success">折扣後應付</td>
                  <td class="text-right text-success">
                    <strong>{{cartproducts.final_total | currency}}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h5 class="py-3 mt-5 mb-2 text-center bg-light">訂購人資訊</h5>
          <form id="needs-validation" @submit.prevent="addorder">
            <div class="coupon">
              <label for="username">輸入優惠碼</label>
              <div class="input-group mb-3">
                <input
                  type="text"
                  placeholder="請輸入優惠碼"
                  aria-label="請輸入優惠碼"
                  aria-describedby="button"
                  class="form-control"
                  v-model="couponCode"
                >
                <div class="input-group-append">
                  <button type="button" id="button" class="btn btn-primary" @click="addCoupon">套用優惠碼</button>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="username">姓名</label>
              <input
                type="text"
                class="form-control"
                id="username"
                placeholder="姓名"
                v-model="form.user.name"
                v-validate="'required'"
                name="name"
                :class="{'is-invalid':errors.has('name')}"
              >
              <div class="text-danger" v-if="errors.has('name')">請輸入姓名</div>
            </div>
            <div class="form-group">
              <label for="usertel">收件人電話</label>
              <input
                type="tel"
                class="form-control"
                id="usertel"
                placeholder="請輸入電話"
                v-model="form.user.tel"
                v-validate="'required'"
                name="電話"
                :class="{'is-invalid':errors.first('電話')}"
              >
              <div class="text-danger">{{errors.first('電話')}}</div>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                class="form-control"
                id="email"
                placeholder="Email"
                v-model="form.user.email"
                name="email"
                v-validate="'required|email'"
                :class="{'is-invalid':errors.first('email')}"
              >
              <div class="text-danger">{{errors.first('email')}}</div>
            </div>

            <div class="form-group">
              <label for="inputAddress">地址</label>
              <input
                type="text"
                class="form-control"
                id="inputAddress"
                placeholder="請輸入地址"
                v-model="form.user.address"
                name="地址"
                v-validate="'required'"
              >
              <div class="text-danger">{{errors.first('地址')}}</div>
            </div>
            <div class="form-group">
              <label for="comment">留言</label>
              <textarea
                name
                id="comment"
                class="form-control"
                cols="30"
                rows="10"
                v-model="form.user.message"
              ></textarea>
            </div>
            <div class="text-right">
              <router-link :to="{name:`ShappingCart`}" class="btn btn-primary">繼續選購</router-link>
              <button type="submit" class="btn btn-danger">送出訂單</button>
              <!-- <a href="shoppingCart-purchase.html" class="btn btn-primary">確認付款</a> -->
            </div>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>
  <script>
import ShappingHeader from "../ShappingHeader";
export default {
  data() {
    return {
      couponCode: "",
      cartproducts: {},
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: ""
        },
        message: ""
      }
    };
  },
  components: {
    ShappingHeader
    // ShappingBanner
  },
  methods: {
    //取得購物車全產品
    getCart() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      this.$http.get(api).then(res => {
        vm.cartproducts = res.data.data;
        console.log(vm.cartproducts);
      });
    },
    //新增優惠券
    addCoupon() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
      const coupon = {
        code: vm.couponCode
      };
      this.$http.post(api, { data: coupon }).then(res => {
        vm.getCart();
        console.log(res.data);
      });
      vm.couponCode = "";
    },
    //刪除功能
    delProduct(id) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/cart/${id}`;
      this.$http.delete(api).then(res => {
        console.log(res.data);
        vm.getCart();
        // $("#removeModal").modal("hide");
        this.$emit("del");
      });
    },
    //送出訂單
    addorder() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`;
      const order = vm.form;
      this.$validator.validate().then(valid => {
        if (valid) {
          this.$http.post(api, { data: order }).then(res => {
            console.log("訂單已建立", res.data);
            if (res.data.success) {
              vm.$router.push(`/payorder/${res.data.orderId}`);
            }
          });
        } else {
          alert(`欄位不完整`);
          console.log("欄位不完整");
        }
      });
    }
  },
  created() {
    this.getCart();
  }
};
</script>

<style lang="scss" scoped>
.cartList-set:hover {
  text-decoration: none;
}
.text-blue {
  color: #01a1dd;
}
</style>
