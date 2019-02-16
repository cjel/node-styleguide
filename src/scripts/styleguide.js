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
      open: false
    }
  },
  methods: {
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
      if (window.innerWidth < 1088) {
        this.$root.$refs['main-menu'].open = false;
      }
      console.log(this.$root.mainContentFile);
    }
  },
  template: '#main-menu-link-template'
});

var app = new Vue({
  el: '#page',
  data: {
    mainContentFile: 'about:blank',
    files: {},
  },
  methods: {
  },
  mounted: function() {
    var that = this
    axios.get('styleguidefiles.json')
      .then(function(res) {
        console.log(res.data)
        that.files = res.data
      })
  },
})
