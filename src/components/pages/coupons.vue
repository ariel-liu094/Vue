<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="text-right mt-4">
      <button class="btn btn-primary" @click="openModal(true)">建立新的優惠券</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,key) in coupons" :key="key">
          <td>{{item.title}}</td>
          <td>{{item.percent}}%</td>
          <td>{{item.due_date | date}}</td>
          <td>
            <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm" @click="openModal(false,item)">編輯</button>
              <button class="btn btn-outline-danger btn-sm" @click="delCoupons(item)">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{'disabled': !pagination.has_pre}">
          <a
            class="page-link"
            href="#"
            aria-label="Previous"
            @click="getCoupons(pagination.current_page -1)"
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li
          class="page-item"
          v-for="page in pagination.total_pages"
          :key="page"
          :class="{'active': pagination.current_page===page}"
        >
          <a class="page-link" href="#" @click="getCoupons(page)">{{page}}</a>
        </li>
        <li class="page-item" :class="{'disabled':!pagination.has_next}">
          <a
            class="page-link"
            href="#"
            aria-label="Next"
            @click="getCoupons(pagination.current_page +1)"
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>-->
    <Pagination :pages="pagination" @emitPages="getCoupons"></Pagination>
    <div
      class="modal fade"
      id="couponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="title">標題</label>
              <input
                type="text"
                class="form-control"
                id="title"
                placeholder="請輸入標題"
                v-model="tempCoupon.title"
              >
            </div>
            <div class="form-group">
              <label for="coupon_code">優惠碼</label>
              <input
                type="text"
                class="form-control"
                id="coupon_code"
                placeholder="請輸入優惠碼"
                v-model="tempCoupon.code"
              >
            </div>
            <div class="form-group">
              <label for="due_date">到期日</label>
              <input type="date" class="form-control" id="due_date" v-model="due_date">
            </div>
            <div class="form-group">
              <label for="price">折扣百分比</label>
              <input
                type="number"
                class="form-control"
                id="price"
                placeholder="請輸入折扣百分比"
                v-model="tempCoupon.percent"
              >
            </div>
            <div class="form-group">
              <div class="form-check">
                <input
                  :true-value="1"
                  :false-value="0"
                  v-model="tempCoupon.is_enabled"
                  class="form-check-input"
                  type="checkbox"
                  id="is_enabled"
                >
                <label class="form-check-label" for="is_enabled">是否啟用</label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click=" updateCoupon">更新優惠券</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import Pagination from "../Pagination";
export default {
  data() {
    return {
      coupons: {},
      pagination: {},
      tempCoupon: {
        percent: 100,
        due_date: 0,
        is_enabled: 0,
        code: ""
      },
      isLoading: false,
      due_date: new Date(),
      isNew: false
    };
  },
  components: {
    Pagination
  },
  watch: {
    due_date() {
      const vm = this;
      const timestamp = Math.floor(new Date(vm.due_date) / 1000);
      vm.tempCoupon.due_date = timestamp;
    }
  },

  methods: {
    getCoupons(page = 1) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/coupons?page=${page}`;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        // console.log("get" + JSON.stringify(response.data));
        vm.coupons = response.data.coupons;
        vm.pagination = response.data.pagination;
        console.log(vm.pagination);
        vm.isLoading = false;
      });
    },
    // https://vue-course-api.hexschool.io/api/ariel/admin/coupons
    openModal(isNew, item) {
      const vm = this;

      if (isNew) {
        vm.tempCoupon = {};
        vm.isNew = true;
      } else {
        vm.tempCoupon = Object.assign({}, item);
        vm.isNew = false;
        const dateAndTime = new Date(vm.tempCoupon.due_date * 1000)
          .toISOString()
          .split("T");
        vm.due_date = dateAndTime[0];
      }
      $("#couponModal").modal("show");
    },

    updateCoupon() {
      const vm = this;
      if (vm.isNew) {
        vm.isLoading = true;
        let api = `${process.env.APIPATH}/api/${
          process.env.CUSTOMPATH
        }/admin/coupon`;
        this.$http.post(api, { data: vm.tempCoupon }).then(res => {
          // console.log("new" + JSON.stringify(res.data));
          this.getCoupons();
          $("#couponModal").modal("hide");
        });
      } else {
        const api = `${process.env.APIPATH}/api/${
          process.env.CUSTOMPATH
        }/admin/coupon/${vm.tempCoupon.id}`;
        vm.due_date = new Date(vm.tempCoupon.due_date * 1000);
        this.$http.put(api, { data: vm.tempCoupon }).then(res => {
          // console.log("edit" + JSON.stringify(res.data));
          this.getCoupons();
          $("#couponModal").modal("hide");
        });
      }
    },
    delCoupons(item) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/coupon/${item.id}`;
      vm.isLoading = true;
      this.$http.delete(api).then(response => {
        vm.isLoading = false;
        this.getCoupons();
      });
    }
  },

  created() {
    this.getCoupons();
  }
};
</script>
