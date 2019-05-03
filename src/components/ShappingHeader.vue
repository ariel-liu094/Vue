<template>
  <div>
    <nav class="navbar">
      <router-link :to="{name:`ShappingCart`}">
        <i class="fas fa-home text-blue fa-2x" aria-hidden="true"></i>
      </router-link>

      <!-- 購物車內的數量 (Button 內包含 icon, 數量 badge) -->
      <div class="dropdown ml-auto">
        <button class="btn btn-sm btn-cart" data-toggle="dropdown" data-flip="false">
          <i class="fa fa-shopping-cart text-blue fa-2x" aria-hidden="true"></i>
          <span class="badge badge-pill badge-danger" v-if="cartlength">{{cartlength}}</span>
        </button>
        <div class="dropdown-menu dropdown-menu-right p-3" style="min-width: 300px">
          <h6>已選擇商品</h6>
          <table class="table table-sm">
            <tbody>
              <tr v-for="(item,id) in newcart" :key="id">
                <td class="align-middle text-center">
                  <a href="#removeModal" class="text-muted" data-toggle="modal" data-title="刪除商品">
                    <button
                      type="button"
                      class="btn btn-outline-danger btn-sm"
                      @click="delProduct(item.id)"
                    >
                      <i class="far fa-trash-alt"></i>
                    </button>
                  </a>
                </td>
                <td class="align-middle">{{item.product.title}}</td>
                <td class="align-middle">{{item.qty}} {{item.product.unit}}</td>
                <td class="align-middle text-right">{{item.final_total | currency}}</td>
              </tr>
            </tbody>
          </table>
          <router-link :to="{name:'Checkout'}" class="btn btn-primary btn-block">
            <i class="fas fa-dollar-sign"></i> 結帳去
          </router-link>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ["newcart"],

  data() {
    return {};
  },
  methods: {
    //刪除功能
    delProduct(id) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/cart/${id}`;
      this.$http.delete(api).then(res => {
        console.log(res.data);
        // $("#removeModal").modal("hide");
        this.$emit("del");
      });
    }
  },
  computed: {
    //判斷購物車裡是否有內容
    cartlength() {
      return this.newcart ? this.newcart.length : null;
    }
  }
};
</script>

<style lang="scss" scoped>
.fa-shopping-cart:before {
  color: #00a1df;
}
</style>

