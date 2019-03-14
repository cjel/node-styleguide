import Vue from 'vue'
import styles from 'styles/styleguide.sass'
import axios from 'axios'

Vue.component('button-toggle-menu', {
  data: function(){
    return {
      open: false,
    }
  },
  methods: {
    toggleMenu: function() {
      this.$root.$refs['main-menu'].open = !this.$root.$refs['main-menu'].open;
    }
  },
  template: '<a class="button-toggle-menu" v-on:click.prevent="toggleMenu"><slot></slot></a>'
});

Vue.component('main-menu', {
  data: function(){
    return {
      open: false,
    }
  },
  methods: {
  },
  mounted: function() {
    if (window.location.hash == "#keepopen") {
      this.open = true;
    }
  },
  template: '<div v-if="open"><slot></slot></div>'
});

Vue.component('main-menu-link', {
  data: function(){
    return {
      open: false,
    }
  },
  methods: {
    updateMainContent: function() {
      this.$root.mainContentFile = this.$el.href;
      if (window.innerWidth < 1088 && this.$root.keepMenuOpen == false) {
        this.$root.$refs['main-menu'].open = false;
      }
      console.log(this.$root.mainContentFile);
    }
  },
  template: '#main-menu-link-template',
});

var app = new Vue({
  el: '#page',
  data: {
    mainContentFile: 'about:blank',
    files: {},
    keepMenuOpen: false,
  },
  methods: {
  },
  mounted: function() {
    var that = this;
    var baseUrl = window.location.toString();
    if (baseUrl.substr(-1) != '/') {
      baseUrl += '/';
    }
    axios.get(baseUrl + 'styleguidefiles.json')
      .then(function(res) {
        console.log(res.data);
        that.files = res.data;
      });
    if (window.location.hash == "#keepopen") {
      this.keepMenuOpen = true;
    }
  },
})
