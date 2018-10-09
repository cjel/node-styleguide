import Vue from 'vue'
import styles from 'styles/styleguide.sass'
import axios from 'axios'

Vue.component('main-menu-link', {
  data: function(){
    return {
      open: false,
    }
  },
  methods: {
    updateMainContent: function() {
      this.$root.mainContentFile = this.$el.href
      console.log(this.$root.mainContentFile)
    },
  },
  template: '#main-menu-link-template',
})

var app = new Vue({
  el: '#page',
  data: {
    mainContentFile: 'samples/file1.html'
  },
  methods: {
  },
  mounted: function() {
    console.log('running')
  },
  watch: {
    //mainContentFile: function(fileNew, fileOld) {
    //  axios.get(fileNew)
    //    .then(function (response) {
    //      console.log(response);
    //    })
    //},
  },
})
