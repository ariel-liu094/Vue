<template>
  <div>
    <Loading :active.sync="isLoading"></Loading>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>購買時間</th>
          <th>Email</th>
          <th>購買款項</th>
          <th>應付金額</th>
          <th>是否付款</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,key) in sortOrder" :key="key">
          <td>{{item.create_at | date }}</td>
          <td>
            <span v-text="item.user.email" v-if="item.user"></span>
          </td>
          <td>
            <ul class="list-unstyled">
              <li
                v-for="(product,i) in item.products"
                :key="i"
              >{{product.product.title}}數量:{{product.qty}}{{product.product.unit}}</li>
            </ul>
          </td>
          <td class="text-right">{{item.total | currency}}</td>
          <td>
            <span v-if="item.is_paid" class="text-success">已付款</span>
            <span v-else>未付款</span>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :pages="pagination" @emitPages="getOrders"></Pagination>
  </div>
</template>

 <script>
import Pagination from "../Pagination";
export default {
  data() {
    return {
      orders: {},
      isLoading: false,
      pagination: {},
      isLoading: false
    };
  },
  components: {
    Pagination
  },
  methods: {
    getOrders(currentPage = 1) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/orders?page=${currentPage}`;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.orders = response.data.orders;
        vm.isLoading = false;
        console.log(vm.orders);
      });
    }
  },
  computed: {
    sortOrder() {
      const vm = this;
      let newOrder = [];
      if (vm.orders.length) {
        newOrder = vm.orders.sort((a, b) => {
          const aIsPaid = a.is_paid ? 1 : 0;
          const bIsPaid = b.is_paid ? 1 : 0;
          return bIsPaid - aIsPaid;
        });
      }
      return newOrder;
    }
  },
  created() {
    this.getOrders();
  }
};
</script>
