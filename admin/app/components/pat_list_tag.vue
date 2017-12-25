<template lang="jade">
  div(style="max-width:230px;")
    .label.label-primary.inline-block(v-for="(item,index) in tags", style="white-space: normal;margin-bottom: 5px;") {{item.tag.name}}
</template>

<script>
  import { agent } from '../utils/request'
  export default {
    data(){
      return {
        tags: []
      }
    },
    props: {
      id: Number, //要查看或修改的当前实体id
    },
    mounted (){
      const id = this.id;
      agent
        .get('pat_tag')
        .query({ pat_id: 'eq.' + this.id })
        .query({
          select: 'tag(id, name)'
        })
        .end((req, res) => {
          //console.log('tag', res.body)
          this.tags = res.body
        })
    }
  }
</script>

<style lang="stylus">
</style> 