<template>
  <span class="testCss" @click="testMethod">
    Hi, man, test vue data: {{testData}}, and test angular props: {{firstName}} {{lastName}}. and test vue method: click me!
  </span>
</template>

<script>
  export default {
    data(){
      return {
        testData: 'testData'
      }
    },
    props: {
      firstName: String,
      lastName: String
    },
    mounted () {
      console.log('hello world form vue component in angular!')
    },
    methods: {
      testMethod: function () {
        alert('you click me!')
      }
    }
  }
</script>
<style lang="stylus">
  .testCss
    color red
</style>