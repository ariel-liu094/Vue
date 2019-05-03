<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <ShappingHeader :newcart="cartproducts.carts" @del="getCart()"></ShappingHeader>
    <ShappingBanner></ShappingBanner>

    <div class="container main-contant mb-1">
      <div class="row">
        <div class="col-md-3 pb-3">
          <!-- 左側選單 (List group) -->
          <div class="list-group sticky-top">
            <a
              class="list-group-item list-group-item-action text-center"
              href="javascript:;"
              @click.prevent="newProducts='' "
            >全部</a>
            <a
              v-for="(newCategory,touch) in filteredCategory "
              :key="touch"
              class="list-group-item list-group-item-action"
              @click.prevent="newProducts=`${newCategory}`"
              href="#"
            >
              <!-- <i class="fa fa-suitcase" aria-hidden="true"></i> -->
              {{newCategory}}
            </a>
          </div>
        </div>
        <div class="col-md-9">
          <!-- 主要商品列表 (Card) -->
          <div class="tab-content">
            <div class="tab-pane active" id="list-gold">
              <div class="row">
                <!-- 金牌 -->
                <div class="col-md-4 mb-4" v-for="item in filteredProducts" :key="item.id">
                  <div class="card border-0 box-shadow text-center h-100">
                    <div
                      class="card-img-top"
                      style="height:150px; background-size:cover; "
                      :style="{backgroundImage:`url(${item.imageUrl})`}"
                    ></div>

                    <div class="card-body">
                      <h4 class="card-title">{{item.title}}</h4>
                      <p class="card-text">{{item.description}}</p>
                      <p class="card-text">{{item.content}}</p>
                    </div>
                    <div class="card-set d-flex">
                      <button
                        type="button"
                        class="btn btn-outline-secondary btn-sm"
                        @click="getProduct(item.id)"
                      >
                        <!-- <i class="fas fa-spinner fa-spin"></i> -->
                        查看更多
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-blue btn-sm ml-auto"
                        @click="addcart(item.id)"
                      >加到購物車</button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- pagination -->

              <Pagination :pages="pagination" @emitPages="getProducts"></Pagination>
            </div>
          </div>
          <!-- tab-content end -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from "../Pagination";
import ShappingHeader from "../ShappingHeader";
import ShappingBanner from "../ShappingBanner";
export default {
  data() {
    return {
      products: [],
      category: [],
      newCategory: [],
      newProducts: "",
      isLoading: false,
      pagination: {},
      cartproducts: {}
    };
  },
  components: {
    Pagination,
    ShappingHeader,
    ShappingBanner
  },
  methods: {
    //取得全部產品
    getProducts(page = 1) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/products/?page=${page}`;
      vm.isLoading = true;
      this.$http.get(api).then(res => {
        // console.log(res.data);
        vm.products = res.data.products;
        vm.pagination = res.data.pagination;
        // console.log(vm.pagination);
        res.data.products.forEach(item => {
          vm.category.push(item.category);
          vm.isLoading = false;
          // console.log(vm.products);
        });
      });
    },
    //取得單一產品
    getProduct(id) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/product/${id}`;
      this.$http.get(api).then(res => {
        console.log(res.data);
        this.$router.push(`/shappingproducts/${id}`);
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

  computed: {
    //抓出同類別產品
    filteredCategory() {
      const vm = this;
      return (vm.newCategory = vm.category.filter(function(
        element,
        index,
        self
      ) {
        return self.indexOf(element) === index;
      }));
      // console.log(vm.newCategory);
    },
    //取得同類別的產品
    filteredProducts() {
      let vm = this;
      return vm.products.filter(item => {
        return item.category.match(vm.newProducts);
      });
    }
  },

  created() {
    this.getProducts();
    this.getCart();
    // this.filteredProducts();
  }
};
</script>

<style lang="scss" scoped>
.productImg {
  width: 100%;
  height: 100%;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center center;
}
.card-set {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid rgba(0, 0, 0, 0.125);
}
.btn-outline-blue {
  color: #00a1df;
  border-color: #00a1df;
  &:hover {
    color: #fff;
    background: #00a1df;
  }
}
</style>