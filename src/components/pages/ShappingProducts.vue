<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <ShappingHeader :newcart="cartproducts.carts" @del="getCart()"></ShappingHeader>
    <ShappingBanner></ShappingBanner>
    <div class="container main-contant mb-1">
      <div class="row">
        <div class="col-md-6 img-box">
          <!-- <div style="top: 10px; "> -->
          <img class="productImg" :style="{backgroundImage:`url(${product.imageUrl})`}">
          <!-- </div> -->
        </div>
        <div class="col-md-6">
          <div style="top: 10px;">
            <h1 class="h2">{{product.title}}</h1>
            <p class="card-text my-4">{{product.description}}</p>
            <p class="card-text">{{product.content}}</p>
            <div class="d-flex my-3 align-items-end justify-content-end">
              <del class="text-muted">{{product.origin_price | currency}}</del>

              <div class="h3 mb-0 ml-auto text-danger">
                <small>網路價 NT$</small>
                <strong>{{product.price | currency}}</strong>
              </div>
            </div>
            <div class="text-muted text-nowrap text-right">
              小計
              <strong>{{ product.num * product.price }}</strong> 元
            </div>
            <div class="input-group mt-3">
              <select name class="form-control mr-1" v-model="product.num">
                <option :value="num" v-for="num in 10" :key="num">{{num}}{{product.unit}}</option>
              </select>

              <a class="btn btn-primary text-white" @click="addcart(product.id,product.num)">
                <i class="fa fa-cart-plus" aria-hidden="true"></i> 加入購物車
              </a>
            </div>
          </div>
        </div>

        <div class="tab-content my-4 col-md-12">
          <hr>

          <div class="alert alert-secondary mt-4" role="alert">
            <h2 class="text-center">購物說明</h2>
            <p>為了讓您有更美好的購買品質及體驗，購買前請先詳讀下列事項</p>
            <ol>
              <li>所有食材都是新鮮採購，故請於3天前訂購下單。</li>
              <li>下單後即無法退單及退貨，下單前請確認購買品項，請見諒。</li>
              <li>嚴選新鮮食材，商品皆無添加防腐劑故賞味期限較短，故請盡快食用。</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ShappingHeader from "../ShappingHeader";
import ShappingBanner from "../ShappingBanner";
export default {
  data() {
    return {
      id: "",
      product: {},
      cartproducts: {},
      allProducts: {},
      category: [],
      isLoading: false
    };
  },
  components: {
    ShappingHeader,
    ShappingBanner
  },
  methods: {
    //取得被選到的產品
    getProduct(id) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/product/${id}`;
      vm.isLoading = true;
      this.$http.get(api).then(res => {
        vm.product = res.data.product;
        vm.isLoading = false;
        console.log(vm.product);
      });
    },
    //新增購物車
    addcart(id, qty = 1) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const cart = {
        product_id: id,
        qty
      };
      vm.isLoading = true;
      this.$http.post(api, { data: cart }).then(res => {
        console.log(res.data);
        vm.getCart();
        vm.isLoading = false;
      });
    },
    //取得最新購物車
    getCart() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      this.$http.get(api).then(res => {
        vm.cartproducts = res.data.data;
        console.log(vm.cartproducts);
      });
    }
  },

  created() {
    this.id = this.$route.params.id;
    this.getProduct(this.id);
    this.getCart();
  }
};
</script>

<style lang="scss" scoped>
.img-box {
  height: 300px;
  overflow: hidden;
  padding-top: 10px;
  .productImg {
    width: 100%;
    height: 100%;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center center;
  }
}
</style>




