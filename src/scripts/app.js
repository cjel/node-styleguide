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
    greet: function() {
      //console.log(this.$el.href)
      this.$root.mainContentFile = this.$el.href
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
    greet: function() {
    },
  },
  watch: {
    mainContentFile: function(fileNew, fileOld) {
      console.log(fileNew)
      axios.get(fileNew)
        .then(function (response) {
          console.log(response);
        })
    },
  },
})
